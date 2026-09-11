import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { FEEDBACK_CATEGORIES, FEEDBACK_TYPES } from "../data/helpContent.js";
import { IconChevronRight, IconUpload, IconCheckCircle } from "../components/HelpMenu/icons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import "./HelpPages.css";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  category: "",
  requestType: "",
  subject: "",
  description: "",
};

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.phone.trim() && !/^[0-9+\-\s]{7,15}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.category) {
    errors.category = "Please select a department or category.";
  }

  if (!values.requestType) {
    errors.requestType = "Please select a request type.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Please describe your request.";
  } else if (values.description.trim().length < 15) {
    errors.description = "Please provide a bit more detail (at least 15 characters).";
  }

  if (!values.consent) {
    errors.consent = "Please confirm the information provided is correct.";
  }

  return errors;
}

function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("submit"); // 'submit' | 'track'
  const [values, setValues] = useState(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [referenceId, setReferenceId] = useState(null);
  const fileInputRef = useRef(null);

  // Tracking state
  const [trackRefId, setTrackRefId] = useState(searchParams.get("ref") || "");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [trackError, setTrackError] = useState("");

  // Autofill user info if logged in
  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        fullName: prev.fullName || user.full_name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Prefill the request type from the mega-menu / Help page links
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && FEEDBACK_TYPES.includes(typeParam)) {
      setValues((prev) => ({ ...prev, requestType: typeParam }));
    }
    const refParam = searchParams.get("ref");
    if (refParam) {
      setActiveTab("track");
      setTrackRefId(refParam);
      handleTrackSubmit(null, refParam);
    }
  }, [searchParams]);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    const validationErrors = validate({ ...values, consent });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.submitGrievance({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        category: values.category,
        requestType: values.requestType,
        subject: values.subject,
        description: values.description,
        attachmentName: fileName,
      });

      if (data.success) {
        setReferenceId(data.referenceId);
      }
    } catch (err) {
      setSubmitError(err.message || "Failed to submit grievance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTrackSubmit(event, refToSearch = trackRefId) {
    if (event) event.preventDefault();
    if (!refToSearch.trim()) return;

    setTrackError("");
    setTrackedGrievance(null);
    setTrackingLoading(true);

    try {
      const data = await api.trackGrievance(refToSearch.trim());
      if (data.success && data.grievance) {
        setTrackedGrievance(data.grievance);
      }
    } catch (err) {
      setTrackError(err.message || `No record found for Reference ID "${refToSearch}".`);
    } finally {
      setTrackingLoading(false);
    }
  }

  function resetForm() {
    setValues(user ? { fullName: user.full_name, email: user.email, phone: user.phone || "", category: "", requestType: "", subject: "", description: "" } : EMPTY_FORM);
    setConsent(false);
    setFileName("");
    setErrors({});
    setReferenceId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
          <h1 className="help-subpage-header__title">
            Grievance, Feedback &amp; Tracking
          </h1>
          <p className="help-subpage-header__desc">
            Report incorrect land information, raise a grievance, or track the resolution status of an existing request with the concerned department.
          </p>

          {/* Tab Switcher */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              type="button"
              className={`btn ${activeTab === "submit" ? "btn--primary" : "btn--outline"} btn--sm`}
              onClick={() => setActiveTab("submit")}
            >
              📝 Submit Grievance / Feedback
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "track" ? "btn--primary" : "btn--outline"} btn--sm`}
              onClick={() => setActiveTab("track")}
            >
              🔍 Track by Reference ID
            </button>
          </div>
        </div>

        {activeTab === "submit" ? (
          <div className="container feedback-layout">
            <div className="feedback-form-card">
              <h2 className="feedback-form-card__title">
                Submit Feedback or Grievance
              </h2>
              <p className="feedback-form-card__desc">
                Fields marked with <span className="required">*</span> are required. Your request will be directly routed to the department in our central registry.
              </p>

              {submitError && (
                <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>
                  ⚠️ {submitError}
                </div>
              )}

              <form className="feedback-form" onSubmit={handleSubmit} noValidate>
                <div className="feedback-form__row">
                  <div className={`ff-field ${errors.fullName ? "ff-field--error" : ""}`}>
                    <label className="ff-field__label" htmlFor="fb-name">
                      Full Name<span className="required">*</span>
                    </label>
                    <input
                      id="fb-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={values.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                      <span className="ff-field__error">{errors.fullName}</span>
                    )}
                  </div>

                  <div className={`ff-field ${errors.email ? "ff-field--error" : ""}`}>
                    <label className="ff-field__label" htmlFor="fb-email">
                      Email Address<span className="required">*</span>
                    </label>
                    <input
                      id="fb-email"
                      type="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                    {errors.email && (
                      <span className="ff-field__error">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="feedback-form__row">
                  <div className={`ff-field ${errors.phone ? "ff-field--error" : ""}`}>
                    <label className="ff-field__label" htmlFor="fb-phone">
                      Phone Number
                      <span className="ff-field__optional">(optional)</span>
                    </label>
                    <input
                      id="fb-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={values.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                    {errors.phone && (
                      <span className="ff-field__error">{errors.phone}</span>
                    )}
                  </div>

                  <div className={`ff-field ${errors.category ? "ff-field--error" : ""}`}>
                    <label className="ff-field__label" htmlFor="fb-category">
                      Department / Category<span className="required">*</span>
                    </label>
                    <select
                      id="fb-category"
                      value={values.category}
                      onChange={(e) => updateField("category", e.target.value)}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {FEEDBACK_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className="ff-field__error">{errors.category}</span>
                    )}
                  </div>
                </div>

                <div className={`ff-field ${errors.requestType ? "ff-field--error" : ""}`}>
                  <label className="ff-field__label" htmlFor="fb-type">
                    Type of Request<span className="required">*</span>
                  </label>
                  <select
                    id="fb-type"
                    value={values.requestType}
                    onChange={(e) => updateField("requestType", e.target.value)}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {FEEDBACK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.requestType && (
                    <span className="ff-field__error">{errors.requestType}</span>
                  )}
                </div>

                <div className={`ff-field ${errors.subject ? "ff-field--error" : ""}`}>
                  <label className="ff-field__label" htmlFor="fb-subject">
                    Subject<span className="required">*</span>
                  </label>
                  <input
                    id="fb-subject"
                    type="text"
                    placeholder="Briefly summarize your request"
                    value={values.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                  />
                  {errors.subject && (
                    <span className="ff-field__error">{errors.subject}</span>
                  )}
                </div>

                <div className={`ff-field ${errors.description ? "ff-field--error" : ""}`}>
                  <label className="ff-field__label" htmlFor="fb-description">
                    Detailed Description<span className="required">*</span>
                  </label>
                  <textarea
                    id="fb-description"
                    placeholder="Share as much detail as possible — survey number, location, department involved, etc."
                    value={values.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                  {errors.description && (
                    <span className="ff-field__error">{errors.description}</span>
                  )}
                </div>

                <div className="ff-field">
                  <label className="ff-field__label" htmlFor="fb-attachment">
                    Attachment
                    <span className="ff-field__optional">(optional)</span>
                  </label>
                  <div className="ff-file">
                    <button
                      type="button"
                      className="ff-file__button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IconUpload />
                      Choose File
                    </button>
                    <span className="ff-file__name">
                      {fileName || "No file chosen"}
                    </span>
                    <input
                      ref={fileInputRef}
                      id="fb-attachment"
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                <label className="ff-consent" htmlFor="fb-consent">
                  <input
                    id="fb-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  I confirm that the information provided is correct.
                </label>
                {errors.consent && (
                  <span className="ff-field__error">{errors.consent}</span>
                )}

                <div className="feedback-form__submit-row">
                  <button className="btn btn--primary" type="submit" disabled={submitting}>
                    {submitting ? "Submitting to Central Registry…" : "Submit to Department"}
                  </button>
                </div>
              </form>
            </div>

            <aside className="feedback-aside">
              <div className="feedback-aside__card">
                <h3>Before you submit</h3>
                <p>
                  Have your survey number, district and any related document handy — it helps officers resolve your request faster.
                </p>
              </div>
              <div className="feedback-aside__card">
                <h3>Response time</h3>
                <p>
                  Grievances are registered in the centralized audit ledger and acknowledged immediately with a tracking Reference ID.
                </p>
              </div>
              <div className="feedback-aside__card">
                <h3>Already submitted?</h3>
                <p>
                  Use your Reference ID to check live progress, investigating officer remarks, and resolution notes.
                </p>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  style={{ marginTop: 10 }}
                  onClick={() => setActiveTab("track")}
                >
                  Track an existing request →
                </button>
              </div>
            </aside>
          </div>
        ) : (
          /* Track Grievance View */
          <div className="container" style={{ maxWidth: 840, paddingBlock: "30px 60px" }}>
            <div className="feedback-form-card">
              <h2 className="feedback-form-card__title">Track Grievance Status</h2>
              <p className="feedback-form-card__desc">
                Enter your unique Reference ID (e.g. <code>BB-89210341</code>) to view the current status, department assignment, and officer notes.
              </p>

              {/* Sample Quick Demo Reference IDs */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Quick Test IDs:</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  style={{ border: "1px dashed #cbd5e1", fontSize: "0.78rem" }}
                  onClick={() => { setTrackRefId("BB-89210341"); handleTrackSubmit(null, "BB-89210341"); }}
                >
                  BB-89210341 (In Progress)
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  style={{ border: "1px dashed #cbd5e1", fontSize: "0.78rem" }}
                  onClick={() => { setTrackRefId("BB-55291044"); handleTrackSubmit(null, "BB-55291044"); }}
                >
                  BB-55291044 (Resolved)
                </button>
              </div>

              <form onSubmit={handleTrackSubmit} style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="Enter Reference ID (e.g. BB-89210341)"
                  value={trackRefId}
                  onChange={(e) => setTrackRefId(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: "1rem",
                  }}
                  required
                />
                <button type="submit" className="btn btn--primary" disabled={trackingLoading}>
                  {trackingLoading ? "Searching..." : "Track Status"}
                </button>
              </form>

              {trackError && (
                <div style={{ background: "#fee2e2", border: "1px solid #f87171", color: "#991b1b", padding: "12px 16px", borderRadius: 8 }}>
                  ⚠️ {trackError}
                </div>
              )}

              {trackedGrievance && (
                <div style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 24,
                  marginTop: 16
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" }}>Reference ID</span>
                      <h3 style={{ margin: "2px 0 0", color: "#0f2038", fontFamily: "monospace", fontSize: "1.3rem" }}>
                        {trackedGrievance.reference_id}
                      </h3>
                    </div>
                    <span style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      background: trackedGrievance.status === "Resolved" ? "#dcfce7" : trackedGrievance.status === "In Progress" ? "#dbeafe" : "#fef9c3",
                      color: trackedGrievance.status === "Resolved" ? "#15803d" : trackedGrievance.status === "In Progress" ? "#1d4ed8" : "#a16207"
                    }}>
                      ● {trackedGrievance.status}
                    </span>
                  </div>

                  {/* Progress Timeline */}
                  <div style={{ display: "flex", margin: "20px 0", position: "relative" }}>
                    {["Submitted", "Under Review", "In Progress", "Resolved"].map((step, idx) => {
                      const stages = ["Submitted", "Under Review", "In Progress", "Resolved"];
                      const currentIdx = stages.indexOf(trackedGrievance.status);
                      const isCompleted = currentIdx >= idx;
                      return (
                        <div key={step} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: isCompleted ? "#166534" : "#e2e8f0",
                            color: isCompleted ? "#fff" : "#64748b",
                            margin: "0 auto 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700
                          }}>
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <span style={{ fontSize: "0.75rem", color: isCompleted ? "#166534" : "#64748b", fontWeight: isCompleted ? 600 : 400 }}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                    <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                      <strong>Department Assigned:</strong> {trackedGrievance.assigned_department}
                    </p>
                    <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                      <strong>Request Type:</strong> {trackedGrievance.request_type}
                    </p>
                    <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
                      <strong>Subject:</strong> {trackedGrievance.subject}
                    </p>
                    <p style={{ margin: "6px 0", fontSize: "0.9rem", color: "#475569" }}>
                      <strong>Description:</strong> {trackedGrievance.description}
                    </p>
                    <p style={{ margin: "6px 0", fontSize: "0.85rem", color: "#64748b" }}>
                      <strong>Submitted On:</strong> {new Date(trackedGrievance.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {trackedGrievance.officer_notes && (
                    <div style={{
                      marginTop: 16,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      padding: 14,
                      borderRadius: 8
                    }}>
                      <h4 style={{ margin: "0 0 6px", color: "#166534", fontSize: "0.9rem" }}>Official Department Remarks:</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#14532d" }}>
                        {trackedGrievance.officer_notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Success Modal upon submission */}
      {referenceId && (
        <div
          className="ff-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ff-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div className="ff-modal">
            <span className="ff-modal__icon" aria-hidden="true">
              <IconCheckCircle />
            </span>
            <h2 className="ff-modal__title" id="ff-modal-title">
              Submitted Successfully
            </h2>
            <p className="ff-modal__desc">
              Thank you, {values.fullName.split(" ")[0] || "Citizen"}. Your request has been registered in the national land registry system.
            </p>
            <span className="ff-modal__ref">Reference ID: {referenceId}</span>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "8px 0 16px" }}>
              Please save this Reference ID to track updates from the assigned department.
            </p>
            <div className="ff-modal__actions">
              <button
                className="btn btn--outline btn--sm"
                type="button"
                onClick={() => {
                  const ref = referenceId;
                  resetForm();
                  setActiveTab("track");
                  setTrackRefId(ref);
                  handleTrackSubmit(null, ref);
                }}
              >
                Track this request now →
              </button>
              <button className="btn btn--primary btn--sm" type="button" onClick={resetForm}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackPage;