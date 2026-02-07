import React from "react";
import ActivateRoles from "../HiringPortal/ActivateRoles";
import Submissions from "../HiringPortal/Submissions";

const HiringPortal = () => {
  return (
    <div className="min-h-screen bg-[#F6F2EF] px-8 py-6">
      <h1 className="text-sm tracking-widest text-gray-600 mb-6">
        Hiring Portal
      </h1>

      <ActivateRoles />
      <Submissions/>
    </div>
  );
};

export default HiringPortal;
