# EXW3 Format Specification

## Overview

EXW3 uses custom domain-specific languages for mod creation:

- **`.ex3`** - Unified format supporting both layers and sections (recommended)
- **`.exwl3`** - Legacy layer definition files (backward compatible)
- **`.exws3`** - Legacy section definition files (backward compatible)

All formats are custom text formats (not JSON) designed for easy authoring and readability.

**Note:** For new mods, use the `.ex3` format. See `EX3_FORMAT.md` for complete documentation.


## .exwl3 Format (Layers)

Layer files use the `.exwl3` extension and define CSS/HTML modifications and initialization code.

### Basic Structure

```
@name "layer-name"
@version "1.0.0"
@description "What this layer does"
@author "Your Name"
@priority 10
@modifies kernel
@dependencies []

css {
  /* CSS rules go here */
}

html prepend body {
  <!-- HTML injected at top of target -->
}

html append body {
  <!-- HTML injected at bottom of target -->
}

remove .some-selector;

init {
  // JavaScript code runs when layer is applied
}
```

### Metadata Fields

| Field | Required | Default | Description |
|---|---|---|---|
| `@name` | yes | — | Unique identifier |
| `@version` | no | `"1.0.0"` | Semantic version |
| `@description` | no | — | Human-readable description |
| `@author` | no | — | Author name |
| `@priority` | no | `10` | Load order — higher runs first |
| `@disabled` | no | — | Skip this layer without removing it from config |
| `@modifies` | no | — | What this layer targets (kernel, section names) |
| `@dependencies` | no | `[]` | Required layers that must load first |

### Blocks

#### CSS Block
Multiple allowed. Injects CSS into `<head>`.
```
css {
  body { color: red; }
  .my-class { font-size: 14px; }
}
```

#### HTML Block
Multiple allowed. Injects HTML into a target selector.
Syntax: `html [prepend|append] <selector> { ... }`
- `prepend` (default) — inserts at the **top** of the target
- `append` — inserts at the **bottom** of the target

```
html prepend body {
  <header>This appears at the top of body</header>
}

html append #app {
  <footer>This appears at the bottom of #app</footer>
}
```

#### Remove Block
Removes all elements matching a selector.
```
remove .unwanted-element;
remove #old-header;
```

#### Init Block
Multiple allowed, executed in order. JavaScript that runs when the layer is applied. Has access to `kernel`.

**Available Kernel APIs:**
- `kernel.setState(key, value)` - Set global state
- `kernel.getState(key, default)` - Get global state
- `kernel.watchState(key, callback)` - Watch state changes
- `kernel.eventBus.on(event, handler)` - Listen to events
- `kernel.eventBus.emit(event, data)` - Emit events
- `kernel.storage.local.get/set(key, value)` - LocalStorage with namespace
- `kernel.storage.session.get/set(key, value)` - SessionStorage with namespace
- `kernel.router.navigate(route)` - Navigate to route
- `kernel.router.getCurrentRoute()` - Get current route
- `kernel.theme.set(name)` - Set theme
- `kernel.theme.get()` - Get current theme
- `kernel.notify(message, type, duration)` - Show notification
- `kernel.$(selector)` - Query selector shorthand
- `kernel.$$(selector)` - Query all shorthand
- `kernel.createElement(tag, attrs, children)` - Create element helper
- `kernel.fetchJSON(url, options)` - Fetch JSON helper
- `kernel.postJSON(url, data)` - POST JSON helper
- `kernel.debounce(func, wait)` - Debounce function
- `kernel.throttle(func, limit)` - Throttle function
- `kernel.clone(obj)` - Deep clone object
- `kernel.merge(target, ...sources)` - Deep merge objects

```
init {
  console.log('Layer initialized');
  
  // Use kernel APIs
  kernel.setState('myLayerActive', true);
  kernel.notify('Layer loaded!', 'success');
  
  // Listen to events
  kernel.eventBus.on('custom-event', (data) => {
    console.log('Event received:', data);
  });
  
  // Store data
  kernel.storage.local.set('myData', { foo: 'bar' });
}

init {
  // Second init block, runs after the first
  document.body.classList.add('my-layer-active');
}
```

### Examples

**Simple CSS Layer:**
```
@name "custom-theme"
@version "1.0.0"
@description "Custom color theme"

css {
  .exw3-button {
    background: #ff6b6b;
    color: white;
  }
}
```

