import express from "express";
import db from "../database.js";

const router = express.Router();

// GET /api/audit-logs
router.get("/", (req, res) => {
  try {
    const { limit = 20, department } = req.query;

    let sql = "SELECT * FROM audit_logs WHERE 1=1";
    const params = [];

    if (department && department !== "All") {
      sql += " AND department = ?";
      params.push(department);
    }

    sql += " ORDER BY timestamp DESC LIMIT ?";
    params.push(Number(limit));

    const logs = db.prepare(sql).all(...params);

    // Format relative time helper
    const formatted = logs.map(l => {
      const date = new Date(l.timestamp);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.round(diffMs / (60 * 1000));
      let timeText = "Just now";
      if (diffMin > 0 && diffMin < 60) timeText = `${diffMin} min ago`;
      else if (diffMin >= 60 && diffMin < 1440) timeText = `${Math.floor(diffMin / 60)} hr ago`;
      else if (diffMin >= 1440) timeText = `${Math.floor(diffMin / 1440)} days ago`;

      let type = "success";
      if (l.action.includes("DISPUTE") || l.action.includes("FLAG")) type = "danger";
      else if (l.action.includes("MUTATION") || l.action.includes("UPDATE")) type = "warning";

      return {
        ...l,
        relativeTime: timeText,
        type
      };
    });

    res.json({ success: true, logs: formatted });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ success: false, message: "Server error fetching audit logs." });
  }
});

export default router;
