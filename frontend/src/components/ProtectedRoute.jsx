// src/components/ProtectedRoute.jsx (Check this file's code)

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 

const ProtectedRoute = () => {
  // CRITICAL: Ensure this import path is correct relative to the component location
  const { user, loading } = useContext(AuthContext); 

  // ⬅️ MUST WAIT for the session check to complete. This prevents the blank page.
  if (loading) {
    // Return something simple that won't crash (like a plain div or loading spinner)
    return <div>Verifying session...</div>; 
  }
  
  // If loading is done, redirect if not authenticated.
  return user ? <Outlet /> : <Navigate to="/login" replace />; 
};

export default ProtectedRoute;