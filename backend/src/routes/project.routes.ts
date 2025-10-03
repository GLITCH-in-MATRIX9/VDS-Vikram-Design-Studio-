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
import { uploadToCloudinary } from "../middlewares/cloudinary.middleware";

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
  uploadToCloudinary,
  createProject
);

router.post(
  "/upload",
  protect,
  requireRole(["admin", "super_admin"]),
  upload.single("file"), 
  uploadToCloudinary,
  (req, res) => {
    if (!req.body.previewImageUrl) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ url: req.body.previewImageUrl });
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
  uploadToCloudinary,
  updateProject
);

router.delete("/:id", protect, requireRole(["admin", "super_admin"]), deleteProject);
router.patch("/:id/status", protect, requireRole(["admin", "super_admin"]), toggleProjectStatus);

export default router;
