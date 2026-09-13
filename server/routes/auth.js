import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = express.Router();

// ── POST /api/auth/login ───────────────────────────────────────────────────────
// Handles both citizen and officer logins in one endpoint.
// The client passes an optional `role` field; if `role === "officer"`, the
// account must have role "officer" or "admin".
router.post("/login", (req, res) => {
  const { username, password, department, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username/Email and password are required." });
  }

  // Look up user by username or email (case-insensitive)
  const user = db.prepare(
    "SELECT * FROM users WHERE username = ? OR email = ?"
  ).get(username.trim().toLowerCase(), username.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials. User not found." });
  }

  // Verify password
  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid password." });
  }

  // If officer login is requested, verify the role
  if (role === "officer" && user.role !== "officer" && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "This account is not authorized as an official officer account.",
    });
  }

  // Generate JWT token (7-day expiry)
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    department: user.department,
    full_name: user.full_name,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  // Record login in audit logs
  try {
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'LOGIN', 'user', ?, ?)
    `).run(
      user.id,
      user.full_name,
      user.role,
      user.department || "Public",
      String(user.id),
      `User logged in from portal as ${user.role}`
    );
  } catch (_) {
    // Non-critical — don't block login if audit fails
  }

  const { password_hash, ...safeUser } = user;
  return res.json({
    success: true,
    token,
    user: safeUser,
    message: `Welcome back, ${user.full_name}!`,
  });
});

// ── POST /api/auth/department-login ───────────────────────────────────────────
// Dedicated officer/department login endpoint.
router.post("/department-login", (req, res) => {
  const { username, password, department } = req.body;

  if (!username || !password || !department) {
    return res.status(400).json({
      success: false,
      message: "Username, password, and department are required.",
    });
  }

  const user = db.prepare(
    "SELECT * FROM users WHERE username = ? OR email = ?"
  ).get(username.trim().toLowerCase(), username.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials. User not found." });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid password." });
  }

  if (user.role !== "officer" && user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. This account does not have officer privileges.",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    department: user.department || department,
    full_name: user.full_name,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  try {
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'LOGIN', 'user', ?, ?)
    `).run(
      user.id,
      user.full_name,
      user.role,
      user.department || department,
      String(user.id),
      `Officer logged in via department portal — ${department}`
    );
  } catch (_) {
    // Non-critical
  }

  const { password_hash, ...safeUser } = user;
  return res.json({
    success: true,
    token,
    user: safeUser,
    message: `Welcome, ${user.full_name}. You are logged in to the ${department} portal.`,
  });
});

// ── POST /api/auth/register ────────────────────────────────────────────────────
// Citizen self-registration.
router.post("/register", (req, res) => {
  const { username, email, password, full_name, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({
      success: false,
      message: "Username, email, full name, and password are required.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  // Check for existing username or email
  const existing = db.prepare(
    "SELECT id FROM users WHERE username = ? OR email = ?"
  ).get(username.trim().toLowerCase(), email.trim().toLowerCase());

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Username or email is already registered. Please choose a different one.",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 12);

  const result = db.prepare(`
    INSERT INTO users (username, email, password_hash, full_name, phone, role)
    VALUES (?, ?, ?, ?, ?, 'citizen')
  `).run(
    username.trim().toLowerCase(),
    email.trim().toLowerCase(),
    hashedPassword,
    full_name.trim(),
    phone ? phone.trim() : null
  );

  const newUser = db.prepare(
    "SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?"
  ).get(result.lastInsertRowid);

  const token = jwt.sign(
    {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      full_name: newUser.full_name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    success: true,
    token,
    user: newUser,
    message: "Registration successful! Welcome to Bharat Bhoomi.",
  });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare(
    "SELECT id, username, email, full_name, phone, role, department, designation, created_at FROM users WHERE id = ?"
  ).get(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  return res.json({ success: true, user });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// Stateless JWT — logout is handled client-side. This just records the event.
router.post("/logout", requireAuth, (req, res) => {
  try {
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'LOGOUT', 'user', ?, ?)
    `).run(
      req.user.id,
      req.user.full_name,
      req.user.role,
      req.user.department || "Public",
      String(req.user.id),
      "User logged out"
    );
  } catch (_) {
    // Non-critical
  }
  return res.json({ success: true, message: "Logged out successfully." });
});

export default router;
