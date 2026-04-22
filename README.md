# EXW3
# EXW3 Local Site - Documentation
Note, the mods included aren't neccecary for the site to work; that is all in the kernel. They are there to show what you can do with it.
## Overview

EXW3 is a modular local site framework with a powerful kernel system and extensible mods. It's designed for site owners to easily add and manage functionality without touching core code.

## Architecture

### Kernel
The **Kernel** is the core of the system. It provides:
- Module registration and management
- Hook system for extensibility
- Event handling
- Rendering pipeline

**Location:** `/Kernel/`

## Layers
**Layers** are mods stored in unique `.exwl3` files that can:
- Add/override CSS styling
- Inject HTML elements
- Execute custom initialization code

**Location:** `/Mods/Layers/`

### Sections
**Sections** are self-contained modules stored in `.exws3` files that:
- Render their own UI with HTML
- Have CSS styling
- Include JavaScript functionality
- Can be enabled/disabled via configuration

**Location:** `/Mods/Sections/`

## File Structure

```
EXW3/
├── Kernel/
│   ├── core.js              # Main kernel class
│   ├── utils.js             # Utility functions
│   ├── modManager.js        # Mod loading system
│   ├── styles.css           # Base styles
│   └── Server/
│       ├── server.js        # Development server
│       ├── start-server.js  # Cross-platform launcher
│       └── start-server.bat # Windows launcher
├── Mods/
│   ├── Layers/          # Layer mods (.exwl3 files)
│   │   ├── base-styling.exwl3
│   │   ├── dark-mode.exwl3
│   │   └── header-bar.exwl3
│   └── Sections/        # Section mods (.exws3 files)
│       ├── dashboard.exws3
│       ├── content.exws3
│       └── settings.exws3
├── Config/
│   └── site-config.json # Site configuration
├── Docs/
│   ├── README.md        # Full documentation
│   ├── GETTING_STARTED.md
│   ├── EXW3_FORMAT.md   # .exw3 file specification
│   └── SERVER_SETUP.md  # Server setup guide
└── index.html           # Main entry point
```

## Quick Start

### Start the Server

**Using Node.js:**
```bash
node Kernel/Server/server.js
```

**Using npm:**
```bash
npm start
```

**Using Python (if Node.js not installed):**
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

Then open your browser to: **http://localhost:3000**

### Using the Site

1. Open the site in your browser
2. View the console (Press F12) for debugging info
3. Access kernel: Type `window.__exw3_kernel` in console
4. Access mod manager: Type `window.__exw3_modManager` in console

## Configuration

Edit `Config/site-config.json` to enable/disable mods:

```json
{
  "name": "EXW3 Local Site",
  "version": "1.0.0",
  "layers": ["base-styling", "dark-mode"],
  "sections": ["dashboard", "content", "settings"]
}
```

- **layers:** Array of layer names to load and apply
- **sections:** Array of sections to render on the page

## Creating Mods

### .exwl3 Format (Layers)

Layer files define CSS styling and HTML modifications. Basic structure:

```
@name "my-layer"
@version "1.0.0"
@description "Layer description"
@modifies kernel
@dependencies []

css {
  /* Your CSS here */
}

html body {
  <!-- HTML to inject into body -->
}

init {
  // Optional: JavaScript initialization
}
```

### .exws3 Format (Sections)

Section files combine HTML, CSS, and JavaScript for complete self-contained modules:

```
@name "my-section"
@version "1.0.0"
@description "Section description"
@dependencies []

html {
  <!-- Your HTML here -->
}

css {
  /* Your CSS here */
}

javascript {
  // Global JavaScript for this section
}

init {
  // Initialization code (runs after HTML is added)
}

render {
  // Optional: Dynamic rendering function
}
```

## Adding a New Layer

1. Create a new file in `Mods/Layers/` with `.exwl3` extension
2. Add your layer definition
3. Add the layer name to `Config/site-config.json` in the `layers` array
4. Open `index.html` in browser to load it

**Example:**

Create `Mods/Layers/colorful.exwl3`:
```
@name "colorful"
@version "1.0.0"
@description "Colorful theme"

css {
  .exw3-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
}
```

Update `Config/site-config.json`:
```json
{
  "layers": ["base-styling", "colorful"]
}
```

## Adding a New Section

1. Create a new file in `Mods/Sections/` with `.exws3` extension
2. Add your section definition
3. Add the section name to `Config/site-config.json` in the `sections` array
4. Open `index.html` in browser to load it

**Example:**

Create `Mods/Sections/about.exws3`:
```
@name "about"
@version "1.0.0"
@description "About page"

html {
  <div class="exw3-container">
    <h2>About</h2>
    <p>This is the about page.</p>
  </div>
}
```

Update `Config/site-config.json`:
```json
{
  "sections": ["dashboard", "about"]
}
```

## Kernel API

### Core Methods

```javascript
// Access kernel from console
const kernel = window.__exw3_kernel;

// Register a section
kernel.registerSection(name, module);

// Register a layer
kernel.registerLayer(name, module);

// Apply a layer
kernel.applyLayer(name);

// Initialize kernel
await kernel.init(config);

// Render the site
await kernel.render('app');

// List all sections
kernel.listSections();

// List all layers
kernel.listLayers();

// Debug info
kernel.debug();
```

### Hook System

Hooks are extension points that mods can attach to:

- `before-init` - Before kernel initialization
- `after-init` - After kernel initialization
- `before-render` - Before rendering sections
- `after-render` - After rendering sections
- `section-register` - When a section is registered
- `layer-apply` - When a layer is applied

**Example:**
```javascript
kernel.onHook('before-render', (data) => {
  console.log('About to render!');
}, 10); // priority (higher = runs first)
```

## Mod Best Practices

1. **Unique Names:** Use descriptive, unique names for mods
2. **Dependencies:** List dependencies clearly
3. **Validation:** Check for required elements before modifying DOM
4. **Error Handling:** Wrap code in try-catch blocks
5. **Documentation:** Add clear descriptions
6. **Version:** Use semantic versioning (major.minor.patch)

## Debugging

**Console Commands:**
```javascript
// Access kernel and manager
window.__exw3_kernel
window.__exw3_modManager

// Get kernel state
kernel.debug()

// List loaded mods
modManager.listLoadedMods()

// Get mod info
modManager.getModInfo('layer:my-layer')

// Reload a mod
await modManager.reloadMod('section:my-section')
```

## Common Tasks

### Add CSS to Entire Site
Create a layer in `Mods/Layers/custom-styles.exw3` with CSS in modifications.

### Add a New App/Page
Create a section in `Mods/Sections/my-app.exw3` with HTML and logic.

### Modify Existing Section
Attach hooks to `section-register` event to intercept and modify sections.

### Add Interactivity
Use the `init` field in sections to add event listeners and dynamic behavior.

## Performance Tips

1. Load only needed layers and sections
2. Keep .exw3 files small and focused
3. Use CSS for styling instead of DOM manipulation
4. Cache DOM queries in variables
5. Avoid heavy computations in render phase

## Troubleshooting

**Mods not loading:**
- Check browser console (F12) for errors
- Verify file paths match configuration
- Ensure files are in correct directories
- Check that server is running (not opening from file://)

**Styling not applying:**
- Check CSS syntax in modifications
- Verify selectors are correct
- Check CSS specificity conflicts
- Look at browser DevTools Elements tab

**Scripts not running:**
- Check for JavaScript errors in console
- Verify init/render functions are valid
- Check for scope issues (use arrow functions)
- Ensure DOM elements exist before manipulating

**Server setup issues:**
- See [SERVER_SETUP.md](SERVER_SETUP.md) for detailed setup guide

- Make sure Node.js or Python is installed
- Check that port 3000 is not in use

## License

EXW3 is open-source and free to use and modify for your local site.

---

**Need help?** Check the example mods in `Mods/Layers/` and `Mods/Sections/` for patterns and best practices.
