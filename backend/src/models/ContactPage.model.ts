import mongoose, { Schema, Document } from "mongoose";

export interface IContactEntry {
  id: number;
  city: string;
  phone_numbers: string[];
  address: string;
  google_maps_iframe_src?: string;
}

export interface IContactPage extends Document {
  page: string;
  contacts: IContactEntry[];
  lastModifiedBy?: string;
}

const ContactEntrySchema: Schema = new Schema(
  {
    id: Number,
    city: String,
    phone_numbers: [String],
    address: String,
    google_maps_iframe_src: String,
  },
  { _id: false }
);

const ContactPageSchema: Schema = new Schema(
  {
    page: { type: String, default: "CONTACT" },
    contacts: { type: [ContactEntrySchema], default: [] },
    lastModifiedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model<IContactPage>("ContactPage", ContactPageSchema);
