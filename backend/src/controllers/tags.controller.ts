import { Request, Response } from "express";
import { Tag } from "../models/Tag";

// Get all tags
export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags.map(t => t.name));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tags" });
  }
};

// Add a new tag
export const addTag = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Tag name required" });

  try {
    const existing = await Tag.findOne({ name: name.toUpperCase() });
    if (existing) return res.status(409).json({ message: "Tag already exists" });

    const tag = new Tag({ name: name.toUpperCase() });
    await tag.save();
    res.status(201).json(tag.name);
  } catch (err) {
    res.status(500).json({ message: "Failed to create tag" });
  }
};
