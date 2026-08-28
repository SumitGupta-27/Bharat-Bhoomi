import IndiaMap from "./IndiaMap.jsx";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <h1 className="hero__title">
            <span>One Nation.</span>
            <span>One Land Record.</span>
            <span>One Trusted System.</span>
          </h1>
          <p className="hero__desc">
            A unified digital platform to manage, access and govern land
            records across India.
          </p>

          <ul className="hero__features">
            <li className="hero__feature">
              <span className="hero__feature-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Centralized Land Records
            </li>
            <li className="hero__feature">
              <span className="hero__feature-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Real-time Updates
            </li>
            <li className="hero__feature">
              <span className="hero__feature-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Transparency &amp; Trust
            </li>
            <li className="hero__feature">
              <span className="hero__feature-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Better Governance
            </li>
          </ul>

          <div className="hero__cta">
            <button className="btn btn--primary" type="button">
              Explore Map
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hero__visual">
          <IndiaMap />
        </div>
      </div>
    </section>
  );
}

export default Hero;
