import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    position: String,
    description: String,
    photo: String,
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const TeamPageSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: ["TEAM"],
      default: "TEAM",
      unique: true,
    },

    heading: {
      title: String,
      subtitle: String,
      image: String,
      paragraphs: [
        {
          id: Number,
          text: String,
        },
      ],
    },

    members: [MemberSchema],

    marquee_images: [
      {
        id: Number,
        img_src: String,
        alt: String,
      },
    ],

    lastModifiedBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("TeamPage", TeamPageSchema);
