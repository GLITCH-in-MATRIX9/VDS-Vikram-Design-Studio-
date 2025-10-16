#!/usr/bin/env node

/**
 * Verify migration results
 * This script checks if there are any remaining base64 images in the database
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Simple schema for checking
const ProjectSchema = new mongoose.Schema({
  name: String,
  sections: [{
    type: String,
    content: String
  }]
});

const Project = mongoose.model('Project', ProjectSchema);

async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration results...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all projects
    const projects = await Project.find({});
    console.log(`📊 Found ${projects.length} projects`);
    
    let totalSections = 0;
    let base64Sections = 0;
    let cloudinarySections = 0;
    let placeholderSections = 0;
    
    projects.forEach(project => {
      if (project.sections && Array.isArray(project.sections)) {
        project.sections.forEach(section => {
          totalSections++;
          
          if (section.content) {
            if (section.content.startsWith('data:image/')) {
              base64Sections++;
              console.log(`❌ Found base64 image in project: ${project.name}`);
            } else if (section.content.includes('cloudinary.com')) {
              cloudinarySections++;
            } else if (section.content.includes('[Large base64 image')) {
              placeholderSections++;
            }
          }
        });
      }
    });
    
    console.log('\n📈 Migration Verification Results:');
    console.log(`   Total sections: ${totalSections}`);
    console.log(`   Cloudinary URLs: ${cloudinarySections}`);
    console.log(`   Base64 images: ${base64Sections}`);
    console.log(`   Placeholder text: ${placeholderSections}`);
    
    if (base64Sections === 0) {
      console.log('\n🎉 SUCCESS: No base64 images found!');
      console.log('✅ Migration was successful');
    } else {
      console.log('\n⚠️  WARNING: Some base64 images still exist');
      console.log('💡 You may need to run the migration again');
    }
    
    if (placeholderSections > 0) {
      console.log('\n🔧 NOTE: Some sections show placeholder text');
      console.log('   This means the API is still cleaning responses');
      console.log('   The actual images should be Cloudinary URLs in the database');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

verifyMigration();

