# 🇮🇳 Bharat Bhoomi

> **National Land Records & Governance Portal — Full-Stack Application**

Bharat Bhoomi is a comprehensive, production-ready web platform that unifies land governance, cadastral parcel mapping, title mutation, cross-department verification, and citizen grievance resolution into a single digital ecosystem.

Built with **React 18 + Vite** on the frontend, **Node.js + Express** on the backend, and **SQLite (`better-sqlite3`)** for persistent, zero-config relational storage.

---

## 🌟 Key Features

### 1. 🔍 National Land Records & Parcel Search (`/search`)
- Search millions of cadastral land parcels by **Survey Number** (e.g. `123/4`), **Owner Name**, **Village**, or **ULPIN** (Unique Land Parcel Identification Number).
- Filter seamlessly by **State**, **District**, and **Land Classification** (Agricultural, Residential, Commercial, Industrial, Forest).
- Interactive **Digital Record of Rights (RoR / Khatauni / 7/12)** inspection sheet with title holders, co-owners, valuation, tax payment status, and encumbrance/legal dispute details.
- Printable/downloadable official RoR certificate format with Government watermark.

### 2. 🏛️ Department Integration & Officer Command Center (`/dashboard`)
- Multi-department officer portal supporting:
  - **Revenue Department** (SDM, Tehsildar)
  - **Survey & Settlement Department** (Cadastral & DGPS realignments)
  - **Registration & Stamps Department** (Sub-Registrar deeds)
  - **Panchayati Raj & Urban Local Bodies**
- **Live Statistics & State Cadastre Matrix**: Real-time parcel count, monthly mutation volume, pending verifications, and active disputes across Indian states.
- **Add New Land Parcel**: Form to register new parcels with automatic ULPIN generation, area calculations, and immutable audit logging.
- **Ownership Mutation Engine**: Title transfer recording (Sale Deed, Inheritance, Family Partition, Gift Deed) with automated ledger updating.
- **Dispute & Grievance Manager**: Inter-departmental investigation workflow to inspect boundary overlaps, flag court litigation, or resolve citizen grievances.
- **Audit Ledger**: Comprehensive, tamper-proof record of every change, officer action, and login event.

### 3. 📝 Citizen Grievance, Feedback & Live Tracking (`/help/feedback`)
- Citizen grievance submission with file attachment support and department auto-routing.
- Generates a real tracking Reference ID (e.g. `BB-89210341`).
- **Live Tracking System**: Citizens can enter their Reference ID to view a multi-stage timeline (Submitted → Under Review → In Progress → Resolved) along with official department remarks and directions.

### 4. 🔐 Authentication & Role-Based Access Control (`/login`)
- **JWT (JSON Web Token)** authentication with bcrypt password hashing.
- Role-based views:
  - `citizen`: Search public records, view/print RoR certificates, submit & track grievances.
  - `officer`: Department-level administrative actions, record verification, mutation execution, dispute resolution.
  - `admin`: National-level configuration and audit review.
- **Quick Demo Logins**: 1-click test buttons for Revenue Officer, Survey Officer, and Citizen accounts.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/SumitGupta-27/Bharat-Bhoomi.git
cd Bharat-Bhoomi

# Install dependencies
npm install --legacy-peer-deps
```

### Running the Application
To run both the **Backend API Server (port 5000)** and the **Vite Frontend (port 5173)** concurrently:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Useful Commands
```bash
# Run only the backend API server (port 5000)
npm run server

# Re-seed the SQLite database with fresh sample data
npm run seed

# Run the automated backend test suite
node server/test-api.js

# Build production bundle
npm run build
```

---

## 🔑 Demo Accounts

For testing and demonstration, the database comes pre-seeded with the following accounts:

| Role | Username / Email | Password | Department / Notes |
| :--- | :--- | :--- | :--- |
| **Revenue Officer (SDM)** | `officer.revenue` | `Password123!` | Revenue Department, Agra |
| **Survey Officer** | `officer.survey` | `Password123!` | Survey & Settlement Dept |
| **Sub-Registrar** | `officer.registration` | `Password123!` | Registration & Stamps Dept |
| **Panchayat Officer** | `officer.panchayat` | `Password123!` | Panchayati Raj Dept |
| **Portal Administrator** | `admin` | `Admin123!` | Ministry of Rural Development |
| **Citizen (Rahul Sharma)** | `citizen.rahul` | `Password123!` | Public Citizen Account |
| **Citizen (Priya Patel)** | `citizen.priya` | `Password123!` | Public Citizen Account |

> *Tip: You can also use the **Quick Demo Logins** bar directly on the [Login Page](/login).*

---

## 🗄️ Database Architecture

The backend utilizes **SQLite** (`server/data/bhoomi.sqlite`) configured in WAL mode:

- `users`: Credentials, roles (`citizen`, `officer`, `admin`), departments, and designations.
- `land_parcels`: Cadastral data, ULPIN, survey numbers, coordinates, ownership, valuation, tax status, verification badges, and dispute flags.
- `mutations`: Immutable title transfer history linked to each parcel.
- `grievances`: Citizen requests, reference IDs (`BB-XXXXXXXX`), department routing, statuses, and officer resolution notes.
- `audit_logs`: Timestamped ledger of all system edits and mutations.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new citizen account | No |
| `POST` | `/api/auth/login` | Citizen or Officer authentication | No |
| `GET` | `/api/auth/me` | Current authenticated session profile | Yes (Bearer) |
| `GET` | `/api/parcels` | Query and filter cadastral records | No |
| `GET` | `/api/parcels/:id` | Full parcel details & mutation history | No |
| `POST` | `/api/parcels` | Register new land parcel | Officer only |
| `PUT` | `/api/parcels/:id` | Update parcel attributes | Officer only |
| `POST` | `/api/parcels/:id/mutate` | Execute ownership title transfer | Officer only |
| `POST` | `/api/parcels/:id/verify` | Mark record as officially verified | Officer only |
| `POST` | `/api/parcels/:id/dispute` | Flag dispute or update litigation | Officer only |
| `POST` | `/api/grievances` | Submit citizen grievance / feedback | No |
| `GET` | `/api/grievances/track/:refId` | Public grievance status tracking | No |
| `GET` | `/api/grievances` | List grievances for department | Officer only |
| `PATCH` | `/api/grievances/:id` | Update status & resolution notes | Officer only |
| `GET` | `/api/stats` | Global analytics & department metrics | No |
| `GET` | `/api/stats/state/:stateName` | State cadastre breakdown | No |
| `GET` | `/api/audit-logs` | Chronological activity feed | No |
| `GET` | `/api/users` | Officer and citizen directory | Officer only |

---

## 🇮🇳 Government of India Standards Compliance
- Adheres to the **National Land Records Modernization Programme (NLRMP)** guidelines.
- Standardized **ULPIN** (Unique Land Parcel Identification Number) format.
- Multi-tier department integration covering Revenue, Registration, Survey, and Local Bodies.