**Layer with CSS and Init:**
```
@name "analytics"
@version "1.0.0"
@description "Add analytics tracking"

init {
  window.trackEvent = function(eventName, data) {
    console.log('Event:', eventName, data);
  };
}
```

**Layer with HTML Injection:**
```
@name "navigation"
@version "1.0.0"

html prepend body {
  <nav style="background: #333; padding: 10px;">
    <a href="#" style="color: white; margin-right: 20px;">Home</a>
    <a href="#" style="color: white;">About</a>
  </nav>
}
```

**Layer with @disabled (skipped at runtime):**
```
@name "experimental-feature"
@version "1.0.0"
@disabled

css {
  /* This layer won't apply until @disabled is removed */
}
```

**Layer with remove and priority:**
```
@name "clean-ui"
@version "1.0.0"
@priority 20

remove #old-banner;
remove .deprecated-widget;
```

## .exws3 Format (Sections)

Section files use the `.exws3` extension and combine HTML, CSS, and JavaScript for complete self-contained modules.

### Basic Structure

```
@name "section-name"
@version "1.0.0"
@description "What this section does"
@dependencies []

html {
  <!-- HTML content -->
}

css {
  /* CSS styling specific to this section */
}

javascript {
  // JavaScript code that runs for this section
}

init {
  // Initialization code runs when section loads
}

render {
  // Render function (optional, receives container and kernel)
}
```

### Fields

**Metadata (all optional except @name):**
- `@name` - Unique identifier (required)
- `@version` - Semantic version (default: "1.0.0")
- `@description` - Human-readable description
- `@dependencies` - Array of required layers/sections

**Blocks (all optional, but html or render is usually needed):**

#### HTML Block
```
html {
  <div class="exw3-container">
    <h2>My Section</h2>
    <p>Content here</p>
  </div>
}
```
Static HTML to render in the section. Only one html block allowed.

#### CSS Block
```
css {
  .my-section-class {
    color: blue;
    padding: 10px;
  }
}
```
CSS rules specific to this section. Injected automatically. Only one css block allowed.

#### JavaScript Block
```
javascript {
  const myVar = 'value';
  window.mySectionHelper = function() {
    return myVar;
  };
}
```
Global JavaScript code that runs during initialization. Only one javascript block allowed.

#### Init Block
```
init {
  const input = document.getElementById('my-input');
  if (input) {
    input.addEventListener('change', (e) => {
      console.log('Changed:', e.target.value);
    });
  }
}
```
Initialization code that runs when the section loads. Can access DOM elements created by html block. Has access to `kernel` object. Only one init block allowed.

**Available Kernel APIs in Sections:**
- All kernel APIs available in layers (see layer documentation above)
- `kernel.registerSection(name, module)` - Register new sections dynamically
- `kernel.getSection(name)` - Get section instance
- `kernel.canViewSection(name)` - Check if user can view section
- Access to global event bus, state, storage, router, theme, notifications, etc.

#### Render Block
```
render {
  container.innerHTML = '<p>Dynamic content</p>';
  // or manipulate container as needed
}
```
Dynamic render function that generates HTML. Receives `container` and `kernel` parameters. Only one render block allowed.

### Examples

**Simple HTML Section:**
```
@name "about"
@version "1.0.0"
@description "About page"

html {
  <div class="exw3-container">
    <h2>About Us</h2>
    <p>This is the about page.</p>
  </div>
}
```

**Section with HTML and CSS:**
```
@name "hero"
@version "1.0.0"
@description "Hero banner section"

html {
  <div class="hero-banner">
    <h1>Welcome</h1>
    <p>This is a hero section</p>
  </div>
}

css {
  .hero-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 20px;
    text-align: center;
  }
}
```

**Section with Interactive Features:**
```
@name "counter"
@version "1.0.0"
@description "Interactive counter"

html {
  <div class="exw3-container">
    <h2>Counter</h2>
    <p>Count: <span id="count">0</span></p>
    <button class="exw3-button" id="increment-btn">+1</button>
    <button class="exw3-button secondary" id="reset-btn">Reset</button>
  </div>
}

css {
  #count {
    font-weight: bold;
    font-size: 24px;
    color: #667eea;
  }
}

javascript {
  let count = 0;
}

init {
  const incBtn = document.getElementById('increment-btn');
  const resetBtn = document.getElementById('reset-btn');
  const countSpan = document.getElementById('count');
  
  if (incBtn) {
    incBtn.addEventListener('click', () => {
      count++;
      countSpan.textContent = count;
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      count = 0;
      countSpan.textContent = count;
    });
  }
}
```

