import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import About from "./pages/About";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import ApplicationFormPage from "./pages/ApplicationFormPage";

// Authentication Pages
import Login from "./pages/authentication/Login";
import ForgotPassword from "./pages/authentication/ForgotPassword";

// Admin Pages
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Projects from "./components/Dashboard/SidebarMenuOptions/Projects";
import AdminHome from "./components/Dashboard/SidebarMenuOptions/AdminHome";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/team" element={<Team />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/apply" element={<ApplicationFormPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin Dashboard */}
      <Route path="/admin/dashboard" element={<DashboardLayout />}>
        <Route path="home" element={<AdminHome />} />
        <Route path="projects" element={<Projects />} />
      </Route>

      {/* 404 Not Found  */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
