import express from "express";
import db from "../database.js";
import { requireAuth, requireOfficer } from "../middleware/auth.js";

const router = express.Router();

// Helper to generate ULPIN (Unique Land Parcel Identification Number)
function generateULPIN(state, district) {
  const stateCode = state.substring(0, 2).toUpperCase();
  const distCode = district.substring(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${stateCode}-${distCode}-${year}-${rand}`;
}

// GET /api/parcels - Search & filter land parcels
router.get("/", (req, res) => {
  try {
    const {
      state,
      district,
      tehsil,
      query,
      land_type,
      verification_status,
      dispute_status,
      limit = 50,
      offset = 0
    } = req.query;

    let sql = "SELECT * FROM land_parcels WHERE 1=1";
    const params = [];

    if (state && state !== "All States" && state !== "All") {
      sql += " AND state = ?";
      params.push(state);
    }

    if (district && district !== "All Districts" && district !== "All") {
      sql += " AND district = ?";
      params.push(district);
    }

    if (tehsil) {
      sql += " AND tehsil LIKE ?";
      params.push(`%${tehsil}%`);
    }

    if (land_type && land_type !== "All Types") {
      sql += " AND land_type = ?";
      params.push(land_type);
    }

    if (verification_status && verification_status !== "All Status") {
      sql += " AND verification_status = ?";
      params.push(verification_status);
    }

    if (dispute_status && dispute_status !== "All") {
      sql += " AND dispute_status = ?";
      params.push(dispute_status);
    }

    if (query && query.trim()) {
      const q = `%${query.trim()}%`;
      sql += " AND (survey_number LIKE ? OR owner_name LIKE ? OR ulpin LIKE ? OR village LIKE ?)";
      params.push(q, q, q, q);
    }

    // Count total matching
    const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total");
    const total = db.prepare(countSql).get(...params).total;

    // Sorting and Pagination
    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const parcels = db.prepare(sql).all(...params);

    // Parse JSON fields
    const formattedParcels = parcels.map(p => ({
      ...p,
      co_owners: p.co_owners ? JSON.parse(p.co_owners) : [],
      coordinates: p.coordinates ? JSON.parse(p.coordinates) : null
    }));

    res.json({
      success: true,
      total,
      limit: Number(limit),
      offset: Number(offset),
      parcels: formattedParcels
    });
  } catch (err) {
    console.error("Error fetching parcels:", err);
    res.status(500).json({ success: false, message: "Server error fetching land parcels." });
  }
});

// GET /api/parcels/:id - Get full parcel detail with mutation history
router.get("/:id", (req, res) => {
  try {
    const parcel = db.prepare("SELECT * FROM land_parcels WHERE id = ? OR ulpin = ?").get(req.params.id, req.params.id);
    if (!parcel) {
      return res.status(404).json({ success: false, message: "Land parcel not found." });
    }

    const mutations = db.prepare("SELECT * FROM mutations WHERE parcel_id = ? ORDER BY registered_date DESC").all(parcel.id);

    res.json({
      success: true,
      parcel: {
        ...parcel,
        co_owners: parcel.co_owners ? JSON.parse(parcel.co_owners) : [],
        coordinates: parcel.coordinates ? JSON.parse(parcel.coordinates) : null
      },
      mutations
    });
  } catch (err) {
    console.error("Error fetching parcel detail:", err);
    res.status(500).json({ success: false, message: "Server error fetching parcel details." });
  }
});

// POST /api/parcels - Create new land parcel (Officer / Admin)
router.post("/", requireOfficer, (req, res) => {
  try {
    const {
      survey_number,
      state,
      district,
      tehsil,
      village,
      owner_name,
      co_owners = [],
      land_type,
      area_acres,
      valuation_inr,
      tax_status = "Paid",
      coordinates
    } = req.body;

    if (!survey_number || !state || !district || !tehsil || !village || !owner_name || !land_type || !area_acres || !valuation_inr) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields." });
    }

    const area_sqft = Number(area_acres) * 43560;
    const ulpin = generateULPIN(state, district);

    const result = db.prepare(`
      INSERT INTO land_parcels (
        ulpin, survey_number, state, district, tehsil, village, owner_name, co_owners,
        land_type, area_sqft, area_acres, valuation_inr, tax_status, last_tax_paid_date,
        verification_status, verified_by_officer, verified_at, coordinates
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'), 'Verified', ?, CURRENT_TIMESTAMP, ?
      )
    `).run(
      ulpin,
      survey_number,
      state,
      district,
      tehsil,
      village,
      owner_name,
      JSON.stringify(co_owners),
      land_type,
      area_sqft,
      Number(area_acres),
      Number(valuation_inr),
      tax_status,
      `${req.user.full_name} (${req.user.department || "Officer"})`,
      coordinates ? JSON.stringify(coordinates) : null
    );

    const newParcelId = result.lastInsertRowid;

    // Log to audit trail
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'CREATE_PARCEL', 'parcel', ?, ?)
    `).run(
      req.user.id,
      req.user.full_name,
      req.user.role,
      req.user.department || "Revenue",
      String(newParcelId),
      `Registered new land parcel: Survey No. ${survey_number}, ${village}, ${district} (ULPIN: ${ulpin})`
    );

    res.status(201).json({
      success: true,
      message: "Land parcel created successfully.",
      parcelId: newParcelId,
      ulpin
    });
  } catch (err) {
    console.error("Error creating land parcel:", err);
    res.status(500).json({ success: false, message: "Server error creating land parcel." });
  }
});

