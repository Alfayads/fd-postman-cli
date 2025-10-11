# 🎨 Autocomplete Quick Reference Card

## Installation (One-Time Setup)

```bash
cd completions && ./install-completions.sh && source ~/.<shell>rc
```

## Try It Out

Just type `fp` and press **TAB** ⚡

---

## Command Groups

### 🌐 HTTP Methods
```
fp get     🌐  fp post    📤  fp put      🔄
fp delete  🗑️   fp patch   ✏️   fp head     📋
fp options ⚙️
```

### 📦 Management
```
fp env          🌍  Environments
fp collection   📦  Collections
fp global       🌐  Global Variables
fp history      📜  Request History
fp workflow     🔄  Workflows
fp auth         🔐  Authentication
```

### 📥📤 Data
```
fp import  📥  Import data
fp export  📤  Export data
```

---

## Common Options

### Request Options
```
-H, --header    📝  Custom headers
-q, --query     🔍  Query parameters
-d, --data      📄  Request body
--form          📋  Form data
-o, --output    💾  Save response
```

### Authentication
```
--auth-type     🔐  Auth method
--token         🎫  Bearer token
--username      👤  Username
--password      🔑  Password
--api-key       🔐  API key
```

### Configuration
```
--env           🌍  Environment
--timeout       ⏱️   Timeout (ms)
--insecure      ⚠️   Skip SSL
--pretty        🎨  Pretty print
--raw           📄  Raw output
--filter        🔍  JSON filter
--verbose       📢  Verbose
```

---

## Subcommands

### Environment (`fp env <TAB>`)
```
set     💾  list    📋  show    👁️
unset   ❌  use     ✅  active  🎯
unuse   ⏹️   delete  🗑️
```

### Collection (`fp collection <TAB>`)
```
create  ➕  list    📋  show    👁️
delete  🗑️   run     ▶️
```

### Global (`fp global <TAB>`)
```
set     💾  list    📋
unset   ❌  clear   🗑️
```

### History (`fp history <TAB>`)
```
list    📋  show    👁️   search  🔍
clear   🗑️   replay  🔄
```

### Auth (`fp auth <TAB>`)
```
oauth2-url                  🔑
oauth2-token                🎫
oauth2-client-credentials   🔐
pkce-generate               🔒
```

---

## Auth Types (`--auth-type <TAB>`)

```
none       No authentication
bearer     Bearer token
basic      Basic auth (username/password)
apikey     API key (header or query)
oauth2     OAuth 2.0
aws-sigv4  AWS Signature v4
digest     Digest authentication
custom     Custom JavaScript
```

---

## Tips & Tricks

### Partial Matching
```bash
fp col<TAB>      →  fp collection
fp g<TAB>        →  get, global
```

### Cycle Through Options
```bash
fp <TAB><TAB>    # Press TAB multiple times
```

### Context-Aware
```bash
fp get https://api.com --<TAB>  # Shows HTTP options
fp env <TAB>                     # Shows env commands
```

---

## Troubleshooting

**Not working?** Try:

```bash
# Bash
source ~/.bashrc
complete -p fp  # Check if loaded

# Zsh
source ~/.zshrc
rm ~/.zcompdump && compinit

# Fish
fish_update_completions
```

---

## Full Documentation

- [Complete Autocomplete Guide](AUTOCOMPLETE.md)
- [Main README](../README.md)

---

**Print this reference card for quick access! 📋**

