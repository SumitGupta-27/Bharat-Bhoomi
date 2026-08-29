import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Statistics from "./components/Statistics.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import LoginPage from "./components/LoginPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import ResourcePage from "./pages/ResourcePage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";

function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <Statistics />
        <Features />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/help" element={<HelpPage />} />
      <Route path="/help/resources" element={<ResourcePage />} />
      <Route path="/help/faq" element={<FAQPage />} />
      <Route path="/help/feedback" element={<FeedbackPage />} />
      {/* Catches /help/handbooks, /help/bharat-bhoomi, /help/mythbusters,
          /help/videos — React Router always matches the static routes
          above first, so this never shadows /help/faq or /help/feedback. */}
      <Route path="/help/:slug" element={<ResourcePage />} />
    </Routes>
  );
}

export default App;