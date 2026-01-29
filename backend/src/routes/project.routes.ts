import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMoreProjects,
  reorderProjects,
} from "../controllers/project.controller";
import { upload } from "../middlewares/upload";
import { protect, requireRole } from "../middlewares/auth.middleware";
import {
  validateBase64Content,
  cleanBase64Response,
} from "../middlewares/base64Validator";

const router = Router();

const PROJECT_MANAGEMENT_ROLES: (
  | "super_admin"
  | "hr_hiring"
  | "project_content_manager"
)[] = ["project_content_manager", "super_admin"];

// ---------------- PUBLIC ROUTES ----------------
router.get("/", cleanBase64Response, getProjects);
router.get("/:id", cleanBase64Response, getProjectById);
router.get("/:id/more", cleanBase64Response, getMoreProjects);

// ---------------- PROTECTED ROUTES ----------------
router.post(
  "/",
  protect,
  requireRole(PROJECT_MANAGEMENT_ROLES),
  validateBase64Content,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "sections", maxCount: 10 },
  ]),
  createProject
);

// 🔁 Reorder
router.post(
  "/reorder",
  protect,
  requireRole(PROJECT_MANAGEMENT_ROLES),
  reorderProjects
);

router.put(
  "/:id",
  protect,
  requireRole(PROJECT_MANAGEMENT_ROLES),
  validateBase64Content,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "sections", maxCount: 10 },
  ]),
  updateProject
);

router.delete(
  "/:id",
  protect,
  requireRole(PROJECT_MANAGEMENT_ROLES),
  deleteProject
);

export default router;
