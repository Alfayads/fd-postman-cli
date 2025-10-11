# Publishing fd-postman-cli to npm

## 📦 Pre-Publishing Checklist

✅ All features implemented  
✅ 93 tests passing  
✅ Documentation complete  
✅ Version updated to 2.0.0  
✅ package.json configured  
✅ .npmignore configured  

---

## 🚀 Step-by-Step Publishing Guide

### Step 1: Create npm Account (if you don't have one)

Visit: https://www.npmjs.com/signup

Or from terminal:
```bash
npm adduser
```

Enter:
- Username
- Password
- Email (must be verified)

### Step 2: Login to npm

```bash
npm login
```

Verify you're logged in:
```bash
npm whoami
# Should show your username
```

### Step 3: Check Package Name Availability

```bash
npm search fd-postman-cli
```

**Note:** If the name is taken, you can:
1. Use a scoped package: `@yourusername/fd-postman-cli`
2. Choose a different name: `fd-postman`, `fayad-postman-cli`, etc.

To use a scoped package, update `package.json`:
```json
{
  "name": "@alfayads/fd-postman-cli",
  ...
}
```

And update the binary name if needed:
```json
{
  "bin": {
    "fp": "dist/cli/index.js"
  }
}
```

### Step 4: Final Pre-Publish Checks

```bash
cd /Users/fayad/Documents/Projects/fd-postman-cli

# Run linting
npm run lint

# Run all tests
npm test

# Build the project
npm run build

# Verify dist/ folder exists and has compiled files
ls -la dist/
```

### Step 5: Dry Run (Test Publishing)

```bash
# This simulates publishing without actually publishing
npm publish --dry-run
```

Review the output to see what files will be included.

### Step 6: Publish to npm

**For Public Package (Free):**
```bash
npm publish --access public
```

**For Scoped Package:**
```bash
npm publish --access public
```

### Step 7: Verify Publication

```bash
# Search for your package
npm search fd-postman-cli

# View package info
npm info fd-postman-cli

# Install it globally to test
npm install -g fd-postman-cli

# Test the CLI
fp --version
fp --help
```

---

## 📝 What Gets Published?

Based on your `.npmignore`, the following are included:

✅ **Included:**
- `dist/` (compiled JavaScript)
- `package.json`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- Documentation files

❌ **Excluded:**
- `src/` (TypeScript source)
- `tests/`
- `node_modules/`
- `.git/`
- Development files

---

## 🔄 Publishing Updates

### Version Bumping

```bash
# Patch version (bug fixes): 2.0.0 → 2.0.1
npm version patch

# Minor version (new features): 2.0.0 → 2.1.0
npm version minor

# Major version (breaking changes): 2.0.0 → 3.0.0
npm version major
```

Then publish:
```bash
npm publish --access public
```

### Update Process

1. Make your changes
2. Update `CHANGELOG.md`
3. Run tests: `npm test`
4. Bump version: `npm version patch/minor/major`
5. Commit: `git commit -am "Release v2.0.1"`
6. Push: `git push origin main --tags`
7. Publish: `npm publish --access public`

---

## 🎯 Post-Publishing

### Add npm Badge to README

Add this at the top of your README.md:

```markdown
[![npm version](https://img.shields.io/npm/v/fd-postman-cli.svg)](https://www.npmjs.com/package/fd-postman-cli)
[![npm downloads](https://img.shields.io/npm/dm/fd-postman-cli.svg)](https://www.npmjs.com/package/fd-postman-cli)
[![license](https://img.shields.io/npm/l/fd-postman-cli.svg)](https://github.com/Alfayads/fd-postman-cli/blob/main/LICENSE)
```

### Share Your Package

1. **GitHub Release:**
   - Go to: https://github.com/Alfayads/fd-postman-cli/releases
   - Click "Create a new release"
   - Tag: `v2.0.0`
   - Title: `v2.0.0 - Request Chaining, Workflows & Import/Export`
   - Use content from `CHANGELOG.md`

2. **Social Media:**
   - Twitter/X
   - LinkedIn
   - Dev.to
   - Reddit (r/javascript, r/node)

3. **Product Hunt** (optional):
   - https://www.producthunt.com/

---

## ⚠️ Troubleshooting

### Error: Package name already taken

**Solution 1: Use a scoped package**
```bash
# Update package.json
{
  "name": "@alfayads/fd-postman-cli"
}

# Publish
npm publish --access public
```

**Solution 2: Choose a different name**
```bash
# Update package.json
{
  "name": "fayad-postman-cli"
  # or
  "name": "fp-api-cli"
}
```

### Error: Need auth

```bash
npm login
# Or
npm adduser
```

### Error: 402 Payment Required

This happens with private scoped packages. Use `--access public`:
```bash
npm publish --access public
```

### Error: prepublishOnly script failed

This means tests or linting failed. Fix the issues:
```bash
npm run lint:fix
npm test
```

---

## 📊 Package Statistics

Once published, you can track:

- **Downloads:** https://npm-stat.com/charts.html?package=fd-postman-cli
- **npm Page:** https://www.npmjs.com/package/fd-postman-cli
- **Bundle Size:** https://bundlephobia.com/package/fd-postman-cli

---

## 🎉 Success!

Your package is now available to everyone:

```bash
# Anyone can install it
npm install -g fd-postman-cli

# And use it
fp --version
fp get https://api.example.com/users
```

---

## 📚 Next Steps

1. **Announce:** Share on social media
2. **Document:** Keep README updated
3. **Support:** Respond to issues on GitHub
4. **Iterate:** Continue improving based on feedback
5. **Update:** Release new versions regularly

---

## 🔗 Useful Links

- **npm Documentation:** https://docs.npmjs.com/
- **Semantic Versioning:** https://semver.org/
- **npm Package Best Practices:** https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
- **Your Package:** https://www.npmjs.com/package/fd-postman-cli (after publishing)

---

**Good luck with your npm publication! 🚀**

If you encounter any issues, refer to this guide or check npm documentation.

