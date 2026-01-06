#!/usr/bin/env node

/**
 * Test Cloudinary connection
 * This script tests if Cloudinary credentials are working
 */

const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

console.log('🧪 Testing Cloudinary Connection...');
console.log('');

// Check environment variables
const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 8)}...`);
console.log('');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔧 Testing Cloudinary API...');

// Test with a simple API call
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log(`   Status: ${result.status}`);
    console.log('');
    console.log('🚀 You can now run the migration:');
    console.log('   npm run migrate:base64');
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error('');
    console.error('💡 Please check your Cloudinary credentials:');
    console.error('   1. Go to https://cloudinary.com/console');
    console.error('   2. Copy your API credentials');
    console.error('   3. Set the environment variables');
    process.exit(1);
  });



