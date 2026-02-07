import { Request, Response } from "express";
import ContactPage from "../models/ContactPage.model";

const PAGE_TYPE = {
  CONTACT: "CONTACT",
};

export const getContactPage = async (req: Request, res: Response) => {
  try {

    const page = await ContactPage.findOneAndUpdate(
      { page: PAGE_TYPE.CONTACT },
      {},
      { new: true, upsert: true }
    );

    res.json({ contacts: page.contacts || [] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Contact page" });
  }
};

export const upsertContactPage = async (req: Request, res: Response) => {
  try {

    const { content, lastModifiedBy } = req.body;

    if (!Array.isArray(content)) {
      return res.status(400).json({
        error: "Content must be an array of contacts"
      });
    }

    const page = await ContactPage.findOneAndUpdate(
      { page: PAGE_TYPE.CONTACT },
      {
        contacts: content,
        lastModifiedBy,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({ contacts: page?.contacts || [] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update Contact page" });
  }
};
