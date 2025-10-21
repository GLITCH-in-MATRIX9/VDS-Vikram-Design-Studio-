import { Schema, model, Document } from 'mongoose';

export interface IJobApplication extends Document {
  jobPostingId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  jobPostingId: {
    type: String,
    required: true,
    ref: 'JobPosting'
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  applicantEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  applicantPhone: {
    type: String,
    required: true,
    trim: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'],
    default: 'PENDING'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: String,
    ref: 'AdminUser'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

JobApplicationSchema.index({ jobPostingId: 1, status: 1 });
JobApplicationSchema.index({ appliedAt: -1 });
JobApplicationSchema.index({ applicantEmail: 1 });

export const JobApplication = model<IJobApplication>('JobApplication', JobApplicationSchema);
