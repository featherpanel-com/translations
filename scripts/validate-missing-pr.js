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
  const jsonFiles = fs.readdirSync(languagesDir)
    .filter(file => file.endsWith('.json') && file !== 'en.json');

  if (jsonFiles.length === 0) {
    console.log('✅ No other translation files found - nothing to validate');
    process.exit(0);
  }

  let hasErrors = false;
  const errors = [];

  for (const file of jsonFiles) {
    const filePath = path.join(languagesDir, file);
    const translations = loadTranslationFile(filePath);
    
    if (!translations) {
      errors.push(`❌ **${file}**: Failed to parse JSON`);
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
      let errorMsg = `### ❌ ${file}\n\n`;
      
      if (missingKeys.length > 0) {
        errorMsg += `**Missing ${missingKeys.length} translation key(s):**\n\n`;
        missingKeys.slice(0, 20).forEach(key => {
          errorMsg += `- \`${key}\`\n`;
        });
        if (missingKeys.length > 20) {
          errorMsg += `\n*... and ${missingKeys.length - 20} more*\n`;
        }
        errorMsg += '\n';
      }
      
      if (extraKeys.length > 0) {
        errorMsg += `**Extra ${extraKeys.length} key(s) (not in en.json):**\n\n`;
        extraKeys.slice(0, 10).forEach(key => {
          errorMsg += `- \`${key}\`\n`;
        });
        if (extraKeys.length > 10) {
          errorMsg += `\n*... and ${extraKeys.length - 10} more*\n`;
        }
      }
      
      errors.push(errorMsg);
    }
  }

  if (hasErrors) {
    console.log('# ❌ Translation Validation Failed\n\n');
    console.log('Oops! Looks like your files are missing some translations:\n\n');
    errors.forEach(error => console.log(error));
    console.log('\n---\n');
    console.log('💡 **Tip:** Make sure all translation files have the same keys as `en.json`');
    process.exit(1);
  } else {
    console.log('✅ All translation files have complete keys!');
    process.exit(0);
  }
}

main();
