import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { FaUserCheck, FaUserTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSpinner } from "react-icons/fa";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.post("http://localhost:5000/api/auth/refresh");
        const res = await axios.get("http://localhost:5000/api/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      setUser(res.data.user);
      return { success: true, icon: <FaSignInAlt style={{ color: 'green' }} /> };
    } catch (err) {
      return {
        success: false,
        icon: <FaUserTimes style={{ color: 'red' }} />,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      setUser(res.data.user);
      return { success: true, icon: <FaUserPlus style={{ color: 'green' }} /> };
    } catch (err) {
      return {
        success: false,
        icon: <FaUserTimes style={{ color: 'red' }} />,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      setUser(null);
      return { success: true, icon: <FaSignOutAlt style={{ color: 'blue' }} /> };
    } catch (err) {
      return { success: false, icon: <FaUserTimes style={{ color: 'red' }} />, message: "Logout failed" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, icons: { FaUserCheck, FaUserTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaSpinner } }}>
      {loading ? <FaSpinner className="animate-spin text-2xl mx-auto mt-10 text-gray-500" /> : children}
    </AuthContext.Provider>
  );
};
