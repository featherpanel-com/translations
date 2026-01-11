# FeatherPanel Translations

This repository contains translations for [FeatherPanel](https://github.com/MythicalLTD/FeatherPanel). All translation files are stored as JSON files in the `languages/` directory.

## Structure

```
translations/
├── languages/          # Translation JSON files (en.json, ro.json, etc.)
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
# Clone the repository
git clone <repository-url>
cd translations

# Install dependencies (no external dependencies needed)
npm install

# Sync en.json from upstream
npm run sync:en
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

1. **Base Language**: `en.json` is synced from the upstream repository and should always match the latest version
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

The `languages/en.json` file is synced directly from the upstream FeatherPanel repository using the raw GitHub URL.

### Syncing en.json

To sync `en.json` from the latest upstream version:

```bash
npm run sync:en
```

This will:
1. Download `en.json` from `https://raw.githubusercontent.com/MythicalLTD/FeatherPanel/main/frontendv2/public/locales/en.json`
2. Format and save it to `languages/en.json`

The file is downloaded directly from GitHub, so no submodules or complex setup is required.

## License

See [LICENSE](LICENSE) for details.
