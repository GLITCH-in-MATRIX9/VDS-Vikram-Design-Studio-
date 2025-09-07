import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

const textColor = "text-[#474545]";

const AdminHome = () => {
  // Tooltip appears when you hover the question mark, giving you a friendly dashboard summary
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipContent = "This dashboard gives you a quick overview of key metrics. Monitor project status, live applicant counts, and a summary of recent changes.";

  return (
    <div className="p-10 bg-[#f3efee] min-h-screen relative">
      <div className="flex justify-between items-start mb-10">
        <h1 className={`text-2xl font-semibold uppercase text-[#6E6A6B]`}>
          Welcome, User Name
        </h1>

        {/* Question mark button with hover popup */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button className={`text-xl hover:opacity-70 ${textColor}`}>
            <FaQuestionCircle />
          </button>
          {showTooltip && (
            <div className="absolute right-0 mt-2 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 z-10 transition-opacity duration-300 opacity-100">
              <p className="text-sm text-gray-700 font-inter">
                {tooltipContent}
              </p>
              <div className="absolute top-[-8px] right-2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
            </div>
          )}
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
          <StatCard value="32" label="Total Projects" />
          <StatCard value="16" label="Live Projects" />
          <StatCard value="4:2" label="Positions Open : Categories" />
          <StatCard value="45" label="Applicants Total" />
          <StatCard value="12" label="New Applicants Since DD/MM/YY" />
          <StatCard value="8" label="Shortlisted Candidates" />
        </div>

        <div className="w-full lg:w-1/3 border rounded-lg p-6 shadow-sm min-h-[250px] border-[#7E797A]">
          <h2 className={`font-semibold mb-2 uppercase ${textColor}`}>
            Edit History
          </h2>
          <p className={`text-sm ${textColor} opacity-70 uppercase`}>
            No recent edits available.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }) => (
  <div className="bg-white shadow rounded-lg p-8">
    <div className={`text-3xl font-bold mb-2 uppercase ${textColor}`}>
      {value}
    </div>
    <p className={`text-sm uppercase ${textColor}`}>{label}</p>
  </div>
);

export default AdminHome;