# Quick Commands Reference

All useful commands in one place.

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev
```

## 🔍 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lintfix

# Format code
npm run format
```

## 🧪 Local Testing

```bash
# Link package locally
npm link

# In n8n custom directory
cd ~/.n8n/custom
npm init -y
npm link n8n-nodes-qlynk

# Start n8n
n8n start

# Start n8n with AI tools enabled
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true n8n start

# Start n8n with debug logs
N8N_LOG_LEVEL=debug n8n start

# Unlink package
npm unlink n8n-nodes-qlynk

# In project directory
npm unlink
```

## 📝 Git Operations

```bash
# Initialize repository
git init
git add .
git commit -m "feat: initial release of n8n-nodes-qlynk"

# Add remote (first time)
git remote add origin https://github.com/ClosiQode/n8n-nodes-qlynk.git

# Push to GitHub
git branch -M main
git push -u origin main

# Push with tags
git push --follow-tags

# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# View commit history
git log --oneline

# Check status
git status

# View changes
git diff
```

## 📦 npm Operations

```bash
# Login to npm
npm login

# Check who you're logged in as
npm whoami

# Test package locally
npm pack
# Creates: n8n-nodes-qlynk-1.0.0.tgz

# Publish to npm (first time)
npm publish

# Publish scoped package
npm publish --access public

# View package info
npm info n8n-nodes-qlynk

# Update version (patch: 1.0.0 → 1.0.1)
npm version patch

# Update version (minor: 1.0.1 → 1.1.0)
npm version minor

# Update version (major: 1.1.0 → 2.0.0)
npm version major

# Unpublish (within 72h only)
npm unpublish n8n-nodes-qlynk@1.0.0

# Deprecate version
npm deprecate n8n-nodes-qlynk@1.0.0 "Please upgrade to 1.0.1"
```

## 🚀 Complete Release Flow

```bash
# 1. Make your changes
# ... edit files ...

# 2. Test everything
npm run build
npm run lint

# 3. Update version
npm version patch  # or minor, or major

# 4. Update CHANGELOG.md manually
# Add release notes

# 5. Commit everything
git add .
git commit -m "chore: release v1.0.1"

# 6. Create tag
git tag v1.0.1

# 7. Push to GitHub
git push origin main --tags

# 8. Publish to npm
npm run build
npm publish

# 9. Verify
npm info n8n-nodes-qlynk
```

## 🔧 Troubleshooting

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clean build
rm -rf dist
npm run build

# Reset git
git reset --hard HEAD
git clean -fd

# View npm config
npm config list

# Check npm registry
npm config get registry
# Should be: https://registry.npmjs.org/

# Fix npm permissions (Linux/Mac)
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

## 📊 Package Information

```bash
# View package details
npm info n8n-nodes-qlynk

# View specific field
npm info n8n-nodes-qlynk version
npm info n8n-nodes-qlynk description
npm info n8n-nodes-qlynk dependencies

# Download package
npm pack n8n-nodes-qlynk

# View package files
tar -tzf n8n-nodes-qlynk-1.0.0.tgz

# Check package size
npm pack --dry-run

# Audit dependencies
npm audit

# Update dependencies
npm update

# Check outdated dependencies
npm outdated
```

## 🔍 Testing Installation

```bash
# Install from npm
npm install n8n-nodes-qlynk

# Install specific version
npm install n8n-nodes-qlynk@1.0.0

# Install from local tarball
npm install ./n8n-nodes-qlynk-1.0.0.tgz

# Install from GitHub
npm install github:ClosiQode/n8n-nodes-qlynk

# Uninstall
npm uninstall n8n-nodes-qlynk
```

## 📝 Documentation

```bash
# Generate TypeDoc (if installed)
npx typedoc --out docs nodes/

# Serve docs locally
npx http-server docs/

# Check for broken links in README
npx markdown-link-check README.md
```

## 🤖 GitHub Operations

```bash
# Create release via gh CLI
gh release create v1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "First stable release"

# List releases
gh release list

# View release
gh release view v1.0.0

# Delete release
gh release delete v1.0.0

# Create issue
gh issue create \
  --title "Bug: Something broke" \
  --body "Description here"

# List issues
gh issue list

# Clone repository
gh repo clone ClosiQode/n8n-nodes-qlynk
```

## 🔐 Security

```bash
# Scan for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Generate security report
npm audit --json > security-report.json
```

## 📈 Analytics

```bash
# View download stats
npm info n8n-nodes-qlynk dist.tarball

# Check package on npms.io
# Visit: https://npms.io/search?q=n8n-nodes-qlynk

# Check bundle size
npx bundlephobia n8n-nodes-qlynk
```

## 🎨 Development

```bash
# Run TypeScript compiler
npx tsc

# Check TypeScript without emitting
npx tsc --noEmit

# Run ESLint on specific file
npx eslint nodes/Qlynk/Qlynk.node.ts

# Format specific file
npx prettier --write nodes/Qlynk/Qlynk.node.ts

# Run Gulp tasks
npx gulp build:icons
```

## 📦 Package Management

```bash
# List installed packages
npm list

# List global packages
npm list -g --depth=0

# Check for duplicate packages
npm dedupe

# Clean npm cache
npm cache clean --force

# Verify cache integrity
npm cache verify
```

## 🌐 Environment Variables

```bash
# Linux/Mac
export N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
export N8N_LOG_LEVEL=debug

# Windows (PowerShell)
$env:N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE="true"
$env:N8N_LOG_LEVEL="debug"

# Windows (CMD)
set N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
set N8N_LOG_LEVEL=debug
```

## 🔄 Update Workflow

```bash
# Regular update cycle
git pull origin main          # Get latest changes
npm install                   # Update dependencies
npm run build                 # Rebuild
npm run lint                  # Check code
npm version patch             # Bump version
git push --follow-tags        # Push changes
npm publish                   # Publish to npm
```

## ⚡ Quick Actions

```bash
# Build & publish
npm run build && npm publish

# Format & lint
npm run format && npm run lint

# Clean, install, build
rm -rf node_modules dist && npm install && npm run build

# Test locally
npm link && cd ~/.n8n/custom && npm link n8n-nodes-qlynk

# Create new version and publish
npm version patch && git push --follow-tags && npm run build && npm publish
```

---

**Tip**: Bookmark this file for quick reference! 🔖
