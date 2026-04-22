#!/usr/bin/env node

/**
 * EXW3 Local Site - Launcher Script
 * Cross-platform server launcher for Windows, Mac, and Linux
 */

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';
const SERVER_URL = `http://${HOST}:${PORT}`;

console.log('\n✓ EXW3 Local Site - Development Server\n');

// Try to open browser automatically
function openBrowser(url) {
  let command;
  
  switch (os.platform()) {
    case 'win32':
      command = 'start';
      break;
    case 'darwin':
      command = 'open';
      break;
    default:
      command = 'xdg-open';
  }
  
  try {
    spawn(command, [url]);
    console.log(`  Opening browser: ${url}\n`);
  } catch (err) {
    console.log(`  Please open: ${url}\n`);
  }
}

// Start server
const server = spawn('node', [path.join(__dirname, 'server.js')], {
  cwd: path.join(__dirname, '../..'),
  stdio: 'inherit'
});

// Open browser after a short delay
setTimeout(() => {
  openBrowser(SERVER_URL);
}, 1000);

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Handle exit
server.on('exit', (code) => {
  process.exit(code);
});
