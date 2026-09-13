import express from "express";
import cors from "cors";
import path from "path";
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

// Middleware
app.use(cors());
app.use(express.json());

// Initialize & Seed Database
initDatabase();
seedDatabase();

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Bharat Bhoomi National Land Records API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/parcels", parcelsRoutes);
app.use("/api/grievances", grievancesRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/users", usersRoutes);

// Serve frontend static build in production (e.g. Render all-in-one deployment)
import fs from "fs";
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`🇮🇳 Bharat Bhoomi Backend Server running on http://localhost:${PORT}`);
});

export default app;
