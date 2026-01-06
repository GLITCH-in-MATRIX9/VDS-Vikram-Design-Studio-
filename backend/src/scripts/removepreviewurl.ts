// removePreviewImages.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Project } from "../models/Project.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

const main = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Project.updateMany(
      {},
      { $unset: { previewImageUrl: "", previewImagePublicId: "" } }
    );

    console.log(`✅ Removed preview images from ${result.modifiedCount} projects`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error removing preview images:", err);
    process.exit(1);
  }
};

main();
