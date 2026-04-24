# EXW3 Project Structure

## Overview

EXW3 now uses a unified folder structure where all mods are in `.ex3` format and organized by access level.

## Folder Structure

```
EXW3/
├── index.html                  # Main entry point
├── Config/
│   └── site-config.json       # Site configuration with mod list
├── Kernel/
│   ├── core.js                # Core kernel with advanced features
│   ├── modManager.js          # Unified mod loading system
│   ├── utils.js               # Parsing and utilities
│   ├── styles.css             # Base styles
│   └── Server/
│       ├── server.js          # Development server with auto-discovery
│       ├── start-server.js    # Server launcher
│       └── start-server.bat   # Windows batch file
├── Mods/
│   ├── *.ex3                  # Standard mods (all users)
│   ├── Admin/                 # Higher access mods
│   │   ├── admin-panel.ex3
│   │   └── login-settings.ex3
│   └── Examples/
│       └── demo-unified.ex3
└── Docs/
    ├── GETTING_STARTED.md
    ├── EX3_FORMAT.md          # Unified format documentation
    ├── EXW3_FORMAT.md         # Legacy formats (backward compatible)
    ├── ADVANCED_FEATURES.md
    ├── KERNEL_API.md
    └── SERVER_SETUP.md
```

## Mod Organization

### Standard Mods (`Mods/*.ex3`)
All regular mods accessible to standard users:
- `base-styling.ex3` - Base CSS styles
- `dark-mode.ex3` - Dark theme toggle
- `header-bar.ex3` - Site header
- `nav-router.ex3` - Navigation and routing
- `permissions.ex3` - Permission system
- `login.ex3` - Login functionality
- `dashboard.ex3` - Main dashboard section
- `about.ex3` - About page
- `calc.ex3` - Calculator app
- `clock.ex3` - Clock widget
- `links.ex3` - Links manager
- `notes.ex3` - Notes app
- `settings.ex3` - User settings

### Admin Mods (`Mods/Admin/*.ex3`)
Higher access mods for administrators:
- `admin-panel.ex3` - Admin control panel
- `login-settings.ex3` - Login configuration

## Configuration

The `Config/site-config.json` now supports custom folder structure:

```json
{
  "name": "EXW3 Local Site",
  "version": "Ex 3 Core | V.2",
  "structure": {
    "modsFolder": "Mods",
    "adminFolder": "Mods/Admin",
    "examplesFolder": "Mods/Examples",
    "configFolder": "Config",
    "kernelFolder": "Kernel"
  },
  "mods": [
    "permissions",
    "login",
    "base-styling",
    ...
  ]
}
```

### Structure Options

You can customize folder names and locations:

- **modsFolder** - Main mods directory (default: "Mods")
- **adminFolder** - Admin-only mods (default: "Mods/Admin")
- **examplesFolder** - Example mods (default: "Mods/Examples")
- **configFolder** - Configuration files (default: "Config")
- **kernelFolder** - Kernel files (default: "Kernel")

### Custom Structure Example

Want to rename folders? Just update the config:

```json
{
  "structure": {
    "modsFolder": "Extensions",
    "adminFolder": "Extensions/SuperUser",
    "examplesFolder": "Extensions/Demos"
  }
}
```

The kernel and server automatically use these paths!

## Mod Loading

The mod manager automatically searches for mods in this order:
1. `Mods/{modName}.ex3`
2. `Mods/Admin/{modName}.ex3`
3. Legacy: `Mods/Layers/{modName}.ex3` (if folder exists)
4. Legacy: `Mods/Sections/{modName}.ex3` (if folder exists)

## Benefits

- **Unified Structure**: No more separate Layers/Sections folders
- **Access Control**: Admin mods in separate folder
- **Simplified**: All mods use `.ex3` format
- **Flexible**: Mods can be layers, sections, or both
- **Backward Compatible**: Legacy formats still work
- **Configurable**: Customize folder names and structure
- **Production Ready**: Build script combines kernel into one file

## Adding New Mods

1. Create `Mods/my-mod.ex3` for standard mods
2. Create `Mods/Admin/my-mod.ex3` for admin mods
3. Add mod name to `Config/site-config.json` mods array
4. Refresh the site

## Development Server

The server auto-discovers all `.ex3` files in:
- `Mods/` directory
- `Mods/Admin/` directory

Run with: `node Kernel/Server/start-server.js`
