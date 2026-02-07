import React from "react";

const JobOverview = ({ role }) => {
  return (
    <section className="space-y-10 text-[#3E3C3C]">

      {/* =========================
         JOB DESCRIPTION
      ========================== */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Job Description
        </h2>
        <p className="leading-relaxed text-[#474545]">
          {role.jobDescription}
        </p>
      </div>

      {/* =========================
         RESPONSIBILITIES
      ========================== */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Responsibilities
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-[#474545]">
          {role.responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* =========================
         REQUIREMENTS
      ========================== */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Requirements
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-[#474545]">
          {role.requirements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default JobOverview;
