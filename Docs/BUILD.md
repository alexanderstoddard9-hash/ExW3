# EXW3 Build Guide

## Building the Combined Kernel (Development)

The EXW3 kernel can be combined into a single file for easier deployment and faster loading.

### Build Steps

**Windows:**
```bash
build-kernel.bat
```

**Mac/Linux:**
```bash
node build-kernel.js
```

**Output:** `Kernel/exw3-kernel.js`

---

## Building Distribution Package (Production)

Create a clean distribution package that users can deploy without seeing source code.

### Build Steps

**Windows:**
```bash
build-distribution.bat
```

**Mac/Linux:**
```bash
node build-distribution.js
```

### What Gets Built

The distribution includes only what users need:

```
dist/
├── index.html           # Main HTML file
├── exw3-kernel.js       # Pre-built kernel (single file, ~72 KB)
├── exw3-styles.css      # Base styles
├── mod-config.json      # Configuration file
├── README.md            # User documentation
├── LICENSE              # License file
└── mods/
    ├── example.ex3      # Example mod
    └── admin/           # Admin mods folder
```

### Distribution Features

✓ **Single Kernel File** - Users can't see/edit source code
✓ **Simple Config** - Just `mod-config.json`
✓ **Clean Structure** - Only essential files
✓ **Ready to Deploy** - Upload and run
✓ **Mod System** - Users extend via mods only

### User Experience

Users get:
1. `exw3-kernel.js` - Pre-built kernel (they can't edit)
2. `mod-config.json` - Configuration
3. `mods/` folder - Where they create their mods
4. `index.html` - Ready to use

They **don't** get:
- Source code (utils.js, core.js, modManager.js)
- Build scripts
- Development tools
- Documentation source

---

## Development vs Distribution

### Development Build (`build-kernel.js`)

**Purpose:** Combine kernel for faster loading during development

**Output:** `Kernel/exw3-kernel.js`

**Use when:**
- You're developing the kernel
- You want faster page loads
- You still have access to source files

**Command:**
```bash
node build-kernel.js
```

### Distribution Build (`build-distribution.js`)

**Purpose:** Create a clean package for end users

**Output:** `dist/` folder with everything users need

**Use when:**
- Releasing to users
- Deploying to production
- Distributing on GitHub releases
- Selling/licensing the framework

**Command:**
```bash
node build-distribution.js
```

---

## Using the Distribution

### For Developers (You)

1. Build distribution:
   ```bash
   node build-distribution.js
   ```

2. Distribute the `dist/` folder to users

3. Users can't see your source code

### For Users (Them)

1. Receive the `dist/` folder

2. Open `index.html` in browser

3. Edit `mod-config.json` to configure

4. Create mods in `mods/` folder

5. Add mod names to config

---

## Configuration Structure

The distribution uses `mod-config.json`:

```json
{
  "name": "My EXW3 Site",
  "version": "1.0.0",
  "description": "A modular site powered by EXW3",
  "structure": {
    "modsFolder": "mods",
    "adminFolder": "mods/admin"
  },
  "mods": [
    "example",
    "my-custom-mod"
  ]
}
```

### Structure Options

- `modsFolder` - Main mods directory (default: "mods")
- `adminFolder` - Admin-only mods (default: "mods/admin")

Users can customize folder names!

---

## Creating Mods for Distribution

Users create `.ex3` files in the `mods/` folder:

```
@name "my-mod"
@description "My custom mod"
@type both

css {
  .my-class { color: blue; }
}

html {
  <div class="my-class">Hello World</div>
}

init {
  console.log('Mod loaded!');
}
```

Then add to `mod-config.json`:

```json
{
  "mods": [
    "example",
    "my-mod"
  ]
}
```

---

## Benefits

### Development Build
- Faster loading (1 HTTP request vs 3)
- Easier debugging (still have source)
- Quick iteration

### Distribution Build
- **Protected Source** - Users can't see/edit kernel code
- **Simple for Users** - Just kernel + config + mods
- **Professional** - Clean, production-ready package
- **Extensible** - Users extend via mod system only
- **Licensable** - Can sell/distribute without exposing source

---

## Rebuilding

### Rebuild Kernel (Development)
```bash
node build-kernel.js
```

Rebuild when you modify kernel source files.

### Rebuild Distribution (Production)
```bash
node build-distribution.js
```

Rebuild when you want to create a new release for users.

---

## Distribution Checklist

Before distributing:

- [ ] Build distribution: `node build-distribution.js`
- [ ] Test `dist/index.html` in browser
- [ ] Verify mods load correctly
- [ ] Check `mod-config.json` has correct defaults
- [ ] Update `dist/README.md` with your info
- [ ] Add your LICENSE
- [ ] Zip the `dist/` folder
- [ ] Upload to GitHub releases or your platform

---

## File Sizes

- **exw3-kernel.js**: ~72 KB (unminified)
- **exw3-styles.css**: ~2 KB
- **Total distribution**: ~75 KB + your mods

---

## Advanced: Minification

For even smaller file sizes, you can minify the kernel:

```bash
npm install -g terser
terser dist/exw3-kernel.js -o dist/exw3-kernel.min.js -c -m
```

This can reduce the kernel to ~30-40 KB!

---

## Summary

- **`build-kernel.js`** - Combine kernel for development
- **`build-distribution.js`** - Create user-ready package
- **Distribution** - Users get kernel + config + mods folder
- **Source Protected** - Users can't see/edit kernel code
- **Mod System** - Users extend functionality via mods only
