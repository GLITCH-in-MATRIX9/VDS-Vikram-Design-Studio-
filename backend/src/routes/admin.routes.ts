import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getActivityLogs,
} from "../controllers/admin.controller";

import {
  exportApplicationsCSV,
  exportApplicationsZIP
} from "../controllers/export.controller";


import {
  getAboutPage,
  updateHero,
  updateMetrics,
  updateSections,
} from "../controllers/about.controller";

import { protect, requireRole } from "../middlewares/auth.middleware";

const router = Router();

/* ================================
   AUTH MIDDLEWARE
================================ */

router.use(protect);

/* ================================
   DASHBOARD
   All roles
================================ */

router.get(
  "/dashboard/stats",
  requireRole(["super_admin", "hr_hiring", "project_content_manager"]),
  getDashboardStats
);

/* ================================
   USER MANAGEMENT
   Super Admin only
================================ */

router.get("/users", requireRole(["super_admin"]), getAllUsers);

router.post("/users", requireRole(["super_admin"]), createUser);

router.put("/users/:id", requireRole(["super_admin"]), updateUser);

router.delete("/users/:id", requireRole(["super_admin"]), deleteUser);

/* ================================
   ABOUT PAGE MANAGEMENT
   Super Admin + Project Content Manager
================================ */

router.get(
  "/about",
  requireRole(["super_admin", "project_content_manager"]),
  getAboutPage
);

router.put(
  "/about/hero",
  requireRole(["super_admin", "project_content_manager"]),
  updateHero
);

router.put(
  "/about/metrics",
  requireRole(["super_admin", "project_content_manager"]),
  updateMetrics
);

router.put(
  "/about/sections",
  requireRole(["super_admin", "project_content_manager"]),
  updateSections
);

/* ================================
   ACTIVITY LOGS
   Super Admin + HR
================================ */

router.get(
  "/activity",
  requireRole(["super_admin", "hr_hiring"]),
  getActivityLogs
);


/* ================================
   APPLICATION EXPORT (HR + SUPER ADMIN)
================================ */

router.get(
  "/export/applications/csv",
  requireRole(["super_admin", "hr_hiring"]),
  exportApplicationsCSV
);

router.get(
  "/export/applications/zip",
  requireRole(["super_admin", "hr_hiring"]),
  exportApplicationsZIP
);


export default router;
