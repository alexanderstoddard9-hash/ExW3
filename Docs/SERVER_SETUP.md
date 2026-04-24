# Local Server Setup

## Quick Start

### Windows Users
Double-click **`Kernel/Server/start-server.bat`** to launch the server and open it in your browser.

### Mac/Linux Users
Run in terminal:
```bash
npm start
```

Or:
```bash
node Kernel/Server/server.js
```

## Detailed Setup

### Option 1: Using Node.js (Recommended)

#### Install Node.js

1. Download from [nodejs.org](https://nodejs.org/)
2. Install the **LTS (Long Term Support)** version
3. Follow the installer prompts

#### Verify Installation

Open terminal/PowerShell and run:
```bash
node --version
npm --version
```

You should see version numbers like `v18.0.0` and `9.0.0`.

#### Start the Server

Navigate to the EXW3 folder and run:

**Windows:**
- Double-click `Kernel/Server/start-server.bat`, OR
- Open PowerShell and run: `node Kernel/Server/server.js`

**Mac/Linux:**
```bash
node Kernel/Server/server.js
```

### Option 2: Using Python (No Installation Needed)

Python comes pre-installed on most systems.

#### Check if Python is Installed

```bash
python --version
# or
python3 --version
```

#### Start the Server

Navigate to the EXW3 folder and run:

**Python 3:**
```bash
python -m http.server 3000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 3000
```

### Option 3: Using npm

If you have Node.js installed:

```bash
npm start
```

This is equivalent to `node Kernel/Server/server.js`.

## Accessing Your Site

Once the server is running, open your browser to:

```
http://localhost:3000
```

You should see the EXW3 site with the Dashboard, Content, and Settings sections.

## Troubleshooting

### Port Already in Use

If you see "Address already in use" error:

1. Change the PORT variable in `Kernel/Server/server.js`
2. Or stop other applications using port 3000
3. Or use a different terminal/window

### Node.js Not Found

If `node: command not found`:

1. Node.js might not be installed
2. Check installation: `node --version`
3. Restart your terminal after installing Node.js
4. Try the Python option instead

### Browser Won't Open

If the browser doesn't open automatically:

1. Manually navigate to `http://localhost:3000`
2. Check that the server is running in terminal
3. Make sure port 3000 is not blocked by firewall

### Module Not Found Errors

The Node.js server has no dependencies and doesn't require `npm install`. If you see errors:

1. Make sure you're in the EXW3 directory
2. Check that all kernel files exist
3. Verify `Kernel/Server/server.js` wasn't modified

## Development Workflow

1. **Start server:** `node Kernel/Server/server.js`
2. **Create/edit mods:** Add `.exwl3` or `.exws3` files to `Mods/` folder
3. **Update config:** Edit `Config/site-config.json`
4. **Refresh browser:** Press F5 to reload and see changes
5. **Check console:** Press F12 to view any errors

## Production Deployment

For hosting on a real server:

1. Use a proper web server (Apache, Nginx, etc.)
2. The Node.js `Kernel/Server/server.js` is for **local development only**
3. Copy the entire EXW3 folder to your web server
4. Serve the files statically (all files in root directory)

## Performance Tips

- The dev server is single-threaded, suitable for local use
- For production, use a full web server
- Modules load on demand, so performance is good
- Browser caching is disabled (good for development, bad for production)

## What's Running?

The local server:
- Serves static files from the EXW3 directory
- Handles `.exwl3` and `.exws3` files as plain text
- Supports all file types (HTML, CSS, JS, JSON, images, etc.)
- No server-side processing or database
- All logic runs in the browser

## Questions?

Check [README.md](README.md) for complete documentation and [GETTING_STARTED.md](GETTING_STARTED.md) for beginner guide.
