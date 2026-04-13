/**
 * POST /api/pos/order
 *
 * Webhook called by the POS (or the ESC/POS agent) when a table is closed.
 * Returns a one-time tip URL and raw QR data string.
 *
 * Body:
 *   { tableId: string, billAmount: number, employeeId?: string, orderId?: string, source?: string }
 *
 * Response:
 *   { token: string, tipUrl: string, qrData: string, expiresAt: string }
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ── Auth helper ────────────────────────────────────────────────────────────────
function authenticate(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const key  = auth.replace(/^Bearer\s+/i, "").trim();
  // In production this checks against DB. For now: any non-empty key is accepted.
  return key.length > 0;
}

// ── Token store (in-memory — replace with DB in Phase 3) ──────────────────────
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
export const orderTokens = new Map<string, {
  tableId: string;
  billAmount: number;
  employeeId?: string;
  orderId?: string;
  source: string;
  createdAt: number;
}>();

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tableId, billAmount, employeeId, orderId, source = "webhook" } = body as {
    tableId?: string;
    billAmount?: number;
    employeeId?: string;
    orderId?: string;
    source?: string;
  };

  if (!tableId || typeof billAmount !== "number" || billAmount <= 0) {
    return NextResponse.json(
      { error: "Required fields: tableId (string), billAmount (number > 0)" },
      { status: 422 }
    );
  }

  // Generate a short-lived single-use token
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  orderTokens.set(token, {
    tableId,
    billAmount,
    employeeId,
    orderId,
    source,
    createdAt: Date.now(),
  });

  // Build the public tip URL that will be encoded in the QR
  const baseUrl = req.headers.get("x-forwarded-host")
    ? `https://${req.headers.get("x-forwarded-host")}`
    : process.env.NEXT_PUBLIC_BASE_URL ?? "https://propinero.app";

  const tipUrl = `${baseUrl}/tip/${token}`;

  return NextResponse.json({ token, tipUrl, qrData: tipUrl, expiresAt }, { status: 201 });
}

// ── GET: resolve token (used by the public TipPage to read pre-filled data) ───
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const order = orderTokens.get(token);
  if (!order) return NextResponse.json({ error: "Token not found or expired" }, { status: 404 });

  // Expire old tokens on access
  if (Date.now() - order.createdAt > TOKEN_TTL_MS) {
    orderTokens.delete(token);
    return NextResponse.json({ error: "Token expired" }, { status: 410 });
  }

  return NextResponse.json(order);
}