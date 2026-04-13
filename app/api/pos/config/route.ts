/**
 * GET /api/pos/config
 *
 * Called by the ESC/POS local agent on startup to fetch restaurant config:
 * printer name, employee roster, base URL, and the API key for subsequent calls.
 *
 * Auth: Bearer <api_key>  (same key used for /api/pos/order)
 */

import { NextRequest, NextResponse } from "next/server";

// Mock restaurant config — replace with DB query in Phase 3
const RESTAURANT_CONFIG = {
  id: "rest_restomilano",
  slug: "restomilano",
  name: "Resto Milano",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://propinero.app",
  printerPort: "COM3",          // default; agent may override via local config file
  qrSizeModules: 5,             // ESC/POS QR size (1–8)
  qrErrorCorrection: "M",       // L | M | Q | H
  receiptFooterText: "¡Deja tu propina escaneando el código QR! 🙏",
  employees: [
    { id: "e1", name: "María González",  role: "Mesonera",   qrToken: "tok_mg_001" },
    { id: "e2", name: "Carlos Pérez",    role: "Bartender",  qrToken: "tok_cp_002" },
    { id: "e3", name: "Ana Rodríguez",   role: "Mesonera",   qrToken: "tok_ar_003" },
    { id: "e4", name: "Diego Hernández", role: "Anfitrión",  qrToken: "tok_dh_004" },
  ],
};

function authenticate(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const key  = auth.replace(/^Bearer\s+/i, "").trim();
  return key.length > 0;
}

export async function GET(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(RESTAURANT_CONFIG);
}