function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <span className="footer__emblem" aria-hidden="true">
                <img src="/images/Emblem_of_India_white.svg" alt="" />
              </span>
              <div>
                <div className="footer__brand-name">Bharat Bhoomi</div>
                <div className="footer__brand-sub">
                  National Land Records &amp; Governance Portal
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="Quick links">
            <h3 className="footer__heading">Quick Links</h3>
            <ul className="footer__links">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="footer__heading">Resources</h3>
            <ul className="footer__links">
              <li>
                <a href="#">User Manual</a>
              </li>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Downloads</a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Policies">
            <h3 className="footer__heading">Policies</h3>
            <ul className="footer__links">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Use</a>
              </li>
              <li>
                <a href="#">Disclaimer</a>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="footer__heading">Connect</h3>
            <ul className="footer__links">
              <li>
                <a href="mailto:support@bhoomi.gov.in">
                  support@bhoomi.gov.in
                </a>
              </li>
              <li>Toll Free: 1800-XXX-XXXX</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 Government of India. All Rights Reserved.
          </p>
          <div className="footer__social" aria-label="Social media">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H17V3.7C16.6 3.65 15.5 3.5 14.2 3.5c-2.6 0-4.4 1.6-4.4 4.5v2.4H7v3.1h2.8V21z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.9a4.1 4.1 0 001.3 5.5c-.6 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 01-1.9.1c.5 1.6 2 2.8 3.9 2.9A8.3 8.3 0 012 18.6a11.6 11.6 0 006.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12s0-3.2-.4-4.7c-.3-.8-.9-1.5-1.7-1.7C18.4 5 12 5 12 5s-6.4 0-7.9.4c-.8.2-1.4.9-1.7 1.7C2 8.8 2 12 2 12s0 3.2.4 4.7c.3.8.9 1.4 1.7 1.7C5.6 19 12 19 12 19s6.4 0 7.9-.6c.8-.3 1.4-.9 1.7-1.7.4-1.5.4-4.7.4-4.7zM10 15.2V8.8l5.5 3.2z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.94 5a2 2 0 11-4 0 2 2 0 014 0zM3.3 8.8h3.3V21H3.3zM9.7 8.8h3.2v1.7h.05c.45-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.9V21h-3.3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
