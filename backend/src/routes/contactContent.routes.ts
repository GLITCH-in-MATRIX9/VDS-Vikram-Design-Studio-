import { Router } from "express";
import {
  upsertContactPage,
  getContactPage,
} from "../controllers/contactContent.controller";
import { protect, requireRole } from "../middlewares/auth.middleware";

const router = Router();

// Protected: upsert content for contact page
router.post(
  "/",
  protect,
  requireRole(["super_admin", "project_content_manager"]),
  upsertContactPage
);

// Public: fetch contact content
router.get("/contact", getContactPage);

export default router;
