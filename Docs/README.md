# EXW3 Documentation

Welcome to the EXW3 documentation! This guide will help you get started and make the most of your modular web framework.

## 📚 Documentation Index

### Getting Started
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Your first steps with EXW3
- **[AUTO_DISCOVERY.md](AUTO_DISCOVERY.md)** - How automatic mod loading works

### Mod Development
- **[EX3_FORMAT.md](EX3_FORMAT.md)** - Complete `.ex3` mod format specification
- **[EX3_SUMMARY.md](EX3_SUMMARY.md)** - Quick reference for `.ex3` format
- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - Advanced mod features
- **[MOD_TEMPLATES.json](MOD_TEMPLATES.json)** - Ready-to-use mod templates

### Technical Reference
- **[KERNEL_API.md](KERNEL_API.md)** - Complete kernel API reference
- **[XKERNEL_FORMAT.md](XKERNEL_FORMAT.md)** - Understanding the `.xkernel` format
- **[EXW3_FORMAT.md](EXW3_FORMAT.md)** - Legacy format documentation

## 🚀 Quick Start

### 1. Launch EXW3

**Windows:**
```bash
launch.bat
```

**Mac/Linux:**
```bash
./launch.sh
```

The browser opens automatically to your EXW3 site!

### 2. Create Your First Mod

Create a file `mods/hello.ex3`:

```
@name "hello"
@description "My first mod"
@type both

css {
  .hello {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 10px;
    margin: 20px;
  }
}

html {
  <div class="hello">
    <h2>👋 Hello from my first mod!</h2>
    <p>This was automatically discovered and loaded.</p>
  </div>
}

script {
  console.log('✅ Hello mod loaded!');
}
```

### 3. Reload the Page

Your mod loads automatically - no configuration needed!

## 📖 Core Concepts

### The Kernel

The **kernel** (`exw3.xkernel`) is the core of EXW3. It's a single protected file that contains:
- HTML structure
- CSS styling
- JavaScript framework
- All core functionality

**Important:** The kernel is protected by license. All customization must be done through mods.

### Mods

**Mods** are `.ex3` files that extend EXW3 functionality. They can be:

- **Layers** - Global styling and HTML injection
- **Sections** - UI components and pages
- **Both** - Combined functionality (recommended)

### Auto-Discovery

Drop `.ex3` files in the `mods/` folder and they load automatically. No configuration needed!

The system:
- Scans the `mods/` folder on startup
- Loads all `.ex3` files found
- Applies them in the order discovered

## 🎨 Creating Mods

### Basic Mod Structure

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

**Layer (`@type layer`):**
- Global CSS styling
- HTML injection into existing elements
- Site-wide modifications

**Section (`@type section`):**
- Self-contained UI components
- Pages and widgets
- Interactive features

**Both (`@type both`):**
- Combines layer and section capabilities
- Most flexible option
- Recommended for new mods

## 🔧 Configuration

Edit `mod-config.json` to customize:

```json
{
  "name": "My EXW3 Site",
  "version": "1.0.0",
  "structure": {
    "modsFolder": "mods",
    "adminFolder": "mods/admin"
  },
  "mods": ["*"]
}
```

**Auto-Discovery Mode:**
```json
"mods": ["*"]
```
Loads all mods automatically.

**Manual Mode:**
```json
"mods": ["dashboard", "about", "my-mod"]
```
Only loads specified mods.

## 🛠️ Common Tasks

### Add a New Feature

1. Create `mods/feature-name.ex3`
2. Add your HTML, CSS, and JavaScript
3. Reload the page

### Style the Site

Create a layer mod with CSS:

```
@name "my-theme"
@type layer

css {
  body {
    background: #f0f0f0;
    font-family: 'Arial', sans-serif;
  }
}
```

### Create a Page

Create a section mod with content:

```
@name "about-page"
@type section

html {
  <div class="page">
    <h1>About Us</h1>
    <p>Welcome to our site!</p>
  </div>
}

css {
  .page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
}
```

### Add Interactivity

Use the `script` block:

```
@name "counter"
@type both

html {
  <div id="counter">
    <button onclick="increment()">Count: <span id="count">0</span></button>
  </div>
}

script {
  let count = 0;
  window.increment = () => {
    count++;
    document.getElementById('count').textContent = count;
  };
}
```

## 🐛 Debugging

### Browser Console

Press `F12` to open developer tools.

**Check if mods loaded:**
```javascript
window.__exw3_modManager.listLoadedMods()
```

**Access the kernel:**
```javascript
window.__exw3_kernel.debug()
```

### Common Issues

**Mod not loading:**
- Check browser console for errors
- Verify `.ex3` file is in `mods/` folder
- Check file syntax (use a text editor with syntax highlighting)

**Styling not working:**
- Check CSS syntax
- Verify selectors match your HTML
- Use browser DevTools to inspect elements

**JavaScript errors:**
- Check console for error messages
- Verify variable names and function calls
- Make sure DOM elements exist before accessing them

## 📚 Learn More

- **[EX3_FORMAT.md](EX3_FORMAT.md)** - Complete mod format guide
- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - Middleware, plugins, animations
- **[KERNEL_API.md](KERNEL_API.md)** - Full API documentation
- **[AUTO_DISCOVERY.md](AUTO_DISCOVERY.md)** - How auto-discovery works

## 🎯 Best Practices

1. **Use descriptive names** - `user-dashboard` not `mod1`
2. **One feature per mod** - Keep mods focused and reusable
3. **Test in browser** - Always check console for errors
4. **Comment your code** - Help future you understand what you did
5. **Use `@type both`** - Most flexible for future changes

## 🆘 Need Help?

- Check the example mods in the `mods/` folder
- Read the documentation files listed above
- Open browser console (F12) to see error messages
- Review the [KERNEL_API.md](KERNEL_API.md) for available functions

## 📄 License

The EXW3 kernel is protected by license. See `KERNEL-LICENSE.txt` for terms.

You may:
- ✅ Use EXW3 in your projects
- ✅ Create unlimited mods
- ✅ Distribute applications built with EXW3

You may not:
- ❌ Edit or modify the kernel file
- ❌ Reverse engineer the kernel
- ❌ Remove copyright notices

All customization must be done through the mod system.

---

**Ready to build?** Start with [GETTING_STARTED.md](GETTING_STARTED.md)!