// PUT /api/parcels/:id - Update parcel attributes (Officer / Admin)
router.put("/:id", requireOfficer, (req, res) => {
  try {
    const parcelId = req.params.id;
    const existing = db.prepare("SELECT * FROM land_parcels WHERE id = ?").get(parcelId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Land parcel not found." });
    }

    const {
      land_type,
      area_acres,
      valuation_inr,
      tax_status,
      dispute_status,
      dispute_details
    } = req.body;

    const area_sqft = area_acres ? Number(area_acres) * 43560 : existing.area_sqft;

    db.prepare(`
      UPDATE land_parcels
      SET land_type = COALESCE(?, land_type),
          area_acres = COALESCE(?, area_acres),
          area_sqft = ?,
          valuation_inr = COALESCE(?, valuation_inr),
          tax_status = COALESCE(?, tax_status),
          dispute_status = COALESCE(?, dispute_status),
          dispute_details = COALESCE(?, dispute_details),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      land_type || null,
      area_acres ? Number(area_acres) : null,
      area_sqft,
      valuation_inr ? Number(valuation_inr) : null,
      tax_status || null,
      dispute_status || null,
      dispute_details || null,
      parcelId
    );

    // Log to audit trail
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'UPDATE_PARCEL', 'parcel', ?, ?)
    `).run(
      req.user.id,
      req.user.full_name,
      req.user.role,
      req.user.department || "Revenue",
      String(parcelId),
      `Updated parcel records for Survey No. ${existing.survey_number} (${existing.village}, ${existing.district})`
    );

    res.json({ success: true, message: "Land parcel records updated successfully." });
  } catch (err) {
    console.error("Error updating land parcel:", err);
    res.status(500).json({ success: false, message: "Server error updating land parcel." });
  }
});