**Section with All Blocks:**
```
@name "weather-widget"
@version "1.0.0"
@description "Weather widget with all features"
@dependencies []

html {
  <div id="weather-section">
    <h2>Weather</h2>
    <div id="weather-data">Loading...</div>
    <button class="exw3-button" id="refresh-btn">Refresh</button>
  </div>
}

css {
  #weather-data {
    background: #f0f0f0;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
  }
}

javascript {
  async function fetchWeather() {
    return {
      temp: 72,
      condition: 'Sunny',
      humidity: 65
    };
  }
}

init {
  const refreshBtn = document.getElementById('refresh-btn');
  const weatherData = document.getElementById('weather-data');
  
  async function updateWeather() {
    const data = await fetchWeather();
    weatherData.innerHTML = `<p>Temperature: ${data.temp}°F</p><p>Condition: ${data.condition}</p><p>Humidity: ${data.humidity}%</p>`;
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', updateWeather);
  }
  
  updateWeather();
}

render {
  // Optional: if you want to dynamically render instead of using static html
  // container.innerHTML = '<p>Dynamically rendered content</p>';
}
```

## File Naming

- Use lowercase: `my-mod.ex3` (recommended), `my-section.exws3`, `my-layer.exwl3`
- Use hyphens for spaces: `my-custom-mod.ex3`
- Match the `@name` field: `@name "my-mod"` → `my-mod.ex3`

**Recommendation:** Use `.ex3` format for all new mods. Legacy `.exwl3` and `.exws3` formats are still supported for backward compatibility.

## Best Practices

1. **Use HTML for structure, CSS for styling:**
   - Keep HTML clean and semantic
   - Use CSS classes for styling
   - Use IDs for JavaScript selectors when needed

2. **JavaScript organization:**
   - Use meaningful variable names
   - Keep code readable and concise
   - Use arrow functions where appropriate
   - Always check if DOM elements exist before manipulating

3. **CSS namespacing:**
   - Consider prefixing classes with section name: `.weather-widget-temp`
   - Avoid generic class names that might conflict
   - Use specific selectors when possible

4. **Event handling:**
   - Attach listeners in the init block
   - Clean up listeners if section is destroyed
   - Use event delegation for dynamic elements

5. **Comments:**
   - Comment complex logic
   - Explain non-obvious design decisions
   - Keep comments up to date

## Combining Languages

The power of `.exws3` is combining multiple languages in one file:

```
@name "complete-app"

html {
  <div id="app">
    <input type="text" id="input" placeholder="Enter name">
    <button id="submit">Submit</button>
    <ul id="list"></ul>
  </div>
}

css {
  #app { padding: 20px; }
  #input { width: 200px; padding: 8px; }
  #list { list-style: none; padding: 0; }
  #list li { padding: 5px; background: #f0f0f0; margin: 5px 0; }
}

javascript {
  const items = [];
}

init {
  const input = document.getElementById('input');
  const submitBtn = document.getElementById('submit');
  const list = document.getElementById('list');
  
  submitBtn.addEventListener('click', () => {
    if (input.value) {
      items.push(input.value);
      const li = document.createElement('li');
      li.textContent = input.value;
      list.appendChild(li);
      input.value = '';
    }
  });
}
```

This single `.exws3` file contains everything needed: structure, styling, and behavior!


## Advanced Features

### Global State Management

Share data between sections and layers using the kernel state API:

**Layer setting state:**
```
@name "data-provider"

init {
  // Set global state
  kernel.setState('userData', { name: 'John', role: 'admin' });
  
  // Watch for changes
  kernel.watchState('theme', (data) => {
    console.log('Theme changed to:', data.value);
  });
}
```

**Section reading state:**
```
@name "user-profile"

init {
  // Get global state
  const userData = kernel.getState('userData', { name: 'Guest' });
  document.getElementById('username').textContent = userData.name;
  
  // Watch for updates
  kernel.watchState('userData', (data) => {
    document.getElementById('username').textContent = data.value.name;
  });
}
```

