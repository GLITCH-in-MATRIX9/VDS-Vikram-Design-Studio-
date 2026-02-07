import mongoose, { Schema, Document } from "mongoose";

/* =========================
   PURE DATA TYPES (NO MONGOOSE)
========================= */

export interface IField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "date"
    | "checkbox"
    | "radio"
    | "select"
    | "textarea";
  required: boolean;
  options?: string[];
  section: string;
}

export interface RoleData {
  roleName: string;
  slug: string;

  isActive: boolean;

  jobDescription: string;
  responsibilities: string[];
  requirements: string[];

  fields: IField[];
}

/* =========================
   MONGOOSE DOCUMENT TYPE
========================= */

export interface IRole extends RoleData, Document {}

/* =========================
   SCHEMAS
========================= */

const FieldSchema = new Schema<IField>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, required: true },
  options: [{ type: String }],
  section: { type: String, required: true }
});

const RoleSchema = new Schema<IRole>({
  roleName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },

  isActive: { type: Boolean, default: true },

  jobDescription: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],

  fields: [FieldSchema]
});

/* =========================
   MODEL (OVERWRITE-SAFE)
========================= */

const Role =
  mongoose.models.Role ||
  mongoose.model<IRole>("Role", RoleSchema);

export default Role;
