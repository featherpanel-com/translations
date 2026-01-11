const fs = require('fs');
const path = require('path');

const languagesDir = path.join(__dirname, '..', 'languages');
const mappingsFile = path.join(__dirname, '..', 'data', 'mappings.json');

function getLanguageCodeFromFilename(filename) {
  return filename.replace('.json', '');
}

function main() {
  console.log('🔍 Validating translation files against mappings...\n');

  if (!fs.existsSync(mappingsFile)) {
    console.error(`❌ Mappings file not found: ${mappingsFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(languagesDir)) {
    console.error(`❌ Languages directory not found: ${languagesDir}`);
    process.exit(1);
  }

  const mappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'));
  const mappingCodes = Object.keys(mappings);

  console.log(`📋 Found ${mappingCodes.length} language(s) in mappings.json\n`);

  const jsonFiles = fs.readdirSync(languagesDir)
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      filename: file,
      code: getLanguageCodeFromFilename(file)
    }));

  if (jsonFiles.length === 0) {
    console.log('⚠️  No translation files found');
    process.exit(0);
  }

  let hasErrors = false;
  const foundCodes = new Set();

  // Check if all translation files have corresponding mappings
  for (const { filename, code } of jsonFiles) {
    foundCodes.add(code);
    if (!mappingCodes.includes(code)) {
      console.error(`❌ ${filename}: Language code "${code}" not found in mappings.json`);
      hasErrors = true;
    } else {
      console.log(`✅ ${filename}: Mapping found (${mappings[code].name})`);
    }
  }

  // Check if all mappings have corresponding translation files
  const missingFiles = mappingCodes.filter(code => !foundCodes.has(code));
  if (missingFiles.length > 0) {
    console.log(`\n⚠️  ${missingFiles.length} mapping(s) without translation files:`);
    missingFiles.forEach(code => {
      console.log(`   - ${code} (${mappings[code].name})`);
    });
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Translation files: ${jsonFiles.length}`);
  console.log(`   - Mappings: ${mappingCodes.length}`);
  console.log(`   - Missing files: ${missingFiles.length}`);

  if (hasErrors) {
    console.error('\n❌ Validation failed! Some translation files do not match mappings.');
    process.exit(1);
  } else {
    console.log('\n✅ All translation files match mappings!');
    if (missingFiles.length > 0) {
      console.log('⚠️  Note: Some mappings do not have translation files yet.');
    }
    process.exit(0);
  }
}

main();
