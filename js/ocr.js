// js/ocr.js — screenshot scan with Tesseract
let worker = null;
let tesseractLoading = null;

async function loadTesseract() {
  if (window.Tesseract) return window.Tesseract;
  if (!tesseractLoading) {
    tesseractLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.async = true;
      s.onload = () => resolve(window.Tesseract);
      s.onerror = () => { tesseractLoading = null; reject(new Error('OCR library failed to load')); };
      document.head.appendChild(s);
    });
  }
  return tesseractLoading;
}

async function getWorker() {
  if (worker) return worker;
  const T = await loadTesseract();
  worker = await T.createWorker('eng');
  await worker.setParameters({
    tessedit_pageseg_mode: '6',
    preserve_interword_spaces: '1',
    user_defined_dpi: '220'
  });
  return worker;
}

function preprocess(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Cannot read image')); };
    img.onload = () => {
      const maxDim = Math.max(img.width, img.height);
      const scale = maxDim > 1700 ? 1700 / maxDim : maxDim < 900 ? Math.min(1.35, 900 / maxDim) : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      // Grayscale
      const im = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = im.data;
      for (let i = 0; i < d.length; i += 4) {
        const g = (d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114) | 0;
        d[i] = d[i+1] = d[i+2] = g;
      }
      ctx.putImageData(im, 0, 0);
      resolve(canvas);
    };
    img.src = url;
  });
}

export async function scanScreenshot(file, order) {
  const w = await getWorker();
  const canvas = await preprocess(file);
  const { data: { text } } = await w.recognize(canvas);
  return extractPaymentInfo(text, order);
}

export function extractPaymentInfo(rawText, order) {
  const bn = '০১২৩৪৫৬৭৮৯';
  const text = String(rawText || '').replace(/[০-৯]/g, c => '0123456789'[bn.indexOf(c)]);
  const lower = text.toLowerCase();
  const expected = parseFloat(order?.amountNumeric);

  const info = {
    fullText: text.trim(),
    amount: null, trxId: null, method: null, sender: null,
    date: null, time: null, matchesAmount: false, score: 0
  };

  if (/bkash|বিকাশ/.test(lower)) info.method = 'bKash';
  else if (/nagad|নগদ/.test(lower)) info.method = 'Nagad';
  else if (/opay/.test(lower)) info.method = 'OPay';
  else if (/usdt|tether/.test(lower)) info.method = 'USDT';

  // Amount detection
  const candidates = [];
  const re = /(?:৳|tk\.?|bdt|ngn|₦|amount|total|paid)\s*:?\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const v = parseFloat(m[1].replace(/,/g, ''));
    if (isFinite(v) && v > 0 && v < 1e7) candidates.push(v);
  }
  (text.match(/\b[0-9][0-9,]*\.[0-9]{2}\b/g) || []).forEach(s => {
    const v = parseFloat(s.replace(/,/g, ''));
    if (isFinite(v) && v > 0 && v < 1e7) candidates.push(v);
  });

  if (candidates.length) {
    const best = candidates.sort((a, b) => Math.abs(a - expected) - Math.abs(b - expected))[0];
    info.amount = best.toLocaleString('en-US', { maximumFractionDigits: 2 });
    info.matchesAmount = Math.abs(best - expected) <= Math.max(1, expected * 0.02);
  }

  // TrxID detection
  const trxPatterns = [
    /(?:trx\s*id|txn\s*id|transaction\s*(?:id|no\.?)|reference|order\s*no\.?)\s*[:#\-]?\s*([A-Z0-9]{8,30})/i,
    /\b([A-Z]{2,4}[0-9]{4,10}[A-Z0-9]*)\b/i,
    /\b([0-9]{15,25})\b/
  ];
  for (const pat of trxPatterns) {
    const match = text.match(pat);
    if (match) {
      const candidate = match[1];
      if (!/^0\d{10}$/.test(candidate)) { info.trxId = candidate.toUpperCase(); break; }
    }
  }

  // Sender phone
  const masked = text.match(/[0-9]{3}\*{4}[0-9]{3}/);
  if (masked) info.sender = masked[0];
  else {
    const phones = text.match(/(?:\+?880|0)1[3-9]\d{8}|\+?234[789][01]\d{8}|\b[789][01]\d{8}\b/g) || [];
    info.sender = phones[0] || null;
  }

  // Date / time
  const tm = text.match(/\d{1,2}:\d{2}\s*(?:am|pm)?/i);
  if (tm) info.time = tm[0];
  const dt = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/);
  if (dt) info.date = dt[0];

  info.score = (info.matchesAmount ? 40 : 0) + (info.trxId ? 35 : 0) + (info.amount ? 25 : 0);
  return info;
}
