// js/ui.js — toast, header, copy helpers (all pages use this)
export function showToast(msg, color = 'bg-slate-800') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl text-sm font-bold text-white shadow-2xl opacity-0 pointer-events-none transition-all duration-300';
    document.body.appendChild(t);
  }
  t.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl text-sm font-bold text-white shadow-2xl ${color} transition-all duration-300`;
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translate(-50%, 0)';
  clearTimeout(t._t);
  t._t = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translate(-50%, 20px)';
  }, 2500);
}

export function copyText(text, label = 'Item') {
  navigator.clipboard.writeText(text)
    .then(() => showToast(label + ' copied', 'bg-green-600'))
    .catch(() => showToast('Copy failed', 'bg-red-600'));
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function renderHeader(activePage = '') {
  const draft = window.__draftHasContent ? true : false;
  const header = document.getElementById('site-header');
  if (!header) return;
  header.className = 'glass-nav sticky top-0 z-40';
  header.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="index.html" class="flex items-center space-x-3">
        <div class="bg-slate-900 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg text-white">
          <i class="fas fa-shield-halved text-xl"></i>
        </div>
        <div class="font-black text-2xl tracking-tighter text-white flex items-center">
          NAIM <i class="fas fa-dove ml-1.5 text-sm"></i>
        </div>
      </a>
      <div class="flex items-center gap-2">
        <a href="region.html" class="h-10 px-3 rounded-full glass flex items-center gap-1.5 text-xs font-bold text-white border border-white/20">
          <i class="fas fa-globe"></i><span id="hdr-region">${localStorage.getItem('naim_region') || 'US'}</span>
        </a>
        <a href="dashboard.html" class="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md">
          <i class="fas fa-user"></i>
        </a>
      </div>
    </div>
  `;
}
