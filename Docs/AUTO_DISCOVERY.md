# Auto-Discovery Feature

## Overview

EXW3 supports automatic mod discovery, eliminating the need to manually list mods in the configuration file. When enabled, the system automatically scans the mods folders and loads all `.ex3` files.

## Enabling Auto-Discovery

### Method 1: Use "*" in Config

Set the `mods` array to `["*"]` in your `mod-config.json`:

```json
{
  "name": "My EXW3 Site",
  "version": "1.0.0",
  "mods": ["*"]
}
```

### Method 2: Empty Mods Array

Leave the `mods` array empty:

```json
{
  "name": "My EXW3 Site",
  "version": "1.0.0",
  "mods": []
}
```

### Method 3: Omit Mods Array

Don't include a `mods` array at all:

```json
{
  "name": "My EXW3 Site",
  "version": "1.0.0"
}
```

## How It Works

### 1. Server Endpoint

The Python launcher provides a `/__mods_list__` endpoint that:
- Reads the `mod-config.json` to get folder structure
- Scans the `modsFolder` (default: `mods/`)
- Scans the `adminFolder` (default: `mods/admin/`)
- Returns a JSON array of all `.ex3` files found

**Example Response:**
```json
[
  {"name": "dashboard", "path": "mods/dashboard.ex3"},
  {"name": "about", "path": "mods/about.ex3"},
  {"name": "admin-panel", "path": "mods/admin/admin-panel.ex3"}
]
```

### 2. Client-Side Discovery

The `EXW3ModManager` class:
1. Detects auto-discovery mode (mods = "*" or empty)
2. Fetches the `/__mods_list__` endpoint
3. Loads each discovered mod automatically
4. Falls back to common mod names if endpoint unavailable

### 3. Folder Structure

Auto-discovery respects the folder structure defined in config:

```json
{
  "structure": {
    "modsFolder": "mods",
    "adminFolder": "mods/admin"
  }
}
```

## Benefits

### For Users
- **Zero Configuration**: Just drop `.ex3` files in the mods folder
- **No Manual Updates**: Add/remove mods without editing config
- **Automatic Loading**: New mods are discovered on page reload

### For Developers
- **Rapid Development**: Test mods immediately without config changes
- **Easy Distribution**: Users don't need to configure anything
- **Flexible Structure**: Customize folder names via config

## Usage Examples

### Adding a New Mod

1. Create your mod file: `my-feature.ex3`
2. Copy it to the `mods/` folder
3. Reload the page - it loads automatically!

**No configuration needed!**

### Organizing Mods

```
mods/
├── dashboard.ex3
├── about.ex3
├── calc.ex3
└── admin/
    ├── admin-panel.ex3
    └── user-management.ex3
```

All mods are discovered automatically, including those in subfolders defined in the config.

### Disabling Specific Mods

If you want to disable a mod without deleting it:

1. Rename it to something without `.ex3` extension (e.g., `dashboard.ex3.disabled`)
2. Or move it to a different folder outside the mods structure

### Manual Mode (Selective Loading)

If you want to manually control which mods load:

```json
{
  "mods": [
    "dashboard",
    "about",
    "admin-panel"
  ]
}
```

Only the listed mods will be loaded.

## Fallback Behavior

If the `/__mods_list__` endpoint is unavailable (e.g., using a custom launcher without this feature), the system falls back to trying common mod names:

- permissions
- login
- base-styling
- dark-mode
- header-bar
- nav-router
- dashboard
- about
- calc
- clock
- links
- notes
- settings
- admin-panel
- login-settings

## Custom Launchers

If you create a custom launcher, implement the `/__mods_list__` endpoint:

### Node.js Example

```javascript
app.get('/__mods_list__', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const config = JSON.parse(fs.readFileSync('mod-config.json', 'utf8'));
  const modsFolder = config.structure?.modsFolder || 'mods';
  const adminFolder = config.structure?.adminFolder || 'mods/admin';
  
  const mods = [];
  
  // Scan mods folder
  if (fs.existsSync(modsFolder)) {
    fs.readdirSync(modsFolder).forEach(file => {
      if (file.endsWith('.ex3')) {
        mods.push({
          name: file.replace('.ex3', ''),
          path: `${modsFolder}/${file}`
        });
      }
    });
  }
  
  // Scan admin folder
  if (fs.existsSync(adminFolder)) {
    fs.readdirSync(adminFolder).forEach(file => {
      if (file.endsWith('.ex3')) {
        mods.push({
          name: file.replace('.ex3', ''),
          path: `${adminFolder}/${file}`
        });
      }
    });
  }
  
  res.json(mods);
});
```

### PHP Example

```php
<?php
header('Content-Type: application/json');

$config = json_decode(file_get_contents('mod-config.json'), true);
$modsFolder = $config['structure']['modsFolder'] ?? 'mods';
$adminFolder = $config['structure']['adminFolder'] ?? 'mods/admin';

$mods = [];

// Scan mods folder
if (is_dir($modsFolder)) {
    foreach (scandir($modsFolder) as $file) {
        if (substr($file, -4) === '.ex3') {
            $mods[] = [
                'name' => substr($file, 0, -4),
                'path' => "$modsFolder/$file"
            ];
        }
    }
}

// Scan admin folder
if (is_dir($adminFolder)) {
    foreach (scandir($adminFolder) as $file) {
        if (substr($file, -4) === '.ex3') {
            $mods[] = [
                'name' => substr($file, 0, -4),
                'path' => "$adminFolder/$file"
            ];
        }
    }
}

echo json_encode($mods);
?>
```

## Performance

- **Fast**: Folder scanning is done once per page load
- **Cached**: Browser caches mod files (304 responses)
- **Efficient**: Only `.ex3` files are scanned
- **Scalable**: Works with hundreds of mods

## Troubleshooting

### Mods Not Loading

1. Check browser console for errors
2. Verify `.ex3` files are in the correct folder
3. Check `mod-config.json` has `"mods": ["*"]`
4. Verify Python launcher is running (not a static file server)

### Endpoint Not Found

If you see "Server does not support auto-discovery endpoint":
- You're using a custom launcher without the `/__mods_list__` endpoint
- System will fall back to trying common mod names
- Consider implementing the endpoint in your launcher

### Wrong Folder Scanned

Check your `mod-config.json` structure settings:

```json
{
  "structure": {
    "modsFolder": "mods",
    "adminFolder": "mods/admin"
  }
}
```

## Security Considerations

- Only `.ex3` files are discovered (other files ignored)
- Admin folder can be protected by server configuration
- Mods are validated before loading
- No arbitrary file execution

## Comparison: Manual vs Auto-Discovery

### Manual Configuration
```json
{
  "mods": ["dashboard", "about", "calc"]
}
```
**Pros:** Explicit control, specific load order
**Cons:** Must update config for every mod change

### Auto-Discovery
```json
{
  "mods": ["*"]
}
```
**Pros:** Zero maintenance, automatic updates
**Cons:** All mods load (can't selectively disable)

## Best Practices

1. **Development**: Use auto-discovery for rapid iteration
2. **Production**: Consider manual mode for explicit control
3. **Distribution**: Use auto-discovery for user-friendly packages
4. **Large Sites**: Use manual mode to control load order and dependencies

## Future Enhancements

Potential future features:
- Mod priority/load order in auto-discovery
- Exclude patterns (e.g., `*.disabled.ex3`)
- Recursive folder scanning
- Mod dependency resolution
- Hot-reload without page refresh
