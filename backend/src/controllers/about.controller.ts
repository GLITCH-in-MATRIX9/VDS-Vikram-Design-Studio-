import { Request, Response } from "express";
import AboutPage from "../models/AboutPage.model";
import cloudinary from "../config/cloudinary";
import {
  isBase64Image,
  convertBase64ToCloudinary,
} from "../utils/imageProcessor";
import { normalizeSections } from "../utils/normalizeAbout";

/* ---------- TYPES ---------- */
type AboutParagraph = {
  id: number;
  text: string;
};

type AboutCarouselCard = {
  id: number;
  img_src?: string;
  text?: string;
  project_name?: string;
  project_location?: string;
};

type AboutSection = {
  heading: string;
  paragraphs: AboutParagraph[];
  carousel_cards: AboutCarouselCard[];
};

/* ---------- GET ABOUT PAGE ---------- */
export const getAboutPage = async (_: Request, res: Response) => {
  try {
    let about = await AboutPage.findOne({ page: "ABOUT" });

    if (!about) {
      about = await AboutPage.create({ page: "ABOUT" });
    }

    res.json({
      hero: about.hero || {},
      metrics: about.metrics || [],
      sections: about.sections || {},
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch About page" });
  }
};

/* ---------- UPDATE HERO ---------- */
export const updateHero = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const updatedHero = {
      title: content.title,
      subtitle: content.subtitle,
      subtitleLine2: content.subtitleLine2 || "",
      image: content.image,
      paragraphs: content.paragraphs || [],
    };

    if (content?.image && isBase64Image(content.image)) {
      const result = await convertBase64ToCloudinary(
        content.image,
        "VDS_FOLDER/ABOUT/HERO"
      );
      updatedHero.image = result.url;
    }

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { hero: updatedHero, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(about?.hero);
  } catch (err) {
    console.error("❌ Failed to update hero:", err);
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
    console.error("❌ Failed to update metrics:", err);
    res.status(500).json({ error: "Failed to update metrics" });
  }
};

/* ---------- UPDATE SECTIONS (WITH CLOUDINARY) ---------- */
export const updateSections = async (req: Request, res: Response) => {
  try {
    const { content, lastModifiedBy } = req.body;

    const normalized = normalizeSections(content) as Record<
      string,
      AboutSection
    >;

    for (const [sectionKey, section] of Object.entries(normalized)) {
      if (!Array.isArray(section.carousel_cards)) continue;

      for (const card of section.carousel_cards) {
        if (card.img_src && isBase64Image(card.img_src)) {
          const folder = `VDS_FOLDER/ABOUT/SECTIONS/${sectionKey
            .replace(/[^a-zA-Z0-9]/g, "_")
            .toUpperCase()}`;

          const result = await convertBase64ToCloudinary(card.img_src, folder);

          card.img_src = result.url;
        }
      }
    }

    const about = await AboutPage.findOneAndUpdate(
      { page: "ABOUT" },
      { sections: normalized, lastModifiedBy },
      { new: true, upsert: true }
    );

    res.json(about?.sections);
  } catch (err) {
    console.error("❌ Failed to update sections:", err);
    res.status(500).json({ error: "Failed to update sections" });
  }
};

//only for testing purpose not to be used in production
// export const clearAboutSections = async (_: Request, res: Response) => {
//   try {
//     const about = await AboutPage.findOneAndUpdate(
//       { page: "ABOUT" },
//       { sections: {} },
//       { new: true }
//     );

//     res.json({
//       message: "About sections cleared successfully",
//       sections: about?.sections,
//     });
//   } catch (err) {
//     console.error("❌ Failed to clear sections:", err);
//     res.status(500).json({ error: "Failed to clear sections" });
//   }
// };
