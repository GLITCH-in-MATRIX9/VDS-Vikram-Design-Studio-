import React from 'react';

import AboutHeading from '../components/AboutPage/AboutHeading';
import AboutMetrics from '../components/AboutPage/AboutMetrics';
import aboutSectionData from "../Data/aboutSections.json"
import AboutSection from '../components/AboutPage/AboutSection';
import SectionDivider from "../components/SectionDivider"

const About = () => {
  return (
    <div>
      <AboutHeading />
      <SectionDivider />
      <AboutMetrics />
      <SectionDivider />
      {aboutSectionData.map((sectionData, index) => (
        sectionData.heading.toLowerCase() !== "engineering" && 
          <>
            <AboutSection key={sectionData.id} data={sectionData}/>
            {index !== aboutSectionData.length - 1 && <SectionDivider/>}
          </>
      ))}
    </div>
  );
};

export default About;
