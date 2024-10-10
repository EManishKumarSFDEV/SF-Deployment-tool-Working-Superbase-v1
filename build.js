import { execSync } from 'child_process';
import fs from 'fs';

// Run the build command
console.log('Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Create a dist folder if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy necessary files to the dist folder
console.log('Copying files to dist folder...');
fs.copyFileSync('package.json', 'dist/package.json');

console.log('Build completed successfully!');