import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the database directory exists
const dbDir = path.join(__dirname, "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "bhoomi.sqlite");
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize Schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'citizen', -- 'citizen', 'officer', 'admin'
      department TEXT,                     -- e.g. 'Revenue Department', 'Survey & Settlement Department'
      designation TEXT,                    -- e.g. 'Revenue Officer', 'Sub-Divisional Magistrate'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS land_parcels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ulpin TEXT UNIQUE NOT NULL,          -- Unique Land Parcel Identification Number
      survey_number TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      tehsil TEXT NOT NULL,
      village TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      co_owners TEXT DEFAULT '[]',         -- JSON array of co-owners
      owner_aadhaar_hash TEXT,
      land_type TEXT NOT NULL,             -- 'Agricultural', 'Residential', 'Commercial', 'Forest / Eco-sensitive', 'Industrial'
      area_sqft REAL NOT NULL,
      area_acres REAL NOT NULL,
      valuation_inr REAL NOT NULL,
      tax_status TEXT NOT NULL DEFAULT 'Paid', -- 'Paid', 'Pending', 'Exempted'
      last_tax_paid_date TEXT,
      verification_status TEXT NOT NULL DEFAULT 'Pending Verification', -- 'Verified', 'Pending Verification', 'Flagged'
      verified_by_officer TEXT,
      verified_at DATETIME,
      dispute_status TEXT NOT NULL DEFAULT 'Clear', -- 'Clear', 'Active Dispute', 'Litigation Pending', 'Boundary Overlap'
      dispute_details TEXT,
      coordinates TEXT,                    -- JSON object with lat, lng, polygon coordinates
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mutations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parcel_id INTEGER NOT NULL,
      mutation_number TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,                  -- 'Sale Deed', 'Inheritance', 'Partition', 'Gift Deed', 'Government Acquisition'
      previous_owner TEXT NOT NULL,
      new_owner TEXT NOT NULL,
      registered_date TEXT NOT NULL,
      executing_department TEXT NOT NULL,
      officer_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Approved', -- 'Approved', 'Under Review', 'Objected'
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parcel_id) REFERENCES land_parcels (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS grievances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      category TEXT NOT NULL,
      request_type TEXT NOT NULL,          -- 'Grievance', 'Feedback', 'Report Incorrect Information', 'Service Request'
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      attachment_filename TEXT,
      status TEXT NOT NULL DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'
      assigned_department TEXT NOT NULL,
      officer_notes TEXT,
      resolved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT,
      action TEXT NOT NULL,                -- e.g. 'CREATE_PARCEL', 'UPDATE_PARCEL', 'VERIFY_PARCEL', 'FLAG_DISPUTE', 'MUTATION', 'UPDATE_GRIEVANCE'
      target_type TEXT NOT NULL,           -- 'parcel', 'grievance', 'user'
      target_id TEXT NOT NULL,
      details TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for fast searching
    CREATE INDEX IF NOT EXISTS idx_parcels_survey ON land_parcels (survey_number);
    CREATE INDEX IF NOT EXISTS idx_parcels_state_dist ON land_parcels (state, district);
    CREATE INDEX IF NOT EXISTS idx_parcels_owner ON land_parcels (owner_name);
    CREATE INDEX IF NOT EXISTS idx_parcels_ulpin ON land_parcels (ulpin);
    CREATE INDEX IF NOT EXISTS idx_grievances_ref ON grievances (reference_id);
    CREATE INDEX IF NOT EXISTS idx_grievances_dept ON grievances (assigned_department);
    CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs (timestamp DESC);
  `);
}

export default db;
