# 📹 Recording Terminal Demo for README

## Quick Recording Instructions

### Option 1: Using asciinema (Recommended)

**Install:**
```bash
# macOS
brew install asciinema

# Convert to GIF
brew install agg
```

**Record:**
```bash
# Start recording
asciinema rec demo.cast

# In the recording:
# 1. Type: fp
# 2. Wait for the welcome animation to complete
# 3. Type: fp get https://jsonplaceholder.typicode.com/users/1
# 4. Type: fp --help
# 5. Press Ctrl+D to stop

# Convert to GIF
agg demo.cast assets/demo.gif
```

---

### Option 2: Using terminalizer

**Install:**
```bash
npm install -g terminalizer
```

**Record:**
```bash
# Initialize
terminalizer init demo

# Record
terminalizer record demo

# In the recording, show:
# 1. fp (welcome message)
# 2. fp get https://jsonplaceholder.typicode.com/users/1
# 3. fp --help

# Render to GIF
terminalizer render demo -o assets/demo.gif
```

---

### Option 3: Using ttygif (macOS)

**Install:**
```bash
brew install ttyrec ttygif imagemagick
```

**Record:**
```bash
# Start recording
ttyrec myrecording

# Show your demo:
# 1. fp
# 2. fp get https://jsonplaceholder.typicode.com/users/1
# 3. fp workflow --help

# Stop: exit or Ctrl+D

# Convert to GIF
ttygif myrecording
mv tty.gif assets/demo.gif
```

---

### Option 4: Using VHS (Modern, Scriptable)

**Install:**
```bash
brew install vhs
```

**Create script:** `demo.tape`
```tape
Output assets/demo.gif

Set FontSize 16
Set Width 1200
Set Height 600
Set Theme "Catppuccin Mocha"

Type "fp"
Enter
Sleep 3s

Type "fp get https://jsonplaceholder.typicode.com/users/1"
Enter
Sleep 2s

Type "fp workflow --help"
Enter
Sleep 2s
```

**Generate:**
```bash
vhs demo.tape
```

---

## 🎬 What to Record

### Demo Script (30-45 seconds)

1. **Welcome Message** (8s)
   ```bash
   fp
   ```
   Shows the beautiful animated welcome screen

2. **Simple GET Request** (5s)
   ```bash
   fp get https://jsonplaceholder.typicode.com/users/1
   ```
   Shows colored JSON output

3. **Help Command** (3s)
   ```bash
   fp --help
   ```
   Shows available commands

4. **Workflow Demo** (Optional - 5s)
   ```bash
   fp workflow --help
   ```

---

## 📝 Tips for Best Results

1. **Terminal Settings:**
   - Use a dark theme (better contrast)
   - Font size: 14-16pt
   - Window size: 120x30 characters
   - Color scheme: Solarized Dark, Dracula, or Monokai

2. **Recording Tips:**
   - Clear terminal before starting: `clear`
   - Type slowly and deliberately
   - Pause briefly between commands
   - Keep total length under 1 minute

3. **GIF Optimization:**
   ```bash
   # Optimize GIF size
   gifsicle -O3 --lossy=80 -o assets/demo-optimized.gif assets/demo.gif
   ```

---

## 🎯 Quick Start (Recommended Method)

**Using VHS (Easiest):**

1. Install VHS:
   ```bash
   brew install vhs
   ```

2. Create `demo.tape`:
   ```tape
   Output assets/demo.gif
   Set FontSize 14
   Set Width 1200
   Set Height 600
   Type "fp"
   Enter
   Sleep 3s
   Type "fp get https://jsonplaceholder.typicode.com/users/1"
   Enter
   Sleep 2s
   ```

3. Generate:
   ```bash
   vhs demo.tape
   ```

4. Commit and push:
   ```bash
   git add assets/demo.gif
   git commit -m "docs: Add demo GIF to README"
   git push origin main
   ```

Done! Your README will now show the animated demo.

---

## 📦 File Size

Keep GIF under 10MB for GitHub:
- Recommended: 2-5MB
- Use optimization tools if needed
- Consider shorter duration (20-30s)