// POST /api/parcels/:id/mutate - Ownership transfer / mutation (Officer / Admin)
router.post("/:id/mutate", requireOfficer, (req, res) => {
  try {
    const parcelId = req.params.id;
    const parcel = db.prepare("SELECT * FROM land_parcels WHERE id = ?").get(parcelId);
    if (!parcel) {
      return res.status(404).json({ success: false, message: "Land parcel not found." });
    }

    const { new_owner, type, remarks } = req.body;
    if (!new_owner || !type) {
      return res.status(400).json({ success: false, message: "New owner name and mutation type are required." });
    }

    const previous_owner = parcel.owner_name;
    const mutationNumber = `MUT-${new Date().getFullYear()}-${parcel.state.substring(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Begin mutation transaction
    const executeMutation = db.transaction(() => {
      // 1. Insert mutation record
      db.prepare(`
        INSERT INTO mutations (
          parcel_id, mutation_number, type, previous_owner, new_owner,
          registered_date, executing_department, officer_name, status, remarks
        ) VALUES (?, ?, ?, ?, ?, date('now'), ?, ?, 'Approved', ?)
      `).run(
        parcelId,
        mutationNumber,
        type,
        previous_owner,
        new_owner,
        req.user.department || "Revenue Department",
        req.user.full_name,
        remarks || "Ownership transfer executed upon verification of registered deed."
      );

      // 2. Update parcel owner
      db.prepare(`
        UPDATE land_parcels
        SET owner_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(new_owner, parcelId);

      // 3. Log audit
      db.prepare(`
        INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
        VALUES (?, ?, ?, ?, 'MUTATION', 'parcel', ?, ?)
      `).run(
        req.user.id,
        req.user.full_name,
        req.user.role,
        req.user.department || "Revenue",
        String(parcelId),
        `Ownership mutated: Survey No. ${parcel.survey_number} transferred from "${previous_owner}" to "${new_owner}" (${type})`
      );
    });

    executeMutation();

    res.json({
      success: true,
      message: `Ownership mutation completed successfully. Mutation No: ${mutationNumber}`,
      mutationNumber,
      new_owner
    });
  } catch (err) {
    console.error("Error executing mutation:", err);
    res.status(500).json({ success: false, message: "Server error executing mutation." });
  }
});

// POST /api/parcels/:id/verify - Verify parcel (Officer / Admin)
router.post("/:id/verify", requireOfficer, (req, res) => {
  try {
    const parcelId = req.params.id;
    const parcel = db.prepare("SELECT * FROM land_parcels WHERE id = ?").get(parcelId);
    if (!parcel) {
      return res.status(404).json({ success: false, message: "Land parcel not found." });
    }

    db.prepare(`
      UPDATE land_parcels
      SET verification_status = 'Verified',
          verified_by_officer = ?,
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(`${req.user.full_name} (${req.user.designation || req.user.department || "Officer"})`, parcelId);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'VERIFY_PARCEL', 'parcel', ?, ?)
    `).run(
      req.user.id,
      req.user.full_name,
      req.user.role,
      req.user.department || "Revenue",
      String(parcelId),
      `Verified land record: Survey No. ${parcel.survey_number}, ${parcel.village} (${parcel.district}, ${parcel.state})`
    );

    res.json({ success: true, message: `Parcel Survey No. ${parcel.survey_number} verified successfully.` });
  } catch (err) {
    console.error("Error verifying parcel:", err);
    res.status(500).json({ success: false, message: "Server error verifying parcel." });
  }
});

// POST /api/parcels/:id/dispute - Flag or resolve dispute (Officer / Admin)
router.post("/:id/dispute", requireOfficer, (req, res) => {
  try {
    const parcelId = req.params.id;
    const parcel = db.prepare("SELECT * FROM land_parcels WHERE id = ?").get(parcelId);
    if (!parcel) {
      return res.status(404).json({ success: false, message: "Land parcel not found." });
    }

    const { dispute_status, dispute_details } = req.body;
    if (!dispute_status) {
      return res.status(400).json({ success: false, message: "Dispute status is required." });
    }

    db.prepare(`
      UPDATE land_parcels
      SET dispute_status = ?,
          dispute_details = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(dispute_status, dispute_details || null, parcelId);

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, 'DISPUTE_STATUS_CHANGE', 'parcel', ?, ?)
    `).run(
      req.user.id,
      req.user.full_name,
      req.user.role,
      req.user.department || "Revenue",
      String(parcelId),
      `Dispute status updated to "${dispute_status}" for Survey No. ${parcel.survey_number}`
    );

    res.json({ success: true, message: `Dispute status updated to ${dispute_status}.` });
  } catch (err) {
    console.error("Error updating dispute:", err);
    res.status(500).json({ success: false, message: "Server error updating dispute status." });
  }
});

export default router;
