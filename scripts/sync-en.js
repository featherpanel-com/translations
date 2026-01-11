const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const languagesDir = path.join(__dirname, '..', 'languages');
const enFile = path.join(languagesDir, 'en.json');
const upstreamUrl = 'https://raw.githubusercontent.com/MythicalLTD/FeatherPanel/main/frontendv2/public/locales/en.json';

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

function formatJSON(content) {
  const parsed = JSON.parse(content);
  return JSON.stringify(parsed, null, 4) + '\n';
}

async function main() {
  console.log('🔄 Syncing en.json from upstream...\n');
  console.log(`📥 Downloading from: ${upstreamUrl}\n`);

  // Ensure languages directory exists
  if (!fs.existsSync(languagesDir)) {
    fs.mkdirSync(languagesDir, { recursive: true });
    console.log(`📁 Created languages directory: ${languagesDir}`);
  }

  try {
    // Download the file
    await downloadFile(upstreamUrl, enFile);
    
    // Format and save the JSON
    const content = fs.readFileSync(enFile, 'utf8');
    const formatted = formatJSON(content);
    fs.writeFileSync(enFile, formatted, 'utf8');

    // Count keys for info
    const parsed = JSON.parse(formatted);
    const keyCount = Object.keys(parsed).length;
    
    console.log(`✅ Successfully synced en.json`);
    console.log(`   Location: ${enFile}`);
    console.log(`   Keys: ${keyCount}`);
    console.log('\n✨ Sync complete!');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error syncing en.json: ${error.message}`);
    process.exit(1);
  }
}

main();
