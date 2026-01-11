const fs = require('fs');
const path = require('path');

const languagesDir = path.join(__dirname, '..', 'languages');

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValueByPath(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

function loadTranslationFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function main() {
  console.log('🔍 Checking for missing translation keys...\n');

  if (!fs.existsSync(languagesDir)) {
    console.error(`❌ Languages directory not found: ${languagesDir}`);
    process.exit(1);
  }

  const enFile = path.join(languagesDir, 'en.json');
  
  if (!fs.existsSync(enFile)) {
    console.error('❌ en.json not found! This file is required as the base translation.');
    process.exit(1);
  }

  const enTranslations = loadTranslationFile(enFile);
  if (!enTranslations) {
    console.error('❌ Failed to parse en.json');
    process.exit(1);
  }

  const enKeys = getAllKeys(enTranslations);
  console.log(`📋 Base translation (en.json) has ${enKeys.length} keys\n`);

  const jsonFiles = fs.readdirSync(languagesDir)
    .filter(file => file.endsWith('.json') && file !== 'en.json');

  if (jsonFiles.length === 0) {
    console.log('⚠️  No other translation files found');
    process.exit(0);
  }

  let hasErrors = false;

  for (const file of jsonFiles) {
    const filePath = path.join(languagesDir, file);
    const translations = loadTranslationFile(filePath);
    
    if (!translations) {
      console.error(`❌ ${file}: Failed to parse JSON`);
      hasErrors = true;
      continue;
    }

    const missingKeys = [];
    const extraKeys = [];

    // Check for missing keys
    for (const key of enKeys) {
      const value = getValueByPath(translations, key);
      if (value === undefined) {
        missingKeys.push(key);
      }
    }

    // Check for extra keys (not in en.json)
    const translationKeys = getAllKeys(translations);
    for (const key of translationKeys) {
      if (!enKeys.includes(key)) {
        extraKeys.push(key);
      }
    }

    if (missingKeys.length > 0 || extraKeys.length > 0) {
      hasErrors = true;
      console.error(`❌ ${file}:`);
      if (missingKeys.length > 0) {
        console.error(`   Missing ${missingKeys.length} key(s):`);
        missingKeys.slice(0, 10).forEach(key => console.error(`     - ${key}`));
        if (missingKeys.length > 10) {
          console.error(`     ... and ${missingKeys.length - 10} more`);
        }
      }
      if (extraKeys.length > 0) {
        console.error(`   Extra ${extraKeys.length} key(s) (not in en.json):`);
        extraKeys.slice(0, 10).forEach(key => console.error(`     - ${key}`));
        if (extraKeys.length > 10) {
          console.error(`     ... and ${extraKeys.length - 10} more`);
        }
      }
      console.error('');
    } else {
      console.log(`✅ ${file}: All keys present`);
    }
  }

  console.log(`\n📊 Summary: ${jsonFiles.length} file(s) checked`);
  
  if (hasErrors) {
    console.error('\n❌ Validation failed! Some translation files are missing keys.');
    process.exit(1);
  } else {
    console.log('✅ All translation files have complete keys!');
    process.exit(0);
  }
}

main();
