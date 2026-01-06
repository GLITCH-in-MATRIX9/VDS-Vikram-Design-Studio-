import { Router } from "express";
import {
  getAboutPage,
  updateHero,
  updateMetrics,
  updateSections,
  
} from "../controllers/about.controller";

const router = Router();

router.get("/about", getAboutPage);
router.post("/about/hero", updateHero);
router.post("/about/metrics", updateMetrics);
router.post("/about/sections", updateSections);

export default router;
