import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Statistics from "./components/Statistics.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

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

export default App;
