import bcrypt from "bcryptjs";
import db, { initDatabase } from "./database.js";

export function seedDatabase() {
  initDatabase();

  // Check if already seeded
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  if (userCount > 0) {
    console.log("Database already seeded with users and records.");
    return;
  }

  console.log("Seeding Bharat Bhoomi database with initial records...");

  const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);

  // 1. Seed Users (Officers, Admins, Citizens)
  const insertUser = db.prepare(`
    INSERT INTO users (username, email, password_hash, full_name, phone, role, department, designation)
    VALUES (@username, @email, @password_hash, @full_name, @phone, @role, @department, @designation)
  `);

  const users = [
    {
      username: "admin",
      email: "admin@bhoomi.gov.in",
      password_hash: hashPassword("Admin123!"),
      full_name: "Admin Officer",
      phone: "+91 98765 43210",
      role: "admin",
      department: "Ministry of Rural Development",
      designation: "National Portal Administrator",
    },
    {
      username: "officer.revenue",
      email: "officer.revenue@bhoomi.gov.in",
      password_hash: hashPassword("Password123!"),
      full_name: "Rajeshwar Pratap Singh",
      phone: "+91 98111 22334",
      role: "officer",
      department: "Revenue Department",
      designation: "Sub-Divisional Magistrate (SDM), Agra",
    },
    {
      username: "officer.survey",
      email: "officer.survey@bhoomi.gov.in",
      password_hash: hashPassword("Password123!"),
      full_name: "Amitabh Sen",
      phone: "+91 98222 33445",
      role: "officer",
      department: "Survey & Settlement Department",
      designation: "Chief Settlement Officer, UP",
    },
    {
      username: "officer.registration",
      email: "officer.registration@bhoomi.gov.in",
      password_hash: hashPassword("Password123!"),
      full_name: "Sunita Deshmukh",
      phone: "+91 98333 44556",
      role: "officer",
      department: "Registration & Stamps Department",
      designation: "Sub-Registrar, Aligarh",
    },
    {
      username: "officer.panchayat",
      email: "officer.panchayat@bhoomi.gov.in",
      password_hash: hashPassword("Password123!"),
      full_name: "Virendra Kumar",
      phone: "+91 98444 55667",
      role: "officer",
      department: "Panchayati Raj Department",
      designation: "District Panchayat Officer",
    },
    {
      username: "citizen.rahul",
      email: "rahul.sharma@example.com",
      password_hash: hashPassword("Password123!"),
      full_name: "Rahul Sharma",
      phone: "+91 98765 12345",
      role: "citizen",
      department: null,
      designation: null,
    },
    {
      username: "citizen.priya",
      email: "priya.patel@example.com",
      password_hash: hashPassword("Password123!"),
      full_name: "Priya Patel",
      phone: "+91 98765 67890",
      role: "citizen",
      department: null,
      designation: null,
    }
  ];

  for (const u of users) {
    insertUser.run(u);
  }

  // 2. Seed Land Parcels
  const insertParcel = db.prepare(`
    INSERT INTO land_parcels (
      ulpin, survey_number, state, district, tehsil, village, owner_name, co_owners,
      land_type, area_sqft, area_acres, valuation_inr, tax_status, last_tax_paid_date,
      verification_status, verified_by_officer, verified_at, dispute_status, dispute_details, coordinates
    ) VALUES (
      @ulpin, @survey_number, @state, @district, @tehsil, @village, @owner_name, @co_owners,
      @land_type, @area_sqft, @area_acres, @valuation_inr, @tax_status, @last_tax_paid_date,
      @verification_status, @verified_by_officer, @verified_at, @dispute_status, @dispute_details, @coordinates
    )
  `);

  const parcels = [
    {
      ulpin: "UP-AGR-2024-001234",
      survey_number: "123/4",
      state: "Uttar Pradesh",
      district: "Agra",
      tehsil: "Etmadpur",
      village: "Phalera",
      owner_name: "Rameshwar Singh",
      co_owners: JSON.stringify(["Geeta Devi Singh", "Suresh Singh"]),
      land_type: "Agricultural",
      area_sqft: 104544,
      area_acres: 2.4,
      valuation_inr: 4800000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-03-15",
      verification_status: "Verified",
      verified_by_officer: "Rajeshwar Pratap Singh (SDM)",
      verified_at: "2024-02-10 11:30:00",
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 27.2345, lng: 78.1256 })
    },
    {
      ulpin: "UP-ALG-2024-000587",
      survey_number: "58/7",
      state: "Uttar Pradesh",
      district: "Aligarh",
      tehsil: "Koil",
      village: "Tehsil Gram",
      owner_name: "Anjali Gupta",
      co_owners: JSON.stringify(["Vikram Gupta"]),
      land_type: "Residential",
      area_sqft: 34848,
      area_acres: 0.8,
      valuation_inr: 6500000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-05-20",
      verification_status: "Verified",
      verified_by_officer: "Sunita Deshmukh (Sub-Registrar)",
      verified_at: "2024-05-18 14:15:00",
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 27.8974, lng: 78.088 })
    },
    {
      ulpin: "UP-AKB-2024-000501",
      survey_number: "50/1",
      state: "Uttar Pradesh",
      district: "Agra",
      tehsil: "Fatehabad",
      village: "Barhanpur",
      owner_name: "Mahendra Yadav",
      co_owners: JSON.stringify([]),
      land_type: "Commercial",
      area_sqft: 52272,
      area_acres: 1.2,
      valuation_inr: 12500000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-06-01",
      verification_status: "Verified",
      verified_by_officer: "Rajeshwar Pratap Singh (SDM)",
      verified_at: "2024-06-01 10:00:00",
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 27.0984, lng: 78.312 })
    },
    {
      ulpin: "UP-AGR-2024-000128",
      survey_number: "12/8",
      state: "Uttar Pradesh",
      district: "Agra",
      tehsil: "Etmadpur",
      village: "Phalera",
      owner_name: "Harish Chandra",
      co_owners: JSON.stringify(["Kailash Chandra", "Subhash Chandra"]),
      land_type: "Agricultural",
      area_sqft: 152460,
      area_acres: 3.5,
      valuation_inr: 7200000,
      tax_status: "Pending",
      last_tax_paid_date: "2023-01-10",
      verification_status: "Flagged",
      verified_by_officer: null,
      verified_at: null,
      dispute_status: "Active Dispute",
      dispute_details: "Overlapping boundary claim filed by owner of adjacent Survey No. 12/9. SDM hearing scheduled.",
      coordinates: JSON.stringify({ lat: 27.2412, lng: 78.1345 })
    },
    {
      ulpin: "MH-PUN-2024-009841",
      survey_number: "184/2",
      state: "Maharashtra",
      district: "Pune",
      tehsil: "Haveli",
      village: "Wagholi",
      owner_name: "Shantanu Kulkarni",
      co_owners: JSON.stringify(["Meera Kulkarni"]),
      land_type: "Residential",
      area_sqft: 21780,
      area_acres: 0.5,
      valuation_inr: 18000000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-04-11",
      verification_status: "Verified",
      verified_by_officer: "Amitabh Sen",
      verified_at: "2024-04-12 16:00:00",
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 18.5793, lng: 73.9832 })
    },
    {
      ulpin: "KA-BLR-2024-004512",
      survey_number: "45/A",
      state: "Karnataka",
      district: "Bengaluru Urban",
      tehsil: "Anekal",
      village: "Sarjapur",
      owner_name: "Naveen Gowda",
      co_owners: JSON.stringify([]),
      land_type: "Commercial",
      area_sqft: 43560,
      area_acres: 1.0,
      valuation_inr: 35000000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-03-30",
      verification_status: "Verified",
      verified_by_officer: "Virendra Kumar",
      verified_at: "2024-04-01 09:45:00",
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 12.8601, lng: 77.7865 })
    },
    {
      ulpin: "GJ-AHM-2024-007812",
      survey_number: "102/3",
      state: "Gujarat",
      district: "Ahmedabad",
      tehsil: "Daskroi",
      village: "Bopal",
      owner_name: "Bhavin Patel",
      co_owners: JSON.stringify(["Nita Patel"]),
      land_type: "Residential",
      area_sqft: 26136,
      area_acres: 0.6,
      valuation_inr: 14200000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-02-28",
      verification_status: "Verified",
      verified_by_officer: "Sunita Deshmukh",
      verified_at: "2024-03-01 12:00:00",
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 23.0338, lng: 72.4633 })
    },
    {
      ulpin: "RJ-JAI-2024-003319",
      survey_number: "77/5",
      state: "Rajasthan",
      district: "Jaipur",
      tehsil: "Sanganer",
      village: "Muhana",
      owner_name: "Ramavtar Meena",
      co_owners: JSON.stringify(["Kishan Meena"]),
      land_type: "Agricultural",
      area_sqft: 217800,
      area_acres: 5.0,
      valuation_inr: 9500000,
      tax_status: "Paid",
      last_tax_paid_date: "2024-01-22",
      verification_status: "Pending Verification",
      verified_by_officer: null,
      verified_at: null,
      dispute_status: "Clear",
      dispute_details: null,
      coordinates: JSON.stringify({ lat: 26.8123, lng: 75.7421 })
    },
    {
      ulpin: "BR-PAT-2024-006214",
      survey_number: "91/2",
      state: "Bihar",
      district: "Patna",
      tehsil: "Danapur",
      village: "Khagaul",
      owner_name: "Dharmendra Kumar Jha",
      co_owners: JSON.stringify([]),
      land_type: "Residential",
      area_sqft: 17424,
      area_acres: 0.4,
      valuation_inr: 5800000,
      tax_status: "Pending",
      last_tax_paid_date: "2023-08-14",
      verification_status: "Pending Verification",
      verified_by_officer: null,
      verified_at: null,
      dispute_status: "Active Dispute",
      dispute_details: "Heirship dispute pending in District Civil Court regarding will validity.",
      coordinates: JSON.stringify({ lat: 25.5823, lng: 85.0451 })
    }
  ];

  for (const p of parcels) {
    insertParcel.run(p);
  }

  // 3. Seed Mutations (Ownership History)
  const insertMutation = db.prepare(`
    INSERT INTO mutations (
      parcel_id, mutation_number, type, previous_owner, new_owner,
      registered_date, executing_department, officer_name, status, remarks
    ) VALUES (
      @parcel_id, @mutation_number, @type, @previous_owner, @new_owner,
      @registered_date, @executing_department, @officer_name, @status, @remarks
    )
  `);

  const mutations = [
    {
      parcel_id: 1,
      mutation_number: "MUT-2024-UP-00104",
      type: "Inheritance",
      previous_owner: "Balkishan Singh (Late)",
      new_owner: "Rameshwar Singh",
      registered_date: "2024-01-15",
      executing_department: "Revenue Department",
      officer_name: "Rajeshwar Pratap Singh (SDM)",
      status: "Approved",
      remarks: "Mutation granted on basis of succession certificate No. SC-2023-908."
    },
    {
      parcel_id: 2,
      mutation_number: "MUT-2024-UP-00219",
      type: "Sale Deed",
      previous_owner: "Satish Kumar Sharma",
      new_owner: "Anjali Gupta",
      registered_date: "2024-05-18",
      executing_department: "Registration & Stamps Department",
      officer_name: "Sunita Deshmukh (Sub-Registrar)",
      status: "Approved",
      remarks: "Registered Sale Deed Vol. 412, Page 88-94 with full stamp duty paid."
    },
    {
      parcel_id: 5,
      mutation_number: "MUT-2024-MH-00088",
      type: "Sale Deed",
      previous_owner: "Dilip Gaikwad",
      new_owner: "Shantanu Kulkarni",
      registered_date: "2024-04-10",
      executing_department: "Registration & Stamps Department",
      officer_name: "Amitabh Sen",
      status: "Approved",
      remarks: "Clear title deed verified against Talathi records."
    }
  ];

  for (const m of mutations) {
    insertMutation.run(m);
  }

  // 4. Seed Grievances
  const insertGrievance = db.prepare(`
    INSERT INTO grievances (
      reference_id, full_name, email, phone, category, request_type,
      subject, description, status, assigned_department, officer_notes
    ) VALUES (
      @reference_id, @full_name, @email, @phone, @category, @request_type,
      @subject, @description, @status, @assigned_department, @officer_notes
    )
  `);

  const grievances = [
    {
      reference_id: "BB-89210341",
      full_name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 12345",
      category: "Revenue Department",
      request_type: "Grievance",
      subject: "Delay in issuance of mutation certificate for Survey 123/4",
      description: "Applied for mutation 45 days ago at Etmadpur Tehsil. Application acknowledgement was received but status has remained pending without inspection.",
      status: "In Progress",
      assigned_department: "Revenue Department",
      officer_notes: "Forwarded to Naib Tehsildar Etmadpur for immediate field spot inspection on Monday."
    },
    {
      reference_id: "BB-76431902",
      full_name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 98765 67890",
      category: "Survey & Settlement Department",
      request_type: "Report Incorrect Information",
      subject: "Boundary coordinates mismatch on GIS map for Survey 102/3",
      description: "The digital boundary shown on the web portal clips into the village access road by 4 meters. Request re-survey and GIS boundary realignment.",
      status: "Under Review",
      assigned_department: "Survey & Settlement Department",
      officer_notes: "Survey team assigned to re-verify using DGPS coordinates."
    },
    {
      reference_id: "BB-55291044",
      full_name: "Vikram Malhotra",
      email: "vikram.m@example.com",
      phone: "+91 98111 99887",
      category: "Registration & Stamps Department",
      request_type: "Service Request",
      subject: "Certified copy of registered sale deed from 2019",
      description: "Need digital certified copy of registered deed volume 218 for bank loan processing.",
      status: "Resolved",
      assigned_department: "Registration & Stamps Department",
      officer_notes: "Digitized certificate generated and sent to citizen email."
    }
  ];

  for (const g of grievances) {
    insertGrievance.run(g);
  }

  // 5. Seed Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (user_id, user_name, role, department, action, target_type, target_id, details, timestamp)
    VALUES (@user_id, @user_name, @role, @department, @action, @target_type, @target_id, @details, @timestamp)
  `);

  const auditLogs = [
    {
      user_id: 2,
      user_name: "Rajeshwar Pratap Singh",
      role: "officer",
      department: "Revenue Department",
      action: "UPDATE_PARCEL",
      target_type: "parcel",
      target_id: "1",
      details: "Land record updated – Survey No. 123/4 (Phalera Office, Agra, UP)",
      timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString().replace("T", " ").substring(0, 19)
    },
    {
      user_id: 4,
      user_name: "Sunita Deshmukh",
      role: "officer",
      department: "Registration & Stamps Department",
      action: "MUTATION",
      target_type: "parcel",
      target_id: "2",
      details: "Ownership updated – Survey No. 58/7 (Tehsil Office, Aligarh)",
      timestamp: new Date(Date.now() - 16 * 60 * 1000).toISOString().replace("T", " ").substring(0, 19)
    },
    {
      user_id: 2,
      user_name: "Rajeshwar Pratap Singh",
      role: "officer",
      department: "Revenue Department",
      action: "TAX_UPDATE",
      target_type: "parcel",
      target_id: "3",
      details: "Land tax updated – Survey No. 50/1 (Barhanpur Office, Akbarpur)",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString().replace("T", " ").substring(0, 19)
    },
    {
      user_id: 2,
      user_name: "Rajeshwar Pratap Singh",
      role: "officer",
      department: "Revenue Department",
      action: "FLAG_DISPUTE",
      target_type: "parcel",
      target_id: "4",
      details: "Dispute flagged – Survey No. 12/8 (Phalera Office, Agra, UP)",
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString().replace("T", " ").substring(0, 19)
    }
  ];

  for (const a of auditLogs) {
    insertAudit.run(a);
  }

  console.log("Database successfully seeded with realistic national records!");
}

// If executed directly, run seed
if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase();
}
