import { useState } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id: "e1", name: "Анна Соколова", role: "Официант", initials: "АС", rating: 4.9, txCount: 312, totalTips: 84200, bio: "Коплю на путешествие в Японию 🌸", avgTip: 270 },
  { id: "e2", name: "Иван Петров", role: "Бармен", initials: "ИП", rating: 4.7, txCount: 198, totalTips: 53600, bio: "Рад помочь с выбором коктейля", avgTip: 220 },
  { id: "e3", name: "Мария Кузнецова", role: "Официант", initials: "МК", rating: 5.0, txCount: 401, totalTips: 112400, bio: "Стараюсь сделать ваш вечер незабываемым ✨", avgTip: 280 },
  { id: "e4", name: "Дмитрий Волков", role: "Хостес", initials: "ДВ", rating: 4.8, txCount: 144, totalTips: 38900, bio: "", avgTip: 195 },
];

const TRANSACTIONS = [
  { id: "t1", empId: "e3", amount: 500, billAmount: 4800, pct: 10, comment: "Всё идеально, спасибо!", date: "2026-02-26T20:14", rating: 5 },
  { id: "t2", empId: "e1", amount: 300, billAmount: 3200, pct: 9, comment: "Отличный сервис", date: "2026-02-26T19:40", rating: 5 },
  { id: "t3", empId: "e2", amount: 200, billAmount: 2100, pct: null, comment: "", date: "2026-02-26T18:55", rating: 4 },
  { id: "t4", empId: "e1", amount: 150, billAmount: 1800, pct: 8, comment: "", date: "2026-02-26T17:20", rating: 4 },
  { id: "t5", empId: "e3", amount: 400, billAmount: 3900, pct: 10, comment: "Мария — лучший официант!", date: "2026-02-25T21:05", rating: 5 },
  { id: "t6", empId: "e4", amount: 250, billAmount: null, pct: null, comment: "Приятная атмосфера", date: "2026-02-25T20:30", rating: 5 },
];

const fmt = (n) => n?.toLocaleString("ru-RU") + " ₽";
const fmtDate = (d) => new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

// ─── MINI QR ──────────────────────────────────────────────────────────────────
function QRSvg({ value, size = 100, light = false }) {
  const C = 21, cell = size / C;
  const h = (s) => { let x = 0; for (let i = 0; i < s.length; i++) x = (Math.imul(31, x) + s.charCodeAt(i)) | 0; return x; };
  const grid = Array.from({ length: C }, (_, r) =>
    Array.from({ length: C }, (_, c) => {
      if ((r < 7 && c < 7) || (r < 7 && c >= C - 7) || (r >= C - 7 && c < 7)) return true;
      return Math.abs(h(value + r * 100 + c)) % 3 !== 0;
    })
  );
  const fg = light ? "#ffffff" : "#0d1117";
  const bg = light ? "transparent" : "#ffffff";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {bg !== "transparent" && <rect width={size} height={size} fill={bg} rx={4} />}
      {grid.map((row, r) => row.map((on, c) => on ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fg} /> : null))}
    </svg>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c-bg: #F8F9FB;
  --c-white: #FFFFFF;
  --c-surface: #FFFFFF;
  --c-border: #E5E8EF;
  --c-border-strong: #CDD2DC;
  --c-text: #0D1117;
  --c-text-2: #4A5568;
  --c-text-3: #8A94A6;
  --c-accent: #1A56DB;
  --c-accent-light: #EBF0FF;
  --c-accent-hover: #1447C5;
  --c-green: #0D9488;
  --c-green-bg: #F0FDF9;
  --c-amber: #D97706;
  --c-amber-bg: #FFFBEB;
  --c-red: #DC2626;
  --c-red-bg: #FEF2F2;
  --c-purple: #7C3AED;
  --c-purple-bg: #F5F3FF;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 20px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05);
  --font: 'Inter', system-ui, sans-serif;
  --font-display: 'Syne', sans-serif;
}

body { background: var(--c-bg); color: var(--c-text); font-family: var(--font); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

/* ── Layout ── */
.shell { display: flex; min-height: 100vh; }
.sidebar { width: 220px; background: var(--c-white); border-right: 1px solid var(--c-border); display: flex; flex-direction: column; flex-shrink: 0; position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; }
.main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.topbar { height: 56px; background: var(--c-white); border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 40; }
.content { padding: 24px; flex: 1; }

/* ── Sidebar ── */
.sidebar-logo { padding: 20px 16px 16px; border-bottom: 1px solid var(--c-border); }
.logo-mark { display: flex; align-items: center; gap: 10px; }
.logo-icon { width: 32px; height: 32px; background: var(--c-accent); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; flex-shrink: 0; }
.logo-name { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--c-text); letter-spacing: -0.02em; }
.logo-sub { font-size: 10px; color: var(--c-text-3); font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; margin-top: 1px; }
.sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
.nav-section-label { font-size: 10px; font-weight: 600; color: var(--c-text-3); text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 10px 4px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); font-size: 13px; font-weight: 500; color: var(--c-text-2); cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: all 0.15s; font-family: var(--font); }
.nav-item:hover { background: var(--c-bg); color: var(--c-text); }
.nav-item.active { background: var(--c-accent-light); color: var(--c-accent); font-weight: 600; }
.nav-item .nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; opacity: 0.7; }
.nav-item.active .nav-icon { opacity: 1; }
.sidebar-footer { padding: 12px 8px; border-top: 1px solid var(--c-border); }
.sidebar-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--r-sm); cursor: pointer; }
.sidebar-user:hover { background: var(--c-bg); }

