import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectName = (req.body.name || "UNKNOWN_PROJECT")
      .slice(0, 50)
      .replace(/\s+/g, "_");
    const folder = `VDS_FOLDER/${projectName}`;

    if (req.files && (req.files as any).previewImage) {
      const file = (req.files as any).previewImage[0];
      const result = await uploadBufferToCloudinary(file.buffer, folder);
      req.body.previewImageUrl = result.secure_url;
      req.body.previewImagePublicId = result.public_id;
    }

    if (req.files && (req.files as any).sections) {
      const sectionFiles = (req.files as any).sections;

      req.body.sections = await Promise.all(
        sectionFiles.map(async (file: any, idx: number) => {
          const sectionResult = await uploadBufferToCloudinary(
            file.buffer,
            folder
          );
          return {
            type: "image",
            content: sectionResult.secure_url,
            publicId: sectionResult.public_id,
            order: idx,
          };
        })
      );
    }

    if (req.body.client) req.body.client = req.body.client.slice(0, 100);
    if (req.body.collaborators)
      req.body.collaborators = req.body.collaborators.slice(0, 200);
    if (req.body.name) req.body.name = req.body.name.slice(0, 255);

    next();
  } catch (err: any) {
    console.error("❌ Cloudinary upload failed:", err);
    return res.status(500).json({
      message: "Failed to upload image to Cloudinary",
      error: err.message,
    });
  }
};
