import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary';
import { config } from '../config/env';

// Convert a file buffer to a Data URI string acceptable by Cloudinary uploader
const bufferToDataURI = (buffer: Buffer, mimeType: string) => {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  try {
    const dataUri = bufferToDataURI(req.file.buffer, req.file.mimetype);

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: config.cloudinary.folderName,
    });

    // Attach details to body for downstream controller usage
    (req as any).body.previewImageUrl = result.secure_url;
    (req as any).body.previewImagePublicId = result.public_id;

    return next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Cloudinary upload failed:', error);
    return res.status(500).json({ message: 'Failed to upload image to cloud service.' });
  }
};
