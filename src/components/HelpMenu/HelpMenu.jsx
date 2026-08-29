import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ResourceGrid from "./ResourceGrid.jsx";
import FAQPreview from "./FAQPreview.jsx";
import {
  IconChevronDown,
  IconFolder,
  IconHelp,
  IconMessageSquare,
  IconArrowRight,
} from "./icons.jsx";
import "./HelpMenu.css";

const SECTIONS = [
  { id: "resources", label: "Resources", icon: IconFolder },
  { id: "faq", label: "Frequently Asked Questions", icon: IconHelp },
  { id: "grievance", label: "Grievance & Feedback", icon: IconMessageSquare },
];

/** true when the viewport matches the desktop nav breakpoint (see App.css: 900px) */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > 900 : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

function HelpMenu() {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("resources");
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const isHelpRoute = location.pathname.startsWith("/help");

  // Close the menu whenever the route changes (e.g. after clicking a card/link).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click/tap — mainly needed for the mobile toggle mode.
  useEffect(() => {
    if (!open) return undefined;
    function handleOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  // Close on Escape, and return focus to the trigger button.
  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        wrapperRef.current?.querySelector(".help-menu__trigger")?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function openMenu() {
    if (!isDesktop) return;
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function scheduleClose() {
    if (!isDesktop) return;
    // Small delay so moving the cursor diagonally from the button into the
    // panel doesn't accidentally close the menu.
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function handleTriggerClick(event) {
    if (!isDesktop) {
      // On mobile/tablet the button only toggles the panel; navigation to
      // /help happens from the "Visit Help Center" link inside the panel.
      event.preventDefault();
      setOpen((prev) => !prev);
    }
    // On desktop, let the Link navigate to /help as normal — this is what
    // makes "click" work independently of the hover-opened preview.
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div
      className="help-menu"
      ref={wrapperRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        to="/help"
        className={`help-menu__trigger ${isHelpRoute ? "help-menu__trigger--active" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleTriggerClick}
        onFocus={openMenu}
        onKeyDown={handleTriggerKeyDown}
      >
        Help
        <IconChevronDown
          className={`help-menu__caret ${open ? "help-menu__caret--open" : ""}`}
        />
      </Link>

      {open && (
        <div className="help-menu__panel" role="menu" aria-label="Help menu">
          <div className="help-menu__panel-inner container">
            <nav className="help-menu__sections" aria-label="Help categories">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const to =
                  section.id === "faq"
                    ? "/help/faq"
                    : section.id === "grievance"
                    ? "/help/feedback"
                    : "/help/resources";
                return (
                  <Link
                    key={section.id}
                    to={to}
                    className={`help-menu__section ${isActive ? "help-menu__section--active" : ""}`}
                    onMouseEnter={() => setActiveSection(section.id)}
                    onFocus={() => setActiveSection(section.id)}
                    onClick={closeMenu}
                  >
                    <span className="help-menu__section-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    {section.label}
                  </Link>
                );
              })}
            </nav>

            <div className="help-menu__content">
              {activeSection === "resources" && (
                <>
                  <p className="help-menu__content-label">Resources</p>
                  <ResourceGrid compact onNavigate={closeMenu} />
                </>
              )}

              {activeSection === "faq" && (
                <>
                  <p className="help-menu__content-label">
                    Frequently Asked Questions
                  </p>
                  <FAQPreview limit={4} showViewAll onNavigate={closeMenu} />
                </>
              )}

              {activeSection === "grievance" && (
                <div className="help-menu__grievance">
                  <p className="help-menu__content-label">
                    Grievance &amp; Feedback
                  </p>
                  <p className="help-menu__grievance-text">
                    Report incorrect land information, raise a grievance, or
                    share feedback about the platform. Every submission gets
                    a reference ID you can use to follow up.
                  </p>
                  <div className="help-menu__grievance-actions">
                    <Link
                      to="/help/feedback?type=Feedback"
                      className="btn btn--primary btn--sm"
                      onClick={closeMenu}
                    >
                      Submit Feedback
                    </Link>
                    <Link
                      to="/help/feedback?type=Grievance"
                      className="btn btn--ghost btn--sm"
                      onClick={closeMenu}
                    >
                      File a Grievance
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="help-menu__footer container">
            <Link to="/help" className="help-menu__footer-link" onClick={closeMenu}>
              Visit Help Center
              <IconArrowRight />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpMenu;