import React from "react";
import AboutHeadingUpdates from "./AboutPageComponents/AboutHeadingUpdates";
import AboutMetricsUpdates from "./AboutPageComponents/AboutMetricsUpdates";
import AboutSectionUpdates from "./AboutPageComponents/AboutSectionUpdates";

const AboutAdminPanel = () => {
  return (
    <div>
      <AboutHeadingUpdates />
      <AboutMetricsUpdates/>
      <AboutSectionUpdates/>
    </div>
  );
};

export default AboutAdminPanel;
