/**
 * Script to clean base64-encoded images from the database.
 * Run this once to fix existing data.
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from '../models/Project.model';
import connectDB from '../config/db';

// Load environment variables
dotenv.config();

const cleanBase64Images = async (): Promise<void> => {
  try {
    // ✅ Ensure Mongo URI is provided
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('❌ MONGO_URI not defined in .env file');
    }

    // ✅ Connect to MongoDB
    await connectDB(mongoUri);
    console.log('🔗 Connected to MongoDB');
    console.log('🔍 Searching for projects with base64 images...\n');

    const projects = await Project.find({});
    let updatedCount = 0;

    for (const project of projects) {
      let hasBase64 = false;

      // ✅ Clean sections that contain base64 image data
      const cleanedSections = project.sections.map((section: any) => {
        if (section.content?.startsWith('data:image')) {
          hasBase64 = true;
          console.warn(`⚠️  Project "${project.name}" has base64 image in sections`);

          return {
            ...section, // removed .toObject() to prevent TS error
            content: '[REMOVED_BASE64_IMAGE]', // mark for manual review
          };
        }
        return section;
      });

      // ✅ Save updated project if any section had base64 data
      if (hasBase64) {
        project.sections = cleanedSections;
        await project.save();
        updatedCount++;
        console.log(`✅ Cleaned project: ${project.name}`);
      }
    }

    console.log(`\n✅ Cleanup complete! Updated ${updatedCount} projects.`);
    console.log('⚠️  Projects with [REMOVED_BASE64_IMAGE] need manual review.');
    console.log('   Re-upload those images through the admin panel.');

    // ✅ Graceful exit
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning base64 images:', error);
    process.exit(1);
  }
};

cleanBase64Images();
