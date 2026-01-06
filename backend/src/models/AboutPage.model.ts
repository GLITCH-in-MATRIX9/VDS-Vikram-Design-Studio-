import mongoose, { Schema, Document } from "mongoose";

/* ---------- TYPES ---------- */

export interface Paragraph {
  id: number;
  text: string;
}

export interface Metric {
  id: number;
  value: number;
  label: string;
  suffix?: string;
}

export interface ImageCard {
  id: number;
  type: "image";
  image: string; // later: Cloudinary URL
  project_name?: string;
  project_location?: string;
}

export interface TextCard {
  id: number;
  type: "text";
  text: string;
}

export type CarouselCard = ImageCard | TextCard;

export interface AboutSection {
  heading: string;
  paragraphs: Paragraph[];
  carousel_cards: CarouselCard[];
}

export interface AboutPageDocument extends Document {
  page: "ABOUT";

  hero: {
    title: string;
    subtitle: string;
    image: string;
    paragraphs: Paragraph[];
  };

  metrics: Metric[];

  sections: Map<string, AboutSection>;

  lastModifiedBy?: string;
}

/* ---------- SCHEMAS ---------- */

const ParagraphSchema = new Schema<Paragraph>(
  {
    id: Number,
    text: String,
  },
  { _id: false }
);

const MetricSchema = new Schema<Metric>(
  {
    id: Number,
    value: Number,
    label: String,
    suffix: String,
  },
  { _id: false }
);

const CarouselCardSchema = new Schema(
  {
    id: Number,
    type: { type: String, enum: ["image", "text"] },
    image: String,
    text: String,
    project_name: String,
    project_location: String,
  },
  { _id: false }
);

const AboutSectionSchema = new Schema<AboutSection>(
  {
    heading: String,
    paragraphs: [ParagraphSchema],
    carousel_cards: [CarouselCardSchema],
  },
  { _id: false }
);

const AboutPageSchema = new Schema<AboutPageDocument>(
  {
    page: { type: String, default: "ABOUT" },

    hero: {
      title: String,
      subtitle: String,
      image: String,
      paragraphs: [ParagraphSchema],
    },

    metrics: [MetricSchema],

    sections: {
      type: Map,
      of: AboutSectionSchema,
      default: {},
    },

    lastModifiedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model<AboutPageDocument>(
  "AboutPage",
  AboutPageSchema
);
