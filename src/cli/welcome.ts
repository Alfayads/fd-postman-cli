/**
 * Welcome message and branding with animations
 */

import chalk from 'chalk';
import { version } from '../../package.json';

/**
 * Sleep utility for animations
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clear the console
 */
function clearConsole(): void {
  process.stdout.write('\x1Bc');
}

/**
 * Matrix-style digital rain effect
 */
async function showMatrixEffect(): Promise<void> {
  const chars = '01';
  const width = 70;
  const height = 3;

  for (let row = 0; row < height; row++) {
    let line = '     ';
    for (let col = 0; col < width; col++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const color = Math.random() > 0.7 ? chalk.green.bold : chalk.green.dim;
      line += color(char || '0');
    }
    console.log(line);
    await sleep(100);
  }
  await sleep(300);
}

/**
 * System initialization sequence
 */
async function showSystemInit(): Promise<void> {
  const systems = [
    { name: '[CORE]         Initializing HTTP engine', icon: '▰▰▰▰▱▱▱▱▱▱', time: 60 },
    { name: '[AUTH]         Loading authentication modules', icon: '▰▰▰▰▰▰▱▱▱▱', time: 50 },
    { name: '[STORAGE]      Mounting data persistence layer', icon: '▰▰▰▰▰▰▰▰▱▱', time: 50 },
    { name: '[COLLECTIONS]  Indexing request collections', icon: '▰▰▰▰▰▰▰▰▰▱', time: 50 },
    { name: '[ENVIRONMENT]  Loading variable scopes', icon: '▰▰▰▰▰▰▰▰▰▰', time: 50 },
  ];

  console.log('');
  console.log(chalk.cyan.bold('     ┌─────────────────────────────────────────────────────┐'));
  console.log(
    chalk.cyan.bold('     │') +
      chalk.white.bold('  SYSTEM INITIALIZATION SEQUENCE') +
      chalk.cyan.bold('                 │')
  );
  console.log(chalk.cyan.bold('     └─────────────────────────────────────────────────────┘'));
  console.log('');

  for (const system of systems) {
    process.stdout.write(chalk.gray('     '));
    process.stdout.write(chalk.cyan('►') + ' ');
    process.stdout.write(chalk.white(system.name.padEnd(48)));

    // Animate loading bar
    for (let i = 0; i < 10; i++) {
      process.stdout.write('\x1B[48D'); // Move cursor back
      const filled = '▰'.repeat(i + 1);
      const empty = '▱'.repeat(10 - i - 1);
      const bar = i < 5 ? chalk.yellow(filled + empty) : chalk.green(filled + empty);
      process.stdout.write(bar);
      await sleep(system.time);
    }

    console.log(chalk.green.bold(' ✓'));
    await sleep(50);
  }

  console.log('');
  console.log(
    chalk.green.bold('     ╰─► ') +
      chalk.white.bold('ALL SYSTEMS OPERATIONAL') +
      chalk.green(' ✓✓✓')
  );
  await sleep(400);
  clearConsole();
}

/**
 * Scanning effect
 */
async function showScanEffect(): Promise<void> {
  clearConsole();
  console.log('');
  console.log('');
  const scanLines = [
    '     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓',
    '     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
  ];

  for (let i = 0; i < 5; i++) {
    for (const line of scanLines) {
      console.log(chalk.cyan(line));
    }
    await sleep(80);
    process.stdout.write('\x1B[2A\x1B[2K\x1B[1A\x1B[2K');
  }

  await sleep(200);
  clearConsole();
}

/**
 * Enhanced loading animation with professional tech style
 */
async function showLoadingAnimation(): Promise<void> {
  clearConsole();

  // Show matrix effect
  await showMatrixEffect();
  clearConsole();

  // System initialization
  await showSystemInit();

  // Scanning effect
  await showScanEffect();
}

