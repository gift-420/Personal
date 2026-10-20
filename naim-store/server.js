require('dotenv').config();
const express = require('express');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');
const requestIp = require('request-ip');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
app.use(express.json());
app.use(express.static('public'));

// ================= DATA =================
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const STOCKS_FILE = path.join(DATA_DIR, 'stocks.json');

const readJSON = (f, d = {}) => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d;
const writeJSON = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// Products: only 2 categories
const PRODUCT_KEYS = ['any_name', 'page'];
const PRODUCTS_META = [
    { id: 1, key: 'any_name', title: 'ANY NAME', subtitle: 'Facebook Profile', priceUSD: 1.20, icon: 'fas fa-user', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, key: 'page', title: 'PAGE', subtitle: 'Facebook Page', priceUSD: 1.50, icon: 'fas fa-flag', color: 'text-orange-500', bg: 'bg-orange-50' }
];

// Stock: { any_name: [...], page: [...] }
function loadStocks() {
    return readJSON(STOCKS_FILE, { any_name: [], page: [] });
}
function saveStocks(s) { writeJSON(STOCKS_FILE, s); }
function countStock(key) {
    const s = loadStocks();
    return (s[key] || []).length;
}
function popStock(key) {
    const s = loadStocks();
    if (!s[key] || !s[key].length) return null;
    const acc = s[key].shift();
    saveStocks(s);
    return acc;
}
function addStock(key, acc) {
    const s = loadStocks();
    if (!s[key]) s[key] = [];
    s[key].push(acc);
    saveStocks(s);
}

// ================= TELEGRAM =================
const bot = process.env.TELEGRAM_BOT_TOKEN
    ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
    : null;
const OWNER = process.env.TELEGRAM_CHAT_ID;

