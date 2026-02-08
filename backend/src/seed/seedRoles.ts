import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

import mongoose from "mongoose";
import Role from "../models/Role";
import { roles } from "../roles";
import connectDB from "../config/db";


const seedRoles = async () => {

  try {

    await connectDB();

    for (const role of roles) {

      await Role.findOneAndUpdate(
        { slug: role.slug },
        {
          ...role,

          // cities always exist (for old records safety)
          cities: role.cities || {
            Kolkata: true,
            Guwahati: true,
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

    }

    console.log("✅ Roles seeded successfully");

    await mongoose.connection.close();

  } catch (error) {

    console.error("❌ Role seeding failed:", error);

    await mongoose.connection.close();

  }

};

seedRoles();
