import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  searchProjects,
} from "../controllers/project.controller";
import { upload } from "../middlewares/upload";
import { protect, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", getProjects);
router.get("/search", searchProjects);
router.get("/:id", getProjectById);

// Protected routes
router.post(
  "/",
  protect,
  requireRole(["admin", "super_admin"]),
  upload.fields([
    { name: "previewImage", maxCount: 1 },  
    { name: "sections", maxCount: 10 },
  ]),
  createProject
);

router.post(
  "/upload",
  protect,
  requireRole(["admin", "super_admin"]),
  upload.single("file"), 
  (req, res) => {
    const file = req.file as any;
    if (!file?.url) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ 
      url: file.url,
      publicId: file.publicId,
      originalName: file.originalName,
      size: file.size
    });
  }
);

// Test endpoint specifically for GIF uploads
router.post(
  "/test-gif-upload",
  protect,
  requireRole(["admin", "super_admin"]),
  upload.single("gif"), 
  (req, res) => {
    const file = req.file as any;
    if (!file?.url) {
      return res.status(400).json({ message: "No GIF file uploaded" });
    }
    res.status(200).json({ 
      message: "GIF uploaded successfully",
      url: file.url,
      publicId: file.publicId,
      fileInfo: {
        originalName: file.originalName,
        size: file.size
      }
    });
  }
);

router.put(
  "/:id",
  protect,
  requireRole(["admin", "super_admin"]),
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "sections", maxCount: 10 },
  ]),
  updateProject
);

router.delete("/:id", protect, requireRole(["admin", "super_admin"]), deleteProject);
router.patch("/:id/status", protect, requireRole(["admin", "super_admin"]), toggleProjectStatus);

export default router;
