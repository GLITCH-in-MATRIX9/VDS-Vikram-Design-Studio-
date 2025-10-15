import React from "react";
import Heading from "../components/Teams/Heading";
import MarqueeImages from "../components/Teams/MarqueeImages";
import TeamMembers from "../components/Teams/TeamMembers";
import SectionDivider from "../components/SectionDivider";

const Team = () => {
  return (
    <div className="bg-[#F2EFEE]">
      <Heading />
      <MarqueeImages />
      <SectionDivider />
      <TeamMembers />
    </div>
  );
};

export default Team;
