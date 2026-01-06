#!/usr/bin/env node

/**
 * Deep clean all base64 content from database
 * This script thoroughly searches and removes any base64 content
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Simple schema for deep cleaning
const ProjectSchema = new mongoose.Schema({
  name: String,
  sections: [{
    type: String,
    content: String
  }]
});

const Project = mongoose.model('Project', ProjectSchema);

async function deepCleanBase64() {
  try {
    console.log('🔍 Deep cleaning all base64 content...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all projects
    const projects = await Project.find({});
    console.log(`📊 Found ${projects.length} projects`);
    
    let cleanedProjects = 0;
    let cleanedSections = 0;
    let totalBase64Found = 0;
    
    for (const project of projects) {
      console.log(`\n🔍 Checking project: ${project.name}`);
      
      if (project.sections) {
        console.log(`   Sections found: ${project.sections.length}`);
        
        // Check if sections is an array
        if (Array.isArray(project.sections)) {
          const updatedSections = [];
          let projectUpdated = false;
          
          for (let i = 0; i < project.sections.length; i++) {
            const section = project.sections[i];
            console.log(`   Section ${i}: type=${section?.type}, content length=${section?.content?.length || 0}`);
            
            if (section && section.content) {
              // Check for base64 content
              if (section.content.startsWith('data:image/')) {
                console.log(`   ❌ Found base64 image in section ${i} (${Math.round(section.content.length / 1024)}KB)`);
                totalBase64Found++;
                
                // Replace with empty content
                updatedSections.push({
                  ...section,
                  content: ''
                });
                projectUpdated = true;
                cleanedSections++;
              } else {
                // Keep non-base64 content
                updatedSections.push(section);
              }
            } else {
              // Keep sections without content
              updatedSections.push(section);
            }
          }
          
          // Update project if any changes were made
          if (projectUpdated) {
            await Project.findByIdAndUpdate(project._id, {
              sections: updatedSections
            });
            cleanedProjects++;
            console.log(`   ✅ Updated project: ${project.name}`);
          }
        } else {
          console.log(`   ⚠️  Sections is not an array: ${typeof project.sections}`);
        }
      } else {
        console.log(`   No sections found`);
      }
    }
    
    console.log('\n📈 Deep Clean Results:');
    console.log(`   Total base64 found: ${totalBase64Found}`);
    console.log(`   Projects cleaned: ${cleanedProjects}`);
    console.log(`   Sections cleaned: ${cleanedSections}`);
    
    if (totalBase64Found > 0) {
      console.log('\n🎉 SUCCESS: Base64 content removed!');
      console.log('✅ Your API should now be much faster');
    } else {
      console.log('\n✅ No base64 content found');
    }
    
  } catch (error) {
    console.error('❌ Deep clean failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

deepCleanBase64();

