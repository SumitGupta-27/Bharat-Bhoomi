import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",          path: "/dashboard" },
  { id: "records",   label: "Land Records",        path: "/dashboard" },
  { id: "search",    label: "Land Parcel Search",  path: "/dashboard" },
  { id: "update",    label: "Update Records",      path: "/dashboard" },
  { id: "dispute",   label: "Dispute / Grievance", path: "/dashboard" },
  { id: "reports",   label: "Reports & Analytics", path: "/dashboard", hasChevron: true },
  { id: "users",     label: "Users & Roles",       path: "/dashboard" },
  { id: "notify",    label: "Notifications",       path: "/dashboard" },
  { id: "audit",     label: "Audit Logs",          path: "/dashboard" },
  { id: "settings",  label: "Settings",            path: "/dashboard" },
  { id: "help",      label: "Help & Support",      path: "/help" },
  { id: "logout",    label: "Logout",              path: "/" },
];

const ACTIVITIES = [
  { type: "success", text: "Land record updated", detail: "Survey No. 123/4", office: "Phalera Office, Agra, UP",  time: "7 min ago"  },
  { type: "warning", text: "Ownership updated",   detail: "Survey No. 58/7",  office: "Tehsil Office, Aligarh",    time: "16 min ago" },
  { type: "success", text: "Land tax updated",    detail: "Survey No. 50/1",  office: "Barhanpur Office, Akbar",   time: "1 hr ago"   },
  { type: "danger",  text: "Dispute flagged",     detail: "Survey No. 12/8",  office: "Phalera Office, Agra",      time: "2 hrs ago"  },
];

const STATES = [
  "Uttar Pradesh","Maharashtra","Bihar","Madhya Pradesh",
  "Tamil Nadu","Rajasthan","Karnataka","Gujarat","Andhra Pradesh","Telangana",
];

const UP_SUMMARY = [
  { color: "blue",   label: "Total Land Parcels",    value: "2,34,567" },
  { color: "blue",   label: "Updated Records",        value: "12,456"   },
  { color: "orange", label: "Pending Verifications",  value: "1,234"    },
  { color: "yellow", label: "Active Disputes",         value: "56"       },
  { color: "green",  label: "Verified Records",        value: "2,20,877" },
];

