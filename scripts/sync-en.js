const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const languagesDir = path.join(__dirname, '..', 'languages');
const enFile = path.join(languagesDir, 'en.json');
const upstreamDir = path.join(__dirname, '..', 'upstream');
const upstreamEnFile = path.join(upstreamDir, 'frontendv2', 'public', 'locales', 'en.json');

function ensureSubmodule() {
  const gitModulesFile = path.join(__dirname, '..', '.gitmodules');
  
  if (!fs.existsSync(gitModulesFile)) {
    console.error('❌ .gitmodules file not found!');
    console.error('   Please ensure the submodule is configured.');
    process.exit(1);
  }

  // Check if submodule directory exists
  if (!fs.existsSync(upstreamDir)) {
    console.log('📦 Submodule not initialized. Initializing...\n');
    try {
      execSync('git submodule update --init --recursive', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Failed to initialize submodule:', error.message);
      console.error('\n💡 Try running: git submodule update --init --recursive');
      process.exit(1);
    }
  } else {
    // Update submodule to latest
    console.log('🔄 Updating submodule to latest...\n');
    try {
      execSync('git submodule update --remote upstream', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('⚠️  Warning: Failed to update submodule:', error.message);
      console.log('   Continuing with existing submodule state...\n');
    }
  }
}

function createSymlink(target, linkPath) {
  // Remove existing file/link if it exists
  if (fs.existsSync(linkPath)) {
    try {
      const stats = fs.lstatSync(linkPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(linkPath);
      } else {
        fs.unlinkSync(linkPath);
      }
    } catch (error) {
      // Try to remove anyway
      try {
        fs.unlinkSync(linkPath);
      } catch (e) {
        // Ignore if already removed
      }
    }
  }

  // Calculate relative path for symlink
  const relativeTarget = path.relative(path.dirname(linkPath), target);
  
  try {
    // Try to create symlink
    fs.symlinkSync(relativeTarget, linkPath, 'file');
    return true;
  } catch (error) {
    // On Windows, might need admin rights or developer mode
    if (os.platform() === 'win32') {
      console.error('⚠️  Failed to create symlink (may require admin rights or Developer Mode on Windows)');
      console.error('   Falling back to copying file instead...\n');
      
      // Fallback: copy the file
      const content = fs.readFileSync(target, 'utf8');
      fs.writeFileSync(linkPath, content, 'utf8');
      return false;
    }
    throw error;
  }
}

function main() {
  console.log('🔄 Creating symlink for en.json to upstream submodule...\n');

  // Ensure languages directory exists
  if (!fs.existsSync(languagesDir)) {
    fs.mkdirSync(languagesDir, { recursive: true });
    console.log(`📁 Created languages directory: ${languagesDir}`);
  }

  try {
    // Ensure submodule is initialized and updated
    ensureSubmodule();

    // Check if upstream file exists
    if (!fs.existsSync(upstreamEnFile)) {
      console.error(`❌ Upstream file not found: ${upstreamEnFile}`);
      console.error('   Make sure the submodule is properly initialized.');
      console.error('   Try running: git submodule update --init --recursive');
      process.exit(1);
    }

    // Create symlink (or copy as fallback on Windows)
    const isSymlink = createSymlink(upstreamEnFile, enFile);
    
    // Verify the file exists
    if (!fs.existsSync(enFile)) {
      throw new Error('Failed to create symlink or copy file');
    }

    // Count keys for info (read from the actual file)
    const content = fs.readFileSync(enFile, 'utf8');
    const parsed = JSON.parse(content);
    const keyCount = Object.keys(parsed).length;
    
    console.log(`✅ Successfully ${isSymlink ? 'created symlink' : 'copied file'} for en.json`);
    console.log(`   Source: ${upstreamEnFile}`);
    console.log(`   Link: ${enFile}`);
    console.log(`   Keys: ${keyCount}`);
    
    if (isSymlink) {
      console.log('\n💡 en.json is now a symlink pointing to the upstream file');
      console.log('   It will automatically reflect changes when the submodule is updated.');
    } else {
      console.log('\n⚠️  Note: File was copied instead of symlinked (Windows limitation)');
      console.log('   Run this script again after updating the submodule to sync changes.');
    }
    
    console.log('\n✨ Setup complete!');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error setting up en.json: ${error.message}`);
    process.exit(1);
  }
}

main();
