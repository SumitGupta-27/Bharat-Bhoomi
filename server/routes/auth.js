import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password, department, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username/Email and password are required." });
  }

  // Look up user by username or email
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

  // If officer login, check department if requested
  if (role === "officer" && user.role !== "officer" && user.role !== "admin") {
    return res.status(403).json({ success: false, message: "This account is not authorized as an official officer account." });
  }

  // Generate JWT token
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
  db.prepare(`
    INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
    VALUES (?, ?, ?, ?, 'LOGIN', 'user', ?, ?)
  `).run(user.id, user.full_name, user.role, user.department || "Public", String(user.id), `User logged in from portal as ${user.role}`);

  // Return safe user object
  const { password_hash, ...safeUser } = user;
  res.json({
    success: true,
    token,
    user: safeUser,
    message: `Welcome back, ${user.full_name}!`,
  });
});

// POST /api/auth/register (Citizen registration)
router.post("/register", (req, res) => {
  const { username, email, password, full_name, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ success: false, message: "Username, email, full name, and password are required." });
  }

  // Check if username or email already exists
  const existing = db.prepare("SELECT id FROM users WHERE username = ? OR email = ?").get(
    username.trim().toLowerCase(),
    email.trim().toLowerCase()
  );

  if (existing) {
    return res.status(409).json({ success: false, message: "Username or email is already registered." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

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

  const newUser = db.prepare("SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);

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

  res.status(201).json({
    success: true,
    token,
    user: newUser,
    message: "Registration successful! Welcome to Bharat Bhoomi.",
  });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT id, username, email, full_name, phone, role, department, designation, created_at FROM users WHERE id = ?").get(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  res.json({ success: true, user });
});

export default router;
