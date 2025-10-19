import mongoose from "mongoose";
import dotenv from "dotenv";
import { Project, IProjectSection } from "./src/models/Project.model";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

const backfillSectionPublicIds = async () => {
  console.log("🔹 Connecting to MongoDB...");
  await mongoose.connect(mongoUri || "");
  console.log("✅ Connected to MongoDB");

  const projects = await Project.find();
  console.log(`🔹 Found ${projects.length} projects in the database.`);

  for (const project of projects) {
    console.log(`\n🔹 Processing project: ${project.name} (${project._id})`);
    let updated = false;

    const newSections: IProjectSection[] = project.sections.map((sec, index) => {
      console.log(`  → Checking section ${index} of type "${sec.type}"`);
      if ((sec.type === "image" || sec.type === "gif") && !sec.publicId && sec.content) {
        try {
          const urlParts = sec.content.split("/");
          const fileNameWithExt = urlParts[urlParts.length - 1];
          const fileName = fileNameWithExt.split(".")[0];
          const folderPath = urlParts.slice(7, urlParts.length - 1).join("/");
          const publicId = `${folderPath}/${fileName}`;
          updated = true;
          console.log(`    ✅ Generated publicId: ${publicId}`);
          return { ...sec, publicId };
        } catch (err) {
          console.warn(`    ⚠️ Failed to generate publicId for section ${index}:`, err);
          return sec;
        }
      } else {
        console.log(`    ℹ️ Section ${index} already has publicId or is not image/gif`);
      }
      return sec;
    });

    if (updated) {
      project.sections = newSections;
      await project.save();
      console.log(`✅ Updated section publicIds for project ${project.name} (${project._id})`);
    } else {
      console.log(`ℹ️ No updates needed for project ${project.name} (${project._id})`);
    }
  }

  console.log("\n✅ All projects processed");
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
};

backfillSectionPublicIds().catch((err) => {
  console.error("❌ Error in backfill script:", err);
});
