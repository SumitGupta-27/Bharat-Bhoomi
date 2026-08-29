import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showDeptPassword, setShowDeptPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
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

        <div className="login-card">
          <div className="login-card__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "login"}
              className={`login-card__tab ${activeTab === "login" ? "login-card__tab--active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "department"}
              className={`login-card__tab ${activeTab === "department" ? "login-card__tab--active" : ""}`}
              onClick={() => setActiveTab("department")}
            >
              Department / Officer Login
            </button>
          </div>

          {activeTab === "login" ? (
            <div className="login-card__body">
              <h2 className="login-card__heading">Login</h2>
              <p className="login-card__lead">Login to your account</p>

              <form className="login-form" onSubmit={handleSubmit}>
                <label className="field" htmlFor="login-username">
                  <span className="field__label">Username or Email ID</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input id="login-username" name="username" type="text" placeholder="Enter Username or Email ID" autoComplete="username" />
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

                <div className="login-form__meta">
                  <a className="login-form__link" href="#forgot-password">Forgot Password?</a>
                </div>

                <button className="btn btn--primary btn--block" type="submit">
                  <IconLoginGlyph />
                  Login
                </button>
              </form>

              <div className="login-card__divider" />

              <p className="login-card__footer">
                Don&apos;t have an account? <a href="#create-account">Create Account</a>
              </p>
            </div>
          ) : (
            <div className="login-card__body">
              <h2 className="login-card__heading">Department / Officer Login</h2>
              <p className="login-card__lead">Login to your account</p>

              <form className="login-form" onSubmit={handleSubmit}>
                <label className="field" htmlFor="dept-select">
                  <span className="field__label">Select Department</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconBuilding /></span>
                    <select id="dept-select" name="department" defaultValue="">
                      <option value="" disabled>-- Select Department --</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </span>
                </label>

                <label className="field" htmlFor="dept-username">
                  <span className="field__label">Username</span>
                  <span className="field__control">
                    <span className="field__icon" aria-hidden="true"><IconUser /></span>
                    <input id="dept-username" name="dept-username" type="text" placeholder="Enter Username" autoComplete="username" />
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

                <div className="login-form__meta">
                  <a className="login-form__link" href="#forgot-password">Forgot Password?</a>
                </div>

                <button className="btn btn--primary btn--block" type="submit">
                  <IconLoginGlyph />
                  Login
                </button>
              </form>

              <div className="login-card__divider" />

              <p className="login-card__footer">
                Don&apos;t have an account? <a href="#contact-admin">Contact Admin</a>
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