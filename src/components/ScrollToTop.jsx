import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Runs on every route change (pathname OR hash).
// - No hash → jump straight to the top of the new page.
// - Hash present → scroll to the matching element once it's rendered.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // Plain navigation: always start at the top, instantly (not smooth),
      // so it feels like a fresh page load rather than an animated scroll.
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    // Hash navigation (e.g. /features#interactive-map).
    // The target page may still be rendering its content on the same tick
    // this effect runs, so we wait a couple of animation frames before
    // looking for the element. If it's still not there (e.g. because it
    // loads after a data fetch), we retry a few more times.
    const id = hash.slice(1);
    let attempts = 0;
    let rafId;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < 20) {
        rafId = requestAnimationFrame(tryScroll);
      }
    };

    rafId = requestAnimationFrame(tryScroll);

    return () => cancelAnimationFrame(rafId);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;