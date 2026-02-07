// AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import JobDetails from "./components/Careers/JobDetails";


// Auth Pages
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ForgotPassword from "./pages/authentication/ForgotPassword";

// Admin Pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Projects from "./components/Dashboard/SidebarMenuOptions/Projects";
import EditProject from "./components/Dashboard/Projects/EditProject";
import AdminHome from "./components/Dashboard/SidebarMenuOptions/AdminHome";
import WebsiteContentPage from "./components/Dashboard/SidebarMenuOptions/WebsiteContentPage";
import Settings from "./components/Dashboard/SidebarMenuOptions/Settings";
import HiringPortal from "./components/Dashboard/SidebarMenuOptions/HiringPortal";
import Legal from "./pages/Legal";

// Misc
import NotFound from "./pages/NotFound";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/team" element={<Team />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/careers/:slug" element={<JobDetails />} />

      <Route path="/contact" element={<Contact />} />
      <Route path="/apply" element={<ApplicationFormPage />} />
      <Route path="/legal" element={<Legal />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Redirect /admin to dashboard home */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard/home" replace />} />

      {/* Protected Admin Dashboard Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
          <Route path="website-content" element={<WebsiteContentPage />} />
          <Route path="hiring" element={<HiringPortal />} />
          <Route path="settings" element={<Settings />} />

        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
