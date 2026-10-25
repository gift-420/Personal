// js/store.js — localStorage persistence (Chrome bondho holeo thake)
const DRAFT_KEY  = 'naim_draft_order';
const REGION_KEY = 'naim_region';
const PROD_KEY   = 'naim_products_cache';
const CFG_KEY    = 'naim_config_cache';
const PHONE_KEY  = 'naim_phone';

export function saveDraft(d)  { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {} }
export function loadDraft()   { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { return null; } }
export function clearDraft()  { try { localStorage.removeItem(DRAFT_KEY); } catch {} }

export function saveRegion(c){ try { localStorage.setItem(REGION_KEY, c); } catch {} }
export function loadRegion()  { return localStorage.getItem(REGION_KEY) || null; }

export function cacheProducts(l) { try { localStorage.setItem(PROD_KEY, JSON.stringify(l)); } catch {} }
export function cachedProducts() { try { return JSON.parse(localStorage.getItem(PROD_KEY) || 'null'); } catch { return null; } }

export function cacheConfig(c) { try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch {} }
export function cachedConfig() { try { return JSON.parse(localStorage.getItem(CFG_KEY) || 'null'); } catch { return null; } }

export function savePhone(p) { try { localStorage.setItem(PHONE_KEY, p); } catch {} }
export function loadPhone()  { return localStorage.getItem(PHONE_KEY) || ''; }

export const REGIONS = {
  BD: { label: 'Bangladesh', currency: 'BDT', symbol: '৳', rate: 130, flag: '🇧🇩' },
  NG: { label: 'Nigeria',    currency: 'NGN', symbol: '₦', rate: 1420, flag: '🇳🇬' },
  US: { label: 'Global',     currency: 'USD', symbol: '$', rate: 1,    flag: '🌍' }
};

export function currentRegion() {
  const r = loadRegion() || 'US';
  return REGIONS[r] ? r : 'US';
}

export function formatPrice(usd, qty = 1) {
  const reg = REGIONS[currentRegion()];
  const val = Math.round(usd * reg.rate * qty * 100) / 100;
  return `${reg.symbol} ${val.toLocaleString('en-US')}`;
                                                        }
