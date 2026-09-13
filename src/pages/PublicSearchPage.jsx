import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import "./PublicSearchPage.css";

const ALL_STATES = [
  "All States",
  "Uttar Pradesh",
  "Maharashtra",
  "Karnataka",
  "Gujarat",
  "Rajasthan",
  "Bihar",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Telangana"
];

const LAND_TYPES = [
  "All Types",
  "Agricultural",
  "Residential",
  "Commercial",
  "Industrial",
  "Forest / Eco-sensitive"
];

export default function PublicSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const initialQuery = searchParams.get("q") || "";
  const initialState = searchParams.get("state") || "All States";

  const [query, setQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedType, setSelectedType] = useState("All Types");
  const [parcels, setParcels] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [parcelDetailLoading, setParcelDetailLoading] = useState(false);
  const [mutations, setMutations] = useState([]);

  // Sync with URL parameters
  useEffect(() => {
    const stateParam = searchParams.get("state");
    const qParam = searchParams.get("q");
    if (stateParam && stateParam !== selectedState) {
      setSelectedState(stateParam);
    }
    if (qParam !== null && qParam !== undefined && qParam !== query) {
      setQuery(qParam);
    }
  }, [searchParams]);

  // Fetch parcels whenever search criteria change
  useEffect(() => {
    fetchParcels(query, selectedState);
  }, [selectedState, selectedType]);

  async function fetchParcels(searchQ = query, stateToUse = selectedState) {
    setLoading(true);
    try {
      const data = await api.getParcels({
        query: searchQ,
        state: stateToUse !== "All States" ? stateToUse : undefined,
        land_type: selectedType !== "All Types" ? selectedType : undefined,
        limit: 50,
      });
      if (data.success) {
        setParcels(data.parcels);
        setTotalCount(data.total);
      }
    } catch (err) {
      console.error("Failed to load parcels:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearchParams({ q: query, state: selectedState });
    fetchParcels(query);
  }

  async function handleViewRoR(parcel) {
    setSelectedParcel(parcel);
    setParcelDetailLoading(true);
    try {
      const detail = await api.getParcel(parcel.id);
      if (detail.success) {
        setSelectedParcel(detail.parcel);
        setMutations(detail.mutations || []);
      }
    } catch (err) {
      console.error("Error loading RoR detail:", err);
    } finally {
      setParcelDetailLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <Navbar />

      <main className="search-page">
        {/* Page Header */}
        <section className="search-header">
          <div className="container">
            <span className="search-header__eyebrow">National Land Registry</span>
            <h1 className="search-header__title">Search Land Parcels &amp; Records of Rights</h1>
            <p className="search-header__desc">
              Access verified cadastral data, ownership records, survey numbers, and legal status across India.
            </p>

            {/* Main Search Bar */}
            <form className="search-bar-box" onSubmit={handleSearchSubmit}>
              <div className="search-input-group">
                <span className="search-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by Survey No. (e.g. 123/4), Owner Name, ULPIN, or Village..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="search-filter-select">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {ALL_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="search-filter-select">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {LAND_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn--primary search-submit-btn">
                Search Records
              </button>
            </form>
          </div>
        </section>

        {/* Results Container */}
        <section className="container search-results-section">
          <div className="search-results-header">
            <div>
              <h2>Land Records Directory</h2>
              <p className="results-count-text">
                Showing {parcels.length} of {totalCount} verified parcels
                {selectedState !== "All States" && ` in ${selectedState}`}
              </p>
            </div>
            {query && (
              <button
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setQuery("");
                  fetchParcels("");
                }}
              >
                Clear Search
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-spinner-box">
              <div className="spinner" />
              <p>Searching national land registry database...</p>
            </div>
          ) : parcels.length === 0 ? (
            <div className="empty-results-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M8 11h6" />
              </svg>
              <h3>No Land Parcels Found</h3>
              <p>We couldn&apos;t find any records matching &quot;{query}&quot;. Try adjusting your search query or state filter.</p>
            </div>
          ) : (
            <div className="parcels-grid">
              {parcels.map((parcel) => (
                <article key={parcel.id} className="parcel-card">
                  <div className="parcel-card__top">
                    <span className="parcel-ulpin">{parcel.ulpin}</span>
                    <span className={`status-pill status-pill--${parcel.verification_status === "Verified" ? "success" : parcel.verification_status === "Flagged" ? "danger" : "warning"}`}>
                      {parcel.verification_status}
                    </span>
                  </div>

                  <h3 className="parcel-survey">Survey No. {parcel.survey_number}</h3>
                  <p className="parcel-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mini-icon">
                      <path d="M12 2C8 2 5 5 5 9c0 5.5 7 13 7 13s7-7.5 7-13c0-4-3-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    {parcel.village}, Tehsil {parcel.tehsil}, {parcel.district}, {parcel.state}
                  </p>

                  <div className="parcel-details-list">
                    <div className="parcel-detail-row">
                      <span className="label">Primary Owner</span>
                      <span className="val highlight">{parcel.owner_name}</span>
                    </div>

                    {parcel.co_owners && parcel.co_owners.length > 0 && (
                      <div className="parcel-detail-row">
                        <span className="label">Co-Owners</span>
                        <span className="val">{parcel.co_owners.join(", ")}</span>
                      </div>
                    )}

                    <div className="parcel-detail-row">
                      <span className="label">Land Use</span>
                      <span className="val">{parcel.land_type}</span>
                    </div>

                    <div className="parcel-detail-row">
                      <span className="label">Total Area</span>
                      <span className="val"><strong>{parcel.area_acres} Acres</strong> ({parcel.area_sqft?.toLocaleString()} sq.ft)</span>
                    </div>

                    <div className="parcel-detail-row">
                      <span className="label">Tax Assessment</span>
                      <span className={`val ${parcel.tax_status === "Paid" ? "tax-paid" : "tax-pending"}`}>
                        ₹{Number(parcel.valuation_inr).toLocaleString("en-IN")} ({parcel.tax_status})
                      </span>
                    </div>

                    {parcel.dispute_status !== "Clear" && (
                      <div className="dispute-alert-box">
                        <span className="alert-badge">⚠️ {parcel.dispute_status}</span>
                        {parcel.dispute_details && <p className="alert-text">{parcel.dispute_details}</p>}
                      </div>
                    )}
                  </div>

                  <div className="parcel-card__action">
                    <button
                      type="button"
                      className="btn btn--primary btn--block btn--sm"
                      onClick={() => handleViewRoR(parcel)}
                    >
                      View Record of Rights (RoR)
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Record of Rights (RoR / Khatauni) Modal */}
        {selectedParcel && (
          <div className="ror-modal-overlay" onClick={() => setSelectedParcel(null)}>
            <div className="ror-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ror-modal-header no-print">
                <h2>Official Record of Rights (RoR / 7/12)</h2>
                <div className="ror-actions">
                  <button className="btn btn--outline btn--sm" onClick={handlePrint}>
                    🖨️ Print / Save Certificate
                  </button>
                  <button className="ror-close-btn" onClick={() => setSelectedParcel(null)} aria-label="Close">
                    ✕
                  </button>
                </div>
              </div>

              {/* Official Certificate Paper Document */}
              <div className="ror-document printable-document">
                <div className="ror-doc-header">
                  <img src="/images/Emblem_of_India_black.svg" alt="Emblem of India" className="ror-emblem" />
                  <div className="ror-doc-header-text">
                    <p className="ror-gov">Government of India • Ministry of Rural Development</p>
                    <h3 className="ror-title">Digital Record of Rights (RoR / Khatauni)</h3>
                    <p className="ror-sub">National Land Records Modernization Programme (NLRMP)</p>
                  </div>
                  <div className="ror-qr-placeholder">
                    <div className="qr-box">
                      <span>VERIFIED</span>
                      <span>DIGITAL COPY</span>
                    </div>
                  </div>
                </div>

                <div className="ror-metadata-grid">
                  <div><strong>ULPIN:</strong> {selectedParcel.ulpin}</div>
                  <div><strong>Survey / Khasra No:</strong> {selectedParcel.survey_number}</div>
                  <div><strong>State:</strong> {selectedParcel.state}</div>
                  <div><strong>District:</strong> {selectedParcel.district}</div>
                  <div><strong>Tehsil / Taluk:</strong> {selectedParcel.tehsil}</div>
                  <div><strong>Village / Mauza:</strong> {selectedParcel.village}</div>
                  <div><strong>Verification Status:</strong> {selectedParcel.verification_status}</div>
                  <div><strong>Verified By:</strong> {selectedParcel.verified_by_officer || "Revenue Authority"}</div>
                </div>

                <hr className="ror-hr" />

                <h4 className="ror-section-title">Ownership &amp; Title Particulars</h4>
                <table className="ror-table">
                  <thead>
                    <tr>
                      <th>Title Holder / Primary Owner</th>
                      <th>Co-Sharers / Joint Owners</th>
                      <th>Land Classification</th>
                      <th>Total Area</th>
                      <th>Govt Valuation</th>
                      <th>Tax Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>{selectedParcel.owner_name}</strong></td>
                      <td>{selectedParcel.co_owners?.length > 0 ? selectedParcel.co_owners.join(", ") : "Single Owner"}</td>
                      <td>{selectedParcel.land_type}</td>
                      <td>{selectedParcel.area_acres} Acres ({selectedParcel.area_sqft?.toLocaleString()} sq.ft)</td>
                      <td>₹{Number(selectedParcel.valuation_inr).toLocaleString("en-IN")}</td>
                      <td>{selectedParcel.tax_status}</td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="ror-section-title">Encumbrance, Legal &amp; Dispute Remarks</h4>
                <div className={`ror-legal-box ${selectedParcel.dispute_status !== "Clear" ? "has-dispute" : "is-clear"}`}>
                  <p><strong>Dispute Status:</strong> {selectedParcel.dispute_status}</p>
                  <p><strong>Details / Litigation:</strong> {selectedParcel.dispute_details || "No active civil disputes, mortgage claims or court injunctions registered against this parcel."}</p>
                </div>

                <h4 className="ror-section-title">Mutation &amp; Transaction History</h4>
                {mutations.length === 0 ? (
                  <p className="no-history-text">No subsequent mutations on record. Original allotment intact.</p>
                ) : (
                  <table className="ror-table">
                    <thead>
                      <tr>
                        <th>Mutation No.</th>
                        <th>Type of Deed</th>
                        <th>Previous Owner</th>
                        <th>New Owner</th>
                        <th>Execution Date</th>
                        <th>Approving Authority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mutations.map((m) => (
                        <tr key={m.id}>
                          <td><code>{m.mutation_number}</code></td>
                          <td>{m.type}</td>
                          <td>{m.previous_owner}</td>
                          <td><strong>{m.new_owner}</strong></td>
                          <td>{m.registered_date}</td>
                          <td>{m.officer_name} ({m.executing_department})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="ror-doc-footer">
                  <p>This is a digitally verified land record generated from the central Bharat Bhoomi National Land Registry database.</p>
                  <p>Generated on: {new Date().toLocaleDateString("en-IN")} • Security Token: <code>{selectedParcel.ulpin}-VERIFIED-GOV</code></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
