# Quick Start Guide - New Features

## 🚀 Push to GitHub

Your changes are committed locally. To push to GitHub:

```bash
cd /Users/fayad/Documents/Projects/fd-postman-cli
git push origin main
```

If you encounter errors, try:
```bash
git push origin main --no-verify
```

---

## 🎯 Feature #1: Request Chaining & Workflows

### Create Your First Workflow

```bash
# Create a workflow template
fp workflow create "User Authentication"

# This creates: user-authentication.workflow.json
```

### Edit the Workflow File

Open `user-authentication.workflow.json` and customize:

```json
{
  "name": "User Authentication Flow",
  "description": "Login and get user profile",
  "environment": "development",
  "steps": [
    {
      "name": "Step 1: Login",
      "request": {
        "method": "POST",
        "url": "https://api.example.com/auth/login",
        "headers": { "Content-Type": "application/json" },
        "body": {
          "email": "test@example.com",
          "password": "password123"
        }
      },
      "extractVariables": [
        {
          "name": "authToken",
          "path": "token",
          "scope": "workflow"
        }
      ],
      "continueOnError": false
    },
    {
      "name": "Step 2: Get Profile",
      "request": {
        "method": "GET",
        "url": "https://api.example.com/user/profile",
        "headers": {
          "Authorization": "Bearer {{authToken}}"
        }
      },
      "continueOnError": false
    }
  ]
}
```

### Run the Workflow

```bash
# Run without environment
fp workflow run user-authentication.workflow.json

# Run with specific environment
fp workflow run user-authentication.workflow.json --env production

# Verbose output
fp workflow run user-authentication.workflow.json --verbose
```

---

## 🎯 Feature #2: Import & Export

### Export Your Data

```bash
# Export a specific collection
fp export collection "My API Tests"
# Creates: my-api-tests.collection.json

# Export a specific environment
fp export env "Development"
# Creates: development.env.json

# Export everything
fp export all
# Creates: ./fd-postman-exports/
#   ├── collections/
#   └── environments/
```

### Import Data

```bash
# Import a collection
fp import collection backup.collection.json

# Import and merge with existing
fp import collection backup.collection.json --merge

# Import an environment
fp import env production.env.json --merge
```

### Practical Examples

**Daily Backup:**
```bash
# Create a dated backup
fp export all -d ~/backups/fp-backup-$(date +%Y%m%d)
```

**Share with Team:**
```bash
# Export your collection
fp export collection "API Integration Tests" -o team-tests.json

# Send team-tests.json to your team
# They import it:
fp import collection team-tests.json
```

---

## 🎯 Feature #3: History Replay

### View History

```bash
# List recent requests (last 10)
fp history list

# List more entries
fp history list --limit 50

# Search history
fp history search "api.example.com"
fp history search "POST"
```

### Replay a Request

```bash
# 1. First, list history to get the ID
fp history list

# Output will show something like:
#   1. 2024-01-15 10:30:25
#      GET https://api.example.com/users
#      Status: 200 • Duration: 145ms
#      ID: 1705315825000-abc123

# 2. Copy the ID and replay
fp history replay 1705315825000-abc123

# Or use alias
fp history rerun 1705315825000-abc123
```

### Use Case: Debug a Failed Request

```bash
# Make a request
fp post https://api.example.com/users -d '{"name":"John"}'

# Something went wrong, check history
fp history list

# Get the ID and replay
fp history replay <id>

# Now you can see the exact response again
```

---

## 📚 Complete Example Workflow

Here's a complete example combining all features:

```bash
# 1. Create an environment
fp env create "testing"
fp env set testing API_URL "https://api.example.com"
fp env set testing API_KEY "your-key-here"
fp env use testing

# 2. Create a collection
fp collection create "User Management API"
fp collection add-request "User Management API" \
  --name "Get All Users" \
  --method GET \
  --url "{{API_URL}}/users" \
  --header "X-API-Key: {{API_KEY}}"

# 3. Create a workflow
fp workflow create "Complete User Flow"
# Edit the workflow file...
fp workflow run complete-user-flow.workflow.json --env testing

# 4. Export everything for backup
fp export all -d ~/fp-backup

# 5. Check history
fp history list

# 6. Replay a specific request
fp history replay <id>
```

---

## 🎨 Tips & Tricks

### Variable Extraction Paths

Extract data using JSON paths:

```json
"extractVariables": [
  { "name": "token", "path": "data.token", "scope": "workflow" },
  { "name": "userId", "path": "user.id", "scope": "environment" },
  { "name": "firstItem", "path": "items[0].name", "scope": "global" }
]
```

### Error Handling in Workflows

```json
{
  "name": "Optional Step",
  "continueOnError": true,  // Won't stop workflow if this fails
  "request": { ... }
}
```

### Environment-Specific Workflows

```bash
# Same workflow, different environments
fp workflow run api-tests.workflow.json --env development
fp workflow run api-tests.workflow.json --env staging
fp workflow run api-tests.workflow.json --env production
```

---

## 📖 Documentation

- **README.md** - Complete feature documentation
- **CHANGELOG.md** - Version history and migration guide
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details

---

## 🆘 Need Help?

### Check Available Commands

```bash
fp --help
fp workflow --help
fp export --help
fp import --help
fp history --help
```

### Common Issues

**Workflow not running?**
- Check JSON syntax
- Verify URL format
- Ensure environment exists (if specified)

**Export not working?**
- Check collection/environment name
- Verify write permissions

**Replay not finding request?**
- Run `fp history list` to see available IDs
- Copy the exact ID shown

---

## 🎉 You're All Set!

Start by creating your first workflow:

```bash
fp workflow create "My First Workflow"
```

Then try exporting your data:

```bash
fp export all
```

And replay a request:

```bash
fp history list
fp history replay <id>
```

Happy testing! 🚀

---

**Developer:** Alfayad  
**Portfolio:** https://alfayad.vercel.app  
**GitHub:** https://github.com/Alfayads/fd-postman-cli

