import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FEATURES } from "../../data/featuresContent.js";
import { IconChevronDown, FEATURE_ICONS } from "./featuresIcons.jsx";
import "./FeaturesMenu.css";

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

function FeaturesMenu() {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const isFeaturesRoute = location.pathname.startsWith("/features");

  // Close the menu whenever the route changes (e.g. after clicking a feature).
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

  // Close on Escape, and return focus to the trigger.
  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        wrapperRef.current?.querySelector(".features-menu__trigger")?.focus();
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
      // On mobile/tablet, tapping only toggles the panel open.
      event.preventDefault();
      setOpen((prev) => !prev);
    }
    // On desktop we intentionally do NOT preventDefault: this preserves the
    // existing behaviour of "#features" scrolling to the homepage section.
  }

  function closeMenu() {
    setOpen(false);
  }
return (
  <div
    className="features-menu"
    ref={wrapperRef}
    onMouseEnter={openMenu}
    onMouseLeave={scheduleClose}
  >
    <a
      href="#features"
      className={`features-menu__trigger ${
        isFeaturesRoute ? "features-menu__trigger--active" : ""
      }`}
      aria-haspopup="true"
      aria-expanded={open}
      onClick={handleTriggerClick}
      onFocus={openMenu}
    >
      Features
      <IconChevronDown
        className={`features-menu__caret ${
          open ? "features-menu__caret--open" : ""
        }`}
      />
    </a>
      {open && (
        <div
          className="features-menu__panel"
          role="menu"
          aria-label="Features menu"
        >
          <div className="features-menu__panel-inner container">
            <div className="features-menu__grid">
              {FEATURES.map((feature) => {
                const Icon = FEATURE_ICONS[feature.icon];
                return (
                  <Link
                    key={feature.slug}
                    to={`/features#${feature.slug}`}
                    className="features-menu__item"
                    onClick={closeMenu}
                  >
                    <span
                      className={`features-menu__item-icon features-menu__item-icon--${feature.color}`}
                      aria-hidden="true"
                    >
                      {Icon && <Icon />}
                    </span>
                    <span className="features-menu__item-text">
                      <span className="features-menu__item-title">
                        {feature.title}
                      </span>
                      <span className="features-menu__item-desc">
                        {feature.shortDesc}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="features-menu__footer">
              <Link to="/features" className="features-menu__footer-link" onClick={closeMenu}>
                View all features
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeaturesMenu;