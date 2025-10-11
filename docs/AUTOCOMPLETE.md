# 🎨 Autocomplete & Shell Completion Guide

fd-postman-cli comes with beautiful, emoji-enhanced autocomplete support for Bash, Zsh, and Fish shells. Get intelligent command suggestions as you type!

## ✨ Features

- **🎯 Smart Suggestions**: Context-aware completions for commands, subcommands, and options
- **🎨 Visual Icons**: Emoji icons for every command to make them easier to identify
- **📝 Helpful Descriptions**: See what each command does right in your terminal
- **⚡ Fast & Responsive**: Instant completions as you type
- **🔍 Option Completion**: Complete authentication types, environment names, and more

## 🚀 Quick Installation

### Automatic Installation (Recommended)

Simply run the installation script:

```bash
cd completions
./install-completions.sh
```

The script will:
1. Detect your shell automatically
2. Install the appropriate completion file
3. Update your shell configuration
4. Guide you through activation

### Manual Installation

Choose your shell:

#### Bash

```bash
# Copy completion file
cp completions/fp-completion.bash ~/.bash_completion.d/fp

# Add to your ~/.bashrc
echo '[ -f ~/.bash_completion.d/fp ] && source ~/.bash_completion.d/fp' >> ~/.bashrc

# Reload
source ~/.bashrc
```

#### Zsh

```bash
# Create completion directory if it doesn't exist
mkdir -p ~/.zsh/completion

# Copy completion file
cp completions/fp-completion.zsh ~/.zsh/completion/_fp

# Add to your ~/.zshrc
echo 'fpath=(~/.zsh/completion $fpath)' >> ~/.zshrc
echo 'autoload -Uz compinit && compinit' >> ~/.zshrc

# Reload
source ~/.zshrc
```

#### Fish

```bash
# Create completion directory if it doesn't exist
mkdir -p ~/.config/fish/completions

# Copy completion file
cp completions/fp-completion.fish ~/.config/fish/completions/fp.fish

# Fish automatically loads completions - no reload needed!
```

## 💡 Usage Examples

### Basic Command Completion

```bash
$ fp <TAB>
```

Shows all available commands:
```
🌐 get          - Make GET request
📤 post         - Make POST request
🔄 put          - Make PUT request
🗑️  delete       - Make DELETE request
✏️  patch        - Make PATCH request
📋 head         - Make HEAD request
⚙️  options      - Make OPTIONS request
🌍 env          - Manage environments
📦 collection   - Manage collections
🌐 global       - Manage global variables
📜 history      - View request history
🔄 workflow     - Manage workflows
🔐 auth         - Manage authentication
```

### Subcommand Completion

```bash
$ fp env <TAB>
```

Shows environment management commands:
```
💾 set     - Set environment variable
📋 list    - List all environments
👁️  show    - Show environment details
❌ unset   - Remove environment variable
✅ use     - Set active environment
🎯 active  - Show active environment
⏹️  unuse   - Unset active environment
🗑️  delete  - Delete environment
```

### Option Completion

```bash
$ fp get https://api.example.com <TAB>
```

Shows available options:
```
📝 -H, --header      - Custom header
🔍 -q, --query       - Query parameter
📄 -d, --data        - Request body
📋 --form            - Form data
💾 -o, --output      - Save response
🌍 --env             - Use environment
🔐 --auth-type       - Authentication type
🎫 --token           - Bearer token
⏱️  --timeout         - Request timeout
⚠️  --insecure        - Skip SSL verification
🎨 --pretty          - Pretty print
📄 --raw             - Raw output
🔍 --filter          - JSON filter
📢 --verbose         - Verbose output
```

### Authentication Type Completion

```bash
$ fp get https://api.example.com --auth-type <TAB>
```

Shows authentication types:
```
none       - No authentication
bearer     - Bearer token authentication
basic      - Basic authentication
apikey     - API key authentication
oauth2     - OAuth 2.0 authentication
aws-sigv4  - AWS Signature Version 4
digest     - Digest authentication
custom     - Custom JavaScript authentication
```

### Collection Subcommands

```bash
$ fp collection <TAB>
```

Shows collection commands:
```
➕ create  - Create new collection
📋 list    - List all collections
👁️  show    - Show collection details
🗑️  delete  - Delete collection
▶️  run     - Run collection
```

### Auth Subcommands

```bash
$ fp auth <TAB>
```

Shows authentication management commands:
```
🔑 oauth2-url                 - Generate OAuth2 authorization URL
🎫 oauth2-token               - Exchange code for token
🔐 oauth2-client-credentials  - Get client credentials token
🔒 pkce-generate              - Generate PKCE credentials
```

## 🎯 Tips & Tricks

### 1. Partial Matching

Type partial commands and press TAB:

```bash
$ fp col<TAB>     # Completes to 'fp collection'
$ fp g<TAB>       # Shows: get, global
```

### 2. Option Shortcuts

Short options work too:

```bash
$ fp get https://api.example.com -H <TAB>
# Start typing header...
```

### 3. Multiple Completions

Keep pressing TAB to cycle through options:

```bash
$ fp <TAB><TAB><TAB>  # Cycles through all commands
```

### 4. Context-Aware

Completions change based on context:

```bash
$ fp env set <TAB>        # Suggests environment names
$ fp collection run <TAB> # Suggests collection names
```

## 🔧 Troubleshooting

### Completions Not Working

**Bash:**
```bash
# Check if completion is loaded
complete -p fp

# If not, reload your .bashrc
source ~/.bashrc
```

**Zsh:**
```bash
# Check if completion is in fpath
echo $fpath | grep completion

# Rebuild completion cache
rm -f ~/.zcompdump && compinit
```

**Fish:**
```bash
# Check if completion file exists
ls ~/.config/fish/completions/fp.fish

# Reload completions
fish_update_completions
```

### Completion File Not Found

Make sure you're in the correct directory:

```bash
cd /path/to/fd-postman-cli
ls completions/
```

### Permission Denied

Make sure the installation script is executable:

```bash
chmod +x completions/install-completions.sh
```

## 📚 Advanced Configuration

### Custom Completion Styles (Zsh)

Add to your `~/.zshrc` for enhanced styling:

```zsh
# Group completions by type
zstyle ':completion:*' group-name ''

# Show descriptions
zstyle ':completion:*:descriptions' format '%B%d%b'

# Colorful completions
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}

# Menu selection
zstyle ':completion:*' menu select
```

### Fish Colors

Customize completion colors in Fish:

```fish
# Edit ~/.config/fish/config.fish
set -g fish_color_command green
set -g fish_color_param cyan
```

## 🎨 Emoji Reference

All commands use consistent emoji icons:

| Icon | Meaning |
|------|---------|
| 🌐 | Network/HTTP requests |
| 📤 | Sending/POST |
| 🔄 | Update/PUT |
| 🗑️  | Delete operations |
| ✏️  | Edit/PATCH |
| 📋 | List/View |
| 🌍 | Environment management |
| 📦 | Collection management |
| 📜 | History |
| 🔐 | Authentication |
| 💾 | Save/Storage |
| 🔍 | Search/Filter |
| ⚙️  | Configuration |
| ⏱️  | Time/Duration |
| 🎨 | Formatting |
| 📢 | Verbose/Debug |

## 🆘 Need Help?

- **Documentation**: [README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/Alfayads/fd-postman-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Alfayads/fd-postman-cli/discussions)

---

**Enjoy beautiful autocomplete! 🎉**

