import React from "react";

import AboutHeading from "../components/AboutPage/AboutHeading";
import AboutMetrics from "../components/AboutPage/AboutMetrics";
import AboutSection from "../components/AboutPage/AboutSection";
import SectionDivider from "../components/SectionDivider";

const About = () => {
  return (
    <div>
      <AboutHeading />
      <SectionDivider />

      <AboutMetrics />
      <SectionDivider />

      {/* Sections are now fully backend-driven */}
      <AboutSection />
    </div>
  );
};

export default About;
