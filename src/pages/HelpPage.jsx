import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ResourceGrid from "../components/HelpMenu/ResourceGrid.jsx";
import FAQPreview from "../components/HelpMenu/FAQPreview.jsx";
import {
  IconSearch,
  IconFolder,
  IconHelp,
  IconMessageSquare,
} from "../components/HelpMenu/icons.jsx";
import "./HelpPages.css";

const QUICK_LINKS = [
  {
    to: "/help/resources",
    icon: IconFolder,
    title: "Resources",
    subtitle: "Handbooks, guides and how-to videos",
  },
  {
    to: "/help/faq",
    icon: IconHelp,
    title: "Frequently Asked Questions",
    subtitle: "Quick answers to common questions",
  },
  {
    to: "/help/feedback",
    icon: IconMessageSquare,
    title: "Grievance & Feedback",
    subtitle: "Report an issue or share feedback",
  },
];

function HelpPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearchSubmit(event) {
    event.preventDefault();
    // A full search index isn't built yet — route to the FAQ page (the
    // most likely place to find an answer) with the query preserved.
    navigate(`/help/faq?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <a className="skip-link" href="#help-main">
        Skip to content
      </a>
      <Navbar />

      <main id="help-main" className="help-page-body">
        <section className="help-hero">
          <div className="container">
            <p className="help-hero__eyebrow">Help Center</p>
            <h1 className="help-hero__title">How can we help you today?</h1>
            <p className="help-hero__desc">
              Find guides, answers to common questions, or get in touch with
              our team about land records and the Bharat Bhoomi platform.
            </p>

            <form className="help-search" onSubmit={handleSearchSubmit}>
              <span className="help-search__icon" aria-hidden="true">
                <IconSearch />
              </span>
              <input
                type="search"
                placeholder="Search help topics"
                aria-label="Search help topics"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
          </div>
        </section>

        <section className="help-section">
          <div className="container">
            <div className="help-section__head">
              <div>
                <h2 className="help-section__heading">Quick Access</h2>
                <p className="help-section__subheading">
                  Jump straight to the most common help categories.
                </p>
              </div>
            </div>

            <div className="help-quick-grid">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} className="resource-card">
                    <span className="resource-card__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="resource-card__text">
                      <span className="resource-card__title">
                        {item.title}
                      </span>
                      <span className="resource-card__subtitle">
                        {item.subtitle}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="help-section">
          <div className="container">
            <div className="help-section__head">
              <div>
                <h2 className="help-section__heading">Featured Resources</h2>
                <p className="help-section__subheading">
                  Manuals, verified information and step-by-step guides.
                </p>
              </div>
              <Link className="help-section__link" to="/help/resources">
                View all resources
              </Link>
            </div>

            <ResourceGrid />
          </div>
        </section>

        <section className="help-section">
          <div className="container">
            <div className="help-section__head">
              <div>
                <h2 className="help-section__heading">
                  Frequently Asked Questions
                </h2>
                <p className="help-section__subheading">
                  The questions we hear most often from citizens and
                  officers.
                </p>
              </div>
            </div>

            <FAQPreview limit={5} showViewAll />
          </div>
        </section>

        <section className="help-cta">
          <div className="container">
            <h2 className="help-cta__title">Need more help?</h2>
            <p className="help-cta__desc">
              Couldn&apos;t find what you were looking for? Reach out to us
              directly.
            </p>
            <div className="help-cta__actions">
              <Link className="btn btn--primary" to="/help/feedback?type=Feedback">
                Submit Feedback
              </Link>
              <Link className="btn btn--ghost" to="/help/feedback?type=Grievance">
                File a Grievance
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HelpPage;