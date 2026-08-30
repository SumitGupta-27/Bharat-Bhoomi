import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { FEATURES } from "../data/featuresContent.js";
import { FEATURE_ICONS } from "../components/FeaturesMenu/featuresIcons.jsx";
import "./FeaturesPage.css";

function FeaturesPage() {
  const location = useLocation();

  // React Router doesn't auto-scroll to a #hash after navigating to a new
  // route, so we do it manually — this is what makes clicking a feature in
  // the navbar dropdown ("/features#document-verification") land on the
  // right section instead of just the top of the page.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      // Wait a tick so the page has finished laying out first.
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

  return (
    <>
      <a className="skip-link" href="#features-main">
        Skip to content
      </a>
      <Navbar />

      <main id="features-main" className="features-page-body">
        <section className="features-hero">
          <div className="container">
            <p className="features-hero__eyebrow">Platform Features</p>
            <h1 className="features-hero__title">
              Everything Bharat Bhoomi gives you
            </h1>
            <p className="features-hero__desc">
              A single platform connecting departments, records, maps and
              citizens — built for accuracy, transparency and speed.
            </p>

            <nav className="features-jumplist" aria-label="Jump to a feature">
              {FEATURES.map((feature) => (
                <a key={feature.slug} href={`#${feature.slug}`}>
                  {feature.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="container features-list">
          {FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <article
                key={feature.slug}
                id={feature.slug}
                className="feature-section"
              >
                <span
                  className={`feature-section__icon feature-section__icon--${feature.color}`}
                  aria-hidden="true"
                >
                  {Icon && <Icon />}
                </span>
                <div>
                  <h2 className="feature-section__title">{feature.title}</h2>
                  <p className="feature-section__desc">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default FeaturesPage;