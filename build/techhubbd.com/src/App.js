import React from "react";
import Hero from "./components/Hero";
import Contact from "./components/Contact";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      {/* Hero Section */}
      <Hero />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}

export default App;
