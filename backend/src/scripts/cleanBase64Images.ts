/**
 * Script to clean base64-encoded images from the database
 * Run this once to fix existing data
 */
import mongoose from 'mongoose';
import { Project } from '../models/Project.model';
import { connectDB } from '../config/db';

const cleanBase64Images = async () => {
  try {
    await connectDB();
    console.log('🔍 Searching for projects with base64 images...');

    const projects = await Project.find({});
    let updatedCount = 0;

    for (const project of projects) {
      let hasBase64 = false;
      
      // Check sections for base64 content
      const cleanedSections = project.sections.map((section) => {
        if (section.content?.startsWith('data:image')) {
          hasBase64 = true;
          console.warn(`⚠️  Project "${project.name}" has base64 image in sections`);
          return {
            ...section.toObject(),
            content: '[REMOVED_BASE64_IMAGE]', // Mark for manual review
          };
        }
        return section;
      });

      if (hasBase64) {
        project.sections = cleanedSections as any;
        await project.save();
        updatedCount++;
        console.log(`✅ Cleaned project: ${project.name}`);
      }
    }

    console.log(`\n✅ Cleanup complete! Updated ${updatedCount} projects.`);
    console.log('⚠️  Projects with [REMOVED_BASE64_IMAGE] need manual review.');
    console.log('   You should re-upload those images through the admin panel.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning base64 images:', error);
    process.exit(1);
  }
};

cleanBase64Images();
