import mongoose from "mongoose";
import dotenv from "dotenv";
import { Project, IProjectSection } from "../models/Project.model";

dotenv.config();

const DB_URI = process.env.MONGO_URI;
if (!DB_URI) throw new Error("❌ MONGO_URI not set in .env");

const cleanProjects = async () => {
  await mongoose.connect(DB_URI);
  console.log("✅ Connected to DB");

  const projects = await Project.find();
  for (const project of projects) {
    let updated = false;

    // Remove image/gif sections
    const originalCount = project.sections.length;
    project.sections = project.sections.filter(
      (sec: IProjectSection) => sec.type === "text"
    );
    if (project.sections.length !== originalCount) updated = true;

    // Ensure sizeM2FT2 field exists
    if (!project.sizeM2FT2) {
      project.sizeM2FT2 = "N/A"; // default value
      updated = true;
    }

    if (updated) {
      await project.save();
      console.log(
        `🛠 Updated project "${project.name}": removed ${
          originalCount - project.sections.length
        } image/gif sections, ensured sizeM2FT2`
      );
    }
  }

  console.log("✅ All projects processed");
  await mongoose.disconnect();
  console.log("✅ Disconnected from DB");
};

cleanProjects().catch((err) => {
  console.error("❌ Error:", err);
});
