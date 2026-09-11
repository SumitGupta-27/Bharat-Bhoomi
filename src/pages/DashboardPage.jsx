import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import "./DashboardPage.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "records",   label: "Land Records" },
  { id: "search",    label: "Land Parcel Search" },
  { id: "update",    label: "Update Records" },
  { id: "dispute",   label: "Dispute / Grievance" },
  { id: "reports",   label: "Reports & Analytics", hasChevron: true },
  { id: "users",     label: "Users & Roles" },
  { id: "notify",    label: "Notifications" },
  { id: "audit",     label: "Audit Logs" },
  { id: "settings",  label: "Settings" },
  { id: "help",      label: "Help & Support", path: "/help" },
  { id: "logout",    label: "Logout" },
];

const STATES = [
  "Uttar Pradesh", "Maharashtra", "Karnataka", "Gujarat",
  "Rajasthan", "Bihar", "Madhya Pradesh", "Tamil Nadu",
  "Andhra Pradesh", "Telangana",
];

export default function DashboardPage() {
  const { user, isOfficer, login, logout } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(true);
  const [selectedState, setSelState] = useState("Uttar Pradesh");
  const [dropOpen, setDropOpen] = useState(false);

  // Live Data States
  const [stats, setStats] = useState(null);
  const [stateSummary, setStateSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [parcelsLoading, setParcelsLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Filters for Records Table
  const [recordSearch, setRecordSearch] = useState("");
  const [recordStateFilter, setRecordStateFilter] = useState("All States");
  const [recordStatusFilter, setRecordStatusFilter] = useState("All Status");

  // Form States for "Update Records"
  const [updateSubTab, setUpdateSubTab] = useState("create"); // 'create' | 'mutate'
  const [newParcel, setNewParcel] = useState({
    survey_number: "",
    state: "Uttar Pradesh",
    district: "Agra",
    tehsil: "Etmadpur",
    village: "",
    owner_name: "",
    co_owners: "",
    land_type: "Agricultural",
    area_acres: "",
    valuation_inr: "",
    tax_status: "Paid",
  });
  const [createSuccess, setCreateSuccess] = useState("");

  const [mutationData, setMutationData] = useState({
    parcel_id: "",
    new_owner: "",
    type: "Sale Deed",
    remarks: "",
  });
  const [mutateSuccess, setMutateSuccess] = useState("");

  // Dispute / Grievance Resolution State
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [grievanceNotes, setGrievanceNotes] = useState("");
  const [grievanceStatus, setGrievanceStatus] = useState("Resolved");

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardStats();
    loadStateSummary(selectedState);
    loadRecentActivities();
  }, []);

  useEffect(() => {
    loadStateSummary(selectedState);
  }, [selectedState]);

  // Load section-specific data when tab changes
  useEffect(() => {
    if (active === "records" || active === "search") {
      loadParcels();
    } else if (active === "dispute") {
      loadGrievances();
      loadParcels();
    } else if (active === "users") {
      loadUsers();
    } else if (active === "audit") {
      loadAuditLogs();
    }
  }, [active]);

  async function loadDashboardStats() {
    try {
      const res = await api.getStats();
      if (res.success) setStats(res.stats);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadStateSummary(stateName) {
    try {
      const res = await api.getStateStats(stateName);
      if (res.success) setStateSummary(res);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadRecentActivities() {
    try {
      const res = await api.getAuditLogs({ limit: 10 });
      if (res.success) setActivities(res.logs);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadParcels() {
    setParcelsLoading(true);
    try {
      const res = await api.getParcels({
        query: recordSearch,
        state: recordStateFilter !== "All States" ? recordStateFilter : undefined,
        verification_status: recordStatusFilter !== "All Status" ? recordStatusFilter : undefined,
        limit: 100,
      });
      if (res.success) setParcels(res.parcels);
    } catch (e) {
      console.error(e);
    } finally {
      setParcelsLoading(false);
    }
  }

  async function loadGrievances() {
    try {
      const res = await api.getGrievances({ limit: 50 });
      if (res.success) setGrievances(res.grievances);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadUsers() {
    try {
      const res = await api.getUsers();
      if (res.success) setUsersList(res.users);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadAuditLogs() {
    try {
      const res = await api.getAuditLogs({ limit: 50 });
      if (res.success) setAuditLogs(res.logs);
    } catch (e) {
      console.error(e);
    }
  }

  // Action Handlers
  async function handleVerifyParcel(id) {
    try {
      const res = await api.verifyParcel(id);
      if (res.success) {
        alert(res.message);
        loadParcels();
        loadDashboardStats();
        loadRecentActivities();
      }
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleCreateParcel(e) {
    e.preventDefault();
    setCreateSuccess("");
    try {
      const coOwnersArr = newParcel.co_owners
        ? newParcel.co_owners.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const res = await api.createParcel({
        ...newParcel,
        co_owners: coOwnersArr,
      });
      if (res.success) {
        setCreateSuccess(`✅ Land parcel registered successfully! ULPIN: ${res.ulpin}`);
        setNewParcel({
          survey_number: "",
          state: "Uttar Pradesh",
          district: "Agra",
          tehsil: "Etmadpur",
          village: "",
          owner_name: "",
          co_owners: "",
          land_type: "Agricultural",
          area_acres: "",
          valuation_inr: "",
          tax_status: "Paid",
        });
        loadDashboardStats();
        loadRecentActivities();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleExecuteMutation(e) {
    e.preventDefault();
    setMutateSuccess("");
    if (!mutationData.parcel_id) {
      alert("Please select a parcel to mutate.");
      return;
    }
    try {
      const res = await api.mutateParcel(mutationData.parcel_id, {
        new_owner: mutationData.new_owner,
        type: mutationData.type,
        remarks: mutationData.remarks,
      });
      if (res.success) {
        setMutateSuccess(`✅ ${res.message}`);
        setMutationData({ parcel_id: "", new_owner: "", type: "Sale Deed", remarks: "" });
        loadDashboardStats();
        loadRecentActivities();
        loadParcels();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleUpdateGrievanceStatus(e) {
    e.preventDefault();
    if (!selectedGrievance) return;
    try {
      const res = await api.updateGrievance(selectedGrievance.id, {
        status: grievanceStatus,
        officer_notes: grievanceNotes,
      });
      if (res.success) {
        alert(res.message);
        setSelectedGrievance(null);
        setGrievanceNotes("");
        loadGrievances();
        loadDashboardStats();
        loadRecentActivities();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  function handleNav(item) {
    if (item.id === "logout") {
      logout();
      navigate("/");
      return;
    }
    if (item.id === "help") {
      navigate("/help");
      return;
    }
    setActive(item.id);
  }

  // Quick Demo Login helper if officer is not yet logged in
  async function handleDemoLogin() {
    try {
      await login({
        username: "officer.revenue",
        password: "Password123!",
        department: "Revenue Department",
        role: "officer",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="db-shell">
      {/* Sidebar */}
      <aside className={`db-sidebar ${sidebarOpen ? "" : "db-sidebar--collapsed"}`}>
        <div className="db-sidebar__brand">
          <img src="/images/Emblem_of_India_black.svg" alt="" className="db-brand-logo" />
          {sidebarOpen && (
            <span className="db-brand-text">
              <span className="db-brand-name">Bharat Bhoomi</span>
              <span className="db-brand-sub">Officer Command Center</span>
            </span>
          )}
        </div>
        <nav className="db-sidebar__nav" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`db-nav-item ${active === item.id ? "db-nav-item--active" : ""}`}
              onClick={() => handleNav(item)}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className="db-nav-icon">{NAV_ICONS[item.id] || <GridIcon />}</span>
              {sidebarOpen && <span className="db-nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar__left">
            <button className="db-topbar__toggle" onClick={() => setSidebar((o) => !o)} aria-label="Toggle sidebar">
              <HamburgerIcon />
            </button>
            <h1 className="db-page-title">
              {NAV_ITEMS.find((n) => n.id === active)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="db-topbar__right">
            <Link to="/search" className="btn btn--outline btn--sm" style={{ marginRight: 8 }}>
              Public Search →
            </Link>
            {user ? (
              <div className="db-admin-btn">
                <span className="db-admin-avatar">{user.full_name[0] || "O"}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="db-admin-name">{user.full_name}</span>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>{user.department || "Revenue"}</span>
                </div>
              </div>
            ) : (
              <button className="btn btn--primary btn--sm" onClick={handleDemoLogin}>
                ⚡ Demo Officer Login
              </button>
            )}
          </div>
        </header>

        <div className="db-content">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {active === "dashboard" && (
            <>
              {/* Stats Row */}
              <div className="db-stats-row">
                <div className="db-stat-card" style={{ cursor: "pointer" }} onClick={() => setActive("records")}>
                  <p className="db-stat-label">Total Land Parcels (National)</p>
                  <p className="db-stat-value">{stats?.displayTotal || "12,45,678"}</p>
                </div>
                <div className="db-stat-card">
                  <p className="db-stat-label">Records Updated (This Month)</p>
                  <p className="db-stat-value">{(stats?.recordsUpdatedMonth || 45678).toLocaleString("en-IN")}</p>
                </div>
                <div className="db-stat-card" style={{ cursor: "pointer" }} onClick={() => { setActive("records"); setRecordStatusFilter("Pending Verification"); }}>
                  <p className="db-stat-label">Pending Verifications</p>
                  <p className="db-stat-value db-stat-value--orange">{(stats?.pendingVerifications || 2345).toLocaleString("en-IN")}</p>
                </div>
                <div className="db-stat-card" style={{ cursor: "pointer" }} onClick={() => setActive("dispute")}>
                  <p className="db-stat-label">Active Disputes</p>
                  <p className="db-stat-value db-stat-value--orange">{(stats?.activeDisputes || 123).toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Middle Row */}
              <div className="db-mid-row">
                {/* Recent Activities */}
                <section className="db-card db-card--activities">
                  <h2 className="db-card__title">Recent System Activities</h2>
                  <ul className="db-activity-list">
                    {(activities.length > 0 ? activities.slice(0, 5) : DEFAULT_ACTIVITIES).map((a, i) => (
                      <li key={i} className="db-activity-item">
                        <span className={`db-activity-icon db-activity-icon--${a.type || "success"}`}>
                          {a.type === "danger" ? <DangerTriIcon /> : a.type === "warning" ? <WarnTriIcon /> : <CheckCircleIcon />}
                        </span>
                        <span className="db-activity-body">
                          <span className="db-activity-text">
                            <strong>{a.action || a.text}</strong> – {a.details || a.detail}
                          </span>
                          <span className="db-activity-office">{a.department || a.office || a.user_name}</span>
                        </span>
                        <span className="db-activity-time">{a.relativeTime || a.time || "Recent"}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="db-link-btn" onClick={() => setActive("audit")}>View Full Audit Ledger →</button>
                </section>

                {/* District Overview Map */}
                <section className="db-card db-card--map">
                  <div className="db-card__header">
                    <h2 className="db-card__title">GIS Cadastral Layer ({selectedState})</h2>
                    <Link to="/search" className="db-icon-btn" title="Open Map Search"><SearchIcon /></Link>
                  </div>
                  <div className="db-map-placeholder">
                    <UPMapSVG />
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="db-card db-card--actions">
                  <h2 className="db-card__title">Officer Quick Actions</h2>
                  <div className="db-quick-list">
                    <button className="db-quick-item" onClick={() => setActive("records")}>
                      <span className="db-quick-dot" /><span>Search Land Parcel</span>
                    </button>
                    <button className="db-quick-item" onClick={() => { setActive("update"); setUpdateSubTab("create"); }}>
                      <span className="db-quick-dot" /><span>Add New Land Record</span>
                    </button>
                    <button className="db-quick-item" onClick={() => { setActive("update"); setUpdateSubTab("mutate"); }}>
                      <span className="db-quick-dot" /><span>Mutate Ownership</span>
                    </button>
                    <button className="db-quick-item" onClick={() => setActive("dispute")}>
                      <span className="db-quick-dot" /><span>Resolve Grievances</span>
                    </button>
                  </div>
                </section>
              </div>

              {/* Bottom Row */}
              <div className="db-bot-row">
                <section className="db-card db-card--india">
                  <h2 className="db-card__title">State Cadastre Integration</h2>
                  <div className="db-india-inner">
                    <div className="db-india-map"><IndiaMapSVG /></div>
                    <div className="db-state-panel">
                      <div className="db-dropdown">
                        <button className="db-dropdown__btn" onClick={() => setDropOpen((o) => !o)}>
                          <span>{selectedState}</span><ChevronDownIcon />
                        </button>
                        {dropOpen && (
                          <ul className="db-dropdown__list">
                            {STATES.map((s) => (
                              <li
                                key={s}
                                className={`db-dropdown__option${selectedState === s ? " db-dropdown__option--active" : ""}`}
                                onClick={() => {
                                  setSelState(s);
                                  setDropOpen(false);
                                }}
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Link to={`/search?state=${encodeURIComponent(selectedState)}`} className="db-btn-outline">
                        View {selectedState} Records
                      </Link>
                    </div>
                  </div>
                </section>

                <section className="db-card db-card--summary">
                  <div className="db-summary-header">
                    <h2 className="db-card__title">Land Records Summary – {selectedState}</h2>
                    <div className="db-summary-map"><UPMapSmallSVG /></div>
                  </div>
                  <ul className="db-summary-list">
                    {(stateSummary?.summary || DEFAULT_UP_SUMMARY).map((row) => (
                      <li key={row.label} className="db-summary-row">
                        <span className={`db-summary-dot db-summary-dot--${row.color}`} />
                        <span className="db-summary-label">{row.label}</span>
                        <span className="db-summary-value">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="db-btn-outline db-btn-outline--sm" onClick={() => setActive("records")}>
                    Inspect District Parcels
                  </button>
                </section>
              </div>
            </>
          )}

          {/* TAB 2: LAND RECORDS & SEARCH */}
          {(active === "records" || active === "search") && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">Cadastral Land Records Ledger</h2>
                    <p className="db-panel-subtitle">Manage, verify, and inspect verified parcel records</p>
                  </div>
                  <button className="btn btn--primary btn--sm" onClick={() => { setActive("update"); setUpdateSubTab("create"); }}>
                    + Add New Parcel
                  </button>
                </div>

                {/* Filters */}
                <div className="db-filters-bar">
                  <input
                    type="text"
                    className="db-search-input"
                    placeholder="Filter by Survey No, Owner Name, ULPIN, Village..."
                    value={recordSearch}
                    onChange={(e) => setRecordSearch(e.target.value)}
                  />
                  <select
                    className="db-select-input"
                    value={recordStateFilter}
                    onChange={(e) => setRecordStateFilter(e.target.value)}
                  >
                    <option value="All States">All States</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    className="db-select-input"
                    value={recordStatusFilter}
                    onChange={(e) => setRecordStatusFilter(e.target.value)}
                  >
                    <option value="All Status">All Verification Status</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                  <button className="btn btn--outline btn--sm" onClick={loadParcels}>
                    Apply Filters
                  </button>
                </div>

                {parcelsLoading ? (
                  <p style={{ padding: 20, textAlign: "center" }}>Loading land records from database...</p>
                ) : (
                  <div className="db-table-wrapper">
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>ULPIN</th>
                          <th>Survey No.</th>
                          <th>Location</th>
                          <th>Owner</th>
                          <th>Land Type</th>
                          <th>Area</th>
                          <th>Tax Status</th>
                          <th>Verification</th>
                          <th>Dispute</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parcels.map((p) => (
                          <tr key={p.id}>
                            <td><code>{p.ulpin}</code></td>
                            <td><strong>{p.survey_number}</strong></td>
                            <td>{p.village}, {p.district} ({p.state})</td>
                            <td>{p.owner_name}</td>
                            <td>{p.land_type}</td>
                            <td>{p.area_acres} Acres</td>
                            <td>
                              <span style={{ color: p.tax_status === "Paid" ? "#166534" : "#dc2626", fontWeight: 600 }}>
                                {p.tax_status}
                              </span>
                            </td>
                            <td>
                              <span className={`db-badge ${p.verification_status === "Verified" ? "db-badge--verified" : "db-badge--pending"}`}>
                                {p.verification_status}
                              </span>
                            </td>
                            <td>
                              <span className={`db-badge ${p.dispute_status === "Clear" ? "db-badge--verified" : "db-badge--dispute"}`}>
                                {p.dispute_status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: 6 }}>
                                {p.verification_status !== "Verified" && (
                                  <button
                                    type="button"
                                    className="db-btn-action db-btn-action--success"
                                    onClick={() => handleVerifyParcel(p.id)}
                                  >
                                    Verify
                                  </button>
                                )}
                                <Link
                                  to={`/search?q=${encodeURIComponent(p.survey_number)}`}
                                  className="db-btn-action"
                                >
                                  RoR
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: UPDATE RECORDS & MUTATION */}
          {active === "update" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">Cadastral Registry Operations</h2>
                    <p className="db-panel-subtitle">Register new parcels or execute official ownership mutations</p>
                  </div>
                </div>

                <div className="db-tabs-sub">
                  <button
                    className={`db-tab-sub-btn ${updateSubTab === "create" ? "db-tab-sub-btn--active" : ""}`}
                    onClick={() => setUpdateSubTab("create")}
                  >
                    1. Register New Land Parcel
                  </button>
                  <button
                    className={`db-tab-sub-btn ${updateSubTab === "mutate" ? "db-tab-sub-btn--active" : ""}`}
                    onClick={() => setUpdateSubTab("mutate")}
                  >
                    2. Execute Ownership Mutation (Transfer Title)
                  </button>
                </div>

                {createSuccess && <div className="db-success-alert">{createSuccess}</div>}
                {mutateSuccess && <div className="db-success-alert">{mutateSuccess}</div>}

                {updateSubTab === "create" ? (
                  <form onSubmit={handleCreateParcel}>
                    <div className="db-form-grid">
                      <div className="db-form-group">
                        <label>Survey / Khasra Number *</label>
                        <input
                          type="text"
                          placeholder="e.g. 142/9"
                          value={newParcel.survey_number}
                          onChange={(e) => setNewParcel({ ...newParcel, survey_number: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>State *</label>
                        <select
                          value={newParcel.state}
                          onChange={(e) => setNewParcel({ ...newParcel, state: e.target.value })}
                        >
                          {STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="db-form-group">
                        <label>District *</label>
                        <input
                          type="text"
                          placeholder="e.g. Agra, Pune, Jaipur"
                          value={newParcel.district}
                          onChange={(e) => setNewParcel({ ...newParcel, district: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Tehsil / Taluk *</label>
                        <input
                          type="text"
                          placeholder="e.g. Etmadpur"
                          value={newParcel.tehsil}
                          onChange={(e) => setNewParcel({ ...newParcel, tehsil: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Village / Mauza *</label>
                        <input
                          type="text"
                          placeholder="e.g. Phalera"
                          value={newParcel.village}
                          onChange={(e) => setNewParcel({ ...newParcel, village: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Primary Owner Name *</label>
                        <input
                          type="text"
                          placeholder="Full Name of Primary Title Holder"
                          value={newParcel.owner_name}
                          onChange={(e) => setNewParcel({ ...newParcel, owner_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Co-Owners (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Suresh Singh, Geeta Devi"
                          value={newParcel.co_owners}
                          onChange={(e) => setNewParcel({ ...newParcel, co_owners: e.target.value })}
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Land Use Classification *</label>
                        <select
                          value={newParcel.land_type}
                          onChange={(e) => setNewParcel({ ...newParcel, land_type: e.target.value })}
                        >
                          <option value="Agricultural">Agricultural</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Forest / Eco-sensitive">Forest / Eco-sensitive</option>
                        </select>
                      </div>
                      <div className="db-form-group">
                        <label>Area in Acres *</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 2.5"
                          value={newParcel.area_acres}
                          onChange={(e) => setNewParcel({ ...newParcel, area_acres: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Govt Valuation (INR) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 4500000"
                          value={newParcel.valuation_inr}
                          onChange={(e) => setNewParcel({ ...newParcel, valuation_inr: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Tax Status</label>
                        <select
                          value={newParcel.tax_status}
                          onChange={(e) => setNewParcel({ ...newParcel, tax_status: e.target.value })}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Exempted">Exempted</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn--primary">
                      Register &amp; Generate ULPIN
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleExecuteMutation}>
                    <div className="db-form-grid">
                      <div className="db-form-group">
                        <label>Select Land Parcel to Mutate *</label>
                        <select
                          value={mutationData.parcel_id}
                          onChange={(e) => setMutationData({ ...mutationData, parcel_id: e.target.value })}
                          required
                        >
                          <option value="" disabled>-- Select Parcel --</option>
                          {parcels.map((p) => (
                            <option key={p.id} value={p.id}>
                              Survey No. {p.survey_number} ({p.village}, {p.district}) - Current Owner: {p.owner_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="db-form-group">
                        <label>New Owner Full Name *</label>
                        <input
                          type="text"
                          placeholder="Enter new legal owner name"
                          value={mutationData.new_owner}
                          onChange={(e) => setMutationData({ ...mutationData, new_owner: e.target.value })}
                          required
                        />
                      </div>
                      <div className="db-form-group">
                        <label>Type of Mutation *</label>
                        <select
                          value={mutationData.type}
                          onChange={(e) => setMutationData({ ...mutationData, type: e.target.value })}
                        >
                          <option value="Sale Deed">Registered Sale Deed</option>
                          <option value="Inheritance">Inheritance / Succession</option>
                          <option value="Partition">Family Partition</option>
                          <option value="Gift Deed">Gift Deed</option>
                          <option value="Government Acquisition">Government Acquisition</option>
                        </select>
                      </div>
                    </div>
                    <div className="db-form-group" style={{ marginBottom: 20 }}>
                      <label>Verification &amp; Registration Remarks</label>
                      <textarea
                        rows={3}
                        placeholder="Document reference number, sub-registrar book/volume, stamp duty payment details..."
                        value={mutationData.remarks}
                        onChange={(e) => setMutationData({ ...mutationData, remarks: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn--primary">
                      Execute Ownership Transfer &amp; Record Mutation
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DISPUTE & GRIEVANCE MANAGEMENT */}
          {active === "dispute" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">Citizen Grievances &amp; Conflict Ledger</h2>
                    <p className="db-panel-subtitle">Review grievances, inspect conflicting boundaries, and issue official resolution orders</p>
                  </div>
                </div>

                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Reference ID</th>
                        <th>Citizen</th>
                        <th>Department</th>
                        <th>Request Type</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Submitted On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grievances.map((g) => (
                        <tr key={g.id}>
                          <td><code>{g.reference_id}</code></td>
                          <td><strong>{g.full_name}</strong><br /><small>{g.phone || g.email}</small></td>
                          <td>{g.assigned_department}</td>
                          <td>{g.request_type}</td>
                          <td>
                            <strong>{g.subject}</strong>
                            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.8rem" }}>{g.description}</p>
                            {g.officer_notes && (
                              <p style={{ margin: "4px 0 0", color: "#166534", fontSize: "0.8rem", background: "#f0fdf4", padding: "4px 6px", borderRadius: 4 }}>
                                <strong>Officer Note:</strong> {g.officer_notes}
                              </p>
                            )}
                          </td>
                          <td>
                            <span className={`db-badge ${g.status === "Resolved" ? "db-badge--verified" : g.status === "In Progress" ? "db-badge--pending" : "db-badge--dispute"}`}>
                              {g.status}
                            </span>
                          </td>
                          <td>{new Date(g.created_at).toLocaleDateString("en-IN")}</td>
                          <td>
                            <button
                              type="button"
                              className="db-btn-action db-btn-action--primary"
                              onClick={() => {
                                setSelectedGrievance(g);
                                setGrievanceStatus(g.status === "Resolved" ? "Resolved" : "In Progress");
                                setGrievanceNotes(g.officer_notes || "");
                              }}
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Status Update Modal */}
                {selectedGrievance && (
                  <div className="ror-modal-overlay" onClick={() => setSelectedGrievance(null)}>
                    <div className="ror-modal-sheet" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
                      <div className="ror-modal-header">
                        <h2>Update Grievance {selectedGrievance.reference_id}</h2>
                        <button className="ror-close-btn" onClick={() => setSelectedGrievance(null)}>✕</button>
                      </div>
                      <form onSubmit={handleUpdateGrievanceStatus} style={{ padding: 24 }}>
                        <p style={{ marginBottom: 12, fontSize: "0.9rem" }}>
                          <strong>Citizen:</strong> {selectedGrievance.full_name} ({selectedGrievance.email})
                        </p>
                        <p style={{ marginBottom: 16, fontSize: "0.9rem" }}>
                          <strong>Subject:</strong> {selectedGrievance.subject}
                        </p>

                        <div className="db-form-group" style={{ marginBottom: 14 }}>
                          <label>Update Resolution Status *</label>
                          <select
                            value={grievanceStatus}
                            onChange={(e) => setGrievanceStatus(e.target.value)}
                            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="In Progress">In Progress (Investigation)</option>
                            <option value="Resolved">Resolved (Complete)</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        <div className="db-form-group" style={{ marginBottom: 20 }}>
                          <label>Official Officer Remarks / Instructions *</label>
                          <textarea
                            rows={4}
                            placeholder="Enter official resolution details, inspection findings, or directions issued to field officers..."
                            value={grievanceNotes}
                            onChange={(e) => setGrievanceNotes(e.target.value)}
                            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                            required
                          />
                        </div>

                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                          <button type="button" className="btn btn--outline btn--sm" onClick={() => setSelectedGrievance(null)}>
                            Cancel
                          </button>
                          <button type="submit" className="btn btn--primary btn--sm">
                            Save &amp; Notify Citizen
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & ANALYTICS */}
          {active === "reports" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">National Cadastral Analytics &amp; Reports</h2>
                    <p className="db-panel-subtitle">Key metrics across connected state land registries</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
                  <div style={{ background: "#f8fafc", padding: 18, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontSize: "1rem", color: "#0f2038", marginBottom: 12 }}>Land Use Distribution</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      {(stats?.landTypeStats || []).map((lt) => (
                        <li key={lt.land_type} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                          <span>{lt.land_type}</span>
                          <strong>{lt.count} parcels</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: "#f8fafc", padding: 18, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontSize: "1rem", color: "#0f2038", marginBottom: 12 }}>Department Integration Status</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                        <span>Revenue Department</span>
                        <span style={{ color: "#166534", fontWeight: 700 }}>● Fully Integrated</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                        <span>Registration &amp; Stamps</span>
                        <span style={{ color: "#166534", fontWeight: 700 }}>● Live Mutation Sync</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                        <span>Survey &amp; Settlement</span>
                        <span style={{ color: "#166534", fontWeight: 700 }}>● DGPS Cadastre Sync</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem" }}>
                        <span>Panchayati Raj</span>
                        <span style={{ color: "#166534", fontWeight: 700 }}>● Rural Abadi Sync</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <h3 style={{ fontSize: "1rem", color: "#0f2038", marginBottom: 12 }}>State Performance Matrix</h3>
                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>State</th>
                        <th>Total Parcels on Central Node</th>
                        <th>Verified Records</th>
                        <th>Active Injunctions / Disputes</th>
                        <th>Integration Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.stateStats || []).map((s) => (
                        <tr key={s.state}>
                          <td><strong>{s.state}</strong></td>
                          <td>{s.parcel_count}</td>
                          <td>{s.verified_count || 0}</td>
                          <td>{s.dispute_count || 0}</td>
                          <td><span className="db-badge db-badge--verified">99.8% Online</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT LOGS */}
          {active === "audit" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">Immutable Audit Ledger</h2>
                    <p className="db-panel-subtitle">Chronological ledger of all cadastral updates, officer actions, and authentications</p>
                  </div>
                  <button className="btn btn--outline btn--sm" onClick={loadAuditLogs}>Refresh Ledger</button>
                </div>

                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Officer / User</th>
                        <th>Department</th>
                        <th>Action</th>
                        <th>Target</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td><code>{log.timestamp}</code><br /><small>{log.relativeTime}</small></td>
                          <td><strong>{log.user_name}</strong><br /><small>{log.role}</small></td>
                          <td>{log.department || "Public"}</td>
                          <td>
                            <span className={`db-badge ${log.type === "danger" ? "db-badge--dispute" : log.type === "warning" ? "db-badge--pending" : "db-badge--verified"}`}>
                              {log.action}
                            </span>
                          </td>
                          <td>{log.target_type} #{log.target_id}</td>
                          <td>{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: USERS & ROLES */}
          {active === "users" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">Authorized Personnel &amp; Citizen Directory</h2>
                    <p className="db-panel-subtitle">Access control roster for SDMs, Sub-Registrars, and verified citizen accounts</p>
                  </div>
                </div>

                <div className="db-table-wrapper">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Username / Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Official Designation</th>
                        <th>Registered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td><strong>{u.full_name}</strong></td>
                          <td>{u.username}<br /><small>{u.email}</small></td>
                          <td>
                            <span className={`db-badge ${u.role === "admin" ? "db-badge--dispute" : u.role === "officer" ? "db-badge--verified" : "db-badge--pending"}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>{u.department || "Public Citizen"}</td>
                          <td>{u.designation || "Citizen User"}</td>
                          <td>{u.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICATIONS */}
          {active === "notify" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">System &amp; Inter-Departmental Notifications</h2>
                    <p className="db-panel-subtitle">Pending verifications, high-priority dispute flags, and citizen grievance escalations</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "#fff7ed", border: "1px solid #fdba74", padding: 14, borderRadius: 8, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem" }}>⚠️</span>
                    <div>
                      <h4 style={{ margin: 0, color: "#9a3412" }}>High Priority Boundary Dispute Flagged: Survey No. 12/8 (Phalera)</h4>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#c2410c" }}>Overlapping boundary claim filed. SDM hearing scheduled.</p>
                    </div>
                  </div>

                  <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: 14, borderRadius: 8, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem" }}>✓</span>
                    <div>
                      <h4 style={{ margin: 0, color: "#166534" }}>Mutation Executed: Survey No. 58/7 (Aligarh)</h4>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#15803d" }}>Registered Sale Deed recorded by Sub-Registrar Sunita Deshmukh.</p>
                    </div>
                  </div>

                  <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", padding: 14, borderRadius: 8, display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem" }}>ℹ️</span>
                    <div>
                      <h4 style={{ margin: 0, color: "#1e40af" }}>Citizen Grievance Received (Ref: BB-89210341)</h4>
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#2563eb" }}>Assigned to Revenue Department: &quot;Delay in issuance of mutation certificate for Survey 123/4&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {active === "settings" && (
            <div className="db-view-panel">
              <div className="db-panel-card">
                <div className="db-panel-header">
                  <div>
                    <h2 className="db-panel-title">Portal Configuration &amp; Database Health</h2>
                    <p className="db-panel-subtitle">National node server settings and storage status</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                  <div style={{ background: "#f8fafc", padding: 18, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <h4 style={{ margin: "0 0 10px" }}>Storage Engine</h4>
                    <p style={{ margin: "4px 0", fontSize: "0.88rem" }}>Engine: <strong>SQLite (WAL Mode Enabled)</strong></p>
                    <p style={{ margin: "4px 0", fontSize: "0.88rem" }}>Database File: <code>server/data/bhoomi.sqlite</code></p>
                    <p style={{ margin: "4px 0", fontSize: "0.88rem" }}>Integrity Status: <span style={{ color: "#166534", fontWeight: 700 }}>OK (Healthy)</span></p>
                  </div>

                  <div style={{ background: "#f8fafc", padding: 18, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <h4 style={{ margin: "0 0 10px" }}>API Gateway</h4>
                    <p style={{ margin: "4px 0", fontSize: "0.88rem" }}>Server URL: <code>http://localhost:5000</code></p>
                    <p style={{ margin: "4px 0", fontSize: "0.88rem" }}>Proxy Route: <code>/api/*</code></p>
                    <p style={{ margin: "4px 0", fontSize: "0.88rem" }}>Security: <strong>JWT Authentication + RBAC</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="db-footer">
            <div className="db-footer__brand">
              <img src="/images/Emblem_of_India_black.svg" alt="" className="db-footer__logo" />
              <div>
                <p className="db-footer__name">Bharat Bhoomi</p>
                <p className="db-footer__sub">National Land Records &amp; Governance Portal</p>
                <p className="db-footer__copy">© 2024 Government of India. All Rights Reserved.</p>
              </div>
            </div>
            <div className="db-footer__cols">
              <div>
                <p className="db-footer__heading">Quick Links</p>
                <ul>
                  {[["Home", "/"], ["Land Search", "/search"], ["Features", "/features"], ["Help Center", "/help"]].map(([l, p]) => (
                    <li key={l}><Link to={p}>{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="db-footer__heading">Resources</p>
                <ul>
                  {["User Manual", "Help Center", "FAQs", "Downloads"].map((l) => (
                    <li key={l}><Link to="/help">{l}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="db-footer__heading">Policies</p>
                <ul>
                  {["Privacy Policy", "Terms of Use", "Disclaimer"].map((l) => (
                    <li key={l}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="db-footer__heading">Connect</p>
                <p className="db-footer__contact">✉ support@bhoomi.gov.in</p>
                <p className="db-footer__contact">Toll Free: 1800-XXX-XXXX</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Fallback defaults if data is loading
const DEFAULT_ACTIVITIES = [
  { type: "success", text: "Land record updated", detail: "Survey No. 123/4", office: "Phalera Office, Agra, UP", time: "7 min ago" },
  { type: "warning", text: "Ownership updated", detail: "Survey No. 58/7", office: "Tehsil Office, Aligarh", time: "16 min ago" },
  { type: "success", text: "Land tax updated", detail: "Survey No. 50/1", office: "Barhanpur Office, Akbarpur", time: "1 hr ago" },
  { type: "danger", text: "Dispute flagged", detail: "Survey No. 12/8", office: "Phalera Office, Agra", time: "2 hrs ago" },
];

const DEFAULT_UP_SUMMARY = [
  { color: "blue", label: "Total Land Parcels", value: "2,34,567" },
  { color: "blue", label: "Updated Records", value: "12,456" },
  { color: "orange", label: "Pending Verifications", value: "1,234" },
  { color: "yellow", label: "Active Disputes", value: "56" },
  { color: "green", label: "Verified Records", value: "2,20,877" },
];

// Icons
const NAV_ICONS = {
  dashboard: <GridIcon />,
  records: <DocIcon />,
  search: <SearchIcon />,
  update: <EditIcon />,
  dispute: <AlertIcon />,
  reports: <ChartIcon />,
  users: <UsersIcon />,
  notify: <BellIcon />,
  audit: <ClockIcon />,
  settings: <SettingsIcon />,
  help: <HelpIcon />,
  logout: <LogoutIcon />,
};

function GridIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function DocIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function EditIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function AlertIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function UsersIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function BellIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ClockIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function SettingsIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function HelpIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ChevronDownIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>; }
function HamburgerIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function CheckCircleIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function WarnTriIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function DangerTriIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="#e55" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }

function UPMapSVG() {
  return (
    <svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,80 L60,40 L100,30 L150,25 L200,35 L240,50 L255,80 L250,110 L240,130 L220,150 L200,165 L170,175 L140,178 L110,172 L80,160 L55,140 L35,115 Z" fill="#c8dfc0" stroke="#fff" strokeWidth="1.5"/>
      <path d="M80,60 L120,55 L160,60 L200,65" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.7"/>
      <path d="M60,95 L100,90 L140,88 L180,92 L220,98" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.7"/>
      <path d="M50,125 L90,120 L130,118 L170,122 L210,128" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.7"/>
      <path d="M100,40 L105,100 L108,160" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.7"/>
      <path d="M140,30 L143,100 L145,175" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.7"/>
      <path d="M180,40 L182,100 L183,165" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.7"/>
    </svg>
  );
}

function UPMapSmallSVG() {
  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M15,50 L35,25 L60,18 L90,15 L125,22 L148,38 L155,65 L148,88 L130,105 L100,112 L70,114 L45,105 L22,85 Z" fill="#d4e8cb" stroke="#fff" strokeWidth="1"/>
    </svg>
  );
}

function IndiaMapSVG() {
  return (
    <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg">
      <path d="M120,10 L150,8 L185,15 L210,25 L235,40 L250,60 L260,85 L265,110 L258,140 L245,160 L252,185 L248,210 L235,230 L215,250 L200,270 L185,295 L175,318 L165,330 L155,318 L148,295 L138,272 L122,250 L105,232 L88,215 L75,195 L65,175 L58,150 L50,125 L45,100 L48,75 L60,55 L75,38 L95,22 Z" fill="#cce3bf" stroke="#fff" strokeWidth="1.5"/>
      <path d="M95,10 L120,10 L120,40 L100,50 L80,45 L70,30 Z" fill="#bdd9b0" stroke="#fff" strokeWidth="1"/>
      <path d="M235,40 L265,35 L275,60 L260,85 L235,70 Z" fill="#bdd9b0" stroke="#fff" strokeWidth="1"/>
      <path d="M120,80 L165,75 L210,85 L215,115 L200,130 L155,135 L115,125 L108,100 Z" fill="#96c98d" stroke="#fff" strokeWidth="1.2"/>
      <text x="148" y="110" textAnchor="middle" fontSize="9" fill="#2d5a27" fontWeight="600">UP</text>
    </svg>
  );
}