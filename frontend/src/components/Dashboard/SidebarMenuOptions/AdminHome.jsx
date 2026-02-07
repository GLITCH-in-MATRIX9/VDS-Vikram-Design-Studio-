import React, { useEffect, useState, useContext } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import projectApi from "../../../services/projectApi";
import jobApi from "../../../services/jobApi";
import { AuthContext } from "../../../context/authContext";
import dashboardImage from "../../../assets/other/admin-dashboard.png";


const textColor = "text-[#474545]";

const AdminHome = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRoles: 0,
    activeRoles: 0,
    totalApplications: 0,
  });

  const tooltipContent =
    "Overview of projects and current hiring activity.";

  /* =========================
     FETCH DASHBOARD STATS
  ========================== */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [projects, roles, applications] = await Promise.all([
          projectApi.getProjects(),
          jobApi.getRoles(),
          jobApi.getApplications(),
        ]);

        setStats({
          totalProjects: projects.length,
          totalRoles: roles.length,
          activeRoles: roles.filter((r) => r.isActive).length,
          totalApplications: applications.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user) {
    return (
      <div className="p-10 text-sm text-gray-500">
        Loading user…
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#F2EFEE] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <h1 className="text-2xl font-semibold uppercase text-[#6E6A6B]">
          Welcome, {user.name || "Admin"}
        </h1>

        {/* Tooltip */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button className={`text-xl ${textColor}`}>
            <FaQuestionCircle />
          </button>

          {showTooltip && (
            <div className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-lg shadow border border-gray-200 z-10">
              <p className="text-sm text-gray-700">
                {tooltipContent}
              </p>
              <div className="absolute top-[-8px] right-3 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            <StatCard value={stats.totalProjects} label="Total Projects" />
            <StatCard value={stats.totalRoles} label="Total Roles" />
            <StatCard value={stats.activeRoles} label="Active Roles" />
            <StatCard
              value={stats.totalApplications}
              label="Total Applications"
            />
          </div>
        )}

        {/* Right Image Panel */}
        <div className="w-full xl:w-1/3">
          <div className="h-full min-h-[260px] overflow-hidden">
            <img
              src={dashboardImage}
              alt="Dashboard visual"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   COMPONENTS
========================= */

const StatCard = ({ value, label }) => (
  <div className="bg-white shadow rounded-lg p-8">
    <div className="text-3xl font-bold mb-2 text-[#474545]">
      {value}
    </div>
    <p className="text-sm uppercase text-[#474545]">
      {label}
    </p>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white shadow rounded-lg p-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
);

export default AdminHome;
