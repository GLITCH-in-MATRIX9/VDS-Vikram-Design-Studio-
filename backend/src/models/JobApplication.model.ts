import mongoose, { Schema, Document } from "mongoose";

/* =========================
   PURE DATA TYPE
========================= */

export interface JobApplicationData {
  roleSlug: string;                 // e.g. "junior-architect"
  answers: Record<string, any>;     // dynamic form responses
  status?: "submitted" | "reviewed" | "shortlisted" | "rejected";
  notes?: string;                   // internal HR notes
}

/* =========================
   MONGOOSE DOCUMENT TYPE
========================= */

export interface JobApplicationDocument
  extends JobApplicationData,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */

const JobApplicationSchema = new Schema<JobApplicationDocument>(
  {
    roleSlug: {
      type: String,
      required: true,
      index: true
    },

    answers: {
      type: Schema.Types.Mixed,
      required: true
    },

    status: {
      type: String,
      enum: ["submitted", "reviewed", "shortlisted", "rejected"],
      default: "submitted"
    },

    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   MODEL
========================= */

const JobApplication = mongoose.model<JobApplicationDocument>(
  "JobApplication",
  JobApplicationSchema
);

export default JobApplication;
