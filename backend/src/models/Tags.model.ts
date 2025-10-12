import { Schema, model, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const TagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true, uppercase: true, trim: true },
}, { timestamps: true });

export const Tag = model<ITag>("Tag", TagSchema);
