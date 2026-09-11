import { useNavigate } from "react-router-dom";
import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
import India from "@svg-maps/india";

// Geographically accurate map data for all 28 states + 8 union
// territories of India, from the @svg-maps/india package
function IndiaMap() {
  const navigate = useNavigate();

  // Runs whenever a state/UT is clicked.
  function handleStateClick(event) {
    const stateName = event.target.attributes.name?.value;
    if (stateName) {
      navigate(`/search?state=${encodeURIComponent(stateName)}`);
    }
  }

  return (
    <div className="map-card">
      <SVGMap
        map={India}
        className="india-svg-map"
        locationClassName="india-state"
        onLocationClick={handleStateClick}
      />

      <div className="map-tooltip">
        <span className="map-tooltip__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C8 2 5 5 5 9c0 5.5 7 13 7 13s7-7.5 7-13c0-4-3-7-7-7z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
        </span>
        <p>
          <strong>Click on a State</strong> to search Land Records
        </p>
      </div>
    </div>
  );
}

export default IndiaMap;
