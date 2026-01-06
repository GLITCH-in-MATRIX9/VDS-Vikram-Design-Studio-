import { Request, Response } from "express";
import AboutPage from "../models/AboutPage.model";

/* ---------- GET ABOUT PAGE ---------- */
export const getAboutPage = async (req: Request, res: Response) => {
  try {
    let about = await AboutPage.findOne({ page: "ABOUT" });

    if (!about) {
      about = await AboutPage.create({ page: "ABOUT" });
    }

    res.json({
      hero: about.hero || {},
      metrics: about.metrics || [],
      sections: Object.fromEntries(about.sections || []),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch About page" });
  }
};

/* ---------- UPDATE HERO ---------- */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { hero: content, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(about?.hero);
  } catch (err) {
    res.status(500).json({ error: "Failed to update hero" });
  }
};

/* ---------- UPDATE METRICS ---------- */
export const updateMetrics = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { metrics: content, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(about?.metrics);
  } catch (err) {
    res.status(500).json({ error: "Failed to update metrics" });
  }
};

/* ---------- UPDATE ALL SECTIONS ---------- */
export const updateSections = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { sections: content, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(Object.fromEntries(about?.sections || []));
  } catch (err) {
    res.status(500).json({ error: "Failed to update sections" });
  }
};
