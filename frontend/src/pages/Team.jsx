import React from 'react';
import Heading from '../components/Teams/Heading';
import MarqueeImages from '../components/Teams/MarqueeImages';
import TeamMembers from '../components/Teams/TeamMembers';

const Team = () => {
  return (
    <div>
      <Heading />
      <MarqueeImages />
      <TeamMembers />
    </div>
  );
};

export default Team;