/* ── Topbar ── */
.page-heading { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--c-text); letter-spacing: -0.02em; }
.topbar-actions { display: flex; align-items: center; gap: 8px; }

/* ── Cards ── */
.card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--shadow-sm); }
.card-body { padding: 20px; }
.card-header { padding: 16px 20px; border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; }
.card-title { font-size: 14px; font-weight: 600; color: var(--c-text); }
.card-footer { padding: 12px 20px; border-top: 1px solid var(--c-border); background: var(--c-bg); border-radius: 0 0 var(--r-lg) var(--r-lg); }

/* ── Stats ── */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
.stat-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-lg); padding: 18px 20px; box-shadow: var(--shadow-sm); }
.stat-label { font-size: 12px; font-weight: 500; color: var(--c-text-3); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.stat-value { font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--c-text); letter-spacing: -0.02em; line-height: 1; }
.stat-sub { font-size: 12px; color: var(--c-text-3); margin-top: 6px; }
.stat-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
.delta-up { background: var(--c-green-bg); color: var(--c-green); }
.delta-down { background: var(--c-red-bg); color: var(--c-red); }

/* ── Buttons ── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; font-family: var(--font); font-weight: 500; transition: all 0.15s; white-space: nowrap; }
.btn-primary { background: var(--c-accent); color: white; font-size: 13px; padding: 9px 16px; border-radius: var(--r-sm); }
.btn-primary:hover { background: var(--c-accent-hover); }
.btn-secondary { background: var(--c-white); color: var(--c-text); border: 1px solid var(--c-border); font-size: 13px; padding: 8px 14px; border-radius: var(--r-sm); }
.btn-secondary:hover { border-color: var(--c-border-strong); background: var(--c-bg); }
.btn-ghost { background: none; color: var(--c-text-2); font-size: 13px; padding: 8px 12px; border-radius: var(--r-sm); }
.btn-ghost:hover { background: var(--c-bg); color: var(--c-text); }
.btn-danger { background: var(--c-red); color: white; font-size: 13px; padding: 9px 16px; border-radius: var(--r-sm); }
.btn-sm { padding: 6px 12px !important; font-size: 12px !important; }
.btn-lg { padding: 13px 22px !important; font-size: 15px !important; border-radius: var(--r-md) !important; font-weight: 600 !important; }
.btn-full { width: 100%; }
.btn-icon { padding: 8px !important; border-radius: var(--r-sm); aspect-ratio: 1; }

/* ── Inputs ── */
.field { margin-bottom: 14px; }
.label { display: block; font-size: 12px; font-weight: 500; color: var(--c-text-2); margin-bottom: 5px; }
.input { width: 100%; padding: 9px 12px; background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-sm); font-size: 14px; font-family: var(--font); color: var(--c-text); outline: none; transition: border-color 0.15s; }
.input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(26,86,219,0.08); }
.input::placeholder { color: var(--c-text-3); }
.input-group { display: flex; gap: 0; }
.input-group .input { border-radius: var(--r-sm) 0 0 var(--r-sm); }
.input-group .btn { border-radius: 0 var(--r-sm) var(--r-sm) 0; }
.textarea { resize: vertical; min-height: 80px; }
.select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238A94A6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; padding-right: 36px; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: var(--c-text-3); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--c-border); white-space: nowrap; background: var(--c-bg); }
.table th:first-child { border-radius: var(--r-sm) 0 0 0; }
.table th:last-child { border-radius: 0 var(--r-sm) 0 0; }
.table td { padding: 12px 14px; border-bottom: 1px solid var(--c-border); color: var(--c-text); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: var(--c-bg); }

/* ── Badges / Tags ── */
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-green { background: var(--c-green-bg); color: var(--c-green); }
.badge-amber { background: var(--c-amber-bg); color: var(--c-amber); }
.badge-blue { background: var(--c-accent-light); color: var(--c-accent); }
.badge-purple { background: var(--c-purple-bg); color: var(--c-purple); }
.badge-red { background: var(--c-red-bg); color: var(--c-red); }
.badge-gray { background: var(--c-bg); color: var(--c-text-3); border: 1px solid var(--c-border); }

