# Deployment Guide

Complete guide to publish n8n-nodes-qlynk to GitHub and npm.

## Table of Contents

- [Prerequisites](#prerequisites)
- [GitHub Setup](#github-setup)
- [npm Publishing](#npm-publishing)
- [Versioning Strategy](#versioning-strategy)
- [Release Checklist](#release-checklist)
- [CI/CD Setup (Optional)](#cicd-setup-optional)
- [Post-Release](#post-release)

## Prerequisites

### Required Accounts

- [ ] GitHub account with repository created
- [ ] npm account (sign up at [npmjs.com](https://www.npmjs.com/))
- [ ] Git configured locally

### Required Tools

```bash
# Verify installations
node --version    # Should be v18+
npm --version     # Should be v8+
git --version     # Should be v2+
```

## GitHub Setup

### 1. Create Repository

```bash
# On GitHub.com
# 1. Go to github.com
# 2. Click "New repository"
# 3. Name: n8n-nodes-qlynk
# 4. Description: n8n community node for Qlynk URL shortener
# 5. Make it public (required for npm community packages)
# 6. Don't initialize with README (we have one)
# 7. Click "Create repository"
```

### 2. Initialize Git in Project

```bash
# Navigate to your project
cd C:\wamp64\www\qlink\n8n-nodes-qlynk

# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial release of n8n-nodes-qlynk"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/ClosiQode/n8n-nodes-qlynk.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Repository

On GitHub, go to your repository settings:

#### Topics
Add topics for discoverability:
- `n8n`
- `n8n-community-node-package`
- `qlynk`
- `url-shortener`
- `workflow-automation`
- `ai-tools`

#### Description
```
n8n community node for Qlynk URL shortener - Create, manage and track short links in your workflows
```

#### Website
```
https://qlynk.fr
```

#### About Section
- [x] Include in the home page

## npm Publishing

### 1. Create npm Account

```bash
# If you don't have an account
# Go to https://www.npmjs.com/signup

# Login via CLI
npm login

# Verify login
npm whoami
```

### 2. Verify Package Configuration

Check `package.json`:

```json
{
  "name": "n8n-nodes-qlynk",  // Must be unique on npm
  "version": "1.0.0",          // Start with 1.0.0
  "keywords": [
    "n8n-community-node-package"  // Required keyword!
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/ClosiQode/n8n-nodes-qlynk.git"
  },
  "license": "MIT"
}
```

### 3. Build the Package

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# This creates the dist/ folder with compiled code
```

### 4. Test Package Locally

```bash
# Create a tarball to test
npm pack

# This creates n8n-nodes-qlynk-1.0.0.tgz
# You can inspect what will be published

# Optional: Test installation
npm install -g ./n8n-nodes-qlynk-1.0.0.tgz
```

### 5. Publish to npm

```bash
# First time publishing
npm publish

# If you get an error about the package name
# You may need to use a scope
npm publish --access public
```

### 6. Verify Publication

```bash
# Check on npm
npm info n8n-nodes-qlynk

# Visit your package page
# https://www.npmjs.com/package/n8n-nodes-qlynk
```

## Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

1.0.0 → Initial release
1.0.1 → Bug fixes
1.1.0 → New features (backward compatible)
2.0.0 → Breaking changes
```

### Version Update Commands

```bash
# Patch (bug fixes)
npm version patch
# 1.0.0 → 1.0.1

# Minor (new features)
npm version minor
# 1.0.1 → 1.1.0

# Major (breaking changes)
npm version major
# 1.1.0 → 2.0.0
```

## Release Checklist

Before each release, verify:

### Pre-Release

- [ ] All code is tested and working
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] README is up to date
- [ ] CHANGELOG is updated with new version
- [ ] Version number is correct in `package.json`
- [ ] All dependencies are up to date
- [ ] No sensitive data in code

### Release

```bash
# 1. Update version
npm version [patch|minor|major]

# 2. Update CHANGELOG.md manually
# Add release date and changes

# 3. Commit changes
git add .
git commit -m "chore: release v1.x.x"

# 4. Create git tag
git tag v1.x.x

# 5. Push to GitHub
git push origin main --tags

# 6. Build
npm run build

# 7. Publish to npm
npm publish

# 8. Create GitHub Release (optional but recommended)
# Go to GitHub → Releases → "Create a new release"
# - Tag: v1.x.x
# - Title: v1.x.x - Release Name
# - Description: Copy from CHANGELOG
# - Attach files: optional
```

### Post-Release

- [ ] Verify package on npmjs.com
- [ ] Test installation: `npm install n8n-nodes-qlynk`
- [ ] Update documentation if needed
- [ ] Announce on social media/community

## CI/CD Setup (Optional)

### GitHub Actions for Automated Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm run lint

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Setup npm Token

1. Go to npmjs.com → Account → Access Tokens
2. Generate new token (Automation)
3. Copy the token
4. Go to GitHub repo → Settings → Secrets → New secret
5. Name: `NPM_TOKEN`
6. Value: your npm token
7. Save

Now, when you push a tag (`git push --tags`), it will automatically publish to npm!

### GitHub Actions for CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Lint
        run: npm run lint
```

## Post-Release

### Announce the Release

#### n8n Community Forum

Post on [community.n8n.io](https://community.n8n.io/):

```markdown
Title: [NEW NODE] Qlynk - URL Shortener with AI Support

Hi everyone! 👋

I'm excited to announce the release of **n8n-nodes-qlynk**,
a community node for the Qlynk URL shortener.

**Features:**
- Create and manage short links
- Organize links into categories
- Get detailed statistics
- Full AI Agent support

**Installation:**
`npm install n8n-nodes-qlynk`

**Links:**
- npm: https://www.npmjs.com/package/n8n-nodes-qlynk
- GitHub: https://github.com/ClosiQode/n8n-nodes-qlynk
- Docs: https://qlynk.fr/docs

Let me know if you have any questions! 🚀
```

#### Social Media

- Twitter/X
- LinkedIn
- Reddit (r/n8n)
- Discord

### Monitor Issues

Check regularly:
- GitHub issues
- npm package page
- n8n community forum

### Maintain

- Respond to issues within 48 hours
- Keep dependencies updated
- Release patches for bugs quickly
- Plan feature releases

## Troubleshooting

### "Package name already exists"

If someone already took the name:
```bash
# Use scoped package
# Update package.json name to: "@your-username/n8n-nodes-qlynk"
npm publish --access public
```

### "No permission to publish"

```bash
# Login again
npm logout
npm login
```

### Build fails

```bash
# Clean and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### Git push rejected

```bash
# Pull first
git pull origin main --rebase
git push origin main
```

## Quick Reference

```bash
# Complete release flow
npm version patch              # Update version
# Edit CHANGELOG.md manually
git add .
git commit -m "chore: release v1.0.1"
git tag v1.0.1
git push origin main --tags
npm run build
npm publish

# Verify
npm info n8n-nodes-qlynk
```

## Support

Questions about deployment?
- 📧 Email: contact@qlynk.fr
- 🐛 GitHub Issues: [Create Issue](https://github.com/ClosiQode/n8n-nodes-qlynk/issues)

---

Good luck with your release! 🎉
