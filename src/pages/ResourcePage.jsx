import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ResourceGrid from "../components/HelpMenu/ResourceGrid.jsx";
import { RESOURCES } from "../data/helpContent.js";
import {
  IconBook,
  IconLandmark,
  IconShield,
  IconPlay,
  IconChevronRight,
} from "../components/HelpMenu/icons.jsx";
import "./HelpPages.css";

const ICONS = {
  book: IconBook,
  landmark: IconLandmark,
  shield: IconShield,
  play: IconPlay,
};

/**
 * Handles two routes with one reusable component:
 *  - /help/resources        -> overview grid of all resources
 *  - /help/:slug             -> detail view for a single resource
 *    (handbooks, bharat-bhoomi, mythbusters, videos)
 */
function ResourcePage() {
  const { slug } = useParams();
  const resource = slug ? RESOURCES.find((item) => item.slug === slug) : null;

  // /help/resources (no slug) — overview grid
  if (!slug) {
    return (
      <>
        <a className="skip-link" href="#help-main">
          Skip to content
        </a>
        <Navbar />

        <main id="help-main" className="help-page-body">
          <div className="container help-subpage-header">
            <Link className="help-back-link" to="/help">
              <IconChevronRight />
              Back to Help Center
            </Link>
            <h1 className="help-subpage-header__title">Resources</h1>
            <p className="help-subpage-header__desc">
              Handbooks, verified information and step-by-step guides to help
              you work with land records confidently.
            </p>
          </div>

          <section className="help-section" style={{ borderBottom: "none" }}>
            <div className="container">
              <ResourceGrid />
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  // /help/:slug with an unknown slug — friendly fallback instead of a dead page
  if (!resource) {
    return (
      <>
        <Navbar />
        <main id="help-main" className="help-page-body">
          <div className="container help-subpage-header">
            <Link className="help-back-link" to="/help/resources">
              <IconChevronRight />
              Back to Resources
            </Link>
            <h1 className="help-subpage-header__title">Resource not found</h1>
            <p className="help-subpage-header__desc">
              We couldn&apos;t find that resource. Take a look at everything
              else we have available.
            </p>
          </div>
          <section className="help-section" style={{ borderBottom: "none" }}>
            <div className="container">
              <ResourceGrid />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // /help/:slug with a known slug — detail view
  const Icon = ICONS[resource.icon] || IconBook;
  const otherResources = RESOURCES.filter((item) => item.slug !== slug);

  return (
    <>
      <a className="skip-link" href="#help-main">
        Skip to content
      </a>
      <Navbar />

      <main id="help-main" className="help-page-body">
        <div className="container help-subpage-header">
          <Link className="help-back-link" to="/help/resources">
            <IconChevronRight />
            Back to Resources
          </Link>
        </div>

        <div className="container resource-detail">
          <div className="resource-detail__body">
            <span className="resource-detail__icon" aria-hidden="true">
              <Icon />
            </span>
            <h1 className="help-subpage-header__title">{resource.title}</h1>
            <p
              className="help-subpage-header__desc"
              style={{ marginBottom: 20 }}
            >
              {resource.subtitle}
            </p>
            <p>{resource.description}</p>

            <div className="resource-detail__note">
              This section is being populated with official content. In the
              meantime, use the Grievance &amp; Feedback form if you can't
              find what you're looking for.
            </div>
          </div>

          <aside className="resource-detail__aside">
            <p className="resource-detail__aside-title">Other resources</p>
            <div className="resource-grid">
              {otherResources.map((item) => {
                const OtherIcon = ICONS[item.icon] || IconBook;
                return (
                  <Link
                    key={item.slug}
                    to={`/help/${item.slug}`}
                    className="resource-card"
                  >
                    <span className="resource-card__icon" aria-hidden="true">
                      <OtherIcon />
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
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ResourcePage;