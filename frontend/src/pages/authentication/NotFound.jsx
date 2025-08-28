import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100">
    <div className="bg-white shadow-xl rounded-3xl px-10 py-12 w-full max-w-md flex flex-col items-center gap-6 border border-gray-100">
      <FiAlertTriangle size={48} className="text-purple-500 mb-2" />
      <h1 className="text-3xl font-bold text-gray-800 text-center">404 - Page Not Found</h1>
      <p className="text-gray-500 text-center max-w-xs">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline font-medium mt-2">
        <FiArrowLeft /> Go to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
