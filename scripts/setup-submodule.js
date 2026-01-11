const { execSync } = require('child_process');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

function main() {
  console.log('🔧 Setting up Git submodule...\n');

  try {
    // Check if .gitmodules exists
    const fs = require('fs');
    const gitModulesFile = path.join(repoRoot, '.gitmodules');
    
    if (!fs.existsSync(gitModulesFile)) {
      console.error('❌ .gitmodules file not found!');
      process.exit(1);
    }

    console.log('📦 Initializing submodule...\n');
    execSync('git submodule update --init --recursive', {
      cwd: repoRoot,
      stdio: 'inherit'
    });

    console.log('\n✅ Submodule initialized successfully!');
    console.log('💡 You can now run: npm run sync:en');
    
  } catch (error) {
    console.error('\n❌ Failed to initialize submodule:', error.message);
    console.error('\n💡 Make sure you have:');
    console.error('   1. Git installed');
    console.error('   2. Initialized this repository as a git repo');
    console.error('   3. Network access to GitHub');
    console.error('\n   Try running manually:');
    console.error('   git submodule update --init --recursive');
    process.exit(1);
  }
}

main();
