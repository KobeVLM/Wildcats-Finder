import React from "react";
import Navbar from "../../components/navbar/Navbar";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-content">
        <h2>About Wildcats Finder</h2>
        {/* Your about content */}
      </div>
    </div>
  );
}

export default About;