export async function showWelcome(): Promise<void> {
  // Show loading animation
  await showLoadingAnimation();

  // Tech-style header with hex code
  console.log('');
  console.log(
    chalk.bgBlack.green('  [0x00] ') +
      chalk.bgBlack.cyan(' SYSTEM READY ') +
      chalk.bgBlack.green(' [0xFF] ') +
      chalk.gray(' │ ') +
      chalk.gray(`TIMESTAMP: ${Date.now()}`)
  );
  await sleep(150);

  // Animated title reveal with glitch effect
  console.log('');
  console.log(
    chalk.cyan('  ╔═══════════════════════════════════════════════════════════════════╗')
  );

  // ASCII art logo with scanning effect
  const logoLines = [
    chalk.bold.magenta('      ███████╗██████╗       ██████╗  ██████╗ ███████╗████████╗     '),
    chalk.bold.magenta('      ██╔════╝██╔══██╗      ██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝     '),
    chalk.bold.cyan('      █████╗  ██║  ██║█████╗██████╔╝██║   ██║███████╗   ██║        '),
    chalk.bold.cyan('      ██╔══╝  ██║  ██║╚════╝██╔═══╝ ██║   ██║╚════██║   ██║        '),
    chalk.bold.blue('      ██║     ██████╔╝      ██║     ╚██████╔╝███████║   ██║        '),
    chalk.bold.blue('      ╚═╝     ╚═════╝       ╚═╝      ╚═════╝ ╚══════╝   ╚═╝        '),
  ];

  for (let i = 0; i < logoLines.length; i++) {
    const line = logoLines[i];
    if (line) {
      console.log(chalk.cyan('  ║') + line + chalk.cyan('║'));
      // Scanning line effect
      process.stdout.write(chalk.cyan('  ║'));
      for (let j = 0; j < 67; j++) {
        process.stdout.write(chalk.cyan('▓'));
        await sleep(3);
      }
      process.stdout.write(chalk.cyan('║\n'));
      process.stdout.write('\x1B[1A\x1B[2K');
      await sleep(50);
    }
  }

  console.log(
    chalk.cyan('  ║') +
      '                                                                     ' +
      chalk.cyan('║')
  );
  console.log(
    chalk.cyan('  ║') +
      chalk.bold.white('               🚀 A Powerful CLI Tool for API Testing 🚀           ') +
      chalk.cyan('║')
  );
  console.log(
    chalk.cyan('  ║') +
      chalk.italic.cyan('                    Inspired by Postman, Built for CLI             ') +
      chalk.cyan('║')
  );
  console.log(
    chalk.cyan('  ║') +
      '                                                                     ' +
      chalk.cyan('║')
  );
  console.log(
    chalk.cyan('  ╚═══════════════════════════════════════════════════════════════════╝')
  );
  await sleep(200);

  // Developer info with tech style
  console.log('');
  console.log(
    chalk.bgCyan.black(' 👨‍💻 DEVELOPER ') +
      chalk.cyan('═══════════════════════════════════════════════════════════')
  );
  await sleep(100);

  // Glitch effect for name
  const nameGlitch = ['ALF4Y4D', 'A1FAYAD', 'ALFAYAD'];
  for (const glitchName of nameGlitch) {
    process.stdout.write('\x1B[1A\x1B[2K');
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════════'));
    process.stdout.write(
      chalk.gray('     ┌─> ') + chalk.bold.yellow('AUTHOR: ') + chalk.bold.white(glitchName) + '\n'
    );
    await sleep(80);
  }

  console.log(
    chalk.gray('     ├─> ') +
      chalk.bold.cyan('VERSION: ') +
      chalk.green.bold(`v${version}`) +
      chalk.gray(' [STABLE]')
  );
  await sleep(80);
  console.log(
    chalk.gray('     ├─> ') +
      chalk.bold.magenta('PORTFOLIO: ') +
      chalk.blue.bold.underline('https://alfayad.vercel.app') +
      chalk.cyan(' ⚡')
  );
  await sleep(80);
  console.log(
    chalk.gray('     └─> ') +
      chalk.bold.blue('REPOSITORY: ') +
      chalk.blue.underline('github.com/Alfayads/fd-postman-cli') +
      chalk.cyan(' ⭐')
  );
  await sleep(150);
  console.log(chalk.cyan('═══════════════════════════════════════════════════════════════════'));
  await sleep(150);
  console.log('');
  console.log(chalk.bgGreen.black(' ⚡ QUICK START ') + chalk.green('═'.repeat(56)));
  await sleep(100);
  console.log('');

  const examples = [
    {
      title: 'Simple GET Request',
      commands: ['fp get https://api.example.com/users'],
      icon: '🌐',
    },
    {
      title: 'Authenticated Request',
      commands: [
        'fp get https://api.example.com/protected \\',
        '  --auth-type bearer --token <your-token>',
      ],
      icon: '🔐',
    },
    {
      title: 'Environment & Variables',
      commands: [
        'fp env set prod apiUrl=https://api.prod.com',
        'fp env use prod',
        'fp get {{apiUrl}}/users',
      ],
      icon: '🌍',
    },
  ];

  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    if (!example) continue;

    console.log(
      chalk.gray('     [') +
        chalk.yellow.bold(`0${i + 1}`) +
        chalk.gray('] ') +
        example.icon +
        '  ' +
        chalk.cyan.bold(example.title)
    );
    await sleep(80);

    for (const cmd of example.commands) {
      console.log(chalk.gray('          $') + chalk.white(' ' + cmd));
      await sleep(60);
    }
    if (i < examples.length - 1) console.log('');
  }

  await sleep(150);
  console.log('');
  console.log(chalk.bgMagenta.white(' 📚 COMMANDS ') + chalk.magenta('═'.repeat(58)));
  await sleep(100);
  console.log('');
  // HTTP Methods with animated reveal
  console.log(chalk.bold.magenta('     🌐 HTTP Methods:'));
  await sleep(100);
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  const methodColors = [
    chalk.blue,
    chalk.green,
    chalk.yellow,
    chalk.red,
    chalk.magenta,
    chalk.cyan,
    chalk.white,
  ];
  process.stdout.write('        ');
  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    const colorFn = methodColors[i];
    if (method && colorFn) {
      process.stdout.write(colorFn.bold(method));
      if (i < methods.length - 1) {
        process.stdout.write(chalk.gray(' • '));
      }
      await sleep(80);
    }
  }
  console.log('');
  await sleep(150);
  console.log('');

  // Management Commands
  console.log(chalk.bold.green('     ⚙️  Management:'));
  await sleep(100);
  const mgmtCommands = [
    ['env', 'Environments & variables (8 subcommands)', '🌍'],
    ['global', 'Global variables (4 subcommands)', '🌐'],
    ['collection', 'Request collections (5 subcommands)', '📁'],
    ['history', 'Request history (4 subcommands)', '📜'],
  ];

  for (const [cmd, desc, icon] of mgmtCommands) {
    console.log(
      chalk.white('        ' + cmd?.padEnd(11)) + chalk.gray('→ ') + chalk.gray(desc) + ' ' + icon
    );
    await sleep(80);
  }
  await sleep(150);
  console.log('');

  // Help section
  console.log(chalk.bold('  ❓ ' + chalk.white('Need Help?')));
  await sleep(100);
  console.log(
    chalk.white('     fp --help           ') +
      chalk.gray('→ Show detailed help ') +
      chalk.yellow('📖')
  );
  await sleep(80);
  console.log(
    chalk.white('     fp <command> --help ') +
      chalk.gray('→ Command-specific help ') +
      chalk.yellow('🔍')
  );
  await sleep(150);
  console.log('');

  // Animated tips box
  console.log(
    chalk.bgBlue.white(' 💡 PRO TIPS ') +
      chalk.blue('═══════════════════════════════════════════════════════════════')
  );
  await sleep(100);
  const tips = [
    ['Set active environment:', 'fp env use production', '🎯'],
    ['Use variables in URLs:', 'https://{{apiUrl}}/{{endpoint}}', '🔗'],
    ['Run test collections:', 'fp collection run "API Tests"', '▶️'],
    ['View request history:', 'fp history list --limit 10', '📊'],
  ];

  for (const [tip, example, icon] of tips) {
    console.log(
      chalk.gray('     ') +
        icon +
        ' ' +
        chalk.white(tip?.padEnd(25)) +
        chalk.cyan.bold(example || '')
    );
    await sleep(80);
  }
  console.log(
    chalk.blue('═══════════════════════════════════════════════════════════════════════')
  );
  await sleep(200);
  console.log('');

  // Animated footer
  const footerText = 'Happy API Testing! 🎯 Built with ❤️  by Alfayad';
  process.stdout.write('  ');
  for (let i = 0; i < footerText.length; i++) {
    const char = footerText[i];
    if (char === '❤') {
      process.stdout.write(chalk.red.bold(char));
    } else if (char === 'Alfayad') {
      process.stdout.write(chalk.yellow.bold('Alfayad'));
      i += 6; // Skip the rest of "Alfayad"
    } else {
      process.stdout.write(chalk.italic.gray(char || ''));
    }
    await sleep(15);
  }
  console.log('');
  console.log('');

  // Sparkle effect
  const sparkles = ['✨', '⭐', '✨', '💫', '⭐', '✨'];
  process.stdout.write('  ');
  for (const sparkle of sparkles) {
    process.stdout.write(
      sparkle === '✨'
        ? chalk.yellow(sparkle)
        : sparkle === '⭐'
          ? chalk.cyan(sparkle)
          : chalk.magenta(sparkle)
    );
    process.stdout.write(' ');
    await sleep(50);
  }
  console.log(
    chalk.bold.green(' Type ') +
      chalk.bgGreen.black(' fp <command> ') +
      chalk.bold.green(' to get started! ') +
      sparkles
        .reverse()
        .map((s) => (s === '✨' ? chalk.yellow(s) : s === '⭐' ? chalk.cyan(s) : chalk.magenta(s)))
        .join(' ')
  );
  console.log('');
}
