import "dotenv/config";
import mongoose from "mongoose";
import Role from "../models/Role";
import { roles } from "../roles";
import connectDB from "../config/db";

const seedRoles = async () => {
  await connectDB();

  for (const role of roles) {
    await Role.findOneAndUpdate(
      { slug: role.slug },
      role,
      { upsert: true, new: true }
    );
  }

  console.log("✅ Roles seeded successfully");
  mongoose.connection.close();
};

seedRoles();
