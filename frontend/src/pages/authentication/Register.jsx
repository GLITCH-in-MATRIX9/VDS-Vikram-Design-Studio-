// src/pages/Register.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
// ⬅️ ADD FiEye and FiEyeOff imports
import {
  FiUser,
  FiLock,
  FiMail,
  FiUserPlus,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { AuthContext } from "../../context/authContext";

const registerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Register() {
  const { register, user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Input validation (basic client-side checks)
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    // Call the register function from AuthContext
    const result = await register(name, email, password);

    if (result.success) {
      // Registration successful (and user is automatically logged in)
      navigate("/admin/dashboard/home");
    } else {
      // Display error message from the backend (e.g., "Registration is disabled" or "Email already exists")
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  // ... (Desktop check UI - keep it simple for this answer)
  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1>Admin Registration requires desktop view.</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2EFEE] p-4">
      <motion.form
        onSubmit={handleRegister}
        className="bg-white shadow-xl rounded-3xl px-10 py-8 w-full max-w-md flex flex-col gap-6 border border-gray-200"
        variants={registerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <FiUserPlus size={36} className="text-[#474545] mb-1" />
          <h2 className="text-2xl font-bold text-center tracking-tight text-[#474545]">
            Register First Admin
          </h2>
          <p className="text-sm text-gray-500 text-center">
            (Only for initial system setup)
          </p>
        </div>

        {/* Name Field */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiUser />
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name (Optional)"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#7E797A] focus:outline-none text-[#474545] bg-[#F9F8F7] transition"
          />
        </div>

        {/* Email Field */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiMail />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#7E797A] focus:outline-none text-[#474545] bg-[#F9F8F7] transition"
          />
        </div>

        {/* Password Field - Updated with View Toggle */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiLock />
          </span>
          <input
            // ⬅️ CONDITIONAL TYPE: 'text' if showPassword is true, 'password' otherwise
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            required
            // ⬅️ ADD pr-10 to make room for the toggle button
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#7E797A] focus:outline-none text-[#474545] bg-[#F9F8F7] transition"
          />

          {/* ⬅️ TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#474545] transition duration-150"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {/* ⬅️ CONDITIONAL ICON */}
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-red-600 mb-2 text-center flex items-center gap-2 justify-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-[#474545] hover:bg-[#343232] text-white font-semibold py-3 rounded-xl shadow-md transition text-base tracking-wide flex items-center justify-center gap-2"
        >
          <FiUserPlus className="inline-block" /> Create Super Admin
        </button>

        <div className="flex justify-start mt-2 text-sm">
          <Link
            to="/login"
            className="text-gray-600 hover:text-[#474545] hover:underline font-medium flex items-center gap-1"
          >
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
