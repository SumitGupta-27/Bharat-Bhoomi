import { Link } from "react-router-dom";
import { RESOURCES } from "../../data/helpContent.js";
import { IconBook, IconLandmark, IconShield, IconPlay } from "./icons.jsx";

const ICONS = {
  book: IconBook,
  landmark: IconLandmark,
  shield: IconShield,
  play: IconPlay,
};

/**
 * Renders the 4 resource cards (Handbooks, Bharat Bhoomi, Mythbusters,
 * How-to Videos). Used inside the navbar mega-menu and on the Help pages.
 *
 * Props:
 * - compact: smaller padding/icon, used inside the mega-menu
 * - onNavigate: called after a card is clicked (used to close the mega-menu)
 */
function ResourceGrid({ compact = false, onNavigate }) {
  return (
    <div
      className={`resource-grid ${compact ? "resource-grid--compact" : ""}`}
    >
      {RESOURCES.map((item) => {
        const Icon = ICONS[item.icon] || IconBook;
        return (
          <Link
            key={item.slug}
            to={`/help/${item.slug}`}
            className="resource-card"
            onClick={onNavigate}
          >
            <span className="resource-card__icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="resource-card__text">
              <span className="resource-card__title">{item.title}</span>
              <span className="resource-card__subtitle">{item.subtitle}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default ResourceGrid;