import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiLogIn, FiArrowLeft } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dummyUser = {
      email: "admin@test.com",
      password: "123456",

  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === dummyUser.email && password === dummyUser.password) {
      const fakeToken = "dummy-token-123456";
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("role", dummyUser.role);
      navigate("/admin/dashboard/home");
    } else {
      setError("Invalid email or password");
    }
  };

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 gap-6 bg-gradient-to-br from-purple-100 via-white to-blue-100">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center gap-6 border border-gray-100">
          <FiUser size={48} className="text-purple-500" />
          <h1 className="text-xl font-semibold text-[#722F37]">Sorry, the Team login page is only accessible on a laptop or desktop screen.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-3xl px-10 py-8 w-full max-w-md flex flex-col gap-6 border border-gray-100"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <FiUser size={36} className="text-purple-600 mb-1" />
          <h2 className="text-2xl font-bold text-center tracking-tight text-gray-800">Login</h2>
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
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700 bg-gray-50 transition mb-3"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiLock />
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700 bg-gray-50 transition mb-3"
          />
        </div>

        {error && <p className="text-red-600 mb-2 text-center flex items-center gap-2 justify-center"><FiArrowLeft className="inline-block" />{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition text-base tracking-wide flex items-center justify-center gap-2"
        >
          <FiLogIn className="inline-block" /> Login
        </button>

        <div className="flex justify-end mt-2 text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
            <FiArrowLeft /> Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
