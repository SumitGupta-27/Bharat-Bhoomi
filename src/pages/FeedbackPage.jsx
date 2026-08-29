import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { FEEDBACK_CATEGORIES, FEEDBACK_TYPES } from "../data/helpContent.js";
import { IconChevronRight, IconUpload, IconCheckCircle } from "../components/HelpMenu/icons.jsx";
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
  } else if (values.description.trim().length < 20) {
    errors.description = "Please provide a bit more detail (at least 20 characters).";
  }

  if (!values.consent) {
    errors.consent = "Please confirm the information provided is correct.";
  }

  return errors;
}

function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState(null);
  const fileInputRef = useRef(null);

  // Prefill the request type from the mega-menu / Help page links,
  // e.g. /help/feedback?type=Grievance
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && FEEDBACK_TYPES.includes(typeParam)) {
      setValues((prev) => ({ ...prev, requestType: typeParam }));
    }
  }, [searchParams]);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate({ ...values, consent });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    // No backend exists yet for this form — simulate a network submission
    // so the UI/UX (loading, success state, reference ID) is fully working
    // and ready to be wired up to a real API later.
    setTimeout(() => {
      const ref = `BB-${Date.now().toString().slice(-8)}`;
      setReferenceId(ref);
      setSubmitting(false);
    }, 900);
  }

  function resetForm() {
    setValues(EMPTY_FORM);
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
            Grievance &amp; Feedback
          </h1>
          <p className="help-subpage-header__desc">
            Report incorrect land information, raise a grievance, or share
            feedback about the platform. We'll route it to the right
            department.
          </p>
        </div>

        <div className="container feedback-layout">
          <div className="feedback-form-card">
            <h2 className="feedback-form-card__title">
              Submit Feedback or Grievance
            </h2>
            <p className="feedback-form-card__desc">
              Fields marked with <span className="required">*</span> are
              required.
            </p>

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
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
            </form>
          </div>

          <aside className="feedback-aside">
            <div className="feedback-aside__card">
              <h3>Before you submit</h3>
              <p>
                Have your survey number, district and any related document
                handy — it helps us resolve your request faster.
              </p>
            </div>
            <div className="feedback-aside__card">
              <h3>Response time</h3>
              <p>
                Grievances are typically acknowledged within 3 working days.
                You'll receive a reference ID to track your request.
              </p>
            </div>
            <div className="feedback-aside__card">
              <h3>Looking for answers instead?</h3>
              <p>
                Check the <Link to="/help/faq">Frequently Asked Questions</Link>{" "}
                — your question may already be answered there.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

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
              Submitted successfully
            </h2>
            <p className="ff-modal__desc">
              Thank you, {values.fullName.split(" ")[0] || "there"}. Your
              request has been received and will be reviewed by our team.
            </p>
            <span className="ff-modal__ref">Reference ID: {referenceId}</span>
            <div className="ff-modal__actions">
              <button className="btn btn--ghost btn--sm" type="button" onClick={resetForm}>
                Submit another
              </button>
              <Link className="btn btn--primary btn--sm" to="/help" onClick={resetForm}>
                Back to Help Center
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackPage;