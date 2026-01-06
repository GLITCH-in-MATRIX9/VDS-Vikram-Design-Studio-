#!/usr/bin/env node

/**
 * Migration runner script
 * This script helps run the base64 migration with proper environment setup
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Base64 Image Migration...');
console.log('📋 This script will convert base64 images to Cloudinary URLs');
console.log('');

// Check if we're in the right directory
const packageJsonPath = path.join(__dirname, 'package.json');
try {
  require(packageJsonPath);
} catch (error) {
  console.error('❌ Error: Please run this script from the backend directory');
  process.exit(1);
}

// Check for required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(v => console.error(`   - ${v}`));
  console.error('');
  console.error('💡 Please set these environment variables:');
  console.error('   export MONGO_URI="your_mongo_uri"');
  console.error('   export CLOUDINARY_CLOUD_NAME="your_cloud_name"');
  console.error('   export CLOUDINARY_API_KEY="your_api_key"');
  console.error('   export CLOUDINARY_API_SECRET="your_api_secret"');
  console.error('');
  console.error('🔗 Or create a .env file with these variables');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('');

// Run the migration
const migrationProcess = spawn('npx', ['ts-node', 'src/scripts/migrateBase64Images.ts'], {
  stdio: 'inherit',
  shell: true
});

migrationProcess.on('close', (code) => {
  if (code === 0) {
    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('📈 Your API should now be much faster');
  } else {
    console.log('');
    console.error('❌ Migration failed with exit code:', code);
    process.exit(code);
  }
});

migrationProcess.on('error', (error) => {
  console.error('❌ Failed to start migration:', error);
  process.exit(1);
});



