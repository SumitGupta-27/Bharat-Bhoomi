import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
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
import AboutDetailPage from "./pages/AboutDetailPage.jsx";
import FeaturesPage from "./pages/FeaturesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PublicSearchPage from "./pages/PublicSearchPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

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
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<PublicSearchPage />} />

        <Route path="/help" element={<HelpPage />} />
        <Route path="/help/resources" element={<ResourcePage />} />
        <Route path="/help/faq" element={<FAQPage />} />
        <Route path="/help/feedback" element={<FeedbackPage />} />
        <Route path="/help/:slug" element={<ResourcePage />} />
        <Route path="/about/:slug" element={<AboutDetailPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;