# FeatherPanel Translations

This repository contains translations for [FeatherPanel](https://github.com/MythicalLTD/FeatherPanel). All translation files are stored as JSON files in the `languages/` directory.

## Structure

```
translations/
├── languages/          # Translation JSON files (en.json, ro.json, etc.)
├── upstream/           # Git submodule pointing to FeatherPanel repository
├── data/
│   └── mappings.json   # Language code mappings and metadata
├── scripts/            # Node.js validation and utility scripts
└── .github/
    └── workflows/      # GitHub Actions workflows
```

## Languages

Translation files are named using their ISO 639-1 language codes (e.g., `en.json`, `ro.json`, `de.json`). The `data/mappings.json` file contains metadata for all supported languages.

### Supported Languages

See `data/mappings.json` for the complete list of supported languages and their metadata.

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone with submodules
git clone --recursive <repository-url>
cd translations

# Or if already cloned, initialize submodules
git submodule update --init --recursive

# Or use the setup script
npm run setup:submodule

# Install dependencies (no external dependencies needed)
npm install
```

## Scripts

### Validation Scripts

- **`npm run validate:json`** - Validates all JSON files for syntax errors
- **`npm run validate:missing`** - Checks for missing translation keys across all languages
- **`npm run validate:mappings`** - Validates that all translation files match the mappings.json
- **`npm run validate:all`** - Runs all validation scripts

### Utility Scripts

- **`npm run sync:en`** - Syncs `en.json` from the upstream FeatherPanel repository

## Translation Guidelines

1. **Base Language**: `en.json` is a symlink to the upstream file and always matches the upstream repository automatically
2. **Structure**: All translation files must maintain the same nested structure as `en.json`
3. **Keys**: All translation files must contain all keys present in `en.json`
4. **Formatting**: Use 4 spaces for indentation (JSON formatting is validated automatically)

## Contributing

1. Fork this repository
2. Create a new branch for your changes
3. Add or update translations in the appropriate language file
4. Run validation scripts to ensure everything is correct:
   ```bash
   npm run validate:all
   ```
5. Commit your changes and create a pull request

### Adding a New Language

1. Ensure the language code exists in `data/mappings.json`
2. Create a new file `languages/{code}.json` based on `en.json`
3. Translate all strings while maintaining the exact same structure
4. Run validation to ensure no keys are missing

## Automated Checks

This repository uses GitHub Actions to automatically:

- ✅ Validate JSON syntax on every push
- ✅ Check for missing translation keys
- ✅ Verify all translation files match the mappings.json

## Upstream Sync

The `languages/en.json` file is a **symlink** pointing directly to the upstream FeatherPanel repository file at `upstream/frontendv2/public/locales/en.json`. This ensures it always reflects the latest upstream version.

### Initial Setup

When cloning this repository, make sure to include submodules:

```bash
git clone --recursive <repository-url>
```

If you've already cloned without submodules:

```bash
git submodule update --init --recursive
npm run sync:en
```

### Setting up the Symlink

The `sync:en` script will:
1. Initialize/update the upstream submodule
2. Create a symlink from `languages/en.json` → `upstream/frontendv2/public/locales/en.json`

```bash
npm run sync:en
```

**Note:** On Windows, symlinks may require:
- Administrator privileges, OR
- Developer Mode enabled (Settings → Update & Security → For developers → Developer Mode)

If symlinks aren't supported, the script will fall back to copying the file.

### Updating to Latest Upstream

To get the latest changes from upstream:

```bash
git submodule update --remote upstream
```

Since `en.json` is a symlink, it will automatically reflect the updated file. If you used the copy fallback, run `npm run sync:en` again.

## License

See [LICENSE](LICENSE) for details.