### Event Bus Communication

Communicate between mods using the global event bus:

**Emitting events:**
```
init {
  const btn = document.getElementById('save-btn');
  btn.addEventListener('click', () => {
    kernel.eventBus.emit('data-saved', { id: 123, timestamp: Date.now() });
    kernel.notify('Data saved!', 'success');
  });
}
```

**Listening to events:**
```
init {
  kernel.eventBus.on('data-saved', (data) => {
    console.log('Data was saved:', data);
    // Refresh UI or take action
  });
  
  // Listen once
  kernel.eventBus.once('first-load', () => {
    console.log('This runs only once');
  });
}
```

### Persistent Storage

Use namespaced storage APIs:

```
init {
  // Local storage (persists across sessions)
  kernel.storage.local.set('preferences', {
    theme: 'dark',
    fontSize: 14
  });
  
  const prefs = kernel.storage.local.get('preferences', {});
  
  // Session storage (cleared when tab closes)
  kernel.storage.session.set('tempData', { foo: 'bar' });
  
  // List all keys
  const allKeys = kernel.storage.local.keys();
  console.log('Stored keys:', allKeys);
}
```

### Router Integration

Navigate and respond to route changes:

```
init {
  // Navigate programmatically
  const btn = document.getElementById('go-settings');
  btn.addEventListener('click', () => {
    kernel.router.navigate('settings');
  });
  
  // Listen to route changes
  kernel.router.onRouteChange((data) => {
    console.log('Route changed from', data.oldRoute, 'to', data.route);
    // Update UI based on route
  });
  
  // Get current route
  const currentRoute = kernel.router.getCurrentRoute();
  
  // Get URL parameters
  const params = kernel.router.getParams();
  console.log('URL params:', params);
}
```

### Theme Management

Control themes dynamically:

```
init {
  // Set theme
  kernel.theme.set('dark');
  
  // Get current theme
  const current = kernel.theme.get();
  
  // Toggle between themes
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    kernel.theme.toggle('light', 'dark');
  });
  
  // Add custom theme CSS
  kernel.theme.addCustomCSS(`
    .exw3-theme-custom {
      --primary: #ff6b6b;
      --secondary: #4ecdc4;
    }
  `, 'custom-theme');
  
  // Listen to theme changes
  kernel.eventBus.on('theme-change', (data) => {
    console.log('Theme changed to:', data.theme);
  });
}
```

### Notifications

Show user notifications:

```
init {
  // Basic notification
  kernel.notify('Hello!', 'info');
  
  // Success notification
  kernel.notify('Saved successfully!', 'success', 3000);
  
  // Warning notification
  kernel.notify('Please check your input', 'warning', 5000);
  
  // Error notification
  kernel.notify('Something went wrong', 'error', 4000);
  
  // Persistent notification (duration = 0)
  const notifId = kernel.notify('Click to dismiss', 'info', 0);
}
```

### DOM Helpers

Use kernel DOM utilities:

```
init {
  // Query selector shortcuts
  const header = kernel.$('#header');
  const buttons = kernel.$$('.exw3-button');
  
  // Create elements programmatically
  const card = kernel.createElement('div', {
    class: 'exw3-card',
    style: { padding: '20px', margin: '10px' },
    onClick: () => console.log('Clicked!')
  }, [
    kernel.createElement('h3', {}, ['Card Title']),
    kernel.createElement('p', {}, ['Card content here'])
  ]);
  
  document.getElementById('container').appendChild(card);
}
```

### AJAX Helpers

Simplified HTTP requests:

```
init {
  // Fetch JSON
  const loadData = async () => {
    try {
      const data = await kernel.fetchJSON('/api/data');
      console.log('Data:', data);
    } catch (error) {
      kernel.notify('Failed to load data', 'error');
    }
  };
  
  // POST JSON
  const saveData = async () => {
    try {
      const result = await kernel.postJSON('/api/save', {
        name: 'John',
        email: 'john@example.com'
      });
      kernel.notify('Saved!', 'success');
    } catch (error) {
      kernel.notify('Save failed', 'error');
    }
  };
  
  document.getElementById('load-btn').addEventListener('click', loadData);
  document.getElementById('save-btn').addEventListener('click', saveData);
}
```

### Performance Utilities

