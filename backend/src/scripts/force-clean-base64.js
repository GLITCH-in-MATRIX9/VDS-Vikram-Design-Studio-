#!/usr/bin/env node

/**
 * Force clean remaining base64 content
 * This script removes any remaining base64 images and replaces them with empty content
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Simple schema for cleaning
const ProjectSchema = new mongoose.Schema({
  name: String,
  sections: [{
    type: String,
    content: String
  }]
});

const Project = mongoose.model('Project', ProjectSchema);

async function forceCleanBase64() {
  try {
    console.log('🧹 Force cleaning remaining base64 content...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all projects
    const projects = await Project.find({});
    console.log(`📊 Found ${projects.length} projects`);
    
    let cleanedProjects = 0;
    let cleanedSections = 0;
    
    for (const project of projects) {
      let projectUpdated = false;
      
      if (project.sections && Array.isArray(project.sections)) {
        const updatedSections = [...project.sections];
        
        for (let i = 0; i < updatedSections.length; i++) {
          const section = updatedSections[i];
          
          if (section && section.content && section.content.startsWith('data:image/')) {
            console.log(`🧹 Cleaning base64 image in project: ${project.name}, section ${i}`);
            updatedSections[i] = {
              ...section,
              content: '' // Remove base64 content
            };
            projectUpdated = true;
            cleanedSections++;
          }
        }
        
        // Update project if any changes were made
        if (projectUpdated) {
          await Project.findByIdAndUpdate(project._id, {
            sections: updatedSections
          });
          cleanedProjects++;
          console.log(`✅ Cleaned project: ${project.name}`);
        }
      }
    }
    
    console.log('\n📈 Force Clean Results:');
    console.log(`   Projects cleaned: ${cleanedProjects}`);
    console.log(`   Sections cleaned: ${cleanedSections}`);
    
    if (cleanedSections > 0) {
      console.log('\n🎉 SUCCESS: All base64 content removed!');
      console.log('✅ Your API should now be much faster');
    } else {
      console.log('\n✅ No base64 content found to clean');
    }
    
  } catch (error) {
    console.error('❌ Force clean failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

forceCleanBase64();
