const fs = require('fs');
const path = require('path');

function prepareDeploy() {
  const docsDir = path.join(__dirname, '../docs');
  
  if (!fs.existsSync(docsDir)) {
    console.error('docs directory not found. Please run generate-markdown.js first.');
    process.exit(1);
  }
  
  const indexHtmlPath = path.join(docsDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('index.html not found in docs directory.');
    process.exit(1);
  }
  
  console.log('Deployment files ready:');
  console.log(`  - ${indexHtmlPath}`);
  
  const files = fs.readdirSync(docsDir);
  console.log(`Total files in docs directory: ${files.length}`);
  
  console.log('✓ Deployment preparation complete');
  console.log('GitHub Actions will automatically deploy the docs directory to GitHub Pages');
}

if (require.main === module) {
  prepareDeploy();
  process.exit(0);
}

module.exports = { prepareDeploy };
