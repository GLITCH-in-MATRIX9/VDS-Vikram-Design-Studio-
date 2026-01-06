#!/usr/bin/env node

/**
 * Check for remaining base64 content in database
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

async function checkRemainingBase64() {
  try {
    console.log('🔍 Checking for remaining base64 content...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all projects
    const projects = await Project.find({});
    console.log(`📊 Found ${projects.length} projects`);
    
    let projectsWithBase64 = 0;
    let totalBase64Sections = 0;
    
    projects.forEach(project => {
      let projectHasBase64 = false;
      let projectBase64Count = 0;
      
      if (project.sections && Array.isArray(project.sections)) {
        project.sections.forEach((section, index) => {
          if (section.content && section.content.startsWith('data:image/')) {
            projectHasBase64 = true;
            projectBase64Count++;
            totalBase64Sections++;
            console.log(`❌ Project: ${project.name}`);
            console.log(`   Section ${index}: Base64 image found (${Math.round(section.content.length / 1024)}KB)`);
          }
        });
      }
      
      if (projectHasBase64) {
        projectsWithBase64++;
        console.log(`   Total base64 sections in this project: ${projectBase64Count}`);
        console.log('');
      }
    });
    
    console.log('\n📈 Summary:');
    console.log(`   Projects with base64: ${projectsWithBase64}`);
    console.log(`   Total base64 sections: ${totalBase64Sections}`);
    
    if (totalBase64Sections > 0) {
      console.log('\n⚠️  WARNING: Base64 content still exists!');
      console.log('💡 You need to run the migration again or manually fix these images');
    } else {
      console.log('\n✅ No base64 content found in database');
      console.log('🔧 The issue might be API caching or deployment');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

checkRemainingBase64();

