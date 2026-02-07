import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

const COLOR_PRIMARY = "#454545";
const COLOR_TEXT_PRIMARY = "#722F37";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F1EE]">
      <div className="bg-white rounded-lg p-10 w-full max-w-md flex flex-col items-center gap-6 border border-gray-300">

        <FiAlertTriangle
          size={48}
          className={`text-[${COLOR_TEXT_PRIMARY}] mb-2`}
        />

        <h1 className="text-3xl font-bold text-[#4A4A4A] text-center">
          404 - Page Not Found
        </h1>

        <p className="text-gray-600 text-center max-w-xs">
          Sorry, the page you are looking for does not exist or you don't have permission to view it.
        </p>

        {/* ✅ Go back to previous page */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors duration-200 hover:opacity-90 mt-2"
          style={{ backgroundColor: COLOR_PRIMARY }}
        >
          <FiArrowLeft />
          Go Back
        </button>

      </div>
    </div>
  );
};

export default NotFound;
