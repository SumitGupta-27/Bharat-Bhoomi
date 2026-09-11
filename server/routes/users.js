import express from "express";
import db from "../database.js";
import { requireOfficer } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users - List users (for officer/admin view)
router.get("/", requireOfficer, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, username, email, full_name, phone, role, department, designation, created_at
      FROM users
      ORDER BY id ASC
    `).all();

    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error fetching users." });
  }
});

export default router;
