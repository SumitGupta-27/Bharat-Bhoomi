import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
import India from "@svg-maps/india";

// Real, geographically accurate map data for all 28 states + 8 union
// territories of India, from the @svg-maps/india package
// (map data licensed CC BY 4.0, original source: mapsvg.com/maps/india).

function IndiaMap() {
  // Runs whenever a state/UT is clicked.
  // react-svg-map sets the location's "name" and "id" as real attributes
  // on the clicked <path>, so we can read them straight off the event.
  function handleStateClick(event) {
    const stateName = event.target.attributes.name.value;
    const stateId = event.target.attributes.id.value;

    console.log("Selected state:", stateName);

    // Later, once React Router is set up, navigate from here, e.g.:
    // navigate(`/land-records/${stateId}`);
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
          <strong>Click on a State</strong>to access Land Records
        </p>
      </div>
    </div>
  );
}

export default IndiaMap;
