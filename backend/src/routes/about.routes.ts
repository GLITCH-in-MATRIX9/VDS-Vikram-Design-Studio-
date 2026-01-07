import { Router } from "express";
import {
  getAboutPage,
  updateHero,
  updateMetrics,
  updateSections,
} from "../controllers/about.controller";
// import { clearAboutSections } from "../controllers/about.controller";

const router = Router();

// Base path: /api/about
router.get("/", getAboutPage);
router.put("/hero", updateHero);
router.put("/metrics", updateMetrics);
router.put("/sections", updateSections);
// router.delete("/sections/clear", clearAboutSections);

export default router;
