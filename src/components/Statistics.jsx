// Edit this array to change the statistics shown on the homepage
const stats = [
  { number: "28", label: "States" },
  { number: "780+", label: "Districts" },
  { number: "6.5 Cr+", label: "Land Parcels" },
  { number: "100+", label: "Departments" },
  { number: "24/7", label: "Online Access" },
];

function Statistics() {
  return (
    <section className="stats" aria-label="Portal statistics">
      <div className="container stats__grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card__number">{stat.number}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;