if (bot) {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        if (String(chatId) !== String(OWNER)) return bot.sendMessage(chatId, '⛔ Unauthorized');

        const text = (msg.text || '').trim();
        const lower = text.toLowerCase();
        const args = text.split(/\s+/);

        if (lower === '/start' || lower === 'start') {
            return bot.sendMessage(chatId,
                `🦅 <b>NAIM Store Bot</b>\n\n` +
                `<b>📦 Stock</b>\n` +
                `/stock — all counts\n` +
                `/list &lt;key&gt; — view accounts\n` +
                `/add &lt;key&gt; &lt;acc&gt; — add one\n` +
                `/bulk &lt;key&gt; — add many (paste)\n` +
                `/clear &lt;key&gt; — empty\n\n` +
                `<b>📋 Orders</b>\n` +
                `/orders — last 10 orders\n` +
                `/give &lt;orderId&gt; — pick account & mark delivered\n\n` +
                `<b>Keys:</b> <code>any_name</code>, <code>page</code>`,
                { parse_mode: 'HTML' });
        }

        if (lower === '/stock') {
            const a = countStock('any_name');
            const p = countStock('page');
            return bot.sendMessage(chatId,
                `📦 <b>Stock</b>\n\n• <b>any_name</b>: ${a}\n• <b>page</b>: ${p}\n\nTotal: ${a + p}`,
                { parse_mode: 'HTML' });
        }

        if (lower.startsWith('/list ')) {
            const key = args[1];
            if (!PRODUCT_KEYS.includes(key)) return bot.sendMessage(chatId, '❌ Invalid key');
            const s = loadStocks();
            const list = s[key] || [];
            if (!list.length) return bot.sendMessage(chatId, `📭 <b>${key}</b> empty`, { parse_mode: 'HTML' });
            const preview = list.slice(0, 20).map((a, i) => `${i + 1}. <code>${a}</code>`).join('\n');
            return bot.sendMessage(chatId,
                `📋 <b>${key}</b> (${list.length})\n\n${preview}` +
                (list.length > 20 ? `\n\n...${list.length - 20} more` : ''),
                { parse_mode: 'HTML' });
        }

        if (lower.startsWith('/add ')) {
            const key = args[1];
            const acc = args.slice(2).join(' ').trim();
            if (!PRODUCT_KEYS.includes(key) || !acc) return bot.sendMessage(chatId, '❌ /add <key> <account>');
            addStock(key, acc);
            return bot.sendMessage(chatId, `✅ Added to <b>${key}</b>\nStock: ${countStock(key)}`, { parse_mode: 'HTML' });
        }

        if (lower.startsWith('/bulk ')) {
            const key = args[1];
            if (!PRODUCT_KEYS.includes(key)) return bot.sendMessage(chatId, '❌ Invalid key');
            bot.sendMessage(chatId, `📝 Send lines for <b>${key}</b> now. /cancel to stop.`, { parse_mode: 'HTML' });
            bot.once('message', async (m2) => {
                if (String(m2.chat.id) !== String(OWNER)) return;
                if ((m2.text || '').trim() === '/cancel') return bot.sendMessage(chatId, '❌ Cancelled');
                const lines = (m2.text || '').split('\n').map(l => l.trim()).filter(Boolean);
                lines.forEach(l => addStock(key, l));
                bot.sendMessage(chatId, `✅ Added ${lines.length} to <b>${key}</b>\nTotal: ${countStock(key)}`, { parse_mode: 'HTML' });
            });
            return;
        }

        if (lower.startsWith('/clear')) {
            const key = args[1];
            if (!PRODUCT_KEYS.includes(key)) return bot.sendMessage(chatId, '❌ Invalid key');
            saveStocks({ ...loadStocks(), [key]: [] });
            return bot.sendMessage(chatId, `🗑 Cleared <b>${key}</b>`, { parse_mode: 'HTML' });
        }

        if (lower === '/orders') {
            const orders = readJSON(ORDERS_FILE);
            const list = Object.values(orders).sort((a, b) => b.createdAt - a.createdAt);
            const pending = list.filter(o => !o.delivered);
            if (!list.length) return bot.sendMessage(chatId, '📭 No orders yet');
            return bot.sendMessage(chatId,
                `📋 <b>Last ${Math.min(10, list.length)} orders</b>\n(pending: ${pending.length})\n\n` +
                list.slice(0, 10).map(o =>
                    `${o.delivered ? '✅' : '⏳'} <code>${o.orderId}</code>\n   ${o.productTitle} × ${o.quantity}\n   ${o.amount}\n   ${o.userId}`
                ).join('\n\n'),
                { parse_mode: 'HTML' });
        }

        if (lower.startsWith('/give ')) {
            const orderId = args[1];
            const orders = readJSON(ORDERS_FILE);
            const o = orders[orderId];
            if (!o) return bot.sendMessage(chatId, '❌ Order not found');
            if (o.delivered) return bot.sendMessage(chatId, '⚠️ Already delivered');

            const acc = popStock(o.productKey);
            if (!acc) return bot.sendMessage(chatId, `❌ No stock for <b>${o.productKey}</b>. Add via /add`, { parse_mode: 'HTML' });

            o.delivered = true;
            o.account = acc;
            o.deliveredAt = Date.now();
            orders[orderId] = o;
            writeJSON(ORDERS_FILE, orders);

            return bot.sendMessage(chatId,
                `✅ Delivered <b>${orderId}</b>\n\n` +
                `To: <code>${o.userId}</code>\n` +
                `Product: ${o.productTitle}\n` +
                `Account: <code>${acc}</code>`,
                { parse_mode: 'HTML' });
        }

        bot.sendMessage(chatId, '❓ Unknown. /start');
    });
    console.log('✅ Telegram bot ready');
}

// ================= ADMIN AUTH =================
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'secret';
const loginAttempts = new Map();

function requireAdmin(req, res, next) {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ ok: false, error: 'No token' });
    try {
        const p = jwt.verify(token, JWT_SECRET);
        if (p.role !== 'admin') throw new Error('Not admin');
        req.admin = p;
        next();
    } catch {
        return res.status(401).json({ ok: false, error: 'Invalid token' });
    }
}

