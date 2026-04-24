# EXW3 - Ready to Use Distribution

Welcome to EXW3! This distribution is ready to use out of the box with **automatic mod discovery**.

## 🚀 Quick Start

### Windows
Double-click `launch.bat`

### Mac/Linux
```bash
./launch.sh
```

Or run directly:
```bash
python3 launch.py
```

The browser opens automatically. That's it!

## 📦 What's Included

```
├── exw3.xkernel         # Everything in one file (PROTECTED)
├── launch.py            # Python launcher
├── launch.bat           # Windows launcher  
├── launch.sh            # Mac/Linux launcher
├── mod-config.json      # Configuration (auto-discovery enabled)
├── KERNEL-LICENSE.txt   # License terms
└── mods/                # Your mods folder
    ├── *.ex3            # Example mods
    └── admin/           # Admin-only mods
```

## ✨ Auto-Discovery Feature

**No configuration needed!** Just drop `.ex3` files in the `mods/` folder and they load automatically.

The `mod-config.json` is set to auto-discovery mode:

```json
{
  "mods": ["*"]
}
```

The `"*"` means "automatically load all mods". No need to list them manually!

## 🎨 Creating Your First Mod

1. Create a file `mods/my-feature.ex3`:

```
@name "my-feature"
@description "My awesome feature"
@type both

css {
  .my-feature {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    margin: 20px;
  }
}

html {
  <div class="my-feature">
    <h2>🎉 Hello from my mod!</h2>
    <p>This was automatically discovered and loaded.</p>
  </div>
}

script {
  console.log('✅ My feature loaded!');
}
```

2. Reload the page - your mod loads automatically!

**No configuration needed. No manual lists. Just drop and reload.**

## 🔧 Configuration Options

### Auto-Discovery (Default)
```json
{
  "mods": ["*"]
}
```
Loads all `.ex3` files from the mods folder automatically.

### Manual Mode
```json
{
  "mods": ["dashboard", "about", "my-feature"]
}
```
Only loads the specified mods.

### Folder Structure
```json
{
  "structure": {
    "modsFolder": "mods",
    "adminFolder": "mods/admin"
  }
}
```
Customize where mods are located.

## 📝 Mod Format (.ex3)

The `.ex3` format is simple and powerful:

```
@name "mod-name"
@description "What this mod does"
@version "1.0.0"
@author "Your Name"
@type both

css {
  /* Your styles */
}

html {
  <!-- Your HTML -->
}

script {
  // Your JavaScript
}
```

### Mod Types

- `@type layer` - Global styling and HTML injection
- `@type section` - UI components and pages
- `@type both` - Combines both (recommended)

## 🛡️ What is .xkernel?

The `.xkernel` file contains the entire EXW3 framework in one protected file:
- HTML structure
- CSS styles  
- JavaScript kernel
- All core functionality

**⚠️ IMPORTANT: Do NOT edit the .xkernel file!**

All customization must be done through mods. The kernel is protected by license.

## 📚 Example Mods Included

The distribution includes several example mods:

- **dashboard** - Main dashboard page
- **about** - About section
- **calc** - Calculator widget
- **clock** - Live clock display
- **dark-mode** - Dark theme toggle
- **settings** - Settings panel
- **notes** - Note-taking app
- And more!

Check the `mods/` folder to see how they work.

## 🔒 License

The EXW3 kernel is protected by license. See `KERNEL-LICENSE.txt` for complete terms.

**You MAY:**
- ✅ Use the kernel in your projects
- ✅ Create unlimited mods
- ✅ Distribute applications built with EXW3
- ✅ Configure via mod-config.json
- ✅ Create custom launchers

**You MAY NOT:**
- ❌ Edit or modify the .xkernel file
- ❌ Reverse engineer the kernel
- ❌ Remove copyright notices
- ❌ Redistribute modified kernel

**All customization must be done through the mod system.**

## 🌐 Custom Launchers

You can create your own launcher in any language. The launcher must:

1. Parse the `.xkernel` file
2. Extract the `html { ... }` block
3. Serve it via HTTP server
4. Serve other files (mods, config) normally
5. Provide `/__mods_list__` endpoint for auto-discovery (optional)

### Node.js Example

```javascript
const http = require('http');
const fs = require('fs');

const xkernel = fs.readFileSync('exw3.xkernel', 'utf8');
const html = xkernel.match(/html\s*\{([\s\S]*)\}\s*$/)[1].trim();

http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  }
  // ... serve other files
}).listen(3000);
```

### PHP Example

```php
<?php
if ($_SERVER['REQUEST_URI'] === '/') {
    $xkernel = file_get_contents('exw3.xkernel');
    preg_match('/html\s*\{([\s\S]*)\}\s*$/', $xkernel, $matches);
    echo trim($matches[1]);
}
?>
```

## 🎯 Tips & Tricks

### Organizing Mods

```
mods/
├── dashboard.ex3
├── about.ex3
├── features/
│   ├── calc.ex3
│   └── clock.ex3
└── admin/
    ├── admin-panel.ex3
    └── user-management.ex3
```

Auto-discovery scans the main `mods/` folder and `admin/` folder.

### Disabling a Mod

Rename it to remove the `.ex3` extension:
```
dashboard.ex3 → dashboard.ex3.disabled
```

Or move it outside the mods folder.

### Testing Mods

1. Create your mod in `mods/`
2. Reload the page
3. Check browser console for errors
4. Iterate and improve

No build step. No configuration. Just create and reload!

## 🆘 Troubleshooting

### Mods Not Loading

1. Check browser console for errors
2. Verify `.ex3` files are in the `mods/` folder
3. Ensure `mod-config.json` has `"mods": ["*"]`
4. Make sure Python launcher is running (not static file server)

### Port Already in Use

The launcher automatically tries ports 3000-3099. If all are busy, close other applications.

### Browser Doesn't Open

Manually navigate to the URL shown in the terminal (e.g., `http://localhost:3001`)

## 📖 Documentation

For complete documentation, see the `Docs/` folder in the repository:
- Getting Started Guide
- EX3 Format Specification
- XKernel Format Details
- Auto-Discovery Documentation
- Advanced Features
- Kernel API Reference

## 🎉 You're Ready!

That's everything you need to know to get started. The system is designed to be simple:

1. **Run** the launcher
2. **Create** `.ex3` files in `mods/`
3. **Reload** the page

No configuration. No build tools. No complexity.

**Happy modding!** 🚀

---

**Version:** EXW3 v2.0  
**License:** See KERNEL-LICENSE.txt  
**Support:** GitHub Issues
