"use client";
import { useState, useContext, createContext, useRef, useEffect } from "react";

// ─── I18N ──────────────────────────────────────────────────────────────────────
const LangCtx = createContext("es");

const TRANSLATIONS = {
  es: {
    // Nav
    panel: "Panel", resumen: "Resumen", personal: "Personal",
    analitica: "Analítica", retiros: "Retiros", configuracion: "Configuración",
    demo: "Demo", paginaInvitado: "Página de invitado", volver: "← Volver",
    ayuda: "Ayuda", demoBtn: "Demo página de invitado ↗",
    // Overview
    totalPropinas: "Total propinas", desdeSiempre: "Desde siempre",
    transacciones: "Transacciones", todasOps: "Todas las operaciones",
    propinaProm: "Propina promedio", porTransaccion: "Por transacción",
    calificacion: "Calificación", empleados: "empleados",
    propinaseSemana: "Propinas esta semana", esteMes: "Este mes",
    promDia: "Prom. día", mejor: "Mejor", sabado: "Sábado", ahora: "Ahora", activo: "↑ Activo",
    topPersonal: "Top personal", verTodos: "Ver todos →",
    ultimasTx: "Últimas transacciones",
    colEmpleado: "Empleado", colMonto: "Monto", colPct: "% cuenta",
    colResena: "Reseña", colFecha: "Fecha", colEstado: "Estado",
    acreditado: "✓ Acreditado",
    // Employees
    gestionPersonal: "Gestión de personal", exportarQR: "⬇ Exportar QR",
    agregarEmpleado: "+ Agregar empleado", colRol: "Rol",
    colCalif: "Calificación", colTx: "Transacciones",
    colTotal: "Total propinas", colProm: "Prom. propina", colAcciones: "Acciones",
    sinDesc: "Sin descripción", pagina: "Página ↗",
    tituloQR: "Código QR", cerrar: "Cerrar", descargarPNG: "⬇ Descargar PNG",
    colocarMesa: "Colócalo en la mesa, en la pre-cuenta o en una tarjeta",
    copiarEnlace: "🔗 Copiar enlace", plantilla: "📄 Plantilla para impresión",
    nuevoEmpleado: "Nuevo empleado", cancelar: "Cancelar", agregar: "Agregar",
    nombre: "Nombre", apellido: "Apellido", rolCargo: "Rol / cargo",
    rolOpciones: ["Mesonero/a", "Bartender", "Anfitrión/a", "Chef", "Otro"],
    telefonoRetiro: "Teléfono (para retiros)", bioLabel: "Bio (visible para los clientes)",
    bioPlaceholder: "Cuéntale algo a tus clientes...",
    editar: "Editar",
    // Analytics
    propinasDia: "Propinas por día de la semana",
    distribucion: "Distribución por empleado",
    lider: "Líder", promCalif: "Prom. calificación", total: "Total",
    resenasClientes: "Reseñas de clientes", promedio: "promedio", ops: "ops",
    days: ["Lu","Ma","Mi","Ju","Vi","Sa","Do"],
    // Settings
    establecimiento: "Establecimiento", direccion: "Dirección", telefono: "Teléfono",
    guardar: "Guardar", notificaciones: "Notificaciones",
    emailCadaTx: "Email en cada transferencia", reporteDiario: "Reporte diario",
    solicitudesRetiro: "Solicitudes de retiro", nuevasResenas: "Nuevas reseñas",
    distPropinas: "Distribución de propinas",
    individual: "Individual", equipo: "Equipo", division: "División",
    descIndividual: "Cada empleado recibe sus propias propinas",
    descEquipo: "Todas van a un fondo común",
    descDivision: "Parte se comparte con otros",
    reglasDivision: "Reglas de división", agregarRegla: "+ Agregar regla",
    disenoPagina: "Diseño de página", logotipo: "Logotipo",
    arrastraArchivo: "Arrastra el archivo o haz clic",
    limitePNG: "PNG, SVG · hasta 2 MB", colorAcento: "Color de acento",
    vistaPreviaBtn: "Vista previa de página",
    // Withdraw
    disponible: "Disponible para retirar", solRetiro: "Solicitud de retiro",
    hasta: "Hasta", metodo: "Método",
    metodos: ["Pago Móvil","Zelle","Zinli","Binance Pay","Transferencia bancaria"],
    datos: "Datos", datosPlaceholder: "+58 412 000-00-00 o usuario de Zelle",
    retirarFondos: "Retirar fondos", acreditacion: "Acreditación en 1 día hábil",
    historialRetiros: "Historial de retiros",
    colMetodo: "Método", pagado: "✓ Pagado", enProceso: "⏳ En proceso",
    // TipPage
    resenas: "reseñas", totalCuenta: "Total de la cuenta",
    pctCuenta: "% de la cuenta", montoFijo: "Monto fijo",
    totalPropina: "Total propina", procesando: "Procesando...",
    pagar: "Pagar", sinPropina: "Sin propina",
    pagoSeguro: "🔒 Pago seguro · Pago Móvil, Zelle, Binance",
    enviado: "enviado!", recibiraPropina: "recibirá tu propina",
    comoServicio: "¿Cómo fue el servicio?",
    comentarioPlaceholder: "Comentario (opcional)...",
    dejaResena: "Deja una reseña y ayuda al restaurante:",
    seleccionado: "Seleccionado ✓",
    enviarResena: "Enviar reseña", enviar: "Enviar", omitir: "Omitir",
    gracias: "¡Gracias!",
    propinasEnviadas: "Tu propina y reseña fueron enviadas.",
    nochesMejor: "Hiciste la noche mejor ✨",
    // Phase 2 – currency
    enUSD: "USD", enBs: "Bs.D", tasaAprox: "Tasa BCV aprox.",
    // Phase 2 – payment step
    elegirMetodo: "¿Cómo vas a pagar?",
    instruccionesPago: "Instrucciones de pago",
    pagoP2P: "Pago directo al empleado (P2P)",
    realizaTransf: "Realiza la transferencia por el monto exacto y luego confirma.",
    yaPague: "Ya pagué ✓",
    metodoPagoMobil: "Teléfono", metodoPagoZelle: "Correo", metodoPagoZinli: "Usuario", metodoPagoBinance: "ID Binance",
    // POS Integration
    posIntegracion: "Integración con POS",
    posDescripcion: "Conecta Propinero con tu sistema de punto de venta para imprimir el QR directamente en el cheque.",
    apiKey: "API Key", webhookUrl: "Webhook URL",
    copiarApiKey: "Copiar", regenerar: "Regenerar",
    probarConexion: "Probar conexión", conexionOk: "✓ Conexión exitosa",
    agenteTitulo: "ESC/POS Print Agent",
    agenteDesc: "Instala el agente en la PC de caja. Intercepta los trabajos de impresión y añade el QR al final de cada cheque automáticamente.",
    descargarAgente: "⬇ Descargar agente (.exe)",
    posCompatibles: "Sistemas compatibles",
    posManual: "Sin POS (estático)", posManualDesc: "QR estático · el cliente ingresa el monto",
    posWebhook: "Webhook genérico", posWebhookDesc: "Cualquier POS con soporte de webhooks",
    posEscPos: "ESC/POS Agente local", posEscPosDesc: "~90% de impresoras térmicas en Venezuela",
    posProfitPlus: "Profit Plus", posProfitPlusDesc: "Sistema más usado en Venezuela",
    posRestArt: "Rest-Art", posRestArtDesc: "Gestión para restaurantes",
    posIiko: "iiko", posIikoDesc: "Cadenas y restaurantes premium",
    estadoConectado: "Conectado", estadoNoConectado: "No conectado",
    instrucciones: "Cómo conectar", paso: "Paso",
  },
  en: {
    // Nav
    panel: "Panel", resumen: "Overview", personal: "Staff",
    analitica: "Analytics", retiros: "Withdrawals", configuracion: "Settings",
    demo: "Demo", paginaInvitado: "Guest page", volver: "← Back",
    ayuda: "Help", demoBtn: "Guest page demo ↗",
    // Overview
    totalPropinas: "Total tips", desdeSiempre: "All time",
    transacciones: "Transactions", todasOps: "All operations",
    propinaProm: "Average tip", porTransaccion: "Per transaction",
    calificacion: "Rating", empleados: "employees",
    propinaseSemana: "Tips this week", esteMes: "This month",
    promDia: "Avg. day", mejor: "Best", sabado: "Saturday", ahora: "Now", activo: "↑ Active",
    topPersonal: "Top staff", verTodos: "See all →",
    ultimasTx: "Latest transactions",
    colEmpleado: "Employee", colMonto: "Amount", colPct: "% bill",
    colResena: "Review", colFecha: "Date", colEstado: "Status",
    acreditado: "✓ Credited",
    // Employees
    gestionPersonal: "Team management", exportarQR: "⬇ Export QR",
    agregarEmpleado: "+ Add employee", colRol: "Role",
    colCalif: "Rating", colTx: "Transactions",
    colTotal: "Total tips", colProm: "Avg. tip", colAcciones: "Actions",
    sinDesc: "No description", pagina: "Page ↗",
    tituloQR: "QR Code", cerrar: "Close", descargarPNG: "⬇ Download PNG",
    colocarMesa: "Place on the table, in the pre-check or on a business card",
    copiarEnlace: "🔗 Copy link", plantilla: "📄 Print template",
    nuevoEmpleado: "New employee", cancelar: "Cancel", agregar: "Add",
    nombre: "First name", apellido: "Last name", rolCargo: "Role / position",
    rolOpciones: ["Waiter/ess", "Bartender", "Host/ess", "Chef", "Other"],
    telefonoRetiro: "Phone (for withdrawals)", bioLabel: "Bio (visible to guests)",
    bioPlaceholder: "Tell guests something about you...",
    editar: "Edit",
    // Analytics
    propinasDia: "Tips by day of the week",
    distribucion: "Distribution by employee",
    lider: "Leader", promCalif: "Avg. rating", total: "Total",
    resenasClientes: "Customer reviews", promedio: "average", ops: "ops",
    days: ["Mo","Tu","We","Th","Fr","Sa","Su"],
    // Settings
    establecimiento: "Establishment", direccion: "Address", telefono: "Phone",
    guardar: "Save", notificaciones: "Notifications",
    emailCadaTx: "Email on each transfer", reporteDiario: "Daily report",
    solicitudesRetiro: "Withdrawal requests", nuevasResenas: "New reviews",
    distPropinas: "Tip distribution",
    individual: "Individual", equipo: "Team", division: "Split",
    descIndividual: "Each employee receives their own tips",
    descEquipo: "All go to a common pool",
    descDivision: "Part is shared with others",
    reglasDivision: "Split rules", agregarRegla: "+ Add rule",
    disenoPagina: "Page design", logotipo: "Logo",
    arrastraArchivo: "Drag file or click",
    limitePNG: "PNG, SVG · up to 2 MB", colorAcento: "Accent color",
    vistaPreviaBtn: "Page preview",
    // Withdraw
    disponible: "Available to withdraw", solRetiro: "Withdrawal request",
    hasta: "Up to", metodo: "Method",
    metodos: ["Pago Móvil","Zelle","Zinli","Binance Pay","Bank transfer"],
    datos: "Details", datosPlaceholder: "+58 412 000-00-00 or Zelle user",
    retirarFondos: "Withdraw funds", acreditacion: "Credited within 1 business day",
    historialRetiros: "Withdrawal history",
    colMetodo: "Method", pagado: "✓ Paid", enProceso: "⏳ Processing",
    // TipPage
    resenas: "reviews", totalCuenta: "Total bill",
    pctCuenta: "% of bill", montoFijo: "Fixed amount",
    totalPropina: "Total tip", procesando: "Processing...",
    pagar: "Pay", sinPropina: "No tip",
    pagoSeguro: "🔒 Secure payment · Pago Móvil, Zelle, Binance",
    enviado: "sent!", recibiraPropina: "will receive your tip",
    comoServicio: "How was the service?",
    comentarioPlaceholder: "Comment (optional)...",
    dejaResena: "Leave a review and help the restaurant:",
    seleccionado: "Selected ✓",
    enviarResena: "Send review", enviar: "Send", omitir: "Skip",
    gracias: "Thank you!",
    propinasEnviadas: "Your tip and review were sent.",
    nochesMejor: "You made the evening better ✨",
    // Phase 2 – currency
    enUSD: "USD", enBs: "Bs.D", tasaAprox: "Approx. BCV rate",
    // Phase 2 – payment step
    elegirMetodo: "How do you want to pay?",
    instruccionesPago: "Payment instructions",
    pagoP2P: "Direct payment to the employee (P2P)",
    realizaTransf: "Send the exact amount and then confirm.",
    yaPague: "I've paid ✓",
    metodoPagoMobil: "Phone", metodoPagoZelle: "Email", metodoPagoZinli: "Username", metodoPagoBinance: "Binance ID",
    // POS Integration
    posIntegracion: "POS Integration",
    posDescripcion: "Connect Propinero to your point-of-sale system to print the QR code directly on the receipt.",
    apiKey: "API Key", webhookUrl: "Webhook URL",
    copiarApiKey: "Copy", regenerar: "Regenerate",
    probarConexion: "Test connection", conexionOk: "✓ Connection successful",
    agenteTitulo: "ESC/POS Print Agent",
    agenteDesc: "Install the agent on the cashier PC. It intercepts print jobs and automatically appends the QR to every receipt.",
    descargarAgente: "⬇ Download agent (.exe)",
    posCompatibles: "Compatible systems",
    posManual: "No POS (static)", posManualDesc: "Static QR · guest enters the amount",
    posWebhook: "Generic webhook", posWebhookDesc: "Any POS with webhook support",
    posEscPos: "ESC/POS Local Agent", posEscPosDesc: "~90% of thermal printers in Venezuela",
    posProfitPlus: "Profit Plus", posProfitPlusDesc: "Most-used management system in Venezuela",
    posRestArt: "Rest-Art", posRestArtDesc: "Restaurant management",
    posIiko: "iiko", posIikoDesc: "Chains and premium restaurants",
    estadoConectado: "Connected", estadoNoConectado: "Not connected",
    instrucciones: "How to connect", paso: "Step",
  },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id: "e1", name: "María González", role: "Mesonera", initials: "MG", rating: 4.9, txCount: 312, totalTips: 340.50, bio: "Hago de tu visita una experiencia inolvidable 🌟", avgTip: 3.20 },
  { id: "e2", name: "Carlos Pérez", role: "Bartender", initials: "CP", rating: 4.7, txCount: 198, totalTips: 182.00, bio: "Te ayudo a elegir el cóctel perfecto", avgTip: 2.80 },
  { id: "e3", name: "Anna Rodríguez", role: "Mesonera", initials: "AR", rating: 5.0, txCount: 401, totalTips: 480.75, bio: "Cada detalle importa para que disfrutes al máximo ✨", avgTip: 4.10 },
  { id: "e4", name: "Diego Hernández", role: "Anfitrión", initials: "DH", rating: 4.8, txCount: 144, totalTips: 95.20, bio: "", avgTip: 2.50 },
];

