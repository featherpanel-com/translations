const fs = require('fs');
const path = require('path');

const languagesDir = path.join(__dirname, '..', 'languages');

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function getAllJSONFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => file.endsWith('.json'));
}

function main() {
  console.log('🔍 Validating JSON files...\n');

  if (!fs.existsSync(languagesDir)) {
    console.error(`❌ Languages directory not found: ${languagesDir}`);
    process.exit(1);
  }

  const jsonFiles = getAllJSONFiles(languagesDir);
  
  if (jsonFiles.length === 0) {
    console.log('⚠️  No JSON files found in languages directory');
    process.exit(0);
  }

  let hasErrors = false;
  const results = [];

  for (const file of jsonFiles) {
    const filePath = path.join(languagesDir, file);
    const result = validateJSON(filePath);
    
    if (result.valid) {
      console.log(`✅ ${file}`);
      results.push({ file, status: 'valid' });
    } else {
      console.error(`❌ ${file}: ${result.error}`);
      results.push({ file, status: 'invalid', error: result.error });
      hasErrors = true;
    }
  }

  console.log(`\n📊 Summary: ${jsonFiles.length} file(s) checked`);
  
  if (hasErrors) {
    console.error('\n❌ Validation failed! Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('✅ All JSON files are valid!');
    process.exit(0);
  }
}

main();
