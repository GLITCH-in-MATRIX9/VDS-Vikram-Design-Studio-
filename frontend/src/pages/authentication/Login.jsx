// src/pages/Login.jsx (Update this file)

import React, { useState, useEffect, useContext } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
// ⬅️ ADD FiEye and FiEyeOff imports
import { FiUser, FiLock, FiLogIn, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { AuthContext } from '../../context/authContext'; // Adjust path as needed

const loginVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Login() {
  const { login, user } = useContext(AuthContext); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  // ⬅️ NEW STATE: To control password visibility
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users away from the login page
    if (user) {
      navigate("/admin/dashboard/home");
    }
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user, navigate]);

  const handleLogin = async (e) => { // Made async
    e.preventDefault();
    setError(""); // Clear previous errors

    // Call the real login function from AuthContext
    const result = await login(email, password); 

    if (result.success) {
      // AuthContext handles setting user state; just navigate
      navigate("/admin/dashboard/home");
    } else {
      // Display error message from the backend
      setError(result.message || "Login failed. Please check your credentials."); 
    }
  };

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 gap-6 bg-[#f3efee]">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center gap-6 border border-gray-100">
          <FiUser size={48} className="text-gray-600" />
          <h1 className="text-xl font-semibold text-[#474545]">
            Sorry, the Team login page is only accessible on a laptop or desktop screen.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3efee] p-4">
      <motion.form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-3xl px-10 py-8 w-full max-w-md flex flex-col gap-6 border border-gray-200"
        variants={loginVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <FiUser size={36} className="text-[#474545] mb-1" />
          <h2 className="text-2xl font-bold text-center tracking-tight text-[#474545]">
            Login to your account
          </h2>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiUser />
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
            // ⬅️ CONDITIONAL TYPE
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            // ⬅️ ADD pr-10 for toggle button spacing
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#7E797A] focus:outline-none text-[#474545] bg-[#F9F8F7] transition"
          />
          
          {/* ⬅️ TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#474545] transition duration-150"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
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
          <FiLogIn className="inline-block" /> Login
        </button>

        <div className="flex justify-end mt-2 text-sm">
          {/* Note: You should ideally have a link to your Register page here if public registration is ever possible */}
          <Link
            to="/forgot-password"
            className="text-gray-600 hover:text-[#474545] hover:underline font-medium flex items-center gap-1"
          >
            <FiArrowRight /> Forgot Password?
          </Link>
        </div>
      </motion.form>
    </div>
  );
}