import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

// Reusing your application's color constant for consistency
const COLOR_PRIMARY = '#454545';
const COLOR_TEXT_PRIMARY = '#722F37'; // Used for emphasis/icon

const NotFound = () => (
    // 🔑 Flat background, consistent with COLOR_SURFACE_LIGHT (bg-[#F5F1EE]) from Settings.jsx
    <div className="flex items-center justify-center min-h-screen bg-[#F5F1EE]"> 
        
        {/* 🔑 Flat container, removed shadows and gradients, using COLOR_SURFACE_DEFAULT (bg-white) */}
        <div className="bg-white rounded-lg p-10 w-full max-w-md flex flex-col items-center gap-6 border border-gray-300">
            
            {/* 🔑 Icon using COLOR_TEXT_PRIMARY for brand consistency */}
            <FiAlertTriangle size={48} className={`text-[${COLOR_TEXT_PRIMARY}] mb-2`} /> 
            
            <h1 className="text-3xl font-bold text-[#4A4A4A] text-center">404 - Page Not Found</h1>
                        <p className="text-gray-600 text-center max-w-xs">
                Sorry, the page you are looking for does not exist or you don't have permission to view it.
            </p>
            
            {/* 🔑 Button/Link styled to be visually consistent with Save/Add buttons (using COLOR_PRIMARY) */}
            <Link 
                to="/admin/dashboard/home" 
                className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors duration-200 hover:opacity-90 mt-2`}
                style={{ backgroundColor: COLOR_PRIMARY }}
            >
                <FiArrowLeft /> Go to Dashboard Home
            </Link>
        </div>
    </div>
);

export default NotFound;