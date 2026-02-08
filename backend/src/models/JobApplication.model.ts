import mongoose, { Schema, Document } from "mongoose";

/* =========================
   PURE DATA TYPE
========================= */

export interface JobApplicationData {
  roleSlug: string;   // e.g. "junior-architect"

  // ⭐ ADD CITY (REQUIRED FOR CITY-BASED ROLE ACTIVATION)
  city: "Kolkata" | "Guwahati";

  applicant: {
    name: string;
    email: string;
  };

  answers: Record<string, any>; // dynamic form responses

  status?:
    | "submitted"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "on-hold";

  notes?: string; // internal HR notes
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
      index: true,
    },

    // ⭐ CITY FIELD
    city: {
      type: String,
      enum: ["Kolkata", "Guwahati"],
      required: true,
      index: true,
    },

    applicant: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },

    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "reviewed",
        "shortlisted",
        "rejected",
        "on-hold",
      ],
      default: "submitted",
      index: true,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   MODEL (OVERWRITE SAFE)
========================= */

const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model<JobApplicationDocument>(
    "JobApplication",
    JobApplicationSchema
  );

export default JobApplication;
