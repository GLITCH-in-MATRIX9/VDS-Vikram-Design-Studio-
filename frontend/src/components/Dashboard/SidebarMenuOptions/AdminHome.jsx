import React, { useState, useEffect, useContext } from "react";
import { FaQuestionCircle, FaDownload } from "react-icons/fa";
import projectApi from "../../../services/projectApi";
import { AuthContext } from "../../../context/authContext"; // ⬅️ Use AuthContext

const textColor = "text-[#474545]";

const AdminHome = () => {
  const { user } = useContext(AuthContext); // ⬅️ Get user from context

  const [showTooltip, setShowTooltip] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    liveProjects: 0,
    positions: "0:0",
    applicantsTotal: 0,
    newApplicants: 0,
    shortlisted: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const tooltipContent =
    "This dashboard gives you a quick overview of key metrics. Monitor project status, live applicant counts, and a summary of recent changes.";

  // Fetch project stats
  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const projects = await projectApi.getProjects();
      const totalProjects = projects.length;
      const liveProjects = projects.filter((p) => p.active).length;
      const positions = `${liveProjects}:${new Set(projects.map((p) => p.category)).size}`;
      const applicantsTotal = projects.reduce((acc, p) => acc + (p.applicants || 0), 0);
      const newApplicants = projects.reduce((acc, p) => acc + (p.newApplicants || 0), 0);
      const shortlisted = projects.reduce((acc, p) => acc + (p.shortlisted || 0), 0);

      setStats({ totalProjects, liveProjects, positions, applicantsTotal, newApplicants, shortlisted });
    } catch (err) {
      console.error("Error fetching project stats:", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(); // fetch stats only, user comes from context
  }, []);

  if (!user) return <div>Loading user info...</div>; // fallback while context loads

  return (
    <div className="p-10 bg-[#F2EFEE] min-h-screen relative">
      <div className="flex justify-between items-start mb-10 gap-4">
        <h1 className={`text-2xl font-semibold uppercase text-[#6E6A6B]`}>
          Welcome, {user?.name || "User"}
        </h1>

        <div className="flex gap-3 items-center">
          {/* Tooltip Icon */}
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
                <p className="text-sm text-gray-700 font-inter">{tooltipContent}</p>
                <div className="absolute top-[-8px] right-2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
              </div>
            )}
          </div>

          {/* Download Icon */}
          <a
            href="/path/to/dashboard-guide.pdf"
            download
            className={`text-xl hover:opacity-70 ${textColor}`}
            title="Download Dashboard Guide"
          >
            <FaDownload />
          </a>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {isStatsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
            {[...Array(6)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
            <StatCard value={stats.totalProjects} label="Total Projects" />
            <StatCard value={stats.liveProjects} label="Live Projects" />
            <StatCard value={stats.applicantsTotal} label="Applicants Total" />
            <StatCard value={stats.newApplicants} label="New Applicants Since DD/MM/YY" />
            <StatCard value={stats.shortlisted} label="Shortlisted Candidates" />
          </div>
        )}

        <div className="w-full xl:w-1/3 border rounded-lg p-6 shadow-sm min-h-[250px] border-[#7E797A]">
          <h2 className={`font-semibold mb-2 uppercase ${textColor}`}>Edit History</h2>
          <p className={`text-sm ${textColor} opacity-70 uppercase`}>No recent edits available.</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }) => (
  <div className="bg-white shadow rounded-lg p-8">
    <div className={`text-3xl font-bold mb-2 uppercase ${textColor}`}>{value}</div>
    <p className={`text-sm uppercase ${textColor}`}>{label}</p>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white shadow rounded-lg p-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

export default AdminHome;
