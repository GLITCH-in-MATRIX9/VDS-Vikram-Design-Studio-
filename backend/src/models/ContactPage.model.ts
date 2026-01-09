import mongoose, { Schema, Document } from "mongoose";

/* ---------------- TYPES ---------------- */

export interface IContactEntry {
  id: number;
  city: string;
  phone_numbers: string[];
  address: string;
  google_maps_iframe_src?: string;
}

export interface IContactPage extends Document {
  page: "CONTACT";
  contacts: IContactEntry[];
  lastModifiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ---------------- CONTACT ENTRY ---------------- */

const ContactEntrySchema = new Schema<IContactEntry>(
  {
    id: {
      type: Number,
      required: true,
      min: 1,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone_numbers: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) =>
          Array.isArray(arr) &&
          arr.length > 0 &&
          arr.every((num) => typeof num === "string" && num.trim().length > 0),
        message: "At least one valid phone number is required",
      },
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    google_maps_iframe_src: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    _id: false, 
  }
);

/* ---------------- CONTACT PAGE ---------------- */

const ContactPageSchema = new Schema<IContactPage>(
  {
    page: {
      type: String,
      default: "CONTACT",
      immutable: true, 
      index: true,
    },

    contacts: {
      type: [ContactEntrySchema],
      default: [],
    },

    lastModifiedBy: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

/* ---------------- SINGLETON SAFETY ---------------- */
// Ensure only ONE ContactPage document exists
ContactPageSchema.index({ page: 1 }, { unique: true });

/* ---------------- EXPORT ---------------- */

export default mongoose.model<IContactPage>(
  "ContactPage",
  ContactPageSchema
);
