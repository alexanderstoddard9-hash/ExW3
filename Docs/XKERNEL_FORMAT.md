# .xkernel Format Specification

## Overview

The `.xkernel` format is a unified file format that packages the entire EXW3 kernel (HTML, CSS, and JavaScript) into a single protected file. This format ensures the kernel cannot be easily modified while remaining human-readable.

## Format Structure

```
@xkernel "EXW3"
@version "2.0"
@built "2026-04-23T00:44:57.969Z"
@license "See KERNEL-LICENSE.txt"

@notice {
  IMPORTANT: This file is protected by copyright and license agreement.
  You may NOT edit, modify, reverse engineer, or attempt to modify this file.
  All customization must be done through the mod system (.ex3 files).
  Violation of these terms will result in immediate license termination.
}

@metadata {
  "name": "EXW3 Kernel",
  "description": "Modular web framework with unified mod system",
  "author": "EXW3 Project",
  "website": "https://github.com/yourusername/exw3"
}

html {
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EXW3</title>
    <style>
        /* CSS content here */
    </style>
</head>
<body>
    <div id="app"></div>
    <script>
        // JavaScript content here
    </script>
</body>
</html>
}
```

## Metadata Fields

### Required Fields

- `@xkernel`: Format identifier (always "EXW3")
- `@version`: Kernel version number
- `@license`: License reference
- `html { ... }`: HTML content block

### Optional Fields

- `@built`: Build timestamp (ISO 8601 format)
- `@notice { ... }`: Legal notice and usage restrictions
- `@metadata { ... }`: JSON metadata about the kernel

## HTML Block

The `html { ... }` block contains the complete HTML document, including:

- Embedded CSS in `<style>` tags
- Embedded JavaScript in `<script>` tags
- All kernel code (utils, core, modManager)
- HTML structure

## Launching .xkernel Files

### Default Python Launcher

The distribution includes a Python launcher (`launch.py`) that:

1. Parses the `.xkernel` file
2. Extracts the `html { ... }` block
3. Serves it via HTTP server
4. Opens the browser automatically

**Usage:**
```bash
# Windows
launch.bat

# Mac/Linux
./launch.sh
# or
python3 launch.py
```

### Custom Launchers

Users can create custom launchers in any language. The launcher must:

1. Read the `.xkernel` file
2. Extract content between `html {` and the final `}`
3. Serve the extracted HTML via HTTP server
4. Handle CORS headers for local development

**Example (Node.js):**
```javascript
const fs = require('fs');
const http = require('http');

const content = fs.readFileSync('exw3.xkernel', 'utf8');
const htmlMatch = content.match(/html\s*\{([\s\S]*)\}\s*$/);
const html = htmlMatch[1].trim();

http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(html);
    } else {
        // Serve other files (mods, config)
    }
}).listen(3000);
```

## Protection Features

1. **Single File**: All kernel code in one file makes it harder to modify
2. **License Notice**: Clear legal terms embedded in the file
3. **Format Validation**: Launchers can validate the format before serving
4. **No Direct Editing**: Users must use the mod system for customization

## Advantages

- **Portability**: Single file contains everything
- **Protection**: Harder to accidentally or intentionally modify
- **Clarity**: Clear separation between kernel (protected) and mods (customizable)
- **Flexibility**: Users can create custom launchers in any language
- **Simplicity**: No build tools required for end users

## File Size

Typical `.xkernel` file size: ~75-80 KB (uncompressed)

## Compatibility

- Works with any HTTP server
- No special server-side processing required
- Can be served as static HTML after extraction
- Compatible with all modern browsers
