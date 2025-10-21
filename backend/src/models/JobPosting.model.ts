import { Schema, model, Document } from 'mongoose';

export interface IJobPosting extends Document {
  title: string;
  department: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  isActive: boolean;
  applicationDeadline?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobPostingSchema = new Schema<IJobPosting>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['ENTRY', 'MID', 'SENIOR', 'LEAD'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: {
    type: Date
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
});

JobPostingSchema.index({ isActive: 1, createdAt: -1 });
JobPostingSchema.index({ department: 1, experienceLevel: 1 });

export const JobPosting = model<IJobPosting>('JobPosting', JobPostingSchema);
