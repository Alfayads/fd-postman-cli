# VHS Script for fd-postman-cli Demo
# Install VHS: brew install vhs
# Run: vhs demo.tape

Output assets/demo.gif

# Terminal settings
Set FontSize 14
Set Width 1200
Set Height 600
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 50ms

# Scene 1: Welcome Message
Type "clear"
Enter
Sleep 500ms

Type "fp"
Enter
Sleep 4s

# Scene 2: Simple GET Request
Type "fp get https://jsonplaceholder.typicode.com/users/1"
Enter
Sleep 3s

# Scene 3: Help Command
Type "fp --help"
Enter
Sleep 2s

# End
Sleep 1s

