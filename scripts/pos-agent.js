#!/usr/bin/env node
/**
 * Propinero ESC/POS Print Agent
 * ─────────────────────────────
 * Installs on the restaurant cashier PC. Creates a virtual TCP print server
 * that intercepts ESC/POS jobs from the POS software, appends a Propinero
 * QR code, then forwards the modified job to the real thermal printer.
 *
 * Setup:
 *   1. npm install (node-thermal-printer escpos escpos-network)
 *   2. Copy propinero-agent.config.json next to this file and fill in values.
 *   3. In your POS, set the printer IP to 127.0.0.1 and port to 9100.
 *      (or use the virtual COM port mode — see README)
 *   4. node pos-agent.js
 *
 * Alternatively, use the packaged .exe build (pkg pos-agent.js).
 */

"use strict";

const net   = require("net");
const http  = require("https");
const fs    = require("fs");
const path  = require("path");

// ── Config ────────────────────────────────────────────────────────────────────
const CONFIG_PATH = path.join(__dirname, "propinero-agent.config.json");

const DEFAULT_CONFIG = {
  // Propinero API
  propineroBaseUrl: "https://propinero.app",
  apiKey: "pk_live_YOUR_API_KEY_HERE",

  // Virtual server (POS connects here)
  listenPort: 9100,
  listenHost: "127.0.0.1",

  // Real printer (agent forwards here)
  printerHost: "192.168.1.100",
  printerPort: 9100,

  // QR options
  qrSize: 5,          // ESC/POS QR module size 1–8
  qrErrorLevel: "M",  // L | M | Q | H
  footerText: "\xA1Deja tu propina escaneando el QR! \uD83D\uDE4F",

  // Employee ID sent to API when the agent cannot determine it from the receipt.
  // Leave null to let the guest choose on the tip page.
  defaultEmployeeId: null,
};

let config = DEFAULT_CONFIG;
if (fs.existsSync(CONFIG_PATH)) {
  try {
    config = { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) };
    console.log("[Propinero] Config loaded from", CONFIG_PATH);
  } catch (e) {
    console.warn("[Propinero] Could not parse config file, using defaults:", e.message);
  }
}

// ── ESC/POS QR builder ────────────────────────────────────────────────────────
/**
 * Builds the ESC/POS byte sequence to print a QR code.
 * Reference: ESC/POS Command Reference (Epson), GS ( k commands.
 */
function buildQRBytes(data, size = 5, errorLevel = "M") {
  const ERROR_LEVELS = { L: 48, M: 49, Q: 50, H: 51 };
  const errByte = ERROR_LEVELS[errorLevel] ?? 49;
  const buf     = Buffer.from(data, "utf8");
  const dataLen = buf.length + 3; // pL pH cn fn m
  const pL      = dataLen & 0xff;
  const pH      = (dataLen >> 8) & 0xff;

  return Buffer.concat([
    // Feed line
    Buffer.from([0x0a]),
    // Set QR model (model 2)
    Buffer.from([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]),
    // Set module size
    Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, size]),
    // Set error correction level
    Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, errByte]),
    // Store data
    Buffer.from([0x1d, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30]),
    buf,
    // Print QR
    Buffer.from([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30]),
    // Feed + cut
    Buffer.from([0x0a, 0x0a]),
  ]);
}

function buildFooterBytes(text) {
  return Buffer.concat([
    Buffer.from([0x1b, 0x61, 0x01]),          // center align
    Buffer.from([0x1b, 0x21, 0x00]),          // normal font
    Buffer.from(text + "\n", "utf8"),
    Buffer.from([0x1b, 0x61, 0x00]),          // left align
  ]);
}

// ── Propinero API call ────────────────────────────────────────────────────────
/**
 * Calls POST /api/pos/order and resolves with the tipUrl string.
 * Falls back to a static employee URL if the API is unreachable.
 */
function fetchTipUrl(tableId, billAmount, employeeId, orderId) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ tableId, billAmount, employeeId, orderId, source: "escpos" });
    const url  = new URL("/api/pos/order", config.propineroBaseUrl);

    const options = {
      method:   "POST",
      hostname: url.hostname,
      port:     url.port || 443,
      path:     url.pathname,
      headers: {
        "Content-Type":  "application/json",
        "Content-Length": Buffer.byteLength(body),
        "Authorization": `Bearer ${config.apiKey}`,
      },
    };

    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(raw);
          resolve(json.tipUrl ?? `${config.propineroBaseUrl}/tip/static`);
        } catch {
          resolve(`${config.propineroBaseUrl}/tip/static`);
        }
      });
    });

    req.on("error", () => {
      // Offline fallback: static restaurant tip page
      resolve(`${config.propineroBaseUrl}/tip/static`);
    });

    req.setTimeout(3000, () => {
      req.destroy();
      resolve(`${config.propineroBaseUrl}/tip/static`);
    });

    req.write(body);
    req.end();
  });
}

