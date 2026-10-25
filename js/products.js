// js/products.js — default products (Firebase na thakle ei list use hobe)
export const DEFAULT_PRODUCTS = [
  { id: 1, title: 'PAGE', subtitle: 'Facebook Page', priceUSD: 1.10, icon: 'fas fa-flag', color: 'text-orange-500', bg: 'bg-orange-50', inputType: 'page_name', inputLabel: 'Your Page Name', inputPlaceholder: 'e.g. My Business Page', details: 'Facebook Page with full admin access. Verified and aged.' },
  { id: 2, title: 'ANY NAME', subtitle: 'Custom Profile', priceUSD: 0.85, icon: 'fas fa-user-pen', color: 'text-indigo-600', bg: 'bg-indigo-50', inputType: 'name', inputLabel: 'Your Desired Name', inputPlaceholder: 'e.g. John Smith', details: 'Facebook profile with your chosen name.' },
  { id: 3, title: 'OLD FB', subtitle: 'Standard Account', priceUSD: 1.20, icon: 'fab fa-facebook', color: 'text-blue-600', bg: 'bg-blue-50', inputType: null, details: 'Aged Facebook account with activity history.' },
  { id: 4, title: 'NEW FB', subtitle: 'Fresh Account', priceUSD: 0.70, icon: 'fab fa-facebook-square', color: 'text-blue-500', bg: 'bg-blue-50', inputType: null, details: 'Brand new Facebook account.' },
  { id: 5, title: 'APPLE ID', subtitle: 'Verified Account', priceUSD: 0.50, icon: 'fab fa-apple', color: 'text-slate-800', bg: 'bg-slate-100', inputType: null, details: 'Fully verified Apple ID.' },
  { id: 6, title: 'PC CLONE FB', subtitle: 'Desktop Created', priceUSD: 0.30, icon: 'fas fa-desktop', color: 'text-teal-600', bg: 'bg-teal-50', inputType: null, details: 'Facebook account created from desktop.' }
];

export const DEFAULT_CONFIG = {
  support: { whatsapp: '8801773204904', telegram: 'naim_store', email: 'support@naim.com' },
  payments: {
    BD: { label: 'Bangladesh', methods: [
      { id: 'bkash', name: 'bKash', type: 'Personal', icon: 'fas fa-mobile-screen', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', account: '01773204904', enabled: true },
      { id: 'nagad', name: 'Nagad', type: 'Personal', icon: 'fas fa-mobile-screen', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', account: '01773204904', enabled: true }
    ]},
    NG: { label: 'Nigeria', methods: [
      { id: 'opay', name: 'OPay', type: 'Bank Transfer', icon: 'fas fa-wallet', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', bank: 'OPay', account: '6598578587', holder: 'Bright Munachi Amaraegbu', enabled: true }
    ]},
    US: { label: 'Global', methods: [
      { id: 'usdt', name: 'USDT (Arbitrum)', type: 'Crypto', icon: 'fab fa-bitcoin', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', account: '0xf0f0c92a09bf1d8d48ccf529d253f19b029fade0', network: 'Arbitrum One', enabled: true }
    ]}
  }
};
