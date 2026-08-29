import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FAQPreview from "../components/HelpMenu/FAQPreview.jsx";
import { IconChevronRight } from "../components/HelpMenu/icons.jsx";
import "./HelpPages.css";

function FAQPage() {
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
            Frequently Asked Questions
          </h1>
          <p className="help-subpage-header__desc">
            Answers to the questions we hear most often about land records,
            verification and the Bharat Bhoomi platform. Can&apos;t find what
            you need?{" "}
            <Link to="/help/feedback?type=Feedback">Send us feedback</Link>.
          </p>
        </div>

        <section className="help-section" style={{ borderBottom: "none" }}>
          <div className="container">
            <FAQPreview />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default FAQPage;