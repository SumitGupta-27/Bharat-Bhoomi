import { useState } from "react";
import { Link } from "react-router-dom";
import HelpMenu from "./HelpMenu/HelpMenu.jsx";
import AboutMenu from "./AboutMenu/AboutMenu.jsx";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((prevState) => !prevState);
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">

        {/* Brand now correctly goes to Home */}
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
          {/* Fixed Home button */}
          <Link to="/">
            Home
          </Link>

          <AboutMenu />
          <a href="#features">Features</a>
          <a href="#dashboard">Dashboard</a>

          <HelpMenu />
        </nav>

        <div className="nav-actions">
          <Link
            className="btn btn--primary btn--sm"
            to="/login"
          >
            Login
          </Link>

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