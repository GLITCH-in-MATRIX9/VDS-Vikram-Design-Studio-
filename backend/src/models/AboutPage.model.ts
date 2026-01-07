import mongoose from "mongoose";

const ParagraphSchema = new mongoose.Schema(
  {
    id: Number,
    text: String,
  },
  { _id: false }
);

const CarouselCardSchema = new mongoose.Schema(
  {
    id: Number,
    img_src: String, // Cloudinary URL
    text: String, // text-only card
    project_name: String,
    project_location: String,
  },
  { _id: false }
);

const SectionSchema = new mongoose.Schema(
  {
    heading: String,
    paragraphs: [ParagraphSchema],
    carousel_cards: [CarouselCardSchema],
  },
  { _id: false }
);

const AboutPageSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: ["ABOUT"],
      default: "ABOUT",
      unique: true,
    },

    hero: {
      title: String,
      subtitle: String, // line 1
      subtitleLine2: String, // line 2
      image: String,
      paragraphs: [ParagraphSchema],
    },

    metrics: [
      {
        id: Number,
        value: Number,
        label: String,
        suffix: String,
      },
    ],

    sections: {
      type: Map,
      of: SectionSchema,
      default: {},
    },

    lastModifiedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("AboutPage", AboutPageSchema);
