// Edit this array to add, remove, or change feature cards.
// Each item needs: an icon (SVG), a color, a title, and a description.
const features = [
  {
    color: "blue",
    title: "Multi-Department Access",
    desc: "All concerned departments work on a single platform.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="7" height="7" rx="1" />
        <rect x="14" y="4" width="7" height="7" rx="1" />
        <rect x="3" y="15" width="7" height="7" rx="1" />
        <rect x="14" y="15" width="7" height="7" rx="1" />
        <path d="M10 7.5h4M10 18.5h4M7.5 11v4M17.5 11v4" />
      </svg>
    ),
  },
  {
    color: "indigo",
    title: "Secure & Reliable",
    desc: "Data security, role-based access & audit logs.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" />
        <path d="M9.5 12l1.8 1.8L14.5 10" />
      </svg>
    ),
  },
  {
    color: "green",
    title: "Real-time Updates",
    desc: "Instant updates from authorized departments.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 11-3.3-6.9" />
        <path d="M21 4v5h-5" />
      </svg>
    ),
  },
  {
    color: "amber",
    title: "Dispute Detection",
    desc: "Identify land conflicts and litigation early.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l9 16H3z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    color: "teal",
    title: "GIS Integrated",
    desc: "Advanced mapping for better planning & governance.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="17" r="2" />
        <circle cx="19" cy="17" r="2" />
        <path d="M12 7v4M12 11L6.5 15.3M12 11l5.5 4.3" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <h2 className="section-heading">
          Integrated. Transparent. Accountable.
        </h2>
        <div className="features__grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span
                className={`feature-card__icon feature-card__icon--${feature.color}`}
                aria-hidden="true"
              >
                {feature.icon}
              </span>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__desc">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
