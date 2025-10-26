import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { FaUserCheck, FaUserTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import authApi from '../services/authApi'; // your API helper

export const AuthContext = createContext();

// Helper function to manage JWT in storage and headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on app load
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        try {
          const res = await authApi.getProfile(); // GET /profile
          setUser(res.user);
        } catch (err) {
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password); // POST /login
      setAuthToken(res.token);
      setUser(res.user);
      return { success: true, icon: <FaSignInAlt style={{ color: "green" }} /> };
    } catch (err) {
      setAuthToken(null);
      return {
        success: false,
        icon: <FaUserTimes style={{ color: "red" }} />,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const res = await authApi.register(name, email, password); // POST /register
      setAuthToken(res.token);
      setUser(res.user);
      return { success: true, icon: <FaUserPlus style={{ color: "green" }} /> };
    } catch (err) {
      setAuthToken(null);
      return {
        success: false,
        icon: <FaUserTimes style={{ color: "red" }} />,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    return { success: true, icon: <FaSignOutAlt style={{ color: "blue" }} /> };
  };

  // Update profile
  const updateProfile = async (updateData) => {
    try {
      const res = await authApi.updateProfile(updateData); // PUT /profile
      setUser(res.user);
      return { success: true, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to update profile" };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await authApi.changePassword(currentPassword, newPassword); // PUT /change-password
      return { success: true, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to change password" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        icons: { FaUserCheck, FaUserTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