/* ── Avatar ── */
.avatar { flex-shrink: 0; border-radius: var(--r-sm); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.avatar-36 { width: 36px; height: 36px; font-size: 12px; }
.avatar-40 { width: 40px; height: 40px; font-size: 13px; }
.avatar-48 { width: 48px; height: 48px; font-size: 15px; border-radius: var(--r-md); }
.avatar-64 { width: 64px; height: 64px; font-size: 20px; border-radius: var(--r-md); }
.avatar-96 { width: 96px; height: 96px; font-size: 28px; border-radius: var(--r-lg); }

/* ── Progress ── */
.progress { height: 6px; background: var(--c-border); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
.progress-blue { background: var(--c-accent); }
.progress-green { background: var(--c-green); }

/* ── Divider ── */
.divider { height: 1px; background: var(--c-border); }

/* ── Utils ── */
.flex { display: flex; } .flex-col { flex-direction: column; }
.items-center { align-items: center; } .items-start { align-items: flex-start; }
.justify-between { justify-content: space-between; } .justify-center { justify-content: center; }
.gap-4 { gap: 4px; } .gap-6 { gap: 6px; } .gap-8 { gap: 8px; } .gap-10 { gap: 10px; }
.gap-12 { gap: 12px; } .gap-16 { gap: 16px; } .gap-20 { gap: 20px; } .gap-24 { gap: 24px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.mt-4{margin-top:4px}.mt-6{margin-top:6px}.mt-8{margin-top:8px}.mt-12{margin-top:12px}.mt-16{margin-top:16px}.mt-20{margin-top:20px}.mt-24{margin-top:24px}
.mb-4{margin-bottom:4px}.mb-8{margin-bottom:8px}.mb-12{margin-bottom:12px}.mb-16{margin-bottom:16px}.mb-20{margin-bottom:20px}.mb-24{margin-bottom:24px}
.p-20{padding:20px}.p-24{padding:24px}
.text-xs{font-size:11px}.text-sm{font-size:13px}.text-base{font-size:14px}.text-lg{font-size:16px}.text-xl{font-size:20px}.text-2xl{font-size:24px}
.font-500{font-weight:500}.font-600{font-weight:600}.font-700{font-weight:700}
.font-display{font-family:var(--font-display)}
.text-2{color:var(--c-text-2)}.text-3{color:var(--c-text-3)}.text-accent{color:var(--c-accent)}.text-green{color:var(--c-green)}.text-red{color:var(--c-red)}.text-amber{color:var(--c-amber)}
.text-center{text-align:center}.text-right{text-align:right}
.w-full{width:100%}.h-full{height:100%}
.rounded{border-radius:var(--r-sm)}.rounded-md{border-radius:var(--r-md)}.rounded-full{border-radius:9999px}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ── Animations ── */
@keyframes fadeUp { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0;transform:scale(0.95); } to { opacity:1;transform:scale(1); } }
.anim-fadeup { animation: fadeUp 0.3s ease; }
.anim-fadein { animation: fadeIn 0.25s ease; }
.anim-scalein { animation: scaleIn 0.2s ease; }

/* ── Tip Page (гостевая) ── */
.tip-shell { min-height: 100vh; background: linear-gradient(160deg, #F0F4FF 0%, #F8F9FB 50%, #F0FDF9 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
.tip-card { background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.12); width: 100%; max-width: 400px; overflow: hidden; }
.tip-header { padding: 28px 28px 20px; background: linear-gradient(135deg, #1A56DB 0%, #1447C5 100%); color: white; text-align: center; }
.tip-body { padding: 24px 28px; }
.tip-footer { padding: 16px 28px; background: #F8F9FB; border-top: 1px solid #E5E8EF; text-align: center; }
.amount-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 12px; }
.amount-btn { padding: 11px 8px; border: 1.5px solid var(--c-border); background: white; border-radius: var(--r-sm); font-size: 14px; font-weight: 600; color: var(--c-text); cursor: pointer; transition: all 0.15s; font-family: var(--font); text-align: center; }
.amount-btn:hover { border-color: var(--c-accent); color: var(--c-accent); }
.amount-btn.active { border-color: var(--c-accent); background: var(--c-accent); color: white; }
.pct-grid { display: flex; gap: 6px; }
.pct-btn { flex:1; padding: 9px 4px; border: 1.5px solid var(--c-border); background: white; border-radius: var(--r-sm); font-size: 13px; font-weight: 600; color: var(--c-text-2); cursor: pointer; transition: all 0.15s; font-family: var(--font); text-align: center; }
.pct-btn:hover { border-color: var(--c-accent); color: var(--c-accent); }
.pct-btn.active { border-color: var(--c-accent); background: var(--c-accent); color: white; }
.tab-row { display: flex; background: var(--c-bg); border-radius: var(--r-sm); padding: 3px; gap: 3px; margin-bottom: 16px; }
.tab-btn { flex:1; padding: 7px; border: none; background: none; border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--c-text-3); cursor: pointer; font-family: var(--font); transition: all 0.15s; }
.tab-btn.active { background: white; color: var(--c-accent); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.review-platforms { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.platform-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1.5px solid var(--c-border); background: white; border-radius: var(--r-sm); cursor: pointer; font-family: var(--font); font-size: 13px; font-weight: 500; color: var(--c-text); transition: border-color 0.15s; }
.platform-btn:hover { border-color: var(--c-accent); }
.platform-btn.active { border-color: var(--c-accent); background: var(--c-accent-light); }
.success-check { width: 64px; height: 64px; background: #ECFDF5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(13,17,23,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; backdrop-filter: blur(2px); }
.modal { background: white; border-radius: var(--r-xl); width: 100%; max-width: 480px; box-shadow: var(--shadow-lg); animation: scaleIn 0.2s ease; }
.modal-header { padding: 20px 24px 16px; border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; }
.modal-body { padding: 20px 24px; }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--c-border); display: flex; gap: 8px; justify-content: flex-end; }

/* ── Employee public card ── */
.emp-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--c-border); }
.emp-row:last-child { border-bottom: none; }
.stars { display: flex; gap: 2px; }
.star { font-size: 12px; }

/* ── Charts ── */
.bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
.bar { flex: 1; border-radius: 4px 4px 0 0; transition: height 0.5s ease; min-width: 0; cursor: pointer; }
.bar:hover { opacity: 0.8; }

/* ── Switch ── */
.switch { width: 36px; height: 20px; background: var(--c-border); border-radius: 10px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.switch.on { background: var(--c-accent); }
.switch-thumb { width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.switch.on .switch-thumb { left: 18px; }
.switch-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--c-border); }
.switch-row:last-child { border-bottom: none; }

/* ── Nav tabs (top) ── */
.view-tabs { display: flex; gap: 0; background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-sm); padding: 3px; }
.view-tab { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; background: none; color: var(--c-text-3); font-family: var(--font); transition: all 0.15s; }
.view-tab.active { background: white; color: var(--c-accent); font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--c-border-strong); border-radius: 3px; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 40, color }) {
  const colors = ["#1A56DB","#0D9488","#7C3AED","#D97706","#DC2626","#0891B2"];
  const bg = color || colors[initials.charCodeAt(0) % colors.length];
  const cls = `avatar avatar-${size}`;
  return <div className={cls} style={{ background: bg, color: "white" }}>{initials}</div>;
}
function Stars({ rating }) {
  return <div className="stars">{[1,2,3,4,5].map(i => <span key={i} className="star" style={{ color: i <= Math.round(rating) ? "#F59E0B" : "#E5E8EF" }}>★</span>)}</div>;
}
function Switch({ on, onChange }) {
  return <div className={`switch ${on ? "on" : ""}`} onClick={() => onChange(!on)}><div className="switch-thumb" /></div>;
}
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal anim-scalein">
        <div className="modal-header">
          <div className="font-600 text-lg">{title}</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── TIP PAGE (гостевая страница) ────────────────────────────────────────────
