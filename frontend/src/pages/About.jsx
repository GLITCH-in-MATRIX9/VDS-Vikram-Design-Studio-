import React from 'react';

import AboutHeading from '../components/AboutPage/AboutHeading';
import AboutMetrics from '../components/AboutPage/AboutMetrics';
import Architecture from '../components/AboutPage/Architecture';
import Collaborators from '../components/AboutPage/Collaborators';
import Engineering from '../components/AboutPage/Engineering';
import Interior from '../components/AboutPage/Interior';
import LandScape from '../components/AboutPage/LandScape';
import Planning from '../components/AboutPage/Planning';

const About = () => {
  return (
    <div>
      <AboutHeading />
      <AboutMetrics />
      <Architecture />
      <Interior />
      <LandScape />
      <Engineering />
      <Planning />
      <Collaborators />
    </div>
  );
};

export default About;