const TRANSACTIONS = [
  { id: "t1", empId: "e3", amount: 8.00, billAmount: 55.00, pct: 15, comment: "¡Todo perfecto, muchas gracias!", date: "2026-02-26T20:14", rating: 5 },
  { id: "t2", empId: "e1", amount: 5.00, billAmount: 42.00, pct: 12, comment: "Excelente servicio", date: "2026-02-26T19:40", rating: 5 },
  { id: "t3", empId: "e2", amount: 3.00, billAmount: 28.00, pct: null, comment: "", date: "2026-02-26T18:55", rating: 4 },
  { id: "t4", empId: "e1", amount: 2.50, billAmount: 25.00, pct: 10, comment: "", date: "2026-02-26T17:20", rating: 4 },
  { id: "t5", empId: "e3", amount: 7.00, billAmount: 48.00, pct: 15, comment: "¡Ana es la mejor mesonera!", date: "2026-02-25T21:05", rating: 5 },
  { id: "t6", empId: "e4", amount: 4.00, billAmount: null, pct: null, comment: "Ambiente muy agradable", date: "2026-02-25T20:30", rating: 5 },
];

const fmt = (n) => n == null ? "$0.00" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => d ? new Date(d).toLocaleString("es-VE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

// ─── PHASE 2 CONSTANTS ────────────────────────────────────────────────────────
const BS_RATE = 36.50; // USD → Bs.D (tasa BCV aprox.)
const fmtBs = (n) => n == null ? "Bs.0,00" : "Bs." + (n * BS_RATE).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PAYMENT_METHODS = [
  { id: "pagomovil", label: "Pago Móvil", emoji: "📱", color: "#059669", fieldKey: "metodoPagoMobil", value: "0412-000-0000 · Banco de Venezuela" },
  { id: "zelle",     label: "Zelle",       emoji: "💜", color: "#6D28D9", fieldKey: "metodoPagoZelle",   value: "pagos@restomilano.com" },
  { id: "zinli",     label: "Zinli",       emoji: "💳", color: "#0891B2", fieldKey: "metodoPagoZinli",   value: "@restomilano" },
  { id: "binance",   label: "Binance Pay", emoji: "🟡", color: "#D97706", fieldKey: "metodoPagoBinance", value: "ID: 312 456 789" },
];

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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --c-bg: #FAFAF9;
  --c-white: #FFFFFF;
  --c-surface: #FFFFFF;
  --c-border: #E8E4DF;
  --c-border-strong: #C9C3BA;
  --c-text: #1C1917;
  --c-text-2: #57534E;
  --c-text-3: #A8A29E;
  --c-accent: #D97706;
  --c-accent-light: #FEF3C7;
  --c-accent-hover: #B45309;
  --c-green: #059669;
  --c-green-bg: #ECFDF5;
  --c-amber: #D97706;
  --c-amber-bg: #FEF3C7;
  --c-red: #DC2626;
  --c-red-bg: #FEF2F2;
  --c-purple: #7C3AED;
  --c-purple-bg: #F5F3FF;
  --c-sidebar: #18181B;
  --c-sidebar-border: #27272A;
  --c-sidebar-text: #A1A1AA;
  --c-sidebar-active: #D97706;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 20px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.05);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.06);
  --shadow-accent: 0 4px 14px rgba(217,119,6,0.35);
  --font: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
}