Debounce and throttle functions:

```
init {
  const searchInput = document.getElementById('search');
  
  // Debounce - waits for user to stop typing
  const debouncedSearch = kernel.debounce((value) => {
    console.log('Searching for:', value);
    // Perform search
  }, 500);
  
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
  
  // Throttle - limits execution rate
  const throttledScroll = kernel.throttle(() => {
    console.log('Scroll position:', window.scrollY);
  }, 200);
  
  window.addEventListener('scroll', throttledScroll);
}
```

### Hooks System

React to kernel lifecycle events:

```
init {
  // Hook into kernel events
  kernel.onHook('before-render', async (data) => {
    console.log('About to render sections');
  });
  
  kernel.onHook('after-render', async (data) => {
    console.log('Sections rendered');
  });
  
  kernel.onHook('route-change', async (data) => {
    console.log('Route changed:', data);
  });
  
  kernel.onHook('state-change', async (data) => {
    console.log('State changed:', data.key, data.value);
  });
  
  kernel.onHook('theme-change', async (data) => {
    console.log('Theme changed:', data.theme);
  });
}
```

### Data Utilities

Clone and merge objects:

```
init {
  const original = { a: 1, b: { c: 2 } };
  
  // Deep clone
  const copy = kernel.clone(original);
  copy.b.c = 3; // Doesn't affect original
  
  // Deep merge
  const defaults = { theme: 'light', fontSize: 14, colors: { primary: 'blue' } };
  const userPrefs = { fontSize: 16, colors: { secondary: 'red' } };
  const merged = kernel.merge({}, defaults, userPrefs);
  // Result: { theme: 'light', fontSize: 16, colors: { primary: 'blue', secondary: 'red' } }
}
```

### Complete Advanced Example

Here's a section using multiple advanced features:

```
@name "advanced-dashboard"
@version "2.0.0"
@description "Dashboard with all advanced features"

html {
  <div class="exw3-container">
    <h2>Advanced Dashboard</h2>
    <div id="user-info"></div>
    <input type="text" id="search" placeholder="Search...">
    <div id="results"></div>
    <button class="exw3-button" id="save-btn">Save</button>
    <button class="exw3-button secondary" id="theme-btn">Toggle Theme</button>
  </div>
}

css {
  #user-info {
    background: var(--card-bg, #f5f5f5);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  #search {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}

init {
  // Get user data from global state
  const userData = kernel.getState('userData', { name: 'Guest', role: 'user' });
  kernel.$('#user-info').innerHTML = `
    <strong>${userData.name}</strong> (${userData.role})
  `;
  
  // Watch for user data changes
  kernel.watchState('userData', (data) => {
    kernel.$('#user-info').innerHTML = `
      <strong>${data.value.name}</strong> (${data.value.role})
    `;
  });
  
  // Debounced search
  const searchInput = kernel.$('#search');
  const debouncedSearch = kernel.debounce(async (query) => {
    if (!query) return;
    
    try {
      const results = await kernel.fetchJSON(`/api/search?q=${query}`);
      kernel.$('#results').innerHTML = results.map(r => 
        `<div class="result-item">${r.title}</div>`
      ).join('');
    } catch (error) {
      kernel.notify('Search failed', 'error');
    }
  }, 300);
  
  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });
  
  // Save button with event emission
  kernel.$('#save-btn').addEventListener('click', async () => {
    try {
      await kernel.postJSON('/api/save', {
        search: searchInput.value,
        timestamp: Date.now()
      });
      
      kernel.notify('Saved successfully!', 'success');
      kernel.eventBus.emit('dashboard-saved', { query: searchInput.value });
    } catch (error) {
      kernel.notify('Save failed', 'error');
    }
  });
  
  // Theme toggle
  kernel.$('#theme-btn').addEventListener('click', () => {
    kernel.theme.toggle('light', 'dark');
  });
  
  // Listen to global events
  kernel.eventBus.on('data-updated', (data) => {
    kernel.notify('Data was updated elsewhere', 'info');
    // Refresh dashboard
  });
  
  // Store preferences
  kernel.storage.local.set('lastVisit', Date.now());
}
```

This example demonstrates:
- Global state management
- Event bus communication
- Persistent storage
- Theme management
- Notifications
- DOM helpers
- AJAX requests
- Debouncing
- Event handling
