import React from 'react';
import Heading from '../components/Teams/Heading';
import CoreMembers from '../components/Teams/CoreMembers';
import MarqueeImages from '../components/Teams/MarqueeImages';
import TeamMembers from '../components/Teams/TeamMembers';

const Team = () => {
  return (
    <div>
      <Heading />
      <MarqueeImages />
      <CoreMembers />
      <TeamMembers />
    </div>
  );
};

export default Team;
