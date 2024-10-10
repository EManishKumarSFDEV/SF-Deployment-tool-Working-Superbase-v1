import fs from 'fs';
import path from 'path';

// Function to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    entry.isDirectory() ?
      copyDir(srcPath, destPath) :
      fs.copyFileSync(srcPath, destPath);
  }
}

// Copy build output
copyDir('dist', 'deploy');

// Copy package.json
fs.copyFileSync('package.json', 'deploy/package.json');

// Create a simple server file
const serverContent = `
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
`;

fs.writeFileSync('deploy/server.js', serverContent);

console.log('Deployment files prepared in the "deploy" directory.');