import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaGlobe,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import logo from "../../assets/navbar/VDSLOGOADMIN.png";

const SidebarLeft = ({ user, onLogout }) => {
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
  };

  const navItems = [
    { label: "Home", icon: <FaHome />, path: "/admin/dashboard/home" },
    {
      label: "Projects Portal",
      icon: <FaBriefcase />,
      path: "/admin/dashboard/projects",
    },
    {
      label: "Hiring Portal",
      icon: <FaUsers />,
      path: "/admin/dashboard/hiring",
    },
    {
      label: "Website Content",
      icon: <FaGlobe />,
      path: "/admin/dashboard/website-content",
    },
    {
      label: "Recent Activity",
      icon: <FaHistory />,
      path: "/admin/dashboard/activity",
    },
    { label: "Settings", icon: <FaCog />, path: "/admin/dashboard/settings" },
  ];

  const userName = user?.name || user?.email || "Admin User";
  const userRole = user?.role || "Admin";

  // Normalize role
  const normalizedRole = userRole?.toString().trim().toUpperCase();

  return (
    <div className="h-screen w-64 bg-[#D4CECA] flex flex-col justify-between py-6 px-4 text-[#333]">
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-24 mb-2" />
        </div>

        <hr className="border-gray-400 mb-6" />

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            // Restrict access only if NOT SUPER_ADMIN
            const isDisabled = normalizedRole !== "SUPER_ADMIN" && index >= 2;

            const baseClasses = `
              flex items-center gap-3 px-4 py-3 rounded
              ${isActive ? "bg-[#F2EFEE] text-[#474545] font-bold" : ""}
            `;

            const activeClasses = isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#e8e6e5] text-gray-700";

            return isDisabled ? (
              <div
                key={item.label}
                className={`${baseClasses} ${activeClasses}`}
                title="Access restricted to SUPER_ADMIN"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm tracking-wide uppercase font-semibold">
                  {item.label}
                </span>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`${baseClasses} ${activeClasses}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm tracking-wide uppercase font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="mt-6">
        <hr className="border-gray-400 mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 border rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div className="text-xs">
            <div className="uppercase text-gray-500">{normalizedRole}</div>
            <div className="font-medium text-sm capitalize">{userName}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 border border-gray-600 rounded text-gray-800 hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarLeft;
