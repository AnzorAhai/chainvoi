"use client";
/**
 * /tip/[token]
 *
 * Public guest tip page — two entry modes:
 *
 *  A) From POS QR (dynamic):
 *     Token is a one-time key created by POST /api/pos/order.
 *     The page fetches bill amount + employee from the token.
 *
 *  B) Static QR (no POS):
 *     Token is the employee's permanent qrToken.
 *     URL may carry ?bill=45.00 from a manual pre-fill (optional).
 *
 * Either way, TipPage receives { employee, billAmount } as props.
 */

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

// ── Mock employee lookup (replace with API call in Phase 3) ───────────────────
const EMPLOYEES_BY_TOKEN = {
  tok_mg_001: { id: "e1", name: "María González",  role: "Mesonera",  initials: "MG", rating: 4.9, txCount: 312, totalTips: 340.50, bio: "Hago de tu visita una experiencia inolvidable 🌟", avgTip: 3.20, payMethods: { pagomovil: "0412-0001234", zelle: "maria@restomilano.com", zinli: null, binance: null } },
  tok_cp_002: { id: "e2", name: "Carlos Pérez",    role: "Bartender", initials: "CP", rating: 4.7, txCount: 198, totalTips: 182.00, bio: "Te ayudo a elegir el cóctel perfecto", avgTip: 2.80, payMethods: { pagomovil: "0424-0005678", zelle: null, zinli: "carlosperez", binance: null } },
  tok_ar_003: { id: "e3", name: "Ana Rodríguez",   role: "Mesonera",  initials: "AR", rating: 5.0, txCount: 401, totalTips: 480.75, bio: "Cada detalle importa para que disfrutes al máximo ✨", avgTip: 4.10, payMethods: { pagomovil: "0416-0009999", zelle: "ana@restomilano.com", zinli: null, binance: "123456789" } },
  tok_dh_004: { id: "e4", name: "Diego Hernández", role: "Anfitrión", initials: "DH", rating: 4.8, txCount: 144, totalTips: 95.20,  bio: "", avgTip: 2.50, payMethods: { pagomovil: "0412-0007777", zelle: null, zinli: "diegoh", binance: null } },
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#1C1917,#292524)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 48, height: 48, border: "3px solid rgba(217,119,6,0.3)", borderTopColor: "#D97706", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#1C1917,#292524)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "white", borderRadius: 24, padding: 32, maxWidth: 360, textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Enlace inválido</div>
        <div style={{ color: "#78716C", fontSize: 14 }}>{message}</div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TipTokenPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();

  const [state, setState] = useState("loading"); // loading | ready | error
  const [employee, setEmployee] = useState(null);
  const [billAmount, setBillAmount] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function resolve() {
      // 1. Try to resolve as a POS dynamic token via the API
      try {
        const res = await fetch(`/api/pos/order?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          // Find employee by id from the order
          const emp = Object.values(EMPLOYEES_BY_TOKEN).find(e => e.id === data.employeeId)
            ?? Object.values(EMPLOYEES_BY_TOKEN)[0]; // fallback: first employee
          setEmployee(emp);
          setBillAmount(data.billAmount);
          setState("ready");
          return;
        }
      } catch {
        // Network error — fall through to static lookup
      }

      // 2. Try to resolve as a static employee qrToken
      const emp = EMPLOYEES_BY_TOKEN[token];
      if (emp) {
        const bill = searchParams.get("bill");
        setEmployee(emp);
        setBillAmount(bill ? parseFloat(bill) : null);
        setState("ready");
        return;
      }

      // 3. Not found
      setErrorMsg("Este enlace no es válido o ha expirado.");
      setState("error");
    }

    resolve();
  }, [token, searchParams]);

  if (state === "loading") return <Skeleton />;
  if (state === "error")   return <ErrorState message={errorMsg} />;

  // Dynamically import TipPage from the main app bundle to avoid duplication.
  // For now we render an inline redirect to the demo with pre-filled params.
  // In Phase 3 this will import the standalone TipPage component.
  return <StandaloneTipPage employee={employee} billAmount={billAmount ?? 40} />;
}

// ── Minimal standalone TipPage (mirrors the one in page.jsx) ─────────────────
// This is a self-contained copy so the route works without importing from page.jsx.
// In Phase 3 it will be extracted to components/TipPage.jsx and shared.

const fmt  = (n) => n == null ? "$0.00" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtBs = (n) => n == null ? "Bs.0,00" : "Bs." + (n * 36.5).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PCTS  = [5, 10, 15, 20];
const FIXED_USD = [1, 2, 5, 10, 20];

const PAY_METHODS = [
  { id: "pagomovil", label: "Pago Móvil",   emoji: "📱", fieldLabel: "Teléfono" },
  { id: "zelle",     label: "Zelle",         emoji: "💵", fieldLabel: "Correo" },
  { id: "zinli",     label: "Zinli",         emoji: "🟣", fieldLabel: "Usuario" },
  { id: "binance",   label: "Binance Pay",   emoji: "🟡", fieldLabel: "Binance ID" },
];

const REVIEW_PLATFORMS = [
  { id: "google",      label: "Google Maps",  emoji: "🗺", color: "#4285F4" },
  { id: "tripadvisor", label: "TripAdvisor",  emoji: "🦉", color: "#00AA6C" },
];

function StandaloneTipPage({ employee, billAmount }) {
  const [step, setStep]           = useState("tips");
  const [mode, setMode]           = useState("pct");
  const [pct, setPct]             = useState(10);
  const [fixed, setFixed]         = useState(5);
  const [customFixed, setCustomFixed] = useState("");
  const [currency, setCurrency]   = useState("USD");
  const [payMethod, setPayMethod] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [rating, setRating]       = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment]     = useState("");
  const [platform, setPlatform]   = useState(null);

  const calcUSD = mode === "pct"
    ? Math.round(billAmount * pct / 100 * 100) / 100
    : (customFixed ? parseFloat(customFixed) || 0 : fixed);

  const fmtD     = (n) => currency === "USD" ? fmt(n) : fmtBs(n);
  const fmtCalc  = fmtD(calcUSD);
  const fmtBill  = fmtD(billAmount);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    .tip-shell { min-height: 100vh; background: linear-gradient(160deg, #1C1917 0%, #292524 50%, #1C1917 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
    .tip-card  { background: white; border-radius: 24px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); width: 100%; max-width: 400px; overflow: hidden; }
    .tip-hdr   { padding: 28px 28px 22px; background: linear-gradient(135deg, #92400E 0%, #D97706 100%); color: white; text-align: center; }
    .tip-body  { padding: 24px 28px; }
    .tip-ftr   { padding: 14px 28px; background: #FAFAF9; border-top: 1px solid #E8E4DF; text-align: center; font-size: 12px; color: #A8A29E; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; font-family: inherit; font-weight: 600; transition: all 0.18s; white-space: nowrap; }
    .btn-primary  { background: #D97706; color: white; padding: 13px 24px; border-radius: 8px; font-size: 15px; box-shadow: 0 4px 14px rgba(217,119,6,0.35); width: 100%; }
    .btn-primary:hover  { background: #B45309; transform: translateY(-1px); }
    .btn-ghost   { background: none; color: #78716C; padding: 12px; border-radius: 8px; font-size: 13px; width: 100%; }
    .btn-ghost:hover { background: #F5F5F4; }
    .tab-row   { display: flex; background: #F5F5F4; border-radius: 8px; padding: 3px; gap: 3px; margin-bottom: 16px; }
    .tab-btn   { flex: 1; padding: 7px; border: none; background: none; border-radius: 6px; font-size: 12px; font-weight: 600; color: #A8A29E; cursor: pointer; font-family: inherit; transition: all 0.15s; }
    .tab-btn.active { background: white; color: #D97706; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .pct-grid  { display: flex; gap: 6px; margin-bottom: 12px; }
    .pct-btn   { flex: 1; padding: 10px 4px; border: 1.5px solid #E8E4DF; background: white; border-radius: 8px; font-size: 13px; font-weight: 700; color: #78716C; cursor: pointer; transition: all 0.15s; font-family: inherit; text-align: center; }
    .pct-btn.active { border-color: #D97706; background: #D97706; color: white; box-shadow: 0 4px 14px rgba(217,119,6,0.35); }
    .amt-grid  { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 12px; }
    .amt-btn   { padding: 12px 8px; border: 1.5px solid #E8E4DF; background: white; border-radius: 8px; font-size: 14px; font-weight: 700; color: #1C1917; cursor: pointer; transition: all 0.15s; font-family: inherit; text-align: center; }
    .amt-btn.active { border-color: #D97706; background: #D97706; color: white; box-shadow: 0 4px 14px rgba(217,119,6,0.35); }
    .input { width: 100%; padding: 9px 12px; border: 1.5px solid #E8E4DF; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.15s; }
    .input:focus { border-color: #D97706; box-shadow: 0 0 0 3px rgba(217,119,6,0.12); }
    .pm-btn  { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1.5px solid #E8E4DF; background: white; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; color: #1C1917; transition: border-color 0.15s; width: 100%; margin-bottom: 8px; }
    .pm-btn:hover  { border-color: #D97706; }
    .pm-btn.active { border-color: #D97706; background: #FEF3C7; }
    .star-btn { background: none; border: none; cursor: pointer; font-size: 32px; transition: transform 0.1s; padding: 4px; }
    .star-btn:hover { transform: scale(1.15); }
    .plat-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1.5px solid #E8E4DF; background: white; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; color: #1C1917; transition: border-color 0.15s; width: 100%; margin-bottom: 8px; }
    .plat-btn.active { border-color: #D97706; background: #FEF3C7; }
    .curr-pill { display: flex; background: rgba(255,255,255,0.15); border-radius: 20px; padding: 3px; gap: 3px; }
    .curr-btn  { padding: 4px 12px; border-radius: 16px; border: none; cursor: pointer; font-size: 11px; font-weight: 700; font-family: inherit; transition: all 0.15s; }
  `;

  const Avatar = () => (
    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, color: "white", margin: "0 auto 12px", border: "3px solid rgba(255,255,255,0.35)" }}>
      {employee.initials}
    </div>
  );

  const TotalBox = () => calcUSD > 0 ? (
    <div style={{ marginTop: 16, padding: "14px 16px", background: "#FEF3C7", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#D97706" }}>Total propina</span>
      <span style={{ fontSize: 22, fontWeight: 800, color: "#D97706" }}>{fmtCalc}</span>
    </div>
  ) : null;

  /* ── STEP: tips ── */
  if (step === "tips") return (
    <div className="tip-shell">
      <style>{styles}</style>
      <div className="tip-card">
        <div className="tip-hdr">
          <div className="curr-pill" style={{ justifyContent: "center", marginBottom: 14 }}>
            {["USD","BS"].map(c => (
              <button key={c} className="curr-btn" onClick={() => setCurrency(c)}
                style={{ background: currency === c ? "white" : "transparent", color: currency === c ? "#D97706" : "rgba(255,255,255,0.75)" }}>
                {c === "USD" ? "USD" : "Bs.D"}
              </button>
            ))}
          </div>
          <Avatar />
          <div style={{ fontWeight: 800, fontSize: 20 }}>{employee.name}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{employee.role}</div>
          {employee.bio && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8, lineHeight: 1.4 }}>{employee.bio}</div>}
          {billAmount && (
            <div style={{ marginTop: 12, fontSize: 12, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", display: "inline-block" }}>
              Total cuenta: <strong>{fmtBill}</strong>
            </div>
          )}
        </div>
        <div className="tip-body">
          <div className="tab-row">
            <button className={`tab-btn${mode==="pct"?" active":""}`} onClick={()=>setMode("pct")}>% de la cuenta</button>
            <button className={`tab-btn${mode==="fixed"?" active":""}`} onClick={()=>setMode("fixed")}>Monto fijo</button>
          </div>
          {mode === "pct" ? (
            <div className="pct-grid">
              {PCTS.map(p => (
                <button key={p} className={`pct-btn${pct===p?" active":""}`} onClick={()=>setPct(p)}>
                  {p}%
                  {billAmount && <div style={{ fontSize: 10, opacity: 0.75, marginTop: 2 }}>{fmtD(Math.round(billAmount*p/100*100)/100)}</div>}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="amt-grid">
                {FIXED_USD.map(f => (
                  <button key={f} className={`amt-btn${!customFixed&&fixed===f?" active":""}`} onClick={()=>{setFixed(f);setCustomFixed("");}}>
                    {fmt(f)}
                  </button>
                ))}
                <button className={`amt-btn${customFixed?" active":""}`} onClick={()=>setCustomFixed("1")} style={{ gridColumn: "3", fontSize: 12 }}>
                  Otro
                </button>
              </div>
              {customFixed !== "" && (
                <input className="input" style={{ marginBottom: 12 }} type="number" placeholder="Otro monto, $" value={customFixed} onChange={e=>setCustomFixed(e.target.value)} />
              )}
            </>
          )}
          <TotalBox />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setStep("payment")} disabled={calcUSD <= 0}>Continuar →</button>
            <button className="btn btn-ghost">Sin propina</button>
          </div>
        </div>
        <div className="tip-ftr">🔒 Pago seguro · Pago Móvil, Zelle, Binance</div>
      </div>
    </div>
  );

  /* ── STEP: payment ── */
  if (step === "payment") return (
    <div className="tip-shell">
      <style>{styles}</style>
      <div className="tip-card">
        <div className="tip-hdr">
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>← <span style={{ cursor:"pointer" }} onClick={()=>setStep("tips")}>Volver</span></div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>¿Cómo vas a pagar?</div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800 }}>{fmtCalc}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{employee.name} · {employee.role}</div>
        </div>
        <div className="tip-body">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Instrucciones de pago</div>
          {PAY_METHODS.filter(m => employee.payMethods?.[m.id]).map(m => (
            <button key={m.id} className={`pm-btn${payMethod===m.id?" active":""}`} onClick={()=>setPayMethod(m.id)}>
              <span style={{ fontSize: 20 }}>{m.emoji}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div>{m.label}</div>
                <div style={{ fontSize: 12, fontWeight: 400, color: "#78716C" }}>{m.fieldLabel}: <strong>{employee.payMethods[m.id]}</strong></div>
              </div>
              {payMethod === m.id && <span style={{ color: "#D97706" }}>✓</span>}
            </button>
          ))}
          <div style={{ marginTop: 8, padding: "10px 12px", background: "#FEF3C7", borderRadius: 8, fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
            💡 Pago directo al empleado (P2P) — Propinero no retiene fondos.
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={()=>{setLoading(true);setTimeout(()=>{setLoading(false);setStep("review");},1600)}} disabled={!payMethod||loading}>
            {loading ? "Procesando…" : "Ya pagué ✓"}
          </button>
        </div>
        <div className="tip-ftr">🔒 Pago seguro · Pago Móvil, Zelle, Binance</div>
      </div>
    </div>
  );

  /* ── STEP: review ── */
  if (step === "review") return (
    <div className="tip-shell">
      <style>{styles}</style>
      <div className="tip-card">
        <div className="tip-hdr">
          <div style={{ fontWeight: 800, fontSize: 18 }}>¡{fmtCalc} enviado!</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{employee.name} recibirá tu propina</div>
        </div>
        <div className="tip-body">
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1917", marginBottom: 12 }}>¿Cómo fue el servicio?</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} className="star-btn" onMouseEnter={()=>setHoverRating(i)} onMouseLeave={()=>setHoverRating(0)} onClick={()=>setRating(i)}>
                  <span style={{ color: i <= (hoverRating||rating) ? "#F59E0B" : "#E8E4DF" }}>★</span>
                </button>
              ))}
            </div>
          </div>
          <textarea className="input" style={{ resize: "vertical", minHeight: 80, marginBottom: 12 }} placeholder="Comentario (opcional)..." value={comment} onChange={e=>setComment(e.target.value)} />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Deja una reseña y ayuda al restaurante:</div>
          {REVIEW_PLATFORMS.map(p => (
            <button key={p.id} className={`plat-btn${platform===p.id?" active":""}`} onClick={()=>setPlatform(platform===p.id?null:p.id)}>
              <span style={{ fontSize: 18 }}>{p.emoji}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{p.label}</span>
              {platform===p.id && <span style={{ color: "#D97706" }}>Seleccionado ✓</span>}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={()=>setStep("success")}>Enviar</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={()=>setStep("success")}>Omitir</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── STEP: success ── */
  return (
    <div className="tip-shell">
      <style>{styles}</style>
      <div className="tip-card">
        <div className="tip-body" style={{ textAlign: "center", padding: "48px 28px" }}>
          <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#92400E,#D97706)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(217,119,6,0.35)" }}>✓</div>
          <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>¡Gracias!</div>
          <div style={{ color: "#78716C", fontSize: 14, lineHeight: 1.6 }}>
            Tu propina y reseña fueron enviadas.<br />Hiciste la noche mejor ✨
          </div>
          {platform && (
            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "10px 20px", background: "#FEF3C7", borderRadius: 10, color: "#92400E", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
              {REVIEW_PLATFORMS.find(p=>p.id===platform)?.emoji} Ir a {REVIEW_PLATFORMS.find(p=>p.id===platform)?.label} →
            </a>
          )}
        </div>
        <div className="tip-ftr">Propinero · Propinas digitales en Venezuela 🇻🇪</div>
      </div>
    </div>
  );
}