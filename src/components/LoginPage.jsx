import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./LoginPage.css";

const DEPARTMENTS = [
  "Revenue Department",
  "Registration & Stamps Department",
  "Survey & Settlement Department",
  "Panchayati Raj Department",
  "Urban Local Bodies",
  "Forest Department",
  "District Collector Office",
  "Tehsildar / Sub-Registrar Office",
];

function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21h16" />
      <path d="M6 21V9l6-5 6 5v12" />
      <path d="M10 21v-6h4v6" />
      <path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconEye({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a20.3 20.3 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function IconLoginGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'department' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showDeptPassword, setShowDeptPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Citizen Login Form State
  const [citizenUser, setCitizenUser] = useState("");
  const [citizenPass, setCitizenPass] = useState("");

  // Officer Login Form State
  const [deptName, setDeptName] = useState("Revenue Department");
  const [officerUser, setOfficerUser] = useState("");
  const [officerPass, setOfficerPass] = useState("");

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  async function handleCitizenSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await login({
        username: citizenUser,
        password: citizenPass,
        role: "citizen",
      });
      navigate("/search");
    } catch (err) {
      setErrorMessage(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOfficerSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await login({
        username: officerUser,
        password: officerPass,
        department: deptName,
        role: "officer",
      });
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await register({
        full_name: regFullName,
        username: regUsername,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      navigate("/search");
    } catch (err) {
      setErrorMessage(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  // Quick Demo Autofills
  function fillDemo(type) {
    setErrorMessage("");
    if (type === "revenue") {
      setActiveTab("department");
      setDeptName("Revenue Department");
      setOfficerUser("officer.revenue");
      setOfficerPass("Password123!");
    } else if (type === "survey") {
      setActiveTab("department");
      setDeptName("Survey & Settlement Department");
      setOfficerUser("officer.survey");
      setOfficerPass("Password123!");
    } else if (type === "citizen") {
      setActiveTab("login");
      setCitizenUser("citizen.rahul");
      setCitizenPass("Password123!");
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true" />

      <div className="login-page__inner">
        <div className="login-page__brand">
          <img className="login-page__emblem" src="/images/Emblem_of_India_black.svg" alt="" />
          <h1 className="login-page__title">Bharat Bhoomi</h1>
          <p className="login-page__subtitle">National Land Records &amp; Governance Portal</p>
        </div>

        {/* Demo Account Pills */}
        <div className="demo-accounts-bar">
          <span className="demo-label">⚡ Quick Demo Logins:</span>
          <button type="button" className="demo-pill" onClick={() => fillDemo("revenue")}>
            Revenue Officer (SDM)
          </button>
          <button type="button" className="demo-pill" onClick={() => fillDemo("survey")}>
            Survey Officer
          </button>
          <button type="button" className="demo-pill" onClick={() => fillDemo("citizen")}>
            Citizen (Rahul)
          </button>
        </div>

        <div className="login-card">
          <div className="login-card__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "login"}
              className={`login-card__tab ${activeTab === "login" ? "login-card__tab--active" : ""}`}
              onClick={() => { setActiveTab("login"); setErrorMessage(""); }}
            >
              Citizen Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "department"}
              className={`login-card__tab ${activeTab === "department" ? "login-card__tab--active" : ""}`}
              onClick={() => { setActiveTab("department"); setErrorMessage(""); }}
            >
              Department / Officer Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "register"}
              className={`login-card__tab ${activeTab === "register" ? "login-card__tab--active" : ""}`}
              onClick={() => { setActiveTab("register"); setErrorMessage(""); }}
            >
              Register
            </button>
          </div>

          {errorMessage && (
            <div className="login-error-alert" role="alert">
              ⚠️ {errorMessage}
            </div>
          )}

          {activeTab === "login" && (
            <div className="login-card__body">
              <h2 className="login-card__heading">Citizen Login</h2>
              <p className="login-card__lead">Access your land records, certificates, and grievances</p>

              <form className="login-form" onSubmit={handleCitizenSubmit}>
                <label className="field" htmlFor="login-username">
                  <span className="field__label">Username or Email ID</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input
                      id="login-username"
                      name="username"
                      type="text"
                      placeholder="Enter Username or Email ID"
                      value={citizenUser}
                      onChange={(e) => setCitizenUser(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </span>
                </label>

                <label className="field" htmlFor="login-password">
                  <span className="field__label">Password</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconLock /></span>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={citizenPass}
                      onChange={(e) => setCitizenPass(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="field__toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <IconEye open={showPassword} />
                    </button>
                  </span>
                </label>

                <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
                  <IconLoginGlyph />
                  {loading ? "Authenticating..." : "Login"}
                </button>
              </form>

              <div className="login-card__divider" />

              <p className="login-card__footer">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => { setActiveTab("register"); setErrorMessage(""); }}
                >
                  Create Account
                </button>
              </p>
            </div>
          )}

          {activeTab === "department" && (
            <div className="login-card__body">
              <h2 className="login-card__heading">Department / Officer Login</h2>
              <p className="login-card__lead">Authorized portal for Revenue, Registration &amp; Survey Officers</p>

              <form className="login-form" onSubmit={handleOfficerSubmit}>
                <label className="field" htmlFor="dept-select">
                  <span className="field__label">Select Department</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconBuilding /></span>
                    <select
                      id="dept-select"
                      name="department"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </span>
                </label>

                <label className="field" htmlFor="dept-username">
                  <span className="field__label">Official Username</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input
                      id="dept-username"
                      name="dept-username"
                      type="text"
                      placeholder="Enter Username (e.g. officer.revenue)"
                      value={officerUser}
                      onChange={(e) => setOfficerUser(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </span>
                </label>

                <label className="field" htmlFor="dept-password">
                  <span className="field__label">Password</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconLock /></span>
                    <input
                      id="dept-password"
                      name="dept-password"
                      type={showDeptPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={officerPass}
                      onChange={(e) => setOfficerPass(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="field__toggle"
                      aria-label={showDeptPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowDeptPassword((prev) => !prev)}
                    >
                      <IconEye open={showDeptPassword} />
                    </button>
                  </span>
                </label>

                <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
                  <IconLoginGlyph />
                  {loading ? "Authenticating Officer..." : "Login to Officer Portal"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "register" && (
            <div className="login-card__body">
              <h2 className="login-card__heading">Citizen Registration</h2>
              <p className="login-card__lead">Create an account to track records and register grievances</p>

              <form className="login-form" onSubmit={handleRegisterSubmit}>
                <label className="field" htmlFor="reg-name">
                  <span className="field__label">Full Name</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                    />
                  </span>
                </label>

                <label className="field" htmlFor="reg-username">
                  <span className="field__label">Choose Username</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input
                      id="reg-username"
                      type="text"
                      placeholder="Choose a username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      required
                    />
                  </span>
                </label>

                <label className="field" htmlFor="reg-email">
                  <span className="field__label">Email Address</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true">✉️</span>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="you@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </span>
                </label>

                <label className="field" htmlFor="reg-phone">
                  <span className="field__label">Mobile Phone (Optional)</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true">📱</span>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </span>
                </label>

                <label className="field" htmlFor="reg-password">
                  <span className="field__label">Password</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconLock /></span>
                    <input
                      id="reg-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </span>
                </label>

                <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="login-card__divider" />

              <p className="login-card__footer">
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => { setActiveTab("login"); setErrorMessage(""); }}
                >
                  Back to Login
                </button>
              </p>
            </div>
          )}
        </div>

        <Link className="login-page__back" to="/">&larr; Back to Home</Link>
      </div>
    </div>
  );
}

export default LoginPage;