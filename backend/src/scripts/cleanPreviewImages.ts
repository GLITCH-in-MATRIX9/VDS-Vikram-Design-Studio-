import mongoose from "mongoose";
import cloudinary from "../config/cloudinary"; // adjust path if needed
import { Project } from "../models/Project.model";

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your-db";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const projects = await Project.find({
      previewImagePublicId: { $exists: true, $ne: "" },
    });

    console.log(`Found ${projects.length} projects with preview images.`);

    for (const project of projects) {
      try {
        if (project.previewImagePublicId) {
          await cloudinary.uploader.destroy(project.previewImagePublicId);
          console.log(
            `Deleted Cloudinary image: ${project.previewImagePublicId} for project: ${project.name}`
          );
        }

        // Clear preview fields
        project.previewImageUrl = "";
        project.previewImagePublicId = "";
        await project.save();
      } catch (err) {
        console.warn(`Failed to delete image for project ${project.name}:`, err);
      }
    }

    console.log("✅ Preview image cleanup completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
}

main();
