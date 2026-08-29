import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ABOUT_SECTIONS } from "../../data/aboutContent.js";
import {
  IconChevronDown,
  IconArrowRight,
  IconInfo,
  IconUsers,
  IconBuilding,
  IconBriefcase,
  IconShieldCheck,
  IconFileText,
  IconEye,
  IconTarget,
  IconScroll,
} from "./aboutIcons.jsx";
import "./AboutMenu.css";

// Icons for the left-side section list
const SECTION_ICONS = {
  "who-we-are": IconInfo,
  people: IconUsers,
  offices: IconBuilding,
  careers: IconBriefcase,
  transparency: IconShieldCheck,
  circulars: IconFileText,
};

// Icons for the cards shown under "Who We Are" / "People at Bharat Bhoomi"
const CARD_ICONS = {
  vision: IconEye,
  mission: IconTarget,
  "citizen-charter": IconScroll,
  departments: IconBuilding,
  officers: IconUsers,
  "past-composition": IconScroll,
};

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

function AboutMenu() {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(ABOUT_SECTIONS[0].slug);
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const isAboutRoute = location.pathname.startsWith("/about");
  const activeSection =
    ABOUT_SECTIONS.find((s) => s.slug === activeSlug) || ABOUT_SECTIONS[0];

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

  // Close on Escape, and return focus to the trigger.
  useEffect(() => {
    if (!open) return undefined;
    function handleKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        wrapperRef.current?.querySelector(".about-menu__trigger")?.focus();
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
      // On mobile/tablet, tapping only toggles the panel open — there's no
      // in-page "#about" section to jump to on small screens' stacked menu.
      event.preventDefault();
      setOpen((prev) => !prev);
    }
    // On desktop we intentionally do NOT preventDefault: this preserves the
    // existing behaviour of "#about" scrolling to the homepage About section.
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div
      className="about-menu"
      ref={wrapperRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      
<a
  href="#about"
  className={`about-menu__trigger ${
    isAboutRoute ? "about-menu__trigger--active" : ""
  }`}
  aria-haspopup="true"
  aria-expanded={open}
  onClick={handleTriggerClick}
  onFocus={openMenu}
>
  About
  <IconChevronDown
    className={`about-menu__caret ${
      open ? "about-menu__caret--open" : ""
    }`}
  />
</a>
      {open && (
        <div className="about-menu__panel" role="menu" aria-label="About menu">
          <div className="about-menu__panel-inner container">
            <nav className="about-menu__sections" aria-label="About categories">
              {ABOUT_SECTIONS.map((section) => {
                const Icon = SECTION_ICONS[section.slug] || IconInfo;
                const isActive = activeSlug === section.slug;
                return (
                  <Link
                    key={section.slug}
                    to={`/about/${section.slug}`}
                    className={`about-menu__section ${isActive ? "about-menu__section--active" : ""}`}
                    onMouseEnter={() => setActiveSlug(section.slug)}
                    onFocus={() => setActiveSlug(section.slug)}
                    onClick={closeMenu}
                  >
                    <span className="about-menu__section-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span>{section.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="about-menu__divider" aria-hidden="true" />

            <div className="about-menu__content">
              {activeSection.type === "cards" ? (
                <>
                  <p className="about-menu__content-label">
                    {activeSection.label}
                  </p>
                  <div className="about-card-grid">
                    {activeSection.cards.map((card) => {
                      const CardIcon = CARD_ICONS[card.slug] || IconInfo;
                      return (
                        <Link
                          key={card.slug}
                          to={`/about/${card.slug}`}
                          className="about-card"
                          onClick={closeMenu}
                        >
                          <span className="about-card__icon" aria-hidden="true">
                            <CardIcon />
                          </span>
                          <span className="about-card__title">{card.title}</span>
                          <span className="about-card__subtitle">
                            {card.subtitle}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="about-menu__simple">
                  <p className="about-menu__content-label">
                    {activeSection.label}
                  </p>
                  <p className="about-menu__simple-text">
                    {activeSection.summary}
                  </p>
                  <Link
                    to={`/about/${activeSection.slug}`}
                    className="about-menu__cta"
                    onClick={closeMenu}
                  >
                    {activeSection.ctaLabel}
                    <IconArrowRight />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutMenu;