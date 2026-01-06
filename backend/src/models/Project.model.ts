import { Schema, model, Document } from "mongoose";

export interface IProjectSection {
  type: "text" | "image" | "gif" | "video";
  content: string; // text content, image URL, or GIF URL
  publicId?: string; // Cloudinary public id for images/GIFs
}

export interface IProject extends Document {
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;

  year?: string;
  status: "On-site" | "Design stage" | "Completed" | "Unbuilt";
  category: string;
  subCategory?: string;
  client: string;
  collaborators: string;
  projectLeaders: string[];
  projectTeam: string;
  tags: string[];
  keyDate: string;
  previewImageUrl?: string;
  previewImagePublicId?: string;
  sections: IProjectSection[];
  sizeM2FT2?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSectionSchema = new Schema<IProjectSection>(
  {
    type: {
      type: String,
      enum: ["text", "image", "gif", "video"],
      required: true,
    },
    content: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number, index: true },
    longitude: { type: Number, index: true },
    year: { type: String },
    status: {
      type: String,
      enum: ["On-site", "Design stage", "Completed", "Unbuilt"],
      required: true,
    },
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, trim: true },
    client: { type: String, required: true, trim: true },
    collaborators: { type: String, required: true, trim: true },
    projectLeaders: { type: [String], required: true, default: [] },
    projectTeam: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    keyDate: { type: String, required: true },
    previewImageUrl: { type: String },
    previewImagePublicId: { type: String },
    sections: { type: [ProjectSectionSchema], default: [] },
    sizeM2FT2: { type: String },
  },
  { timestamps: true }
);

ProjectSchema.index({ createdAt: -1 });

ProjectSchema.index({ latitude: 1, longitude: 1 });

export const Project = model<IProject>("Project", ProjectSchema);
