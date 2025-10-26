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

// Define the roles allowed to manage projects
const PROJECT_MANAGEMENT_ROLES: ("super_admin" | "hr_hiring" | "project_content_manager")[] = [
  "project_content_manager",
  "super_admin",
];

// Public routes
router.get("/", cleanBase64Response, getProjects);
router.get("/:id", cleanBase64Response, getProjectById);

// Protected routes
router.post(
    "/",
    protect,
    // Replaced invalid 'admin' with valid 'project_content_manager'
    requireRole(PROJECT_MANAGEMENT_ROLES),
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
    //  Replaced invalid 'admin' with valid 'project_content_manager'
    requireRole(PROJECT_MANAGEMENT_ROLES),
    validateBase64Content,
    upload.fields([
        { name: "previewImage", maxCount: 1 },
        { name: "sections", maxCount: 10 },
    ]),
    updateProject
);

//  Replaced invalid 'admin' with valid 'project_content_manager'
router.delete("/:id", protect, requireRole(PROJECT_MANAGEMENT_ROLES), deleteProject);

export default router;