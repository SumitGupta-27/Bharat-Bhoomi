import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { initDatabase } from "./database.js";
import { seedDatabase } from "./seed.js";

import authRoutes from "./routes/auth.js";
import parcelsRoutes from "./routes/parcels.js";
import grievancesRoutes from "./routes/grievances.js";
import statsRoutes from "./routes/stats.js";
import auditRoutes from "./routes/audit.js";
import usersRoutes from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Headers (helmet) ─────────────────────────────────────────────────
try {
  const { default: helmet } = await import("helmet");
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP so Vite dev server inline scripts work
    crossOriginEmbedderPolicy: false,
  }));
  console.log("✅ Helmet security headers enabled");
} catch (_) {
  console.warn("⚠️  helmet not installed — run `npm install` to enable security headers");
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────
try {
  const { rateLimit } = await import("express-rate-limit");

  // Strict limit on auth endpoints — prevent brute-force
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,                   // 20 attempts per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many login attempts. Please wait 15 minutes and try again." },
  });

  // General API rate limit
  const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth", authLimiter);
  app.use("/api", generalLimiter);
  console.log("✅ Rate limiting enabled");
} catch (_) {
  console.warn("⚠️  express-rate-limit not installed — run `npm install` to enable rate limiting");
}

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// ── Initialize & Seed Database ────────────────────────────────────────────────
initDatabase();
seedDatabase();

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Bharat Bhoomi National Land Records API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/parcels", parcelsRoutes);
app.use("/api/grievances", grievancesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/users", usersRoutes);

// ── Serve Frontend Static Build (production) ───────────────────────────────────
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: "7d" }));
  // Express 5: wildcard must be a named parameter
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🇮🇳 Bharat Bhoomi Backend running on http://localhost:${PORT}`);
  console.log(`   API Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
