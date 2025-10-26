import { Router } from "express";
import { getTags, addTag } from "../controllers/tags.controller";
import { protect, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Public route: fetch tags
router.get("/", getTags);

router.post(
  "/",
  protect,
  requireRole(["project_content_manager", "super_admin"]),
  addTag
);

export default router;