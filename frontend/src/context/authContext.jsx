import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { FaUserCheck, FaUserTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import authApi from '../services/authApi'; // Assuming authApi.js is in a 'services' folder relative to this file

export const AuthContext = createContext();

// Helper function to manage the JWT token in storage and headers
const setAuthToken = (token) => {
  if (token) {
    // Set Authorization header for all subsequent protected requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    // Clear token on logout or session expiration/failure
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Session Check (Runs once on app load)
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        try {
          // Use the protected GET /profile route to validate the token's active status
          const { user } = await authApi.getProfile();
          setUser(user);
        } catch (err) {
          // Token is invalid, expired, or user deactivated (401/404)
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  // 2. POST /login implementation
  const login = async (email, password) => {
    try {
      // Call the API service
      const resData = await authApi.login(email, password); 
      
      // Store token and user state
      setAuthToken(resData.token);
      setUser(resData.user);
      
      return { success: true, icon: <FaSignInAlt style={{ color: 'green' }} /> };
    } catch (err) {
      setAuthToken(null);
      return {
        success: false,
        icon: <FaUserTimes style={{ color: 'red' }} />,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // 3. POST /register implementation
  const register = async (name, email, password) => {
    try {
      // Call the API service
      const resData = await authApi.register(name, email, password); 
      
      // Store token and user state
      setAuthToken(resData.token);
      setUser(resData.user);
      
      return { success: true, icon: <FaUserPlus style={{ color: 'green' }} /> };
    } catch (err) {
      setAuthToken(null);
      return {
        success: false,
        icon: <FaUserTimes style={{ color: 'red' }} />,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // 4. Client-side Logout (No backend call for JWT)
  const logout = () => {
    setAuthToken(null); // Clear the token from storage and headers
    setUser(null); // Clear the user state
    return { success: true, icon: <FaSignOutAlt style={{ color: 'blue' }} /> };
  };

  // 5. PUT /profile implementation (for use on a Profile Page)
  const updateProfile = async (updateData) => {
    try {
      const resData = await authApi.updateProfile(updateData);
      setUser(resData.user); // Update local user state with new data
      return { success: true, message: resData.message };
    } catch (err) {
         return { success: false, message: err.response?.data?.message || "Failed to update profile" };
    }
  };

  // 6. PUT /change-password implementation (for use on a Profile Page)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const resData = await authApi.changePassword(currentPassword, newPassword);
      // NOTE: Successful password change does not require updating user state
      return { success: true, message: resData.message };
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
        icons: { FaUserCheck, FaUserTimes, FaSignInAlt, FaUserPlus, FaSignOutAlt } 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};