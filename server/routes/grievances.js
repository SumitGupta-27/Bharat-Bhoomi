import express from "express";
import db from "../database.js";
import { requireAuth, requireOfficer } from "../middleware/auth.js";

const router = express.Router();

function generateRefId() {
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  return `BB-${rand}`;
}

// POST /api/grievances - Submit a grievance or feedback (Public / Citizen)
router.post("/", (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      category,
      requestType,
      subject,
      description,
      attachmentName
    } = req.body;

    if (!fullName || !email || !category || !requestType || !subject || !description) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields." });
    }

    const refId = generateRefId();

    const result = db.prepare(`
      INSERT INTO grievances (
        reference_id, full_name, email, phone, category, request_type,
        subject, description, attachment_filename, status, assigned_department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)
    `).run(
      refId,
      fullName.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      category,
      requestType,
      subject.trim(),
      description.trim(),
      attachmentName || null,
      category // default assigned to category department
    );

    // Log in audit trail
    db.prepare(`
      INSERT INTO audit_logs (user_name, role, department, action, target_type, target_id, details)
      VALUES (?, 'citizen', ?, 'SUBMIT_GRIEVANCE', 'grievance', ?, ?)
    `).run(
      fullName.trim(),
      category,
      refId,
      `New ${requestType} submitted: "${subject}" (Ref: ${refId})`
    );

    res.status(201).json({
      success: true,
      referenceId: refId,
      message: "Grievance / Feedback submitted successfully."
    });
  } catch (err) {
    console.error("Error submitting grievance:", err);
    res.status(500).json({ success: false, message: "Server error submitting grievance." });
  }
});

// GET /api/grievances/track/:refId - Public tracking endpoint
router.get("/track/:refId", (req, res) => {
  try {
    const refId = req.params.refId.trim().toUpperCase();
    const grievance = db.prepare(`
      SELECT id, reference_id, full_name, category, request_type,
             subject, description, status, assigned_department,
             officer_notes, created_at, resolved_at, updated_at
      FROM grievances
      WHERE reference_id = ?
    `).get(refId);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `No record found for Reference ID "${refId}". Please check and try again.`
      });
    }

    // Mask name for privacy if viewed publicly
    const nameParts = grievance.full_name.split(" ");
    const maskedName = nameParts.map(p => p[0] + "***").join(" ");

    res.json({
      success: true,
      grievance: {
        ...grievance,
        masked_name: maskedName
      }
    });
  } catch (err) {
    console.error("Error tracking grievance:", err);
    res.status(500).json({ success: false, message: "Server error tracking grievance." });
  }
});

// GET /api/grievances - Officer view of all grievances
router.get("/", requireOfficer, (req, res) => {
  try {
    const { department, status, limit = 50 } = req.query;

    let sql = "SELECT * FROM grievances WHERE 1=1";
    const params = [];

    if (department && department !== "All Departments" && department !== "All") {
      sql += " AND assigned_department = ?";
      params.push(department);
    }

    if (status && status !== "All Status" && status !== "All") {
      sql += " AND status = ?";
      params.push(status);
    }

    sql += " ORDER BY id DESC LIMIT ?";
    params.push(Number(limit));

    const grievances = db.prepare(sql).all(...params);
    res.json({ success: true, grievances });
  } catch (err) {
    console.error("Error fetching grievances:", err);
    res.status(500).json({ success: false, message: "Server error fetching grievances." });
  }
});

// PATCH /api/grievances/:id - Update status & officer notes (Officer / Admin)
router.patch("/:id", requireOfficer, (req, res) => {
  try {
    const grievanceId = req.params.id;
    const grievance = db.prepare("SELECT * FROM grievances WHERE id = ?").get(grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: "Grievance record not found." });
    }

    const { status, officer_notes } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const resolved_at = status === "Resolved" ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE grievances
      SET status = ?,
          officer_notes = COALESCE(?, officer_notes),
          resolved_at = COALESCE(?, resolved_at),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, officer_notes || null, resolved_at, grievanceId);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'UPDATE_GRIEVANCE', 'grievance', ?, ?)
    `).run(
      req.user.id,
      req.user.full_name,
      req.user.role,
      req.user.department || "Officer",
      grievance.reference_id,
      `Grievance ${grievance.reference_id} marked as "${status}". Note: ${officer_notes || "None"}`
    );

    res.json({ success: true, message: `Grievance ${grievance.reference_id} updated to ${status}.` });
  } catch (err) {
    console.error("Error updating grievance:", err);
    res.status(500).json({ success: false, message: "Server error updating grievance." });
  }
});

export default router;
