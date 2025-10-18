import { Request, Response } from "express";
import { Project } from "../models/Project.model";
import cloudinary from "../config/cloudinary";
import {
  isBase64Image,
  convertBase64ToCloudinary,
} from "../utils/imageProcessor";

// Map frontend all-caps status to Mongoose enum
const statusMap: Record<string, string> = {
  "ON-SITE": "On-site",
  "DESIGN STAGE": "Design stage",
  COMPLETED: "Completed",
  UNBUILT: "Unbuilt",
};

// ---------------- CREATE PROJECT ----------------
export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      year,
      status,
      category,
      subCategory,
      client,
      collaborators,
      projectLeaders,
      projectTeam,
      tags,
      keyDate,
      sections,
      sizeM2FT2, // optional
    } = req.body;

    const files = req.files as any;
    let previewImageUrl =
      files?.previewImage?.[0]?.url || req.body.previewImageUrl || "";
    let previewImagePublicId =
      files?.previewImage?.[0]?.publicId || req.body.previewImagePublicId || "";

    if (previewImageUrl && isBase64Image(previewImageUrl)) {
      const result = await convertBase64ToCloudinary(
        previewImageUrl,
        `VDS_FOLDER/${name.replace(/[^a-zA-Z0-9]/g, "_")}`
      );
      previewImageUrl = result.url;
      previewImagePublicId = result.publicId;
    }

    const parsedSections =
      typeof sections === "string" ? JSON.parse(sections) : sections || [];
    const parsedProjectLeaders: string[] =
      typeof projectLeaders === "string"
        ? JSON.parse(projectLeaders)
        : Array.isArray(projectLeaders)
        ? projectLeaders
        : [];
    const parsedTags: string[] =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : [];

    const updatedSections = await Promise.all(
      parsedSections.map(async (sec: any, index: number) => {
        const sectionFile = files?.sections?.[index];
        if (sectionFile)
          return { type: sec.type || "image", content: sectionFile.url };
        if (sec.content && isBase64Image(sec.content)) {
          const result = await convertBase64ToCloudinary(
            sec.content,
            `VDS_FOLDER/${name.replace(/[^a-zA-Z0-9]/g, "_")}`
          );
          return { type: sec.type || "image", content: result.url };
        }
        return sec;
      })
    );

    const project = new Project({
      name,
      location,
      year,
      status: statusMap[status?.toUpperCase()] || status || "Design stage",
      category,
      subCategory,
      client,
      collaborators,
      projectLeaders: parsedProjectLeaders,
      projectTeam,
      tags: parsedTags,
      keyDate,
      sections: updatedSections,
      previewImageUrl,
      previewImagePublicId,
      sizeM2FT2, // optional
    });

    await project.save();
    return res
      .status(201)
      .json({ message: "Project created successfully", project });
  } catch (error: any) {
    console.error("❌ Error creating project:", error);
    return res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
  }
};

// ---------------- UPDATE PROJECT ----------------
export const updateProject = async (req: Request, res: Response) => {
  try {
    const {
      name,
      location,
      year,
      status,
      category,
      subCategory,
      client,
      collaborators,
      projectLeaders,
      projectTeam,
      tags,
      keyDate,
      sections,
      previewImageUrl: reqPreviewImageUrl,
      previewImagePublicId: reqPreviewImagePublicId,
      sizeM2FT2,
    } = req.body as Record<string, any>;

    const files = req.files as any;
    let previewImageUrl =
      files?.previewImage?.[0]?.url || reqPreviewImageUrl || "";
    let previewImagePublicId =
      files?.previewImage?.[0]?.publicId || reqPreviewImagePublicId || "";

    if (previewImageUrl && isBase64Image(previewImageUrl)) {
      const result = await convertBase64ToCloudinary(
        previewImageUrl,
        `VDS_FOLDER/${name.replace(/[^a-zA-Z0-9]/g, "_")}`
      );
      previewImageUrl = result.url;
      previewImagePublicId = result.publicId;
    }
    if (sizeM2FT2 !== undefined) {
      updateData.sizeM2FT2 = sizeM2FT2;
    }

    const parsedSections =
      typeof sections === "string"
        ? JSON.parse(sections)
        : Array.isArray(sections)
        ? sections
        : [];
    const parsedProjectLeaders: string[] =
      typeof projectLeaders === "string"
        ? JSON.parse(projectLeaders)
        : Array.isArray(projectLeaders)
        ? projectLeaders
        : [];
    const parsedTags: string[] =
      typeof tags === "string"
        ? JSON.parse(tags)
        : Array.isArray(tags)
        ? tags
        : [];

    const updatedSections = await Promise.all(
      parsedSections.map(async (sec: any, index: number) => {
        const sectionFile = files?.sections?.[index];
        if (sectionFile)
          return { type: sec.type || "image", content: sectionFile.url };
        if (sec.content && isBase64Image(sec.content)) {
          const result = await convertBase64ToCloudinary(
            sec.content,
            `VDS_FOLDER/${name.replace(/[^a-zA-Z0-9]/g, "_")}`
          );
          return { type: sec.type || "image", content: result.url };
        }
        return sec;
      })
    );

    const existing = await Project.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Project not found" });

    if (
      previewImagePublicId &&
      existing.previewImagePublicId &&
      previewImagePublicId !== existing.previewImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(existing.previewImagePublicId);
      } catch (e) {
        console.warn("⚠️ Failed to delete old Cloudinary image:", e);
      }
    }

    const updateData: any = {
      name,
      location,
      year,
      status:
        statusMap[status?.toUpperCase()] ||
        status ||
        existing.status ||
        "Design stage",
      category,
      subCategory,
      client,
      collaborators,
      projectLeaders: parsedProjectLeaders,
      projectTeam,
      tags: parsedTags,
      keyDate,
      sections: updatedSections,
      previewImageUrl: previewImageUrl || existing.previewImageUrl,
      previewImagePublicId:
        previewImagePublicId || existing.previewImagePublicId,
      sizeM2FT2,
    };

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error("❌ Error updating project:", err);
    return res
      .status(500)
      .json({ message: "Failed to update project", error: err.message });
  }
};

// ---------------- GET ALL PROJECTS ----------------
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err: any) {
    console.error("❌ Error fetching projects:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch projects", error: err.message });
  }
};

// ---------------- GET PROJECT BY ID ----------------
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.status(200).json(project);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to fetch project", error: err.message });
  }
};

// ---------------- DELETE PROJECT ----------------
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.previewImagePublicId) {
      try {
        await cloudinary.uploader.destroy(project.previewImagePublicId);
      } catch (e) {
        console.warn(
          "⚠️ Failed to delete Cloudinary image during project delete:",
          e
        );
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to delete project", error: err.message });
  }
};
