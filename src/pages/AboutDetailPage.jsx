import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { ABOUT_SECTIONS, findAboutEntry } from "../data/aboutContent.js";
import {
  IconChevronRight,
  IconInfo,
  IconUsers,
  IconBuilding,
  IconBriefcase,
  IconShieldCheck,
  IconFileText,
  IconEye,
  IconTarget,
  IconScroll,
} from "../components/AboutMenu/aboutIcons.jsx";
import "./AboutPages.css";

const ICONS = {
  "who-we-are": IconInfo,
  people: IconUsers,
  offices: IconBuilding,
  careers: IconBriefcase,
  transparency: IconShieldCheck,
  circulars: IconFileText,
  vision: IconEye,
  mission: IconTarget,
  "citizen-charter": IconScroll,
  departments: IconBuilding,
  officers: IconUsers,
  "past-composition": IconScroll,
};

/**
 * Handles every /about/:slug route with one reusable component:
 *  - a top-level "cards" section slug (who-we-are, people) -> overview page
 *    with a description and its cards
 *  - a top-level "simple" section slug (offices, careers, transparency,
 *    circulars) -> a single full page
 *  - an individual card slug (vision, mission, citizen-charter,
 *    departments, officers, past-composition) -> its own detail page
 */
function AboutDetailPage() {
  const { slug } = useParams();
  const entry = findAboutEntry(slug);

  if (!entry) {
    return (
      <>
        <Navbar />
        <main id="about-main" className="about-page-body">
          <div className="container about-subpage-header">
            <Link className="about-back-link" to="/">
              <IconChevronRight />
              Back to Home
            </Link>
            <h1 className="about-subpage-header__title">Page not found</h1>
            <p className="about-subpage-header__desc">
              We couldn&apos;t find that About page. Here are the sections
              available.
            </p>
          </div>
          <section className="container" style={{ paddingBlock: "32px 64px" }}>
            <div className="about-overview-grid">
              {ABOUT_SECTIONS.map((section) => {
                const Icon = ICONS[section.slug] || IconInfo;
                return (
                  <Link
                    key={section.slug}
                    to={`/about/${section.slug}`}
                    className="about-card"
                  >
                    <span className="about-card__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="about-card__title">{section.label}</span>
                    <span className="about-card__subtitle">
                      {section.summary}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const Icon = ICONS[slug] || IconInfo;

  // ---- "cards" section overview (Who We Are / People at Bharat Bhoomi) ----
  if (entry.isSection && entry.type === "cards") {
    return (
      <>
        <a className="skip-link" href="#about-main">
          Skip to content
        </a>
        <Navbar />
        <main id="about-main" className="about-page-body">
          <div className="container about-subpage-header">
            <Link className="about-back-link" to="/">
              <IconChevronRight />
              Back to Home
            </Link>
            <p className="about-subpage-header__eyebrow">About Bharat Bhoomi</p>
            <h1 className="about-subpage-header__title">{entry.label}</h1>
            <p className="about-subpage-header__desc">{entry.summary}</p>
          </div>

          <section className="container" style={{ paddingBlock: "32px 64px" }}>
            <div className="about-overview-grid">
              {entry.cards.map((card) => {
                const CardIcon = ICONS[card.slug] || IconInfo;
                return (
                  <Link
                    key={card.slug}
                    to={`/about/${card.slug}`}
                    className="about-card"
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
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // ---- "simple" full page (Offices / Careers / Transparency / Circulars) ----
  if (entry.isSection && entry.type === "simple") {
    return (
      <>
        <a className="skip-link" href="#about-main">
          Skip to content
        </a>
        <Navbar />
        <main id="about-main" className="about-page-body">
          <div className="container about-subpage-header">
            <Link className="about-back-link" to="/">
              <IconChevronRight />
              Back to Home
            </Link>
            <p className="about-subpage-header__eyebrow">About Bharat Bhoomi</p>
            <h1 className="about-subpage-header__title">{entry.label}</h1>
          </div>
          <div className="container about-detail">
            <div className="about-detail__body">
              <p>{entry.description}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ---- individual card detail (Vision, Mission, Departments, ...) ----
  return (
    <>
      <a className="skip-link" href="#about-main">
        Skip to content
      </a>
      <Navbar />
      <main id="about-main" className="about-page-body">
        <div className="container about-subpage-header">
          <Link className="about-back-link" to={`/about/${entry.parentSlug}`}>
            <IconChevronRight />
            Back to {entry.parentLabel}
          </Link>
          <p className="about-subpage-header__eyebrow">{entry.parentLabel}</p>
          <h1 className="about-subpage-header__title">{entry.title}</h1>
          <p className="about-subpage-header__desc">{entry.subtitle}</p>
        </div>

        <div className="container about-detail">
          <div className="about-detail__body">
            <span className="about-card__icon" aria-hidden="true" style={{ marginBottom: 16 }}>
              <Icon />
            </span>
            <p>{entry.description}</p>
          </div>

          {entry.siblings?.length > 0 && (
            <aside className="about-detail__aside">
              <p className="about-detail__aside-title">
                More in {entry.parentLabel}
              </p>
              <div className="about-card-grid">
                {entry.siblings.map((sibling) => {
                  const SiblingIcon = ICONS[sibling.slug] || IconInfo;
                  return (
                    <Link
                      key={sibling.slug}
                      to={`/about/${sibling.slug}`}
                      className="about-card"
                    >
                      <span className="about-card__icon" aria-hidden="true">
                        <SiblingIcon />
                      </span>
                      <span className="about-card__title">
                        {sibling.title}
                      </span>
                      <span className="about-card__subtitle">
                        {sibling.subtitle}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AboutDetailPage;