body { background: var(--c-bg); color: var(--c-text); font-family: var(--font); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }

/* ── Layout ── */
.shell { display: flex; min-height: 100vh; }
.sidebar { width: 224px; background: var(--c-sidebar); border-right: 1px solid var(--c-sidebar-border); display: flex; flex-direction: column; flex-shrink: 0; position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; }
.main { margin-left: 224px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.topbar { height: 58px; background: var(--c-white); border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 40; box-shadow: 0 1px 0 var(--c-border); }
.content { padding: 28px; flex: 1; }

/* ── Sidebar ── */
.sidebar-logo { padding: 22px 16px 18px; border-bottom: 1px solid var(--c-sidebar-border); }
.logo-mark { display: flex; align-items: center; gap: 10px; }
.logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg, #D97706, #F59E0B); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 17px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(217,119,6,0.4); }
.logo-name { font-size: 16px; font-weight: 800; color: #FAFAF9; letter-spacing: -0.02em; }
.logo-sub { font-size: 10px; color: var(--c-sidebar-text); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 1px; }
.sidebar-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; }
.nav-section-label { font-size: 10px; font-weight: 600; color: #52525B; text-transform: uppercase; letter-spacing: 0.08em; padding: 10px 10px 4px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--r-sm); font-size: 13px; font-weight: 500; color: var(--c-sidebar-text); cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: all 0.15s; font-family: var(--font); position: relative; }
.nav-item:hover { background: rgba(255,255,255,0.06); color: #E4E4E7; }
.nav-item.active { background: rgba(217,119,6,0.15); color: #FCD34D; font-weight: 600; }
.nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; background: var(--c-sidebar-active); border-radius: 0 3px 3px 0; }
.nav-item .nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; opacity: 0.6; }
.nav-item.active .nav-icon { opacity: 1; }
.sidebar-footer { padding: 12px 10px; border-top: 1px solid var(--c-sidebar-border); }
.sidebar-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--r-sm); cursor: pointer; }
.sidebar-user:hover { background: rgba(255,255,255,0.06); }
.sidebar-user-name { font-size: 13px; font-weight: 600; color: #E4E4E7; }
.sidebar-user-email { font-size: 11px; color: var(--c-sidebar-text); }

/* ── Topbar ── */
.page-heading { font-size: 17px; font-weight: 700; color: var(--c-text); letter-spacing: -0.02em; }
.topbar-actions { display: flex; align-items: center; gap: 8px; }

/* ── Cards ── */
.card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-lg); box-shadow: var(--shadow-sm); }
.card-body { padding: 20px; }
.card-header { padding: 16px 20px; border-bottom: 1px solid var(--c-border); display: flex; align-items: center; justify-content: space-between; }
.card-title { font-size: 14px; font-weight: 600; color: var(--c-text); }
.card-footer { padding: 12px 20px; border-top: 1px solid var(--c-border); background: var(--c-bg); border-radius: 0 0 var(--r-lg) var(--r-lg); }

/* ── Stats ── */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-lg); padding: 20px; box-shadow: var(--shadow-sm); border-top: 3px solid var(--c-accent); }
.stat-label { font-size: 12px; font-weight: 600; color: var(--c-text-3); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
.stat-value { font-size: 28px; font-weight: 800; color: var(--c-text); letter-spacing: -0.03em; line-height: 1; }
.stat-sub { font-size: 12px; color: var(--c-text-3); margin-top: 8px; }
.stat-delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 20px; }
.delta-up { background: var(--c-green-bg); color: var(--c-green); }
.delta-down { background: var(--c-red-bg); color: var(--c-red); }

/* ── Buttons ── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; font-family: var(--font); font-weight: 600; transition: all 0.18s; white-space: nowrap; }
.btn-primary { background: var(--c-accent); color: white; font-size: 13px; padding: 9px 18px; border-radius: var(--r-sm); box-shadow: var(--shadow-accent); }
.btn-primary:hover { background: var(--c-accent-hover); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(217,119,6,0.4); }
.btn-primary:active { transform: translateY(0); }
.btn-secondary { background: var(--c-white); color: var(--c-text); border: 1px solid var(--c-border); font-size: 13px; padding: 8px 14px; border-radius: var(--r-sm); }
.btn-secondary:hover { border-color: var(--c-border-strong); background: var(--c-bg); }
.btn-ghost { background: none; color: var(--c-text-2); font-size: 13px; padding: 8px 12px; border-radius: var(--r-sm); }
.btn-ghost:hover { background: var(--c-bg); color: var(--c-text); }
.btn-danger { background: var(--c-red); color: white; font-size: 13px; padding: 9px 16px; border-radius: var(--r-sm); }
.btn-sm { padding: 6px 12px !important; font-size: 12px !important; }
.btn-lg { padding: 14px 24px !important; font-size: 15px !important; border-radius: var(--r-md) !important; font-weight: 700 !important; }
.btn-full { width: 100%; }
.btn-icon { padding: 8px !important; border-radius: var(--r-sm); aspect-ratio: 1; }

/* ── Inputs ── */
.field { margin-bottom: 14px; }
.label { display: block; font-size: 12px; font-weight: 600; color: var(--c-text-2); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.04em; }
.input { width: 100%; padding: 9px 12px; background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-sm); font-size: 14px; font-family: var(--font); color: var(--c-text); outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
.input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px rgba(217,119,6,0.12); }
.input::placeholder { color: var(--c-text-3); }
.input-group { display: flex; gap: 0; }
.input-group .input { border-radius: var(--r-sm) 0 0 var(--r-sm); }
.input-group .btn { border-radius: 0 var(--r-sm) var(--r-sm) 0; }
.textarea { resize: vertical; min-height: 80px; }
.select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23A8A29E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; padding-right: 36px; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--c-text-3); text-transform: uppercase; letter-spacing: 0.07em; border-bottom: 1px solid var(--c-border); white-space: nowrap; background: var(--c-bg); }
.table th:first-child { border-radius: var(--r-sm) 0 0 0; }
.table th:last-child { border-radius: 0 var(--r-sm) 0 0; }
.table td { padding: 13px 14px; border-bottom: 1px solid var(--c-border); color: var(--c-text); vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: #FAFAF9; }

/* ── Badges / Tags ── */
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.badge-green { background: var(--c-green-bg); color: var(--c-green); }
.badge-amber { background: var(--c-amber-bg); color: var(--c-amber); }
.badge-blue { background: var(--c-accent-light); color: var(--c-accent-hover); }
.badge-purple { background: var(--c-purple-bg); color: var(--c-purple); }
.badge-red { background: var(--c-red-bg); color: var(--c-red); }
.badge-gray { background: var(--c-bg); color: var(--c-text-3); border: 1px solid var(--c-border); }

/* ── Avatar ── */
.avatar { flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.avatar-36 { width: 36px; height: 36px; font-size: 12px; }
.avatar-40 { width: 40px; height: 40px; font-size: 13px; }
.avatar-48 { width: 48px; height: 48px; font-size: 15px; }
.avatar-64 { width: 64px; height: 64px; font-size: 20px; }
.avatar-96 { width: 96px; height: 96px; font-size: 28px; }

/* ── Progress ── */
.progress { height: 6px; background: var(--c-border); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
.progress-blue { background: linear-gradient(90deg, var(--c-accent), #F59E0B); }
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

/* ── Tip Page (guest) ── */
.tip-shell { min-height: 100vh; background: linear-gradient(160deg, #1C1917 0%, #292524 50%, #1C1917 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
.tip-card { background: white; border-radius: 24px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); width: 100%; max-width: 400px; overflow: hidden; }
.tip-header { padding: 28px 28px 22px; background: linear-gradient(135deg, #92400E 0%, #D97706 100%); color: white; text-align: center; }
.tip-body { padding: 24px 28px; }
.tip-footer { padding: 16px 28px; background: #FAFAF9; border-top: 1px solid #E8E4DF; text-align: center; }
.amount-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 12px; }
.amount-btn { padding: 12px 8px; border: 1.5px solid var(--c-border); background: white; border-radius: var(--r-sm); font-size: 14px; font-weight: 700; color: var(--c-text); cursor: pointer; transition: all 0.15s; font-family: var(--font); text-align: center; }
.amount-btn:hover { border-color: var(--c-accent); color: var(--c-accent); }
.amount-btn.active { border-color: var(--c-accent); background: var(--c-accent); color: white; box-shadow: var(--shadow-accent); }
.pct-grid { display: flex; gap: 6px; }
.pct-btn { flex:1; padding: 10px 4px; border: 1.5px solid var(--c-border); background: white; border-radius: var(--r-sm); font-size: 13px; font-weight: 700; color: var(--c-text-2); cursor: pointer; transition: all 0.15s; font-family: var(--font); text-align: center; }
.pct-btn:hover { border-color: var(--c-accent); color: var(--c-accent); }
.pct-btn.active { border-color: var(--c-accent); background: var(--c-accent); color: white; box-shadow: var(--shadow-accent); }
.tab-row { display: flex; background: var(--c-bg); border-radius: var(--r-sm); padding: 3px; gap: 3px; margin-bottom: 16px; }
.tab-btn { flex:1; padding: 7px; border: none; background: none; border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--c-text-3); cursor: pointer; font-family: var(--font); transition: all 0.15s; }
.tab-btn.active { background: white; color: var(--c-accent); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.review-platforms { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.platform-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1.5px solid var(--c-border); background: white; border-radius: var(--r-sm); cursor: pointer; font-family: var(--font); font-size: 13px; font-weight: 500; color: var(--c-text); transition: border-color 0.15s; }
.platform-btn:hover { border-color: var(--c-accent); }
.platform-btn.active { border-color: var(--c-accent); background: var(--c-accent-light); }
.success-check { width: 72px; height: 72px; background: linear-gradient(135deg, #92400E, #D97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; box-shadow: 0 8px 24px rgba(217,119,6,0.35); }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(28,25,23,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; backdrop-filter: blur(3px); }
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
.bar { flex: 1; border-radius: 5px 5px 0 0; transition: height 0.5s ease; min-width: 0; cursor: pointer; }
.bar:hover { opacity: 0.75; }

/* ── Switch ── */
.switch { width: 36px; height: 20px; background: var(--c-border); border-radius: 10px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.switch.on { background: var(--c-accent); }
.switch-thumb { width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
.switch.on .switch-thumb { left: 18px; }
.switch-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--c-border); }
.switch-row:last-child { border-bottom: none; }

/* ── Nav tabs (top) ── */
.view-tabs { display: flex; gap: 0; background: var(--c-bg); border: 1px solid var(--c-border); border-radius: var(--r-sm); padding: 3px; }
.view-tab { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; background: none; color: var(--c-text-3); font-family: var(--font); transition: all 0.15s; }
.view-tab.active { background: white; color: var(--c-accent); font-weight: 700; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--c-border-strong); border-radius: 3px; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 40, color }) {
  const colors = ["#D97706","#059669","#7C3AED","#B45309","#DC2626","#0891B2"];
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
function TipPage({ employee, billAmount = 40, onBack }) {
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const [step, setStep] = useState("tips"); // tips | payment | review | success
  const [mode, setMode] = useState("pct");
  const [pct, setPct] = useState(10);
  const [fixed, setFixed] = useState(5);
  const [customFixed, setCustomFixed] = useState("");
  const [currency, setCurrency] = useState("USD"); // USD | BS
  const [payMethod, setPayMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [platform, setPlatform] = useState(null);

  const PCTS = [5, 10, 15, 20];
  const FIXED = [1, 2, 5, 10, 20];

  const calcUSD = mode === "pct"
    ? Math.round(billAmount * pct / 100 * 100) / 100
    : (customFixed ? parseFloat(customFixed) || 0 : fixed);

  // display helpers — show in chosen currency
  const fmtD = (n) => currency === "USD" ? fmt(n) : fmtBs(n);
  const fmtBill = fmtD(billAmount);
  const fmtCalc = fmtD(calcUSD);
  const fmtPctHint = (p) => fmtD(Math.round(billAmount * p / 100 * 100) / 100);

  const goToPayment = () => setStep("payment");
  const confirmPayment = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("review"); }, 1600);
  };
  const finish = () => setStep("success");

  // ── Currency toggle pill ──
  const CurrencyToggle = () => (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: 3, gap: 3 }}>
      {["USD", "BS"].map(c => (
        <button key={c} onClick={() => setCurrency(c)}
          style={{ padding: "4px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "var(--font)",
            background: currency === c ? "white" : "transparent",
            color: currency === c ? "var(--c-accent)" : "rgba(255,255,255,0.75)",
            transition: "all 0.15s" }}>
          {c === "USD" ? T.enUSD : T.enBs}
        </button>
      ))}
    </div>
  );

  return (
    <div className="tip-shell">
      <div className="tip-card anim-fadeup">

        {/* ── STEP 1: Choose amount ── */}
        {step === "tips" && <>
          <div className="tip-header">
            <Avatar initials={employee.initials} size={64} />
            <div className="mt-12">
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>{employee.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{employee.role} · Resto Milano</div>
            </div>
            {employee.bio && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7, background: "rgba(255,255,255,0.12)", padding: "8px 12px", borderRadius: 8 }}>💬 {employee.bio}</div>}
            <div className="flex items-center gap-8 mt-12" style={{ justifyContent: "center" }}>
              <Stars rating={employee.rating} />
              <span style={{ fontSize: 13, opacity: 0.9, fontWeight: 600 }}>{employee.rating}</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>({employee.txCount} {T.resenas})</span>
            </div>
            <div className="mt-12"><CurrencyToggle /></div>
          </div>

          <div className="tip-body">
            <div style={{ background: "var(--c-bg)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-sm text-2">{T.totalCuenta}</span>
              <div style={{ textAlign: "right" }}>
                <span className="font-700">{fmtBill}</span>
                {currency === "BS" && <div style={{ fontSize: 10, color: "var(--c-text-3)", marginTop: 1 }}>{T.tasaAprox} Bs.{BS_RATE.toFixed(2)}/$</div>}
              </div>
            </div>

            <div className="tab-row">
              <button className={`tab-btn ${mode === "pct" ? "active" : ""}`} onClick={() => setMode("pct")}>{T.pctCuenta}</button>
              <button className={`tab-btn ${mode === "fixed" ? "active" : ""}`} onClick={() => setMode("fixed")}>{T.montoFijo}</button>
            </div>

            {mode === "pct" ? (
              <div className="pct-grid">{PCTS.map(p => (
                <button key={p} className={`pct-btn ${pct === p ? "active" : ""}`} onClick={() => setPct(p)}>
                  {p}%<br /><span style={{ fontSize: 11, fontWeight: 500 }}>{fmtPctHint(p)}</span>
                </button>
              ))}</div>
            ) : (
              <>
                <div className="amount-grid">
                  {FIXED.map(a => (
                    <button key={a} className={`amount-btn ${fixed === a && !customFixed ? "active" : ""}`} onClick={() => { setFixed(a); setCustomFixed(""); }}>
                      {fmtD(a)}
                    </button>
                  ))}
                </div>
                <input className="input" placeholder={lang === "es" ? `Otro monto, ${currency === "USD" ? "$" : "Bs."}` : `Other amount, ${currency === "USD" ? "$" : "Bs."}`} type="number" value={customFixed} onChange={e => setCustomFixed(e.target.value)} />
              </>
            )}

            {calcUSD > 0 && (
              <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--c-accent-light)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="text-sm font-600 text-accent">{T.totalPropina}</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "var(--c-accent)", letterSpacing: "-0.02em" }}>{fmtCalc}</span>
                </div>
                {currency === "BS" && (
                  <div style={{ marginTop: 4, fontSize: 11, color: "var(--c-accent)", opacity: 0.7, textAlign: "right" }}>{fmt(calcUSD)} USD</div>
                )}
              </div>
            )}

            <button className="btn btn-primary btn-full btn-lg mt-16" onClick={goToPayment} disabled={!calcUSD}>
              {`${T.pagar} ${calcUSD ? fmtCalc : ""}`}
            </button>
            <button className="btn btn-ghost btn-full mt-6" style={{ color: "var(--c-text-3)", fontSize: 12 }}>{T.sinPropina}</button>
          </div>
          <div className="tip-footer">
            <div className="text-xs text-3">{T.pagoSeguro}</div>
            <div className="text-xs text-3 mt-4">Powered by <strong style={{ color: "var(--c-accent)" }}>Propinero</strong></div>
          </div>
        </>}

        {/* ── STEP 2: Choose payment method ── */}
        {step === "payment" && (
          <div className="anim-fadeup">
            <div className="tip-header" style={{ padding: "20px 24px 16px" }}>
              <div style={{ fontSize: 13, opacity: 0.8 }}>{employee.name} · {employee.role}</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 6 }}>{fmtD(calcUSD)}</div>
              {currency === "BS" && <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{fmt(calcUSD)} USD</div>}
              <div style={{ marginTop: 8 }}><CurrencyToggle /></div>
            </div>
            <div className="tip-body">
              <div className="text-sm font-700 mb-12">{T.elegirMetodo}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
                      border: `1.5px solid ${payMethod === m.id ? m.color : "var(--c-border)"}`,
                      borderRadius: "var(--r-sm)", background: payMethod === m.id ? `${m.color}12` : "white",
                      cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.15s", textAlign: "left" }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{m.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-text)" }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 1 }}>{T[m.fieldKey]}: {m.value}</div>
                    </div>
                    {payMethod === m.id && (
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              {payMethod && (() => {
                const m = PAYMENT_METHODS.find(x => x.id === payMethod);
                return (
                  <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--c-bg)", borderRadius: 10, border: "1px solid var(--c-border)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{T.instruccionesPago}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>{T[m.fieldKey]}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-text)" }}>{m.value}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>{T.totalPropina}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "var(--c-accent)" }}>{fmtD(calcUSD)}{currency === "BS" ? ` (${fmt(calcUSD)})` : ""}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--c-text-3)", marginTop: 8, lineHeight: 1.5 }}>💡 {T.realizaTransf}</div>
                  </div>
                );
              })()}

              <button className="btn btn-primary btn-full btn-lg mt-16" onClick={confirmPayment} disabled={!payMethod || loading}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />{T.procesando}</span>
                  : T.yaPague}
              </button>
              <button className="btn btn-ghost btn-full mt-6" style={{ fontSize: 12 }} onClick={() => setStep("tips")}>{T.volver}</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Rate & review ── */}
        {step === "review" && (
          <div className="tip-body anim-fadeup" style={{ padding: "32px 28px" }}>
            <div className="success-check">🎉</div>
            <div style={{ fontSize: 20, fontWeight: 800, textAlign: "center", letterSpacing: "-0.02em" }}>{fmtD(calcUSD)} {T.enviado}</div>
            <div className="text-center text-sm text-2 mt-6">{employee.name} {T.recibiraPropina}</div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div className="text-sm font-700 mb-12 text-center">{T.comoServicio}</div>
            <div className="flex gap-8" style={{ justifyContent: "center", marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 32, cursor: "pointer", filter: s <= (hoverRating || rating) ? "none" : "grayscale(1)", transition: "transform 0.1s", transform: s <= (hoverRating || rating) ? "scale(1.2)" : "scale(1)" }}
                  onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}>⭐</span>
              ))}
            </div>
            <textarea className="input textarea" placeholder={T.comentarioPlaceholder} value={comment} onChange={e => setComment(e.target.value)} style={{ marginBottom: 12 }} />
            {rating >= 4 && (
              <>
                <div className="text-xs text-3 text-center mb-8">{T.dejaResena}</div>
                <div className="review-platforms">
                  {[{ id: "google", label: "Google Maps", emoji: "🗺" }, { id: "tripadvisor", label: "TripAdvisor", emoji: "🦉" }].map(p => (
                    <button key={p.id} className={`platform-btn ${platform === p.id ? "active" : ""}`} onClick={() => setPlatform(p.id)}>
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      <span>{p.label}</span>
                      {platform === p.id && <span className="badge badge-blue" style={{ marginLeft: "auto" }}>{T.seleccionado}</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button className="btn btn-primary btn-full btn-lg mt-16" onClick={finish}>{rating ? T.enviarResena : T.enviar}</button>
            <button className="btn btn-ghost btn-full mt-6" style={{ fontSize: 12 }} onClick={finish}>{T.omitir}</button>
          </div>
        )}

        {/* ── STEP 4: Success ── */}
        {step === "success" && (
          <div className="tip-body anim-fadeup" style={{ padding: "48px 28px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#92400E,#D97706)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(217,119,6,0.35)" }}>✓</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>{T.gracias}</div>
            <div className="text-sm text-2 mt-8" style={{ lineHeight: 1.7 }}>{T.propinasEnviadas}<br />{T.nochesMejor}</div>
            <button className="btn btn-secondary mt-24" onClick={onBack}>{T.volver}</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── OVERVIEW (Dashboard) ────────────────────────────────────────────────────
function Overview({ setView }) {
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const total = EMPLOYEES.reduce((s, e) => s + e.totalTips, 0);
  const maxTotalTips = Math.max(...EMPLOYEES.map(e => e.totalTips));
  const totalTx = EMPLOYEES.reduce((s, e) => s + e.txCount, 0);
  const avgRating = (EMPLOYEES.reduce((s, e) => s + e.rating, 0) / EMPLOYEES.length).toFixed(1);
  const barData = [42, 58, 51, 76, 89, 112, 98];
  const maxBar = Math.max(...barData);

  return (
    <div className="anim-fadeup">
      <div className="stat-grid">
        {[
          { label: T.totalPropinas, value: fmt(total), sub: T.desdeSiempre, delta: "+18%", up: true, icon: "💰" },
          { label: T.transacciones, value: totalTx.toLocaleString("en-US"), sub: T.todasOps, delta: "+24%", up: true, icon: "⚡" },
          { label: T.propinaProm, value: "$3.65", sub: T.porTransaccion, delta: "+5%", up: true, icon: "📊" },
          { label: T.calificacion, value: `★ ${avgRating}`, sub: `${EMPLOYEES.length} ${T.empleados}`, icon: "⭐" },
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
          <div className="card-header"><div className="card-title">{T.propinaseSemana}</div><span className="badge badge-green">{T.esteMes}</span></div>
          <div className="card-body">
            <div className="bar-chart">
              {barData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="bar" style={{ height: `${(v / maxBar) * 100}%`, background: i === 6 ? "var(--c-accent)" : "var(--c-accent-light)" }} />
                  <div className="text-xs text-3">{T.days[i]}</div>
                </div>
              ))}
            </div>
            <div className="divider mt-12 mb-12" />
            <div className="flex justify-between">
              {[[T.promDia, "$98.50"], [T.mejor, T.sabado], [T.ahora, T.activo]].map(([l, v]) => (
                <div key={l} className="text-center"><div className="text-xs text-3">{l}</div><div className="text-sm font-600 mt-4">{v}</div></div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">{T.topPersonal}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("employees")}>{T.verTodos}</button>
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
                <div style={{ width: 80 }}><div className="progress"><div className="progress-fill progress-blue" style={{ width: `${(emp.totalTips / maxTotalTips) * 100}%` }} /></div></div>
                <div className="text-sm font-600 text-accent" style={{ minWidth: 76, textAlign: "right" }}>{fmt(emp.totalTips)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header"><div className="card-title">{T.ultimasTx}</div></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>{T.colEmpleado}</th><th>{T.colMonto}</th><th>{T.colPct}</th><th>{T.colResena}</th><th>{T.colFecha}</th><th>{T.colEstado}</th></tr></thead>
            <tbody>{TRANSACTIONS.slice(0, 5).map(tx => {
              const emp = EMPLOYEES.find(e => e.id === tx.empId);
              return (
                <tr key={tx.id}>
                  <td><div className="flex items-center gap-8"><Avatar initials={emp.initials} size={32} /><span className="font-500">{emp.name}</span></div></td>
                  <td><span className="font-600 text-green">+{fmt(tx.amount)}</span></td>
                  <td>{tx.pct ? <span className="badge badge-blue">{tx.pct}%</span> : <span className="text-3">—</span>}</td>
                  <td>{tx.rating ? <Stars rating={tx.rating} /> : <span className="text-3">—</span>}</td>
                  <td className="text-3">{fmtDate(tx.date)}</td>
                  <td><span className="badge badge-green">{T.acreditado}</span></td>
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
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const openTip = (emp) => { setTipEmployee(emp); setView("tip"); };

  return (
    <div className="anim-fadeup">
      <div className="flex items-center justify-between mb-20">
        <div>
          <div className="text-sm text-3">{T.gestionPersonal}</div>
        </div>
        <div className="flex gap-8">
          <button className="btn btn-secondary">{T.exportarQR}</button>
          <button className="btn btn-primary" onClick={() => setModal(true)}>{T.agregarEmpleado}</button>
        </div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>{T.colEmpleado}</th><th>{T.colRol}</th><th>{T.colCalif}</th><th>{T.colTx}</th><th>{T.colTotal}</th><th>{T.colProm}</th><th>{T.colAcciones}</th></tr></thead>
            <tbody>{EMPLOYEES.map(emp => (
              <tr key={emp.id}>
                <td>
                  <div className="flex items-center gap-10">
                    <Avatar initials={emp.initials} size={40} />
                    <div>
                      <div className="font-600">{emp.name}</div>
                      <div className="text-xs text-3">{emp.bio || T.sinDesc}</div>
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
                    <button className="btn btn-secondary btn-sm" onClick={() => openTip(emp)}>{T.pagina}</button>
                    <button className="btn btn-ghost btn-sm btn-icon" title={T.tituloQR} onClick={() => setSelected(emp)}>⊞</button>
                    <button className="btn btn-ghost btn-sm btn-icon" title={T.editar}>✎</button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal title={`${T.tituloQR} — ${selected.name}`} onClose={() => setSelected(null)}
          footer={<><button className="btn btn-secondary" onClick={() => setSelected(null)}>{T.cerrar}</button><button className="btn btn-primary">{T.descargarPNG}</button></>}>
          <div className="text-center">
            <div style={{ display: "inline-block", padding: 16, background: "white", borderRadius: 12, border: "1px solid var(--c-border)", boxShadow: "var(--shadow-sm)" }}>
              <QRSvg value={`propinero.app/tip/${selected.id}`} size={200} />
            </div>
            <div className="text-sm text-2 mt-12">propinero.app/tip/{selected.id}</div>
            <div className="text-xs text-3 mt-4">{T.colocarMesa}</div>
            <div className="flex gap-8 mt-16" style={{ justifyContent: "center" }}>
              <button className="btn btn-secondary btn-sm">{T.copiarEnlace}</button>
              <button className="btn btn-secondary btn-sm">{T.plantilla}</button>
            </div>
          </div>
        </Modal>
      )}

      {modal && (
        <Modal title={T.nuevoEmpleado} onClose={() => setModal(false)}
          footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>{T.cancelar}</button><button className="btn btn-primary">{T.agregar}</button></>}>
          <div className="grid-2">
            <div className="field"><label className="label">{T.nombre}</label><input className="input" placeholder="María" /></div>
            <div className="field"><label className="label">{T.apellido}</label><input className="input" placeholder="González" /></div>
          </div>
          <div className="field"><label className="label">{T.rolCargo}</label>
            <select className="input select">{T.rolOpciones.map(o => <option key={o}>{o}</option>)}</select>
          </div>
          <div className="field"><label className="label">Email</label><input className="input" placeholder="maria@example.com" type="email" /></div>
          <div className="field"><label className="label">{T.telefonoRetiro}</label><input className="input" placeholder="+58 412 000-00-00" /></div>
          <div className="field"><label className="label">{T.bioLabel}</label><input className="input" placeholder={T.bioPlaceholder} /></div>
        </Modal>
      )}
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function Analytics() {
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const total = EMPLOYEES.reduce((s,e) => s + e.totalTips, 0);
  const weekTips = [32.40, 41.20, 28.90, 56.10, 71.40, 98.20, 84.60];
  const weekTx =   [48,    61,    43,    83,    106,   145,   125];
  const weekData = T.days.map((day, i) => ({ day, tips: weekTips[i], tx: weekTx[i] }));
  const maxTips = Math.max(...weekData.map(d => d.tips));

  return (
    <div className="anim-fadeup">
      <div className="grid-2 mb-16">
        <div className="card">
          <div className="card-header"><div className="card-title">{T.propinasDia}</div></div>
          <div className="card-body">
            <div className="bar-chart" style={{ height: 100 }}>
              {weekData.map((d, i) => (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="bar" style={{ height: `${(d.tips / maxTips) * 100}%`, background: i === 5 ? "var(--c-accent)" : i === 6 ? "#059669" : "var(--c-accent-light)" }} />
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
                <div className="text-xs text-3" style={{ minWidth: 30 }}>{d.tx} {T.ops}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">{T.distribucion}</div></div>
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
              {[[T.lider, "Ana R.", "var(--c-green)"], [T.promCalif, "4.85 ★", "var(--c-amber)"], [T.total, fmt(total), "var(--c-accent)"]].map(([l,v,c]) => (
                <div key={l} className="text-center"><div className="text-xs text-3">{l}</div><div className="text-sm font-600 mt-4" style={{ color: c }}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">{T.resenasClientes}</div><span className="badge badge-green">★ 4.85 {T.promedio}</span></div>
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
// ─── POS INTEGRATION CARD ─────────────────────────────────────────────────────
const MOCK_API_KEY = "pk_live_propinero_restomilano_a7f3d9e2";
const MOCK_WEBHOOK  = "https://propinero.app/api/pos/order";

const POS_SYSTEMS = [
  { key: "manual",     icon: "⬜", color: "#8A94A6", connected: true  },
  { key: "escpos",     icon: "🖨",  color: "#D97706", connected: false },
  { key: "webhook",    icon: "🔗", color: "#7C3AED", connected: false },
  { key: "profitplus", icon: "🇻🇪", color: "#059669", connected: false },
  { key: "restArt",    icon: "🍽",  color: "#0891B2", connected: false },
  { key: "iiko",       icon: "⚡", color: "#DC2626", connected: false },
];

function PosIntegrationCard() {
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const [copied, setCopied] = useState(false);
  const [tested, setTested] = useState(false);
  const [testing, setTesting] = useState(false);
  const [expanded, setExpanded] = useState(null); // key of expanded system

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const test = () => {
    setTesting(true);
    setTimeout(() => { setTesting(false); setTested(true); }, 1400);
  };

  const labelFor = (key) => ({
    manual:     [T.posManual,     T.posManualDesc],
    escpos:     [T.posEscPos,     T.posEscPosDesc],
    webhook:    [T.posWebhook,    T.posWebhookDesc],
    profitplus: [T.posProfitPlus, T.posProfitPlusDesc],
    restArt:    [T.posRestArt,    T.posRestArtDesc],
    iiko:       [T.posIiko,       T.posIikoDesc],
  }[key] || ["", ""]);

  const instructions = {
    escpos: lang === "es"
      ? ["Descarga el agente e instálalo en la PC de la caja", "El agente crea un puerto de impresora virtual (ej: COM8)", "En tu POS, selecciona ese puerto como impresora", "Cada cheque que se imprima recibirá el QR de Propinero automáticamente"]
      : ["Download the agent and install it on the cashier PC", "The agent creates a virtual printer port (e.g. COM8)", "In your POS, select that port as the printer", "Every receipt printed will automatically get the Propinero QR"],
    webhook: lang === "es"
      ? ["Copia el Webhook URL de abajo", "En tu POS, configura una notificación POST al cierre de mesa", 'El cuerpo debe incluir: { "tableId", "billAmount", "employeeId" }', "El QR dinámico se devolverá en la respuesta para imprimir"]
      : ["Copy the Webhook URL below", "In your POS, configure a POST notification on table close", 'The body must include: { "tableId", "billAmount", "employeeId" }', "The dynamic QR will be returned in the response for printing"],
    profitplus: lang === "es"
      ? ["En Profit Plus ve a Configuración → Impresión → Complementos", "Agrega el plugin Propinero desde el Marketplace de Profit Plus", "Ingresa tu API Key cuando el plugin lo solicite", "Activa la opción «QR de propina en cheque»"]
      : ["In Profit Plus go to Settings → Printing → Add-ons", "Add the Propinero plugin from the Profit Plus Marketplace", "Enter your API Key when the plugin asks for it", "Enable the option «Tip QR on receipt»"],
    restArt: lang === "es"
      ? ["En Rest-Art ve a Herramientas → Webhooks", "Agrega una nueva acción en evento «Cierre de comanda»", "URL: " + MOCK_WEBHOOK + " · Método: POST", "Incluye tu API Key en el header Authorization"]
      : ["In Rest-Art go to Tools → Webhooks", "Add a new action on event «Order close»", "URL: " + MOCK_WEBHOOK + " · Method: POST", "Include your API Key in the Authorization header"],
    iiko: lang === "es"
      ? ["Instala el plugin Propinero desde iiko Market", "Abre Administración → Propinero → Configuración", "Pega tu API Key y guarda", "El QR aparecerá en el cheque de cada mesa"]
      : ["Install the Propinero plugin from iiko Market", "Go to Administration → Propinero → Settings", "Paste your API Key and save", "The QR will appear on every table receipt"],
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{T.posIntegracion}</div>
        <span className="badge badge-amber">Beta</span>
      </div>
      <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p className="text-sm text-2">{T.posDescripcion}</p>

        {/* API Key */}
        <div style={{ background: "var(--c-bg)", borderRadius: "var(--r-sm)", padding: "12px 14px" }}>
          <div className="label mb-4">{T.apiKey}</div>
          <div className="flex items-center gap-8">
            <code style={{ flex: 1, fontSize: 12, fontFamily: "monospace", color: "var(--c-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{MOCK_API_KEY}</code>
            <button className="btn btn-secondary btn-sm" onClick={() => copy(MOCK_API_KEY)} style={{ flexShrink: 0 }}>
              {copied ? "✓" : T.copiarApiKey}
            </button>
            <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>{T.regenerar}</button>
          </div>
        </div>

        {/* Webhook URL */}
        <div style={{ background: "var(--c-bg)", borderRadius: "var(--r-sm)", padding: "12px 14px" }}>
          <div className="label mb-4">{T.webhookUrl}</div>
          <div className="flex items-center gap-8">
            <code style={{ flex: 1, fontSize: 12, fontFamily: "monospace", color: "var(--c-accent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{MOCK_WEBHOOK}</code>
            <button className="btn btn-secondary btn-sm" onClick={() => copy(MOCK_WEBHOOK)} style={{ flexShrink: 0 }}>{T.copiarApiKey}</button>
          </div>
        </div>

        {/* Test connection */}
        <div className="flex items-center gap-10">
          <button className="btn btn-secondary btn-sm" onClick={test} disabled={testing}>
            {testing ? "…" : T.probarConexion}
          </button>
          {tested && <span className="text-sm" style={{ color: "var(--c-green)" }}>{T.conexionOk}</span>}
        </div>

        <div className="divider" />

        {/* Compatible systems */}
        <div className="label">{T.posCompatibles}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {POS_SYSTEMS.map(({ key, icon, connected }) => {
            const [name, desc] = labelFor(key);
            const isOpen = expanded === key;
            const hasInstructions = !!instructions[key];
            return (
              <div key={key} style={{ border: `1px solid ${isOpen ? "var(--c-accent)" : "var(--c-border)"}`, borderRadius: "var(--r-sm)", overflow: "hidden", transition: "border-color 0.15s" }}>
                <div className="flex items-center gap-10" style={{ padding: "10px 14px", cursor: hasInstructions ? "pointer" : "default", background: isOpen ? "var(--c-accent-light)" : "white" }}
                  onClick={() => hasInstructions && setExpanded(isOpen ? null : key)}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-sm font-600">{name}</div>
                    <div className="text-xs text-3">{desc}</div>
                  </div>
                  <span className="badge" style={{ background: connected ? "var(--c-green-bg)" : "var(--c-bg)", color: connected ? "var(--c-green)" : "var(--c-text-3)", border: connected ? "none" : "1px solid var(--c-border)", flexShrink: 0 }}>
                    {connected ? T.estadoConectado : T.estadoNoConectado}
                  </span>
                  {hasInstructions && <span style={{ fontSize: 12, color: "var(--c-text-3)", flexShrink: 0 }}>{isOpen ? "▲" : "▾"}</span>}
                </div>
                {isOpen && instructions[key] && (
                  <div style={{ padding: "12px 14px 14px", borderTop: "1px solid var(--c-border)", background: "var(--c-bg)" }}>
                    <div className="text-xs font-600 text-2 mb-10">{T.instrucciones}</div>
                    {instructions[key].map((step, i) => (
                      <div key={i} className="flex gap-10" style={{ marginBottom: 8 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--c-accent)", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                        <div className="text-sm text-2" style={{ lineHeight: 1.5 }}>{step}</div>
                      </div>
                    ))}
                    {key === "escpos" && (
                      <button className="btn btn-primary btn-sm mt-8" style={{ marginTop: 10 }}>{T.descargarAgente}</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const [sw, setSw] = useState({ emailEach: true, dailyReport: true, withdrawReq: false, reviews: true });
  const [splitMode, setSplitMode] = useState("individual");
  return (
    <div className="anim-fadeup">
      <div className="grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">{T.establecimiento}</div></div>
            <div className="card-body">
              {[[T.nombre, "Resto Milano"], [T.direccion, "Caracas, Las Mercedes, Av. Principal"], ["Email", "admin@restomilano.com"], [T.telefono, "+58 212 000-0000"]].map(([l, v]) => (
                <div key={l} className="field"><label className="label">{l}</label><input className="input" defaultValue={v} /></div>
              ))}
              <button className="btn btn-primary">{T.guardar}</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">{T.notificaciones}</div></div>
            <div className="card-body" style={{ padding: "8px 20px" }}>
              {[["emailEach", T.emailCadaTx],["dailyReport", T.reporteDiario],["withdrawReq", T.solicitudesRetiro],["reviews", T.nuevasResenas]].map(([k,l]) => (
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
            <div className="card-header"><div className="card-title">{T.distPropinas}</div></div>
            <div className="card-body">
              {[["individual", T.individual, T.descIndividual],["team", T.equipo, T.descEquipo],["split", T.division, T.descDivision]].map(([v,l,d]) => (
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
                  <div className="text-xs font-600 text-2 mb-8">{T.reglasDivision}</div>
                  {[["Bartender", "10%"], [lang === "es" ? "Cocina" : "Kitchen", "5%"]].map(([r, p]) => (
                    <div key={r} className="flex items-center gap-8 mb-6">
                      <input className="input" defaultValue={r} style={{ flex: 1 }} />
                      <input className="input" defaultValue={p} style={{ width: 64 }} />
                      <button className="btn btn-ghost btn-icon text-red" style={{ flexShrink: 0 }}>×</button>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm text-accent">{T.agregarRegla}</button>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">{T.disenoPagina}</div></div>
            <div className="card-body">
              <div className="field"><label className="label">{T.logotipo}</label><div style={{ padding: "20px", border: "2px dashed var(--c-border)", borderRadius: "var(--r-sm)", textAlign: "center", cursor: "pointer" }}>
                <div className="text-xs text-3">{T.arrastraArchivo}</div>
                <div className="text-xs text-3 mt-4">{T.limitePNG}</div>
              </div></div>
              <div className="field"><label className="label">{T.colorAcento}</label>
                <div className="flex gap-8">{["#D97706","#059669","#7C3AED","#0891B2","#DC2626"].map(c => <div key={c} style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: c === "#D97706" ? "2px solid var(--c-text)" : "2px solid transparent" }} />)}</div>
              </div>
              <button className="btn btn-secondary btn-sm">{T.vistaPreviaBtn}</button>
            </div>
          </div>

          <PosIntegrationCard />
        </div>
      </div>
    </div>
  );
}

// ─── WITHDRAW ─────────────────────────────────────────────────────────────────
function Withdraw() {
  const lang = useContext(LangCtx);
  const T = TRANSLATIONS[lang];
  const [emp, setEmp] = useState(EMPLOYEES[0]);
  return (
    <div className="anim-fadeup">
      <div className="grid-2">
        <div>
          <div className="card mb-16" style={{ background: "linear-gradient(135deg, #92400E 0%, #D97706 100%)", border: "none", color: "white" }}>
            <div className="card-body">
              <div className="text-sm" style={{ opacity: 0.8 }}>{T.disponible}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 4 }}>{fmt(emp.totalTips)}</div>
              <div className="text-sm mt-8" style={{ opacity: 0.8 }}>{T.colEmpleado}: {emp.name}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">{T.solRetiro}</div></div>
            <div className="card-body">
              <div className="field"><label className="label">{T.colEmpleado}</label>
                <select className="input select" onChange={e => setEmp(EMPLOYEES.find(em => em.id === e.target.value))}>
                  {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.name} — {fmt(e.totalTips)}</option>)}
                </select>
              </div>
              <div className="field"><label className="label">{T.colMonto}</label><input className="input" placeholder={`${T.hasta} ${fmt(emp.totalTips)}`} type="number" /></div>
              <div className="field"><label className="label">{T.metodo}</label>
                <select className="input select">{T.metodos.map(m => <option key={m}>{m}</option>)}</select>
              </div>
              <div className="field"><label className="label">{T.datos}</label><input className="input" placeholder={T.datosPlaceholder} /></div>
              <button className="btn btn-primary btn-full btn-lg">{T.retirarFondos}</button>
              <div className="text-xs text-3 text-center mt-8">{T.acreditacion}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">{T.historialRetiros}</div></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>{T.colEmpleado}</th><th>{T.colMonto}</th><th>{T.colMetodo}</th><th>{T.colFecha}</th><th>{T.colEstado}</th></tr></thead>
              <tbody>
                {[["e3","48.00","Pago Móvil","2026-02-20","done"],["e1","32.00","Zelle","2026-02-15","done"],["e2","21.00","Pago Móvil","2026-02-10","done"],["e4","15.00","Pago Móvil","2026-02-05","pending"]].map(([id,amt,method,date,status]) => {
                  const e = EMPLOYEES.find(em => em.id === id);
                  return (
                    <tr key={date}>
                      <td><div className="flex items-center gap-8"><Avatar initials={e.initials} size={32} /><span className="font-500 text-sm">{e.name}</span></div></td>
                      <td><span className="font-600 text-green">−${amt}</span></td>
                      <td className="text-sm text-2">{method}</td>
                      <td className="text-xs text-3">{new Date(date).toLocaleDateString("es-VE")}</td>
                      <td><span className={`badge ${status === "done" ? "badge-green" : "badge-amber"}`}>{status === "done" ? T.pagado : T.enProceso}</span></td>
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

// ─── LANG DROPDOWN ────────────────────────────────────────────────────────────
function LangDropdown({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const opts = [{ code: "es", flag: "🇻🇪", label: "Español" }, { code: "en", flag: "🇺🇸", label: "English" }];
  const current = opts.find(o => o.code === lang);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="btn btn-secondary btn-sm" onClick={() => setOpen(v => !v)} style={{ gap: 6, minWidth: 80 }}>
        <span>{current.flag}</span> <span>{current.label}</span> <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "white", border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)", boxShadow: "var(--shadow-md)", zIndex: 200, minWidth: 130, overflow: "hidden" }}>
          {opts.map(o => (
            <button key={o.code} onClick={() => { setLang(o.code); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", background: o.code === lang ? "var(--c-accent-light)" : "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: o.code === lang ? 600 : 400, color: o.code === lang ? "var(--c-accent)" : "var(--c-text)" }}>
              <span>{o.flag}</span> {o.label} {o.code === lang && <span style={{ marginLeft: "auto" }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("overview");
  const [tipEmployee, setTipEmployee] = useState(EMPLOYEES[0]);
  const [lang, setLang] = useState("es");
  const T = TRANSLATIONS[lang];

  const navItems = [
    { id: "overview", icon: "◈", label: T.resumen },
    { id: "employees", icon: "◉", label: T.personal },
    { id: "analytics", icon: "↗", label: T.analitica },
    { id: "withdraw", icon: "$", label: T.retiros },
    { id: "settings", icon: "⊕", label: T.configuracion },
  ];

  const heading = { overview: T.resumen, employees: T.personal, analytics: T.analitica, withdraw: T.retiros, settings: T.configuracion, tip: T.paginaInvitado };

  if (view === "tip") return (
    <LangCtx.Provider value={lang}>
      <style>{CSS}</style>
      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 999 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setView("employees")} style={{ boxShadow: "var(--shadow-md)" }}>{T.volver}</button>
      </div>
      <TipPage employee={tipEmployee} billAmount={40} onBack={() => setView("employees")} />
    </LangCtx.Provider>
  );

  return (
    <LangCtx.Provider value={lang}>
      <style>{CSS}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">🪙</div>
              <div><div className="logo-name">Propinero</div><div className="logo-sub">{lang === "es" ? "Propinas digitales" : "Digital tips"}</div></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">{T.panel}</div>
            {navItems.map(item => (
              <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
                <span className="nav-icon">{item.icon}</span>{item.label}
              </button>
            ))}
            <div className="nav-section-label" style={{ marginTop: 8 }}>{T.demo}</div>
            <button className="nav-item" onClick={() => { setTipEmployee(EMPLOYEES[0]); setView("tip"); }}>
              <span className="nav-icon">↗</span>{T.paginaInvitado}
            </button>
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <Avatar initials="RM" size={32} color="#D97706" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name truncate">Resto Milano</div>
                <div className="sidebar-user-email">admin@restomilano.com</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="page-heading">{heading[view]}</div>
            <div className="topbar-actions">
              <button className="btn btn-secondary btn-sm">🔔</button>
              <LangDropdown lang={lang} setLang={setLang} />
              <button className="btn btn-secondary btn-sm">? {T.ayuda}</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setTipEmployee(EMPLOYEES[0]); setView("tip"); }}>
                {T.demoBtn}
              </button>
            </div>
          </header>
          <main className="content">
            {view === "overview" && <Overview setView={setView} />}
            {view === "employees" && <Employees setTipEmployee={setTipEmployee} setView={setView} />}
            {view === "analytics" && <Analytics />}
            {view === "withdraw" && <Withdraw />}
            {view === "settings" && <Settings />}
          </main>
        </div>
      </div>
    </LangCtx.Provider>
  );
}