function TipPage({ employee, billAmount = 3200, onBack }) {
  const [step, setStep] = useState("tips"); // tips | review | success
  const [mode, setMode] = useState("pct"); // pct | fixed
  const [pct, setPct] = useState(10);
  const [fixed, setFixed] = useState(300);
  const [customFixed, setCustomFixed] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(false);

  const calcAmount = mode === "pct" ? Math.round(billAmount * pct / 100) : (customFixed ? parseInt(customFixed) || 0 : fixed);
  const PCTS = [5, 10, 15, 20];
  const FIXED = [100, 200, 300, 500, 1000];

  const pay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("review"); }, 1600);
  };
  const finish = () => setStep("success");

  return (
    <div className="tip-shell">
      <div className="tip-card anim-fadeup">
        {step === "tips" && <>
          <div className="tip-header">
            <Avatar initials={employee.initials} size={64} />
            <div className="mt-12">
              <div style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700 }}>{employee.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{employee.role} · Resto Milano</div>
            </div>
            {employee.bio && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, background: "rgba(255,255,255,0.12)", padding: "8px 12px", borderRadius: 8 }}>💬 {employee.bio}</div>}
            <div className="flex items-center gap-8 mt-12" style={{ justifyContent: "center" }}>
              <Stars rating={employee.rating} />
              <span style={{ fontSize: 13, opacity: 0.9, fontWeight: 600 }}>{employee.rating}</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>({employee.txCount} отзывов)</span>
            </div>
          </div>

          <div className="tip-body">
            <div style={{ background: "#F8F9FB", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-sm text-2">Сумма счёта</span>
              <span className="font-600">{fmt(billAmount)}</span>
            </div>

            <div className="tab-row">
              <button className={`tab-btn ${mode === "pct" ? "active" : ""}`} onClick={() => setMode("pct")}>% от счёта</button>
              <button className={`tab-btn ${mode === "fixed" ? "active" : ""}`} onClick={() => setMode("fixed")}>Фиксированно</button>
            </div>

            {mode === "pct" ? (
              <div className="pct-grid">{PCTS.map(p => (
                <button key={p} className={`pct-btn ${pct === p ? "active" : ""}`} onClick={() => setPct(p)}>
                  {p}%<br /><span style={{ fontSize: 11, fontWeight: 500 }}>{fmt(Math.round(billAmount * p / 100))}</span>
                </button>
              ))}</div>
            ) : (
              <>
                <div className="amount-grid">
                  {FIXED.slice(0, 5).map(a => (
                    <button key={a} className={`amount-btn ${fixed === a && !customFixed ? "active" : ""}`} onClick={() => { setFixed(a); setCustomFixed(""); }}>
                      {a} ₽
                    </button>
                  ))}
                </div>
                <input className="input" placeholder="Другая сумма, ₽" type="number" value={customFixed} onChange={e => setCustomFixed(e.target.value)} />
              </>
            )}

            {calcAmount > 0 && (
              <div style={{ marginTop: 16, padding: "14px 16px", background: "#EBF0FF", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="text-sm font-600 text-accent">Итого чаевые</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--c-accent)" }}>{fmt(calcAmount)}</span>
              </div>
            )}

            <button className="btn btn-primary btn-full btn-lg mt-16" onClick={pay} disabled={!calcAmount || loading}>
              {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />Обработка...</span> : `Оплатить ${calcAmount ? fmt(calcAmount) : ""}`}
            </button>
            <button className="btn btn-ghost btn-full mt-6" style={{ color: "var(--c-text-3)", fontSize: 12 }}>Без чаевых</button>
          </div>
          <div className="tip-footer">
            <div className="text-xs text-3">🔒 Безопасная оплата · СБП, Карта, SberPay</div>
            <div className="text-xs text-3 mt-4">Powered by <strong style={{ color: "var(--c-accent)" }}>ЧайВой</strong></div>
          </div>
        </>}

        {step === "review" && (
          <div className="tip-body anim-fadeup" style={{ padding: "32px 28px" }}>
            <div className="success-check">🎉</div>
            <div className="font-display font-700 text-xl text-center">{fmt(calcAmount)} отправлено!</div>
            <div className="text-center text-sm text-2 mt-6">{employee.name} получит ваши чаевые</div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div className="text-sm font-600 mb-12 text-center">Как вам обслуживание?</div>
            <div className="flex gap-8" style={{ justifyContent: "center", marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 32, cursor: "pointer", filter: s <= (hoverRating || rating) ? "none" : "grayscale(1)", transition: "transform 0.1s", transform: s <= (hoverRating || rating) ? "scale(1.2)" : "scale(1)" }}
                  onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>⭐</span>
              ))}
            </div>
            <textarea className="input textarea" placeholder="Комментарий (необязательно)..." value={comment} onChange={e => setComment(e.target.value)} style={{ marginBottom: 12 }} />
            {rating >= 4 && (
              <>
                <div className="text-xs text-3 text-center mb-8">Оставьте отзыв и помогите ресторану:</div>
                <div className="review-platforms">
                  {[{ id: "yandex", label: "Яндекс Карты", emoji: "🗺", color: "#FF0000" }, { id: "2gis", label: "2ГИС", emoji: "🌐", color: "#29A645" }].map(p => (
                    <button key={p.id} className={`platform-btn ${platform === p.id ? "active" : ""}`} onClick={() => setPlatform(p.id)}>
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      <span>{p.label}</span>
                      {platform === p.id && <span className="badge badge-blue" style={{ marginLeft: "auto" }}>Выбрано ✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button className="btn btn-primary btn-full btn-lg mt-16" onClick={finish}>Отправить{rating ? " отзыв" : ""}</button>
            <button className="btn btn-ghost btn-full mt-6" style={{ fontSize: 12 }} onClick={finish}>Пропустить</button>
          </div>
        )}

        {step === "success" && (
          <div className="tip-body anim-fadeup" style={{ padding: "48px 28px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#1A56DB,#0D9488)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>✓</div>
            <div className="font-display font-700 text-2xl" style={{ color: "var(--c-text)" }}>Спасибо!</div>
            <div className="text-sm text-2 mt-8" style={{ lineHeight: 1.7 }}>Чаевые и отзыв отправлены.<br />Вы сделали вечер лучше ✨</div>
            <button className="btn btn-secondary mt-24" onClick={onBack}>← Вернуться</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── OVERVIEW (Dashboard) ────────────────────────────────────────────────────
function Overview({ setView, setTipEmployee }) {
  const total = EMPLOYEES.reduce((s, e) => s + e.totalTips, 0);
  const totalTx = EMPLOYEES.reduce((s, e) => s + e.txCount, 0);
  const avgRating = (EMPLOYEES.reduce((s, e) => s + e.rating, 0) / EMPLOYEES.length).toFixed(1);
  const barData = [42, 58, 51, 76, 89, 112, 98];
  const maxBar = Math.max(...barData);

  return (
    <div className="anim-fadeup">
      <div className="stat-grid">
        {[
          { label: "Всего чаевых", value: fmt(total), sub: "За всё время", delta: "+18%", up: true, icon: "💰" },
          { label: "Переводов", value: totalTx.toLocaleString("ru-RU"), sub: "Транзакций", delta: "+24%", up: true, icon: "⚡" },
          { label: "Средний чек", value: "267 ₽", sub: "Средние чаевые", delta: "+5%", up: true, icon: "📊" },
          { label: "Рейтинг", value: `★ ${avgRating}`, sub: `${EMPLOYEES.length} сотрудников`, icon: "⭐" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-label"><span>{s.icon}</span> {s.label} {s.delta && <span className={`stat-delta ${s.up ? "delta-up" : "delta-down"}`}>{s.up ? "↑" : "↓"} {s.delta}</span>}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Чаевые за неделю</div><span className="badge badge-green">Этот месяц</span></div>
          <div className="card-body">
            <div className="bar-chart">
              {barData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="bar" style={{ height: `${(v / maxBar) * 100}%`, background: i === 6 ? "var(--c-accent)" : "var(--c-accent-light)" }} />
                  <div className="text-xs text-3">{["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]}</div>
                </div>
              ))}
            </div>
            <div className="divider mt-12 mb-12" />
            <div className="flex justify-between">
              {[["Ср. день", "38 400 ₽"], ["Лучший", "Суббота"], ["Сейчас", "↑ Активно"]].map(([l, v]) => (
                <div key={l} className="text-center"><div className="text-xs text-3">{l}</div><div className="text-sm font-600 mt-4">{v}</div></div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Топ сотрудники</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("employees")}>Все →</button>
          </div>
          <div className="card-body" style={{ padding: "8px 20px" }}>
            {[...EMPLOYEES].sort((a,b) => b.totalTips - a.totalTips).map((emp, i) => (
              <div key={emp.id} className="emp-row">
                <span className="text-xs text-3 font-700" style={{ width: 18 }}>#{i+1}</span>
                <Avatar initials={emp.initials} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-sm font-600 truncate">{emp.name}</div>
                  <div className="text-xs text-3">{emp.role}</div>
                </div>
                <div style={{ width: 80 }}><div className="progress"><div className="progress-fill progress-blue" style={{ width: `${(emp.totalTips / EMPLOYEES[2].totalTips) * 100}%` }} /></div></div>
                <div className="text-sm font-600 text-accent" style={{ minWidth: 76, textAlign: "right" }}>{fmt(emp.totalTips)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header"><div className="card-title">Последние переводы</div></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Сотрудник</th><th>Сумма</th><th>% от счёта</th><th>Отзыв</th><th>Дата</th><th>Статус</th></tr></thead>
            <tbody>{TRANSACTIONS.slice(0, 5).map(tx => {
              const emp = EMPLOYEES.find(e => e.id === tx.empId);
              return (
                <tr key={tx.id}>
                  <td><div className="flex items-center gap-8"><Avatar initials={emp.initials} size={32} /><span className="font-500">{emp.name}</span></div></td>
                  <td><span className="font-600 text-green">+{fmt(tx.amount)}</span></td>
                  <td>{tx.pct ? <span className="badge badge-blue">{tx.pct}%</span> : <span className="text-3">—</span>}</td>
                  <td>{tx.rating ? <Stars rating={tx.rating} /> : <span className="text-3">—</span>}</td>
                  <td className="text-3">{fmtDate(tx.date)}</td>
                  <td><span className="badge badge-green">✓ Зачислено</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
function Employees({ setTipEmployee, setView }) {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const openTip = (emp) => { setTipEmployee(emp); setView("tip"); };

  return (
    <div className="anim-fadeup">
      <div className="flex items-center justify-between mb-20">
        <div>
          <div className="text-sm text-3">Управление командой</div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary">⬇ Экспорт QR</button>
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ Добавить сотрудника</button>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Сотрудник</th><th>Роль</th><th>Рейтинг</th><th>Переводов</th><th>Чаевых всего</th><th>Ср. чаевые</th><th>Действия</th></tr></thead>
            <tbody>{EMPLOYEES.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div className="flex items-center gap-10">
                    <Avatar initials={emp.initials} size={40} />
                    <div>
                      <div className="font-600">{emp.name}</div>
                      <div className="text-xs text-3">{emp.bio || "Нет bio"}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-gray">{emp.role}</span></td>
                <td>
                  <div className="flex items-center gap-6"><Stars rating={emp.rating} /><span className="font-600 text-sm">{emp.rating}</span></div>
                </td>
                <td className="font-500">{emp.txCount}</td>
                <td><span className="font-600 text-green">{fmt(emp.totalTips)}</span></td>
                <td className="text-2">{fmt(emp.avgTip)}</td>
                <td>
                  <div className="flex gap-6">
                    <button className="btn btn-secondary btn-sm" onClick={() => openTip(emp)}>Страница ↗</button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="QR-код" onClick={() => setSelected(emp)}>⊞</button>
                    <button className="btn btn-ghost btn-sm btn-icon" title="Редактировать">✎</button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal title={`QR-код — ${selected.name}`} onClose={() => setSelected(null)}
          footer={<><button className="btn btn-secondary" onClick={() => setSelected(null)}>Закрыть</button><button className="btn btn-primary">⬇ Скачать PNG</button></>}>
          <div className="text-center">
            <div style={{ display: "inline-block", padding: 16, background: "white", borderRadius: 12, border: "1px solid var(--c-border)", boxShadow: "var(--shadow-sm)" }}>
              <QRSvg value={`chaivoy.ru/tip/${selected.id}`} size={200} />
            </div>
            <div className="text-sm text-2 mt-12">chaivoy.ru/tip/{selected.id}</div>
            <div className="text-xs text-3 mt-4">Разместите на столике, в пречеке или визитке</div>
            <div className="flex gap-8 mt-16" style={{ justifyContent: "center" }}>
              <button className="btn btn-secondary btn-sm">🔗 Копировать ссылку</button>
              <button className="btn btn-secondary btn-sm">📄 Макет для печати</button>
            </div>
          </div>
        </Modal>
      )}

      {modal && (
        <Modal title="Новый сотрудник" onClose={() => setModal(false)}
          footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>Отмена</button><button className="btn btn-primary">Добавить</button></>}>
          <div className="grid-2">
            <div className="field"><label className="label">Имя</label><input className="input" placeholder="Анна" /></div>
            <div className="field"><label className="label">Фамилия</label><input className="input" placeholder="Иванова" /></div>
          </div>
          <div className="field"><label className="label">Роль / должность</label>
            <select className="input select"><option>Официант</option><option>Бармен</option><option>Хостес</option><option>Повар</option><option>Другое</option></select>
          </div>
          <div className="field"><label className="label">Email</label><input className="input" placeholder="anna@example.com" type="email" /></div>
          <div className="field"><label className="label">Телефон (для вывода средств)</label><input className="input" placeholder="+7 900 000-00-00" /></div>
          <div className="field"><label className="label">Bio (отображается гостям)</label><input className="input" placeholder="На что копит чаевые..." /></div>
        </Modal>
      )}
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function Analytics() {
  const total = EMPLOYEES.reduce((s,e) => s + e.totalTips, 0);
  const weekData = [
    { day: "Пн", tips: 32400, tx: 48 }, { day: "Вт", tips: 41200, tx: 61 },
    { day: "Ср", tips: 28900, tx: 43 }, { day: "Чт", tips: 56100, tx: 83 },
    { day: "Пт", tips: 71400, tx: 106 }, { day: "Сб", tips: 98200, tx: 145 },
    { day: "Вс", tips: 84600, tx: 125 },
  ];
  const maxTips = Math.max(...weekData.map(d => d.tips));

  return (
    <div className="anim-fadeup">
      <div className="grid-2 mb-16">
        <div className="card">
          <div className="card-header"><div className="card-title">Чаевые по дням недели</div></div>
          <div className="card-body">
            <div className="bar-chart" style={{ height: 100 }}>
              {weekData.map((d, i) => (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="bar" style={{ height: `${(d.tips / maxTips) * 100}%`, background: d.day === "Сб" ? "var(--c-accent)" : d.day === "Вс" ? "#0D9488" : "var(--c-accent-light)" }} />
                  <div className="text-xs text-3">{d.day}</div>
                </div>
              ))}
            </div>
            <div className="divider mt-12 mb-12" />
            {weekData.map(d => (
              <div key={d.day} className="flex items-center gap-10" style={{ padding: "6px 0" }}>
                <div className="text-xs text-3" style={{ width: 24 }}>{d.day}</div>
                <div className="progress" style={{ flex: 1 }}>
                  <div className="progress-fill progress-blue" style={{ width: `${(d.tips / maxTips) * 100}%` }} />
                </div>
                <div className="text-sm font-600" style={{ minWidth: 80, textAlign: "right" }}>{fmt(d.tips)}</div>
                <div className="text-xs text-3" style={{ minWidth: 30 }}>{d.tx} шт</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Распределение по сотрудникам</div></div>
          <div className="card-body">
            {EMPLOYEES.map((emp, i) => {
              const pct = Math.round(emp.totalTips / total * 100);
              const colors = ["var(--c-accent)", "var(--c-green)", "var(--c-purple)", "var(--c-amber)"];
              return (
                <div key={emp.id} style={{ marginBottom: 14 }}>
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-8"><div style={{ width: 10, height: 10, borderRadius: 3, background: colors[i], flexShrink: 0 }} /><span className="text-sm">{emp.name}</span></div>
                    <div className="flex items-center gap-8"><span className="text-sm font-600">{fmt(emp.totalTips)}</span><span className="badge badge-gray">{pct}%</span></div>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: `${pct}%`, background: colors[i] }} /></div>
                </div>
              );
            })}
            <div className="divider mt-12 mb-12" />
            <div className="flex justify-between">
              {[["Лидер", "Мария К.", "var(--c-green)"], ["Ср. рейтинг", "4.85 ★", "var(--c-amber)"], ["Всего", fmt(total), "var(--c-accent)"]].map(([l,v,c]) => (
                <div key={l} className="text-center"><div className="text-xs text-3">{l}</div><div className="text-sm font-600 mt-4" style={{ color: c }}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Отзывы гостей</div><span className="badge badge-green">★ 4.85 средний</span></div>
        <div className="card-body">
          {TRANSACTIONS.filter(t => t.comment).map(tx => {
            const emp = EMPLOYEES.find(e => e.id === tx.empId);
            return (
              <div key={tx.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--c-border)" }}>
                <div className="flex items-start gap-10">
                  <Avatar initials={emp.initials} size={36} />
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-8 mb-4">
                      <span className="text-sm font-600">{emp.name}</span>
                      {tx.rating && <Stars rating={tx.rating} />}
                      <span className="text-xs text-3">{fmtDate(tx.date)}</span>
                    </div>
                    <div className="text-sm text-2">{tx.comment}</div>
                  </div>
                  <span className="badge badge-green">+{fmt(tx.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function Settings() {
  const [sw, setSw] = useState({ emailEach: true, dailyReport: true, withdrawReq: false, reviews: true });
  const [splitMode, setSplitMode] = useState("individual");
  return (
    <div className="anim-fadeup">
      <div className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Заведение</div></div>
            <div className="card-body">
              {[["Название", "Resto Milano"], ["Адрес", "Москва, ул. Арбат, 1"], ["Email", "admin@restomilano.ru"], ["Телефон", "+7 499 000-00-00"]].map(([l, v]) => (
                <div key={l} className="field"><label className="label">{l}</label><input className="input" defaultValue={v} /></div>
              ))}
              <button className="btn btn-primary">Сохранить</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Уведомления</div></div>
            <div className="card-body" style={{ padding: "8px 20px" }}>
              {[["emailEach","Email при каждом переводе"],["dailyReport","Ежедневный отчёт"],["withdrawReq","Заявки на вывод"],["reviews","Новые отзывы"]].map(([k,l]) => (
                <div key={k} className="switch-row">
                  <span className="text-sm">{l}</span>
                  <Switch on={sw[k]} onChange={v => setSw(p => ({ ...p, [k]: v }))} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Распределение чаевых</div></div>
            <div className="card-body">
              {[["individual","Индивидуально","Каждый получает свои чаевые"],["team","Командные","Все идут в общий котёл"],["split","Сплит","Часть делится с другими"]].map(([v,l,d]) => (
                <div key={v} style={{ padding: "12px 14px", border: `1.5px solid ${splitMode === v ? "var(--c-accent)" : "var(--c-border)"}`, borderRadius: "var(--r-sm)", marginBottom: 8, cursor: "pointer", background: splitMode === v ? "var(--c-accent-light)" : "white", transition: "all 0.15s" }}
                  onClick={() => setSplitMode(v)}>
                  <div className="flex items-center gap-8">
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${splitMode === v ? "var(--c-accent)" : "var(--c-border)"}`, background: splitMode === v ? "var(--c-accent)" : "white", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {splitMode === v && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                    </div>
                    <div>
                      <div className="text-sm font-600">{l}</div>
                      <div className="text-xs text-3">{d}</div>
                    </div>
                  </div>
                </div>
              ))}
              {splitMode === "split" && (
                <div style={{ padding: "12px 14px", background: "var(--c-bg)", borderRadius: "var(--r-sm)", marginTop: 8 }}>
                  <div className="text-xs font-600 text-2 mb-8">Правила сплита</div>
                  {[["Бармен", "10%"], ["Кухня", "5%"]].map(([r, p]) => (
                    <div key={r} className="flex items-center gap-8 mb-6">
                      <input className="input" defaultValue={r} style={{ flex: 1 }} />
                      <input className="input" defaultValue={p} style={{ width: 64 }} />
                      <button className="btn btn-ghost btn-icon text-red" style={{ flexShrink: 0 }}>×</button>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm text-accent">+ Добавить правило</button>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Дизайн страницы</div></div>
            <div className="card-body">
              <div className="field"><label className="label">Логотип</label><div style={{ padding: "20px", border: "2px dashed var(--c-border)", borderRadius: "var(--r-sm)", textAlign: "center", cursor: "pointer" }}>
                <div className="text-xs text-3">Перетащите файл или кликните</div>
                <div className="text-xs text-3 mt-4">PNG, SVG · до 2 МБ</div>
              </div></div>
              <div className="field"><label className="label">Акцентный цвет</label>
                <div className="flex gap-8">{["#1A56DB","#0D9488","#7C3AED","#D97706","#DC2626"].map(c => <div key={c} style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: c === "#1A56DB" ? "2px solid var(--c-text)" : "2px solid transparent" }} />)}</div>
              </div>
              <button className="btn btn-secondary btn-sm">Предпросмотр страницы</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WITHDRAW ─────────────────────────────────────────────────────────────────
function Withdraw() {
  const [emp, setEmp] = useState(EMPLOYEES[0]);
  return (
    <div className="anim-fadeup">
      <div className="grid-2">
        <div>
          <div className="card mb-16" style={{ background: "linear-gradient(135deg, #1A56DB 0%, #0D9488 100%)", border: "none", color: "white" }}>
            <div className="card-body">
              <div className="text-sm" style={{ opacity: 0.8 }}>Доступно к выводу</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 4 }}>{fmt(emp.totalTips)}</div>
              <div className="text-sm mt-8" style={{ opacity: 0.8 }}>Сотрудник: {emp.name}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Заявка на вывод</div></div>
            <div className="card-body">
              <div className="field"><label className="label">Сотрудник</label>
                <select className="input select" onChange={e => setEmp(EMPLOYEES.find(em => em.id === e.target.value))}>
                  {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} — {fmt(e.totalTips)}</option>)}
                </select>
              </div>
              <div className="field"><label className="label">Сумма</label><input className="input" placeholder={`До ${fmt(emp.totalTips)}`} type="number" /></div>
              <div className="field"><label className="label">Способ</label>
                <select className="input select"><option>СБП по номеру телефона</option><option>Банковская карта</option><option>Перевод на счёт</option></select>
              </div>
              <div className="field"><label className="label">Реквизиты</label><input className="input" placeholder="+7 900 000-00-00 или номер карты" /></div>
              <button className="btn btn-primary btn-full btn-lg">Вывести средства</button>
              <div className="text-xs text-3 text-center mt-8">Зачисление в течение 1 рабочего дня</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">История выводов</div></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Сотрудник</th><th>Сумма</th><th>Способ</th><th>Дата</th><th>Статус</th></tr></thead>
              <tbody>
                {[["e3","48000","СБП","2026-02-20","done"],["e1","32000","Карта","2026-02-15","done"],["e2","21000","СБП","2026-02-10","done"],["e4","15000","СБП","2026-02-05","pending"]].map(([id,amt,method,date,status]) => {
                  const e = EMPLOYEES.find(em => em.id === id);
                  return (
                    <tr key={date}>
                      <td><div className="flex items-center gap-8"><Avatar initials={e.initials} size={32} /><span className="font-500 text-sm">{e.name}</span></div></td>
                      <td><span className="font-600 text-green">−{parseInt(amt).toLocaleString("ru-RU")} ₽</span></td>
                      <td className="text-sm text-2">{method}</td>
                      <td className="text-xs text-3">{new Date(date).toLocaleDateString("ru-RU")}</td>
                      <td><span className={`badge ${status === "done" ? "badge-green" : "badge-amber"}`}>{status === "done" ? "✓ Выплачено" : "⏳ В обработке"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("overview");
  const [tipEmployee, setTipEmployee] = useState(EMPLOYEES[0]);

  const navItems = [
    { id: "overview", icon: "◈", label: "Обзор" },
    { id: "employees", icon: "◉", label: "Сотрудники" },
    { id: "analytics", icon: "↗", label: "Аналитика" },
    { id: "withdraw", icon: "₽", label: "Выплаты" },
    { id: "settings", icon: "⊕", label: "Настройки" },
  ];

  const heading = { overview: "Обзор", employees: "Сотрудники", analytics: "Аналитика", withdraw: "Выплаты", settings: "Настройки", tip: "Страница чаевых" };

  if (view === "tip") return (
    <>
      <style>{CSS}</style>
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 999 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setView("employees")} style={{ boxShadow: "var(--shadow-md)" }}>← Назад</button>
      </div>
      <TipPage employee={tipEmployee} billAmount={3200} onBack={() => setView("employees")} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">₽</div>
              <div><div className="logo-name">ЧайВой</div><div className="logo-sub">Электронные чаевые</div></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Кабинет</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
                <span className="nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
            <div className="nav-section-label" style={{ marginTop: 8 }}>Демо</div>
            <button className="nav-item" onClick={() => { setTipEmployee(EMPLOYEES[0]); setView("tip"); }}>
              <span className="nav-icon">↗</span>Страница гостя
            </button>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <Avatar initials="RM" size={32} color="#1A56DB" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="text-sm font-600 truncate">Resto Milano</div>
                <div className="text-xs text-3">admin@restomilano.ru</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="page-heading">{heading[view]}</div>
            <div className="topbar-actions">
              <button className="btn btn-secondary btn-sm">🔔</button>
              <button className="btn btn-secondary btn-sm">? Помощь</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setTipEmployee(EMPLOYEES[0]); setView("tip"); }}>
                Демо страницы гостя ↗
              </button>
            </div>
          </header>
          <main className="content">
            {view === "overview" && <Overview setView={setView} setTipEmployee={setTipEmployee} />}
            {view === "employees" && <Employees setTipEmployee={setTipEmployee} setView={setView} />}
            {view === "analytics" && <Analytics />}
            {view === "withdraw" && <Withdraw />}
            {view === "settings" && <Settings />}
          </main>
        </div>
      </div>
    </>
  );
}