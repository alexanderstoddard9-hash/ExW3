/**
 * EXW3 Local Development Server
 * Simple HTTP server for hosting the local site
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.exwl3': 'text/plain',
  '.exws3': 'text/plain',
  '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const ROOT = path.join(__dirname, '../..');

  // Auto-discovery endpoint — scans Mods folders and merges with site-config.json
  if (pathname === '/api/mods') {
    try {
      const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'Config/site-config.json'), 'utf8'));

      const layersDir = path.join(ROOT, 'Mods/Layers');
      const sectionsDir = path.join(ROOT, 'Mods/Sections');

      const allLayers = fs.readdirSync(layersDir)
        .filter(f => f.endsWith('.exwl3'))
        .map(f => f.replace('.exwl3', ''));

      const allSections = fs.readdirSync(sectionsDir)
        .filter(f => f.endsWith('.exws3'))
        .map(f => f.replace('.exws3', ''));

      // Preserve config order, append any new ones not yet listed
      const layers = [
        ...(config.layers || []),
        ...allLayers.filter(l => !(config.layers || []).includes(l))
      ];
      const sections = [
        ...(config.sections || []),
        ...allSections.filter(s => !(config.sections || []).includes(s))
      ];

      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
      res.end(JSON.stringify({ ...config, layers, sections }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Failed to scan mods: ' + e.message);
    }
    return;
  }

  let filePath = path.join(ROOT, pathname);

  // Prevent directory traversal
  const realPath = path.resolve(filePath);
  const basePath = path.resolve(ROOT);
  
  if (!realPath.startsWith(basePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // 404 Not Found
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    if (stats.isDirectory()) {
      // Try to serve index.html
      filePath = path.join(filePath, 'index.html');
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      });
    } else {
      // Serve the file
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n✓ EXW3 Server running at http://${HOST}:${PORT}/`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n✗ Port ${PORT} is already in use!`);
    console.error(`\nTry:`);
    console.error(`  1. Close the other application using port ${PORT}`);
    console.error(`  2. Change the PORT variable in server.js`);
    console.error(`  3. Use a different terminal\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✓ Server stopped');
  process.exit(0);
});
