# Getting Started Guide

## What is EXW3?

EXW3 is a modular local site platform where:
- **Kernel** = Core system (don't touch this!)
- **Layers** = Mods that add styling and functionality
- **Sections** = Apps/pages you can add to your site

## First Steps

### 1. Start the Local Server

**Option A: Using Node.js (Recommended)**

```powershell
node Kernel/Server/server.js
```

Or if you prefer npm:

```powershell
npm start
```

The server will start at: **http://localhost:3000**

**Option B: Using Python**

If you don't have Node.js installed, use Python 3:

```powershell
python -m http.server 3000
```

Or Python 2:

```powershell
python -m SimpleHTTPServer 3000
```

Then open your browser to: **http://localhost:3000**

### 2. Open in Browser

Once the server is running, open your web browser to:

```
http://localhost:3000
```

You should see:
- Dashboard section with welcome info
- Content section with features
- Nice styling applied

### 3. Check the Console
Press `F12` to open Developer Tools → Console tab.

You'll see messages like:
```
✓ Layer registered: base-styling
✓ Layer applied: base-styling
✓ EXW3 Site initialized successfully
```

### 4. Try the Debug Commands
In the console, type:
```javascript
window.__exw3_kernel.debug()
```

This shows:
- All registered sections
- All registered layers
- Current configuration

## Making Your First Change

### Change Which Sections Show

Edit `Config/site-config.json`:

**Before:**
```json
{
  "sections": ["dashboard", "content"]
}
```

**After (add settings):**
```json
{
  "sections": ["dashboard", "content", "settings"]
}
```

Refresh the page → Settings section appears!

## Making Your First Mod

### Add a Custom Styling Layer

1. Create `Mods/Layers/my-custom.exwl3`:

```
@name "my-custom"
@version "1.0.0"
@description "My custom styling"

css {
  .exw3-card {
    background: lightyellow;
    border: 2px solid gold;
  }
}
```

2. Add to `Config/site-config.json`:

```json
{
  "layers": ["base-styling", "my-custom"]
}
```

3. Refresh page → Cards are now yellow with gold borders!

## Making Your First Section

### Add a Simple Welcome Section

1. Create `Mods/Sections/welcome.exws3`:

```
@name "welcome"
@version "1.0.0"
@description "Welcome section"

html {
  <div class="exw3-container">
    <h2>Welcome!</h2>
    <p>This is my first custom section!</p>
  </div>
}
```

2. Add to `Config/site-config.json`:

```json
{
  "sections": ["welcome", "dashboard", "content"]
}
```

3. Refresh page → Welcome section appears at the top!

## Common Tasks

### Change Site Colors

Edit `Mods/Layers/base-styling.exwl3` or create a new layer:

```
@name "custom-colors"
@version "1.0.0"

css {
  .exw3-button {
    background: #ff6b6b;
  }
}
```

### Add Header/Navigation

Create `Mods/Layers/nav.exwl3`:

```
@name "nav"
@version "1.0.0"

html body {
  <nav style="background: #333; padding: 10px; color: white;">
    <a href="#" style="color: white; margin: 0 10px;">Home</a>
    <a href="#" style="color: white; margin: 0 10px;">About</a>
  </nav>
}
```

### Add Interactive Section

Create `Mods/Sections/counter.exws3`:

```
@name "counter"
@version "1.0.0"

html {
  <div class="exw3-container">
    <h2>Counter</h2>
    <p>Count: <span id="count">0</span></p>
    <button class="exw3-button" id="increment">+1</button>
  </div>
}

javascript {
  let count = 0;
}

init {
  const btn = document.getElementById('increment');
  const countSpan = document.getElementById('count');
  
  btn.addEventListener('click', () => {
    count++;
    countSpan.textContent = count;
  });
}
```

## File Organization

Keep it organized:

```
Mods/
├── Layers/
│   ├── base-styling.exwl3      ← Base styles
│   ├── dark-mode.exwl3         ← Theme variations
│   ├── custom-colors.exwl3     ← Your customizations
│   └── nav.exwl3               ← Navigation
├── Sections/
│   ├── dashboard.exws3         ← Main content
│   ├── my-app.exws3            ← Your apps
│   └── counter.exws3           ← Interactive features
```

## Tips for Success

1. **Validate your syntax:**
   - `.exwl3` and `.exws3` files should be readable text (not JSON)
   - Check that all blocks are properly closed with `}`
   - Watch for proper indentation

2. **Check the console:**
   - Press F12 anytime something doesn't work
   - Look for error messages
   - Use `window.__exw3_kernel.debug()` to see state

3. **Start simple:**
   - Begin with HTML-only sections
   - Add CSS next
   - Add interactivity last

4. **Keep names unique:**
   - No two sections/layers with same name
   - Use descriptive names: `dark-mode`, `weather-widget`, etc.

5. **Test one change at a time:**
   - Change one thing
   - Refresh page
   - Check result
   - Repeat

## Troubleshooting

**Nothing shows on page?**
- Check browser console (F12)
- Look for red errors
- Make sure `index.html` is in the root folder
- Make sure Mods folder has correct structure

**File not loading?**
- Check file path is correct
- Check filename matches `@name` field in file
- Verify `.exwl3` and `.exws3` files are valid (proper closing braces)
- Check Config/site-config.json lists the mod
- Check console for parsing errors

**Styles not applying?**
- Check CSS selectors are correct
- Check CSS is in a layer (not section)
- Verify layer is enabled in site-config.json
- Use browser DevTools (F12) to inspect elements
- Check for CSS specificity conflicts

**Script errors?**
- Check console for specific error message
- Look at line number in error
- Verify JavaScript syntax is correct
- Make sure DOM elements exist before accessing them
- Use browser DevTools debugger to step through code

## Next Steps

1. Read [README.md](README.md) for full API documentation
2. Check [EXW3_FORMAT.md](EXW3_FORMAT.md) for .exw3 file specification
3. Study the example mods in `Mods/Layers/` and `Mods/Sections/`
4. Start building your own mods!

---

**You're ready to build!** 🚀

Start by copying an example mod and modifying it. Have fun!
