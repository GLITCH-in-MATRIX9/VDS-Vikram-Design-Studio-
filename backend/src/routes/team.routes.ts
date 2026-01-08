import { Router } from "express";
import {
  getTeamPage,
  updateHeading,
  updateMembers,
  updateMarquee,
} from "../controllers/team.controller";
import { protect, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.get("/team", getTeamPage);

router.put(
  "/team/heading",
  protect,
  requireRole(["super_admin", "project_content_manager"]),
  updateHeading
);

router.put(
  "/team/members",
  protect,
  requireRole(["super_admin", "project_content_manager"]),
  updateMembers
);

router.put(
  "/team/marquee",
  protect,
  requireRole(["super_admin", "project_content_manager"]),
  updateMarquee
);

export default router;
