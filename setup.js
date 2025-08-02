#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 SmartCare Setup Script');
console.log('========================\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm.');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully!');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('\n📝 Creating .env file...');
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
    console.log('⚠️  Please update server/.env with your Google Gemini API key');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('\n📁 Creating uploads directory...');
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('✅ Uploads directory created');
  } catch (error) {
    console.error('❌ Error creating uploads directory:', error.message);
  }
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Get your Google Gemini API key from: https://makersuite.google.com/app/apikey');
console.log('2. Update server/.env with your API key');
console.log('3. Run "npm run dev" to start the application');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, see README.md'); 