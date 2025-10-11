#!/usr/bin/env bash
# Installation script for fd-postman-cli shell completions

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
ROCKET="🚀"
INFO="ℹ️"
WARNING="⚠️"
ERROR="❌"

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                          ║${NC}"
echo -e "${BLUE}║         ${GREEN}🎨 FD-POSTMAN-CLI AUTOCOMPLETE INSTALLATION${BLUE}                      ║${NC}"
echo -e "${BLUE}║                                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect shell
SHELL_NAME=$(basename "$SHELL")
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${INFO} Detected shell: ${GREEN}$SHELL_NAME${NC}"
echo ""

# Function to install bash completion
install_bash() {
    echo -e "${ROCKET} Installing Bash completion..."
    
    # Determine bash completion directory
    if [ -d "/usr/local/etc/bash_completion.d" ]; then
        COMPLETION_DIR="/usr/local/etc/bash_completion.d"
    elif [ -d "/etc/bash_completion.d" ]; then
        COMPLETION_DIR="/etc/bash_completion.d"
    elif [ -d "$HOME/.bash_completion.d" ]; then
        COMPLETION_DIR="$HOME/.bash_completion.d"
    else
        mkdir -p "$HOME/.bash_completion.d"
        COMPLETION_DIR="$HOME/.bash_completion.d"
    fi
    
    # Copy completion file
    cp "$SCRIPT_DIR/fp-completion.bash" "$COMPLETION_DIR/fp"
    
    # Add source to .bashrc if not already there
    if ! grep -q "fp-completion" "$HOME/.bashrc" 2>/dev/null; then
        echo "" >> "$HOME/.bashrc"
        echo "# FD-Postman-CLI completion" >> "$HOME/.bashrc"
        echo "[ -f \"$COMPLETION_DIR/fp\" ] && source \"$COMPLETION_DIR/fp\"" >> "$HOME/.bashrc"
    fi
    
    echo -e "${CHECK} ${GREEN}Bash completion installed!${NC}"
    echo -e "${INFO} Completion file: $COMPLETION_DIR/fp"
    echo ""
    echo -e "${INFO} To activate now, run: ${BLUE}source ~/.bashrc${NC}"
}

# Function to install zsh completion
install_zsh() {
    echo -e "${ROCKET} Installing Zsh completion..."
    
    # Determine zsh completion directory
    if [ -d "/usr/local/share/zsh/site-functions" ]; then
        COMPLETION_DIR="/usr/local/share/zsh/site-functions"
    elif [ -d "$HOME/.zsh/completion" ]; then
        COMPLETION_DIR="$HOME/.zsh/completion"
    else
        mkdir -p "$HOME/.zsh/completion"
        COMPLETION_DIR="$HOME/.zsh/completion"
    fi
    
    # Copy completion file
    cp "$SCRIPT_DIR/fp-completion.zsh" "$COMPLETION_DIR/_fp"
    
    # Add fpath to .zshrc if not already there
    if ! grep -q "fp.*completion" "$HOME/.zshrc" 2>/dev/null; then
        echo "" >> "$HOME/.zshrc"
        echo "# FD-Postman-CLI completion" >> "$HOME/.zshrc"
        echo "fpath=($COMPLETION_DIR \$fpath)" >> "$HOME/.zshrc"
        echo "autoload -Uz compinit && compinit" >> "$HOME/.zshrc"
    fi
    
    echo -e "${CHECK} ${GREEN}Zsh completion installed!${NC}"
    echo -e "${INFO} Completion file: $COMPLETION_DIR/_fp"
    echo ""
    echo -e "${INFO} To activate now, run: ${BLUE}source ~/.zshrc${NC}"
}

# Function to install fish completion
install_fish() {
    echo -e "${ROCKET} Installing Fish completion..."
    
    # Determine fish completion directory
    if [ -d "$HOME/.config/fish/completions" ]; then
        COMPLETION_DIR="$HOME/.config/fish/completions"
    else
        mkdir -p "$HOME/.config/fish/completions"
        COMPLETION_DIR="$HOME/.config/fish/completions"
    fi
    
    # Copy completion file
    cp "$SCRIPT_DIR/fp-completion.fish" "$COMPLETION_DIR/fp.fish"
    
    echo -e "${CHECK} ${GREEN}Fish completion installed!${NC}"
    echo -e "${INFO} Completion file: $COMPLETION_DIR/fp.fish"
    echo ""
    echo -e "${INFO} Fish completions are automatically loaded!"
}

# Main installation logic
case "$SHELL_NAME" in
    bash)
        install_bash
        ;;
    zsh)
        install_zsh
        ;;
    fish)
        install_fish
        ;;
    *)
        echo -e "${WARNING} ${YELLOW}Shell '$SHELL_NAME' not directly supported.${NC}"
        echo ""
        echo "Please choose your shell manually:"
        echo "  1) Bash"
        echo "  2) Zsh"
        echo "  3) Fish"
        echo ""
        read -p "Enter choice (1-3): " choice
        
        case $choice in
            1) install_bash ;;
            2) install_zsh ;;
            3) install_fish ;;
            *) echo -e "${ERROR} ${RED}Invalid choice!${NC}"; exit 1 ;;
        esac
        ;;
esac

echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CHECK} ${GREEN}Installation complete!${NC}"
echo ""
echo -e "${INFO} ${BLUE}Try it out:${NC}"
echo -e "   1. Reload your shell configuration"
echo -e "   2. Type ${BLUE}fp${NC} and press ${BLUE}TAB${NC}"
echo -e "   3. See beautiful autocomplete suggestions with emojis! 🎨"
echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════════════════════════${NC}"
echo ""

