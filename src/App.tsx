import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Awards from "./components/Awards";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Philosophy from "./components/Philosophy";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Awards />
        <Projects />
        <TechStack />
        <Philosophy />
        <Contact />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© 2026 Jang Taeung</span>
          <span>Built with React.</span>
        </div>
      </footer>
    </>
  );
}

export default App;