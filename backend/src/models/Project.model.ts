import { Schema, model, Document } from 'mongoose';

export interface IProjectSection {
  type: 'text' | 'image' | 'gif';
  content: string; // text content, image URL, or GIF URL
}

export interface IProject extends Document {
  name: string; // Project Name (frontend field)
  location: string;
  year?: string;
  status: 'Ongoing' | 'Completed' | 'On Hold';
  category: string;
  subCategory?: string;
  client: string;
  collaborators: string;
  projectLeaders: string[]; 
  projectTeam: string;
  tags: string[];
  keyDate: string; // ISO date string from date input
  previewImageUrl?: string; // stored path of uploaded preview
  previewImagePublicId?: string; // Cloudinary public id for deletion
  sections: IProjectSection[]; // content blocks serialized from editor
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSectionSchema = new Schema<IProjectSection>(
  {
    type: { type: String, enum: ['text', 'image', 'gif'], required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    year: { type: String },
    status: { type: String, enum: ['Ongoing', 'Completed', 'On Hold'], required: true },
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
  },
  { timestamps: true }
);

export const Project = model<IProject>('Project', ProjectSchema);