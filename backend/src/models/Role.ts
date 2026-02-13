import mongoose, { Schema, Document } from "mongoose";

/* =========================
   PURE DATA TYPES
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
    | "file"
    | "textarea";
  required: boolean;
  options?: string[];
  section: string;
  placeholder?: string; // ✅ ADDED
}

export interface RoleData {
  roleName: string;
  slug: string;
  department: string; 

  // CITY BASED ACTIVE STATE
  cities: {
    Kolkata: boolean;
    Guwahati: boolean;
  };
  


  jobDescription: string;
  responsibilities: string[];
  requirements: string[];
  fields: IField[];
}

export interface IRole extends RoleData, Document {}

/* =========================
   SCHEMAS
========================= */

const FieldSchema = new Schema<IField>({
  name: String,
  label: String,
  type: String,
  required: Boolean,
  options: [{ type: String }],
  section: String,
  placeholder: String // ✅ ADDED
});

const RoleSchema = new Schema<IRole>({
  roleName: { type: String, required: true },
  slug: { type: String, required: true, unique: true },

  department: { type: String, required: true },


  // ⭐ CITY BASED ACTIVATION
  cities: {
    Kolkata: { type: Boolean, default: true },
    Guwahati: { type: Boolean, default: true }
  },

  jobDescription: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  fields: [FieldSchema]
});

const Role =
  mongoose.models.Role ||
  mongoose.model<IRole>("Role", RoleSchema);

export default Role;