app.post('/api/admin/login', (req, res) => {
    const ip = requestIp.getClientIp(req) || 'unknown';
    const now = Date.now();
    const att = loginAttempts.get(ip) || { count: 0, until: 0 };
    if (att.until > now) {
        const min = Math.ceil((att.until - now) / 60000);
        return res.status(429).json({ ok: false, error: `Locked. Try ${min} min.` });
    }
    const { username, password } = req.body || {};
    const ok = username === ADMIN_USER && password && bcrypt.compareSync(password, ADMIN_PASS_HASH);
    if (!ok) {
        att.count = (att.count || 0) + 1;
        if (att.count >= 5) {
            att.until = now + 15 * 60 * 1000;
            att.count = 0;
            loginAttempts.set(ip, att);
            return res.status(429).json({ ok: false, error: 'Locked 15 min' });
        }
        loginAttempts.set(ip, att);
        return res.status(401).json({ ok: false, error: `Wrong (${5 - att.count} left)` });
    }
    loginAttempts.delete(ip);
    const token = jwt.sign({ role: 'admin', user: ADMIN_USER }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ ok: true, token });
});

app.get('/api/admin/me', requireAdmin, (req, res) => res.json({ ok: true, user: req.admin.user }));
app.get('/api/admin/orders', requireAdmin, (req, res) => res.json(readJSON(ORDERS_FILE)));
app.get('/api/admin/stock', requireAdmin, (req, res) => ({
    any_name: countStock('any_name'),
    page: countStock('page')
}));

// ================= PUBLIC =================
const ipCache = new Map();
app.get('/api/geo', async (req, res) => {
    const ip = requestIp.getClientIp(req) || '';
    if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
        return res.json({ country: 'US', ip });
    }
    if (ipCache.has(ip)) return res.json({ country: ipCache.get(ip), ip });
    try {
        const r = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
        const d = await r.json();
        const code = d.countryCode || 'US';
        ipCache.set(ip, code);
        res.json({ country: code, ip });
    } catch {
        res.json({ country: 'US', ip });
    }
});

app.get('/api/products', (req, res) => {
    res.json(PRODUCTS_META.map(p => ({ ...p, stock: countStock(p.key) })));
});

// ================= SUBMIT ORDER (manual) =================
app.post('/api/submit-order', upload.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ ok: false, error: 'Screenshot required' });

        const { productKey, quantity, region, amount, userId } = req.body;
        const product = PRODUCTS_META.find(p => p.key === productKey);
        if (!product) return res.status(400).json({ ok: false, error: 'Invalid product' });

        const qty = Math.max(1, Math.min(10, parseInt(quantity) || 1));
        const uid = userId || 'U-' + crypto.randomBytes(4).toString('hex');
        const orderId = 'ORD-' + Date.now().toString().slice(-8);
        const orders = readJSON(ORDERS_FILE);

        orders[orderId] = {
            orderId, userId: uid, productKey, productTitle: product.title,
            quantity: qty, region, amount, delivered: false,
            createdAt: Date.now()
        };
        writeJSON(ORDERS_FILE, orders);

        // Send to your Telegram with screenshot
        if (bot && OWNER) {
            const caption =
                `🔔 <b>NEW ORDER</b>\n\n` +
                `Order: <code>${orderId}</code>\n` +
                `Product: ${product.title}\n` +
                `Quantity: <b>${qty}</b>\n` +
                `Amount: <b>${amount}</b>\n` +
                `Region: ${region}\n` +
                `User: <code>${uid}</code>\n\n` +
                `To deliver: <code>/give ${orderId}</code>`;

            bot.sendPhoto(OWNER, req.file.buffer, {
                caption,
                parse_mode: 'HTML'
            }).catch(e => console.error('Telegram send error:', e));
        }

        res.json({
            ok: true,
            orderId,
            userId: uid,
            message: 'Order submitted. Please contact support with your Order ID for delivery.'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🦅 Running on ${PORT}`));