// ── Parse receipt data (heuristic) ───────────────────────────────────────────
/**
 * Tries to extract { tableId, billAmount, employeeId } from the raw ESC/POS
 * byte stream using text heuristics. POS systems vary wildly, so this is
 * best-effort — defaults are used when detection fails.
 *
 * For Profit Plus & Rest-Art the receipt text typically contains:
 *   "Mesa: 5"  or  "Comanda: 007"
 *   "TOTAL: Bs.1,234.56"  or  "TOTAL USD  45.00"
 */
function parseReceiptData(buffer) {
  const text = buffer.toString("utf8", 0, Math.min(buffer.length, 4096));

  // Table / comanda
  const tableMatch = text.match(/(?:Mesa|Comanda|Table|Order)[:\s#]+(\w+)/i);
  const tableId    = tableMatch?.[1] ?? "unknown";

  // Bill amount — prefer USD, fallback to Bs (will convert)
  const usdMatch = text.match(/TOTAL\s*USD?\s*\$?\s*([\d,.]+)/i);
  const bsMatch  = text.match(/TOTAL\s*Bs\.?\s*([\d,.]+)/i);
  let billAmount  = 0;

  if (usdMatch) {
    billAmount = parseFloat(usdMatch[1].replace(",", ""));
  } else if (bsMatch) {
    const bs = parseFloat(bsMatch[1].replace(/[.,](?=\d{3})/g, "").replace(",", "."));
    // Convert Bs to USD using approximate BCV rate
    billAmount = Math.round((bs / 36.5) * 100) / 100;
  }

  // Employee name/code (optional, POS-specific)
  const empMatch = text.match(/(?:Mesonero|Atendido por|Waiter)[:\s]+([A-Za-záéíóúÁÉÍÓÚ ]+)/i);
  const empName  = empMatch?.[1]?.trim() ?? null;

  return { tableId, billAmount: billAmount || 0, empName };
}

// ── Proxy server ──────────────────────────────────────────────────────────────
const server = net.createServer((posSocket) => {
  console.log(`[Propinero] Print job received from ${posSocket.remoteAddress}`);

  const chunks = [];
  posSocket.on("data", (chunk) => chunks.push(chunk));

  posSocket.on("end", async () => {
    const raw = Buffer.concat(chunks);
    const { tableId, billAmount, empName } = parseReceiptData(raw);

    console.log(`[Propinero] Detected — table: ${tableId}, amount: $${billAmount}, emp: ${empName ?? "unknown"}`);

    // Fetch dynamic QR URL from Propinero
    const tipUrl = await fetchTipUrl(tableId, billAmount, config.defaultEmployeeId, null);
    console.log(`[Propinero] Tip URL: ${tipUrl}`);

    // Build QR + footer bytes
    const qrBytes     = buildQRBytes(tipUrl, config.qrSize, config.qrErrorLevel);
    const footerBytes = buildFooterBytes(config.footerText);
    const modified    = Buffer.concat([raw, footerBytes, qrBytes]);

    // Forward to real printer
    const printer = net.createConnection({ host: config.printerHost, port: config.printerPort }, () => {
      printer.write(modified);
      printer.end();
      console.log(`[Propinero] Job forwarded to printer (${modified.length} bytes)`);
    });

    printer.on("error", (err) => {
      console.error(`[Propinero] Printer error: ${err.message}`);
      // Still close the POS socket gracefully
      posSocket.destroy();
    });
  });

  posSocket.on("error", (err) => console.error("[Propinero] POS socket error:", err.message));
});

server.listen(config.listenPort, config.listenHost, () => {
  console.log("╔═══════════════════════════════════════════════════╗");
  console.log("║       Propinero ESC/POS Print Agent               ║");
  console.log("╚═══════════════════════════════════════════════════╝");
  console.log(`  Listening : ${config.listenHost}:${config.listenPort}`);
  console.log(`  Printer   : ${config.printerHost}:${config.printerPort}`);
  console.log(`  API URL   : ${config.propineroBaseUrl}`);
  console.log(`  QR size   : ${config.qrSize}  Error: ${config.qrErrorLevel}`);
  console.log("  Ready — waiting for print jobs...\n");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[Propinero] Port ${config.listenPort} is already in use. Change listenPort in the config.`);
  } else {
    console.error("[Propinero] Server error:", err.message);
  }
  process.exit(1);
});
