import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HelpMenu from "./HelpMenu/HelpMenu.jsx";
import AboutMenu from "./AboutMenu/AboutMenu.jsx";
import FeaturesMenu from "./FeaturesMenu/FeaturesMenu.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isOfficer } = useAuth();
  const navigate = useNavigate();

  function toggleMenu() {
    setIsMenuOpen((prevState) => !prevState);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* Brand */}
        <Link
          to="/"
          className="brand"
          aria-label="Bharat Bhoomi home"
        >
          <img
            className="indian_emblem"
            src="/images/Emblem_of_India_black.svg"
            alt=""
          />

          <span className="brand__text">
            <span className="brand__name">Bharat Bhoomi</span>

            <span className="brand__subtitle">
              National Land Records &amp; Governance Portal
            </span>

            <span className="brand__gov">
              Government of India
            </span>
          </span>
        </Link>

        <nav
          className={`nav-links ${
            isMenuOpen ? "nav-links--open" : ""
          }`}
          aria-label="Primary"
        >
          <Link to="/">
            Home
          </Link>

          <Link to="/search">
            Land Search &amp; RoR
          </Link>

          <AboutMenu />
          <FeaturesMenu />

          <Link to="/dashboard">
            {isOfficer ? "Officer Dashboard" : "Dashboard"}
          </Link>

          <HelpMenu />
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f2038" }}>
                  {user.full_name}
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  {user.role === "officer" ? (user.department || "Officer") : "Citizen"}
                </span>
              </div>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={handleLogout}
                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              className="btn btn--primary btn--sm"
              to="/login"
            >
              Login
            </Link>
          )}

          <button
            className="nav-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;