export default function DashboardPage() {
  const [active, setActive]          = useState("dashboard");
  const [sidebarOpen, setSidebar]    = useState(true);
  const [selectedState, setSelState] = useState("Uttar Pradesh");
  const [dropOpen, setDropOpen]      = useState(false);
  const navigate = useNavigate();

  function handleNav(item) {
    setActive(item.id);
    if (item.id === "logout" || item.id === "help") navigate(item.path);
  }

  return (
    <div className="db-shell">
      <aside className={`db-sidebar ${sidebarOpen ? "" : "db-sidebar--collapsed"}`}>
        <div className="db-sidebar__brand">
          <img src="/images/Emblem_of_India_black.svg" alt="" className="db-brand-logo" />
          {sidebarOpen && (
            <span className="db-brand-text">
              <span className="db-brand-name">Bharat Bhoomi</span>
              <span className="db-brand-sub">National Land Records &amp; Governance Portal</span>
            </span>
          )}
        </div>
        <nav className="db-sidebar__nav" aria-label="Dashboard navigation">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${active === item.id ? "db-nav-item--active" : ""}`}
              onClick={() => handleNav(item)}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className="db-nav-icon">{NAV_ICONS[item.id]}</span>
              {sidebarOpen && <span className="db-nav-label">{item.label}</span>}
              {sidebarOpen && item.hasChevron && <span className="db-nav-chevron"><ChevronDownIcon /></span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar__left">
            <button className="db-topbar__toggle" onClick={() => setSidebar(o => !o)} aria-label="Toggle sidebar">
              <HamburgerIcon />
            </button>
            <h1 className="db-page-title">Dashboard</h1>
          </div>
          <div className="db-topbar__right">
            <button className="db-icon-btn" aria-label="Notifications"><BellIcon /></button>
            <button className="db-icon-btn" aria-label="Alerts"><AlertBellIcon /></button>
            <div className="db-admin-btn">
              <span className="db-admin-avatar">A</span>
              <span className="db-admin-name">Admin Officer</span>
              <ChevronDownIcon />
            </div>
          </div>
        </header>

        <div className="db-content">
          {/* Stats */}
          <div className="db-stats-row">
            {[
              { label: "Total Land Parcels",           value: "12,45,678", orange: false },
              { label: "Records Updated (This Month)",  value: "45,678",    orange: false },
              { label: "Pending Verifications",         value: "2,345",     orange: true  },
              { label: "Active Disputes",               value: "123",       orange: true  },
            ].map(s => (
              <div key={s.label} className="db-stat-card">
                <p className="db-stat-label">{s.label}</p>
                <p className={`db-stat-value${s.orange ? " db-stat-value--orange" : ""}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className="db-mid-row">
            <section className="db-card db-card--activities">
              <h2 className="db-card__title">Recent Activities</h2>
              <ul className="db-activity-list">
                {ACTIVITIES.map((a, i) => (
                  <li key={i} className="db-activity-item">
                    <span className={`db-activity-icon db-activity-icon--${a.type}`}>
                      {a.type === "success" ? <CheckCircleIcon /> : a.type === "warning" ? <WarnTriIcon /> : <DangerTriIcon />}
                    </span>
                    <span className="db-activity-body">
                      <span className="db-activity-text"><strong>{a.text}</strong> – {a.detail}</span>
                      <span className="db-activity-office">{a.office}</span>
                    </span>
                    <span className="db-activity-time">{a.time}</span>
                  </li>
                ))}
              </ul>
              <button className="db-link-btn">View All</button>
            </section>

            <section className="db-card db-card--map">
              <div className="db-card__header">
                <h2 className="db-card__title">District Map Overview</h2>
                <button className="db-icon-btn" aria-label="Download"><DownloadIcon /></button>
              </div>
              <div className="db-map-placeholder"><UPMapSVG /></div>
            </section>

            <section className="db-card db-card--actions">
              <h2 className="db-card__title">Quick Actions</h2>
              <div className="db-quick-list">
                {["Search Land Parcel","Add / Update Record","Verify Record","Generate Report"].map(label => (
                  <button key={label} className="db-quick-item">
                    <span className="db-quick-dot" /><span>{label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom row */}
          <div className="db-bot-row">
            <section className="db-card db-card--india">
              <h2 className="db-card__title">Land Records by State</h2>
              <div className="db-india-inner">
                <div className="db-india-map"><IndiaMapSVG /></div>
                <div className="db-state-panel">
                  <div className="db-dropdown">
                    <button className="db-dropdown__btn" onClick={() => setDropOpen(o => !o)}>
                      <span>All States</span><ChevronDownIcon />
                    </button>
                    {dropOpen && (
                      <ul className="db-dropdown__list">
                        {STATES.map(s => (
                          <li key={s}
                            className={`db-dropdown__option${selectedState === s ? " db-dropdown__option--active" : ""}`}
                            onClick={() => { setSelState(s); setDropOpen(false); }}
                          >{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button className="db-btn-outline">View All States</button>
                </div>
              </div>
            </section>

            <section className="db-card db-card--summary">
              <div className="db-summary-header">
                <h2 className="db-card__title">Land Records Summary – {selectedState}</h2>
                <div className="db-summary-map"><UPMapSmallSVG /></div>
              </div>
              <ul className="db-summary-list">
                {UP_SUMMARY.map(row => (
                  <li key={row.label} className="db-summary-row">
                    <span className={`db-summary-dot db-summary-dot--${row.color}`} />
                    <span className="db-summary-label">{row.label}</span>
                    <span className="db-summary-value">{row.value}</span>
                  </li>
                ))}
              </ul>
              <button className="db-btn-outline db-btn-outline--sm">View Districts</button>
            </section>
          </div>

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
                <ul>{[["Home","/"],["About","/about"],["Features","/features"],["Contact","/"]].map(([l,p])=>(<li key={l}><Link to={p}>{l}</Link></li>))}</ul>
              </div>
              <div>
                <p className="db-footer__heading">Resources</p>
                <ul>{["User Manual","Help Center","FAQs","Downloads"].map(l=>(<li key={l}><Link to="/help">{l}</Link></li>))}</ul>
              </div>
              <div>
                <p className="db-footer__heading">Policies</p>
                <ul>{["Privacy Policy","Terms of Use","Disclaimer"].map(l=>(<li key={l}><a href="#">{l}</a></li>))}</ul>
              </div>
              <div>
                <p className="db-footer__heading">Connect</p>
                <p className="db-footer__contact">✉ support@bhoomi.gov.in</p>
                <p className="db-footer__contact">Toll Free: 1800-XXX-XXXX</p>
                <div className="db-footer__social">
                  {["f","X","▶","in"].map(s=>(<a key={s} href="#" className="db-social-btn">{s}</a>))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

const NAV_ICONS = {
  dashboard:<GridIcon/>, records:<DocIcon/>, search:<SearchIcon/>, update:<EditIcon/>,
  dispute:<AlertIcon/>, reports:<ChartIcon/>, users:<UsersIcon/>, notify:<BellIcon/>,
  audit:<ClockIcon/>, settings:<SettingsIcon/>, help:<HelpIcon/>, logout:<LogoutIcon/>,
};

function GridIcon()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function DocIcon()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function SearchIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function EditIcon()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function AlertIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function ChartIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function UsersIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function BellIcon()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ClockIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function SettingsIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function HelpIcon()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function LogoutIcon()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ChevronDownIcon(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>; }
function HamburgerIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function AlertBellIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="18" cy="5" r="3" fill="#e55" stroke="none"/></svg>; }
function DownloadIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function CheckCircleIcon(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
function WarnTriIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function DangerTriIcon()  { return <svg viewBox="0 0 24 24" fill="none" stroke="#e55" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }

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