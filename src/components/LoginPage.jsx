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

// ── Icon Components ────────────────────────────────────────────────────────────

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

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.74 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.18z" />
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

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Password Strength Helper ───────────────────────────────────────────────────

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 3) return { score, label: "Good", color: "#3b82f6" };
  return { score, label: "Strong", color: "#22c55e" };
}

// ── Main Component ─────────────────────────────────────────────────────────────

function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'department' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showDeptPassword, setShowDeptPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Citizen Login State ──
  const [citizenUser, setCitizenUser] = useState("");
  const [citizenPass, setCitizenPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Officer Login State ──
  const [deptName, setDeptName] = useState("Revenue Department");
  const [officerUser, setOfficerUser] = useState("");
  const [officerPass, setOfficerPass] = useState("");
  const [deptError, setDeptError] = useState("");
  const [deptLoading, setDeptLoading] = useState(false);

  // ── Register State ──
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const pwdStrength = getPasswordStrength(regPassword);

  // ── Tab Switch Helper ──────────────────────────────────────────────────────
  function switchTab(tab) {
    setActiveTab(tab);
    setLoginError("");
    setDeptError("");
    setRegError("");
    setRegSuccess(false);
  }

  // ── Citizen Login ──────────────────────────────────────────────────────────
  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoginError("");

    if (!citizenUser.trim() || !citizenPass) {
      setLoginError("Please enter your username / email and password.");
      return;
    }

    setLoginLoading(true);
    try {
      await login({ username: citizenUser.trim(), password: citizenPass, role: "citizen" });
      navigate("/search");
    } catch (err) {
      setLoginError(err.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  // ── Officer / Department Login ─────────────────────────────────────────────
  async function handleDeptSubmit(event) {
    event.preventDefault();
    setDeptError("");

    if (!deptName || !officerUser.trim() || !officerPass) {
      setDeptError("Please fill in all fields.");
      return;
    }

    setDeptLoading(true);
    try {
      await login({
        username: officerUser.trim(),
        password: officerPass,
        department: deptName,
        role: "officer",
      });
      navigate("/dashboard");
    } catch (err) {
      setDeptError(err.message || "Login failed. Please try again.");
    } finally {
      setDeptLoading(false);
    }
  }

  // ── Register ───────────────────────────────────────────────────────────────
  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setRegError("");

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setRegError("Full name, username, email, and password are required.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters long.");
      return;
    }

    setRegLoading(true);
    try {
      await register({
        full_name: regFullName.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || undefined,
        password: regPassword,
      });
      setRegSuccess(true);
      // Brief success screen, then redirect
      setTimeout(() => navigate("/search"), 1800);
    } catch (err) {
      setRegError(err.message || "Registration failed. Please try again.");
    } finally {
      setRegLoading(false);
    }
  }

  // ── Quick Demo Autofills ───────────────────────────────────────────────────
  function fillDemo(type) {
    setLoginError("");
    setDeptError("");
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

  // ── Render ─────────────────────────────────────────────────────────────────
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
          {/* Tabs */}
          <div className="login-card__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "login"}
              className={`login-card__tab ${activeTab === "login" ? "login-card__tab--active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Citizen Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "department"}
              className={`login-card__tab ${activeTab === "department" ? "login-card__tab--active" : ""}`}
              onClick={() => switchTab("department")}
            >
              Officer Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "register"}
              className={`login-card__tab ${activeTab === "register" ? "login-card__tab--active" : ""}`}
              onClick={() => switchTab("register")}
            >
              Register
            </button>
          </div>

          {/* ── Citizen Login Tab ── */}
          {activeTab === "login" && (
            <div className="login-card__body">
              <h2 className="login-card__heading">Welcome Back</h2>
              <p className="login-card__lead">Access your land records, certificates, and grievances</p>

              <form className="login-form" onSubmit={handleLoginSubmit} noValidate>
                <label className="field" htmlFor="login-username">
                  <span className="field__label">Username or Email ID</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input
                      id="login-username"
                      name="username"
                      type="text"
                      placeholder="Enter username or email"
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
                      placeholder="Enter password"
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

                {loginError && (
                  <p className="login-form__error" role="alert">{loginError}</p>
                )}

                <div className="login-form__meta">
                  <a className="login-form__link" href="#forgot-password">Forgot Password?</a>
                </div>

                <button className="btn btn--primary btn--block" type="submit" disabled={loginLoading}>
                  <IconLoginGlyph />
                  {loginLoading ? "Logging in…" : "Login"}
                </button>
              </form>

              <div className="login-card__divider" />

              <p className="login-card__footer">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => switchTab("register")}
                >
                  Create Account
                </button>
              </p>
            </div>
          )}

          {/* ── Officer Login Tab ── */}
          {activeTab === "department" && (
            <div className="login-card__body">
              <h2 className="login-card__heading">Department / Officer Login</h2>
              <p className="login-card__lead">Authorized portal for Revenue, Registration &amp; Survey Officers</p>

              <form className="login-form" onSubmit={handleDeptSubmit} noValidate>
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
                      placeholder="e.g. officer.revenue"
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
                      placeholder="Enter password"
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

                {deptError && (
                  <p className="login-form__error" role="alert">{deptError}</p>
                )}

                <div className="login-form__meta">
                  <a className="login-form__link" href="#forgot-password">Forgot Password?</a>
                </div>

                <button className="btn btn--primary btn--block" type="submit" disabled={deptLoading}>
                  <IconLoginGlyph />
                  {deptLoading ? "Authenticating Officer…" : "Login to Officer Portal"}
                </button>
              </form>
            </div>
          )}

          {/* ── Register Tab ── */}
          {activeTab === "register" && (
            <div className="login-card__body">
              {regSuccess ? (
                <div className="register-success">
                  <div className="register-success__icon">
                    <IconCheck />
                  </div>
                  <h2 className="register-success__title">Account Created!</h2>
                  <p className="register-success__text">
                    Welcome to Bharat Bhoomi. Redirecting you to the portal…
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="login-card__heading">Create Your Account</h2>
                  <p className="login-card__lead">Register to track land records and file grievances</p>

                  <form className="login-form" onSubmit={handleRegisterSubmit} noValidate>
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
                          autoComplete="name"
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
                          placeholder="Unique username (e.g. rahul.sharma)"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          required
                          autoComplete="username"
                        />
                      </span>
                    </label>

                    <label className="field" htmlFor="reg-email">
                      <span className="field__label">Email Address</span>
                      <span className="field__control">
                        <span className="field__icon" aria-hidden="true"><IconMail /></span>
                        <input
                          id="reg-email"
                          type="email"
                          placeholder="you@example.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </span>
                    </label>

                    <label className="field" htmlFor="reg-phone">
                      <span className="field__label">Mobile Phone <span className="field__label--optional">(optional)</span></span>
                      <span className="field__control">
                        <span className="field__icon" aria-hidden="true"><IconPhone /></span>
                        <input
                          id="reg-phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          autoComplete="tel"
                        />
                      </span>
                    </label>

                    <label className="field" htmlFor="reg-password">
                      <span className="field__label">Password</span>
                      <span className="field__control">
                        <span className="field__icon" aria-hidden="true"><IconLock /></span>
                        <input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          placeholder="Min. 8 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="field__toggle"
                          aria-label={showRegPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowRegPassword((prev) => !prev)}
                        >
                          <IconEye open={showRegPassword} />
                        </button>
                      </span>
                      {regPassword && (
                        <div className="pwd-strength">
                          <div className="pwd-strength__bars">
                            {[1, 2, 3, 4].map((n) => (
                              <div
                                key={n}
                                className="pwd-strength__bar"
                                style={{
                                  background: pwdStrength.score >= n ? pwdStrength.color : "var(--color-border)",
                                }}
                              />
                            ))}
                          </div>
                          <span className="pwd-strength__label" style={{ color: pwdStrength.color }}>
                            {pwdStrength.label}
                          </span>
                        </div>
                      )}
                    </label>

                    <label className="field" htmlFor="reg-confirm">
                      <span className="field__label">Confirm Password</span>
                      <span className="field__control">
                        <span className="field__icon" aria-hidden="true"><IconLock /></span>
                        <input
                          id="reg-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="field__toggle"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                          <IconEye open={showConfirmPassword} />
                        </button>
                      </span>
                      {regConfirmPassword && regPassword !== regConfirmPassword && (
                        <span className="field__hint field__hint--error">Passwords do not match</span>
                      )}
                      {regConfirmPassword && regPassword === regConfirmPassword && regConfirmPassword.length > 0 && (
                        <span className="field__hint field__hint--ok">✓ Passwords match</span>
                      )}
                    </label>

                    {regError && (
                      <p className="login-form__error" role="alert">{regError}</p>
                    )}

                    <button
                      className="btn btn--primary btn--block"
                      type="submit"
                      disabled={regLoading}
                    >
                      {regLoading ? "Creating Account…" : "Create Account"}
                    </button>
                  </form>

                  <div className="login-card__divider" />

                  <p className="login-card__footer">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => switchTab("login")}
                    >
                      Back to Login
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <Link className="login-page__back" to="/">&larr; Back to Home</Link>
      </div>
    </div>
  );
}

export default LoginPage;