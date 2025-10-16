import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { upload } from "../middlewares/upload";
import { protect, requireRole } from "../middlewares/auth.middleware";
import { validateBase64Content, cleanBase64Response } from "../middlewares/base64Validator";

const router = Router();

// Public routes
router.get("/", cleanBase64Response, getProjects);
router.get("/:id", cleanBase64Response, getProjectById);

// Protected routes
router.post(
  "/",
  protect,
  requireRole(["admin", "super_admin"]),
  validateBase64Content,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "sections", maxCount: 10 },
  ]),
  createProject
);

router.put(
  "/:id",
  protect,
  requireRole(["admin", "super_admin"]),
  validateBase64Content,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "sections", maxCount: 10 },
  ]),
  updateProject
);

router.delete("/:id", protect, requireRole(["admin", "super_admin"]), deleteProject);

export default router;
