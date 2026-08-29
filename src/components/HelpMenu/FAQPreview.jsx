import { useState } from "react";
import { Link } from "react-router-dom";
import { FAQS } from "../../data/helpContent.js";
import { IconChevronDown } from "./icons.jsx";

/**
 * Accessible accordion for FAQ items. Only one item stays open at a time.
 * Used both as a short preview (mega-menu, Help Center page via `limit`)
 * and as the full list on the /help/faq page.
 *
 * Props:
 * - limit: only show the first N items (omit to show all)
 * - showViewAll: show a "View All FAQs" link to /help/faq at the bottom
 * - onNavigate: called when the "View All FAQs" link is clicked
 */
function FAQPreview({ limit, showViewAll = false, onNavigate }) {
  const [openId, setOpenId] = useState(null);
  const items = limit ? FAQS.slice(0, limit) : FAQS;

  function toggle(id) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className="faq-accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
          >
            <h3 className="faq-item__heading">
              <button
                type="button"
                className="faq-item__trigger"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                id={`${item.id}-trigger`}
                onClick={() => toggle(item.id)}
              >
                {item.question}
                <IconChevronDown className="faq-item__chevron" />
              </button>
            </h3>
            <div
              className="faq-item__panel"
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-trigger`}
              aria-hidden={!isOpen}
            >
              <div className="faq-item__panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}

      {showViewAll && (
        <Link className="faq-accordion__view-all" to="/help/faq" onClick={onNavigate}>
          View All FAQs
        </Link>
      )}
    </div>
  );
}

export default FAQPreview;