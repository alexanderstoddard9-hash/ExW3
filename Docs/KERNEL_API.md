# EXW3 Kernel API Reference

Complete reference for all kernel APIs available to mods (layers and sections).

## Table of Contents

- [State Management](#state-management)
- [Event Bus](#event-bus)
- [Storage API](#storage-api)
- [Router API](#router-api)
- [Theme API](#theme-api)
- [Notifications](#notifications)
- [DOM Helpers](#dom-helpers)
- [AJAX Helpers](#ajax-helpers)
- [Utility Functions](#utility-functions)
- [Hooks System](#hooks-system)
- [Section Management](#section-management)
- [Layer Management](#layer-management)
- [Overlay System](#overlay-system)
- [Permissions](#permissions)

---

## State Management

Share data globally between all mods.

### `kernel.setState(key, value)`

Set a global state value.

**Parameters:**
- `key` (string) - State key
- `value` (any) - Value to store

**Example:**
```javascript
kernel.setState('userData', { name: 'John', role: 'admin' });
kernel.setState('counter', 42);
```

### `kernel.getState(key, defaultValue)`

Get a global state value.

**Parameters:**
- `key` (string) - State key
- `defaultValue` (any, optional) - Default if key doesn't exist

**Returns:** The stored value or defaultValue

**Example:**
```javascript
const userData = kernel.getState('userData', { name: 'Guest' });
const counter = kernel.getState('counter', 0);
```

### `kernel.watchState(key, callback)`

Watch for changes to a state value.

**Parameters:**
- `key` (string) - State key to watch
- `callback` (function) - Called when state changes, receives `{ value, oldValue }`

**Example:**
```javascript
kernel.watchState('theme', (data) => {
  console.log('Theme changed from', data.oldValue, 'to', data.value);
});
```

### `kernel.clearState()`

Remove all global state.

**Example:**
```javascript
kernel.clearState();
```

---

## Event Bus

Global event system for mod communication.

### `kernel.eventBus.on(event, handler)`

Listen to an event.

**Parameters:**
- `event` (string) - Event name
- `handler` (function) - Event handler, receives event data

**Example:**
```javascript
kernel.eventBus.on('data-saved', (data) => {
  console.log('Data saved:', data);
});
```

### `kernel.eventBus.once(event, handler)`

Listen to an event once (auto-removes after first trigger).

**Parameters:**
- `event` (string) - Event name
- `handler` (function) - Event handler

**Example:**
```javascript
kernel.eventBus.once('first-load', () => {
  console.log('This runs only once');
});
```

### `kernel.eventBus.off(event, handler)`

Remove an event listener.

**Parameters:**
- `event` (string) - Event name
- `handler` (function) - Handler to remove

**Example:**
```javascript
const handler = (data) => console.log(data);
kernel.eventBus.on('my-event', handler);
// Later...
kernel.eventBus.off('my-event', handler);
```

### `kernel.eventBus.emit(event, data)`

Emit an event.

**Parameters:**
- `event` (string) - Event name
- `data` (any) - Data to pass to handlers

**Example:**
```javascript
kernel.eventBus.emit('user-login', { username: 'john', timestamp: Date.now() });
```

### `kernel.eventBus.listEvents()`

Get all registered event names.

**Returns:** Array of event names

**Example:**
```javascript
const events = kernel.eventBus.listEvents();
console.log('Registered events:', events);
```

---

## Storage API

Namespaced localStorage and sessionStorage.

### Local Storage (Persistent)

#### `kernel.storage.local.get(key, defaultValue)`

Get value from localStorage.

**Parameters:**
- `key` (string) - Storage key
- `defaultValue` (any, optional) - Default if key doesn't exist

**Returns:** Stored value or defaultValue

**Example:**
```javascript
const prefs = kernel.storage.local.get('preferences', { theme: 'light' });
```

#### `kernel.storage.local.set(key, value)`

Set value in localStorage.

**Parameters:**
- `key` (string) - Storage key
- `value` (any) - Value to store (will be JSON serialized)

**Example:**
```javascript
kernel.storage.local.set('preferences', { theme: 'dark', fontSize: 14 });
```

#### `kernel.storage.local.remove(key)`

Remove value from localStorage.

**Example:**
```javascript
kernel.storage.local.remove('preferences');
```

#### `kernel.storage.local.clear()`

Clear all EXW3 namespaced localStorage.

**Example:**
```javascript
kernel.storage.local.clear();
```

#### `kernel.storage.local.keys()`

Get all EXW3 storage keys.

**Returns:** Array of key names

**Example:**
```javascript
const keys = kernel.storage.local.keys();
console.log('Stored keys:', keys);
```

### Session Storage (Temporary)

Same API as local storage, but data is cleared when tab closes.

- `kernel.storage.session.get(key, defaultValue)`
- `kernel.storage.session.set(key, value)`
- `kernel.storage.session.remove(key)`
- `kernel.storage.session.clear()`
- `kernel.storage.session.keys()`

**Example:**
```javascript
kernel.storage.session.set('tempData', { foo: 'bar' });
const data = kernel.storage.session.get('tempData');
```

---

## Router API

Navigation and route management.

### `kernel.router.navigate(route)`

Navigate to a route (changes URL hash).

**Parameters:**
- `route` (string) - Route name (without #)

**Example:**
```javascript
kernel.router.navigate('settings');
kernel.router.navigate('dashboard');
```

### `kernel.router.getCurrentRoute()`

Get current route name.

**Returns:** Current route string

**Example:**
```javascript
const route = kernel.router.getCurrentRoute();
console.log('Current route:', route);
```

### `kernel.router.onRouteChange(callback)`

Listen to route changes.

**Parameters:**
- `callback` (function) - Called on route change, receives `{ route, oldRoute }`

**Example:**
```javascript
kernel.router.onRouteChange((data) => {
  console.log('Navigated from', data.oldRoute, 'to', data.route);
});
```

### `kernel.router.getParams()`

Get URL query parameters.

**Returns:** Object with parameter key-value pairs

**Example:**
```javascript
// URL: http://localhost:3000/?user=john&id=123
const params = kernel.router.getParams();
console.log(params); // { user: 'john', id: '123' }
```

---

## Theme API

Theme management system.

### `kernel.theme.set(themeName)`

Set the active theme.

**Parameters:**
- `themeName` (string) - Theme name

**Example:**
```javascript
kernel.theme.set('dark');
kernel.theme.set('light');
kernel.theme.set('custom');
```

### `kernel.theme.get()`

Get current theme name.

**Returns:** Current theme string

**Example:**
```javascript
const currentTheme = kernel.theme.get();
console.log('Current theme:', currentTheme);
```

### `kernel.theme.toggle(theme1, theme2)`

Toggle between two themes.

**Parameters:**
- `theme1` (string) - First theme
- `theme2` (string) - Second theme

**Example:**
```javascript
// Toggle between light and dark
kernel.theme.toggle('light', 'dark');
```

### `kernel.theme.addCustomCSS(css, id)`

Add custom theme CSS.

**Parameters:**
- `css` (string) - CSS content
- `id` (string, optional) - Style element ID

**Example:**
```javascript
kernel.theme.addCustomCSS(`
  .exw3-theme-custom {
    --primary: #ff6b6b;
    --secondary: #4ecdc4;
  }
`, 'custom-theme');
```

---

## Notifications

User notification system.

### `kernel.notify(message, type, duration)`

Show a notification.

**Parameters:**
- `message` (string) - Notification message
- `type` (string, optional) - Type: 'info', 'success', 'warning', 'error' (default: 'info')
- `duration` (number, optional) - Duration in ms, 0 for persistent (default: 3000)

**Returns:** Notification ID

**Example:**
```javascript
kernel.notify('Hello!', 'info');
kernel.notify('Saved successfully!', 'success', 3000);
kernel.notify('Warning message', 'warning', 5000);
kernel.notify('Error occurred', 'error', 4000);

// Persistent notification
const id = kernel.notify('Click to dismiss', 'info', 0);
```

---

## DOM Helpers

Simplified DOM manipulation.

### `kernel.$(selector)`

Query selector shorthand (returns first match).

**Parameters:**
- `selector` (string) - CSS selector

**Returns:** DOM element or null

**Example:**
```javascript
const header = kernel.$('#header');
const button = kernel.$('.exw3-button');
```

### `kernel.$$(selector)`

Query selector all shorthand (returns array).

**Parameters:**
- `selector` (string) - CSS selector

**Returns:** Array of DOM elements

**Example:**
```javascript
const buttons = kernel.$$('.exw3-button');
buttons.forEach(btn => btn.classList.add('active'));
```

### `kernel.createElement(tag, attrs, children)`

Create DOM element with attributes and children.

**Parameters:**
- `tag` (string) - HTML tag name
- `attrs` (object, optional) - Attributes object
- `children` (array, optional) - Array of child elements or strings

**Attributes:**
- `class` - CSS class name
- `style` - Style object or string
- `onClick`, `onChange`, etc. - Event handlers
- Any other HTML attribute

**Returns:** DOM element

**Example:**
```javascript
const card = kernel.createElement('div', {
  class: 'exw3-card',
  style: { padding: '20px', background: '#f5f5f5' },
  onClick: () => console.log('Clicked!')
}, [
  kernel.createElement('h3', {}, ['Card Title']),
  kernel.createElement('p', {}, ['Card content here']),
  kernel.createElement('button', { class: 'exw3-button' }, ['Click Me'])
]);

document.body.appendChild(card);
```

---

## AJAX Helpers

Simplified HTTP requests.

### `kernel.fetchJSON(url, options)`

Fetch JSON from URL.

**Parameters:**
- `url` (string) - Request URL
- `options` (object, optional) - Fetch options

**Returns:** Promise resolving to JSON data

**Example:**
```javascript
try {
  const data = await kernel.fetchJSON('/api/users');
  console.log('Users:', data);
} catch (error) {
  console.error('Failed to fetch:', error);
}
```

### `kernel.postJSON(url, data, options)`

POST JSON to URL.

**Parameters:**
- `url` (string) - Request URL
- `data` (object) - Data to send
- `options` (object, optional) - Fetch options

**Returns:** Promise resolving to response JSON

**Example:**
```javascript
try {
  const result = await kernel.postJSON('/api/save', {
    name: 'John',
    email: 'john@example.com'
  });
  console.log('Saved:', result);
} catch (error) {
  console.error('Save failed:', error);
}
```

---

## Utility Functions

Helper functions for common tasks.

### `kernel.debounce(func, wait)`

Create debounced function (waits for inactivity).

**Parameters:**
- `func` (function) - Function to debounce
- `wait` (number) - Wait time in ms

**Returns:** Debounced function

**Example:**
```javascript
const searchInput = document.getElementById('search');
const debouncedSearch = kernel.debounce((value) => {
  console.log('Searching for:', value);
  // Perform search
}, 500);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### `kernel.throttle(func, limit)`

Create throttled function (limits execution rate).

**Parameters:**
- `func` (function) - Function to throttle
- `limit` (number) - Minimum time between calls in ms

**Returns:** Throttled function

**Example:**
```javascript
const throttledScroll = kernel.throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', throttledScroll);
```

### `kernel.clone(obj)`

Deep clone an object.

**Parameters:**
- `obj` (object) - Object to clone

**Returns:** Cloned object

**Example:**
```javascript
const original = { a: 1, b: { c: 2 } };
const copy = kernel.clone(original);
copy.b.c = 3; // Doesn't affect original
```

### `kernel.merge(target, ...sources)`

Deep merge objects.

**Parameters:**
- `target` (object) - Target object
- `sources` (objects) - Source objects to merge

**Returns:** Merged object

**Example:**
```javascript
const defaults = { theme: 'light', fontSize: 14, colors: { primary: 'blue' } };
const userPrefs = { fontSize: 16, colors: { secondary: 'red' } };
const merged = kernel.merge({}, defaults, userPrefs);
// Result: { theme: 'light', fontSize: 16, colors: { primary: 'blue', secondary: 'red' } }
```

---

## Hooks System

React to kernel lifecycle events.

### `kernel.onHook(hookName, callback, priority)`

Attach callback to a hook.

**Parameters:**
- `hookName` (string) - Hook name
- `callback` (function) - Async function to call
- `priority` (number, optional) - Priority (higher runs first, default: 10)

**Available Hooks:**
- `before-init` - Before kernel initialization
- `after-init` - After kernel initialization
- `before-render` - Before sections render
- `after-render` - After sections render
- `section-register` - When section is registered
- `layer-apply` - When layer is applied
- `route-change` - When route changes
- `state-change` - When global state changes
- `theme-change` - When theme changes

**Example:**
```javascript
kernel.onHook('before-render', async (data) => {
  console.log('About to render sections');
});

kernel.onHook('route-change', async (data) => {
  console.log('Route changed:', data.route);
});

kernel.onHook('state-change', async (data) => {
  console.log('State changed:', data.key, '=', data.value);
});
```

---

## Section Management

Manage sections dynamically.

### `kernel.registerSection(name, sectionModule)`

Register a new section.

**Parameters:**
- `name` (string) - Section name
- `sectionModule` (object) - Section module with init/render methods

**Example:**
```javascript
kernel.registerSection('my-section', {
  name: 'my-section',
  async init(kernel) {
    console.log('Section initialized');
  },
  async render(container, kernel) {
    container.innerHTML = '<h2>My Section</h2>';
  }
});
```

### `kernel.getSection(name)`

Get a registered section.

**Parameters:**
- `name` (string) - Section name

**Returns:** Section module or undefined

**Example:**
```javascript
const section = kernel.getSection('dashboard');
console.log('Section:', section);
```

### `kernel.listSections()`

Get all registered section names.

**Returns:** Array of section names

**Example:**
```javascript
const sections = kernel.listSections();
console.log('Sections:', sections);
```

---

## Layer Management

Manage layers dynamically.

### `kernel.registerLayer(name, layerModule)`

Register a new layer.

**Parameters:**
- `name` (string) - Layer name
- `layerModule` (object) - Layer module with onApply method

**Example:**
```javascript
kernel.registerLayer('my-layer', {
  name: 'my-layer',
  onApply(kernel) {
    console.log('Layer applied');
  }
});
```

### `kernel.applyLayer(layerName)`

Apply a registered layer.

**Parameters:**
- `layerName` (string) - Layer name

**Returns:** Boolean (success)

**Example:**
```javascript
kernel.applyLayer('my-layer');
```

### `kernel.getLayer(name)`

Get a registered layer.

**Parameters:**
- `name` (string) - Layer name

**Returns:** Layer module or undefined

**Example:**
```javascript
const layer = kernel.getLayer('dark-mode');
```

### `kernel.listLayers()`

Get all registered layer names.

**Returns:** Array of layer names

**Example:**
```javascript
const layers = kernel.listLayers();
console.log('Layers:', layers);
```

---

## Overlay System

Full-screen overlay management.

### `kernel.showOverlay(html, css)`

Show a full-screen overlay.

**Parameters:**
- `html` (string) - HTML content
- `css` (string, optional) - CSS styles

**Returns:** Overlay DOM element

**Example:**
```javascript
const overlay = kernel.showOverlay(`
  <div style="background: white; padding: 40px; border-radius: 12px;">
    <h2>Modal Title</h2>
    <p>Modal content here</p>
    <button id="close-btn">Close</button>
  </div>
`, `
  #close-btn {
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`);

overlay.querySelector('#close-btn').addEventListener('click', () => {
  kernel.hideOverlay();
});
```

### `kernel.hideOverlay()`

Hide the current overlay.

**Example:**
```javascript
kernel.hideOverlay();
```

---

## Permissions

Role-based section visibility.

### `kernel.registerSectionPermission(sectionName, roles)`

Set required roles for a section.

**Parameters:**
- `sectionName` (string) - Section name
- `roles` (array) - Array of allowed role names

**Example:**
```javascript
kernel.registerSectionPermission('admin-panel', ['admin']);
kernel.registerSectionPermission('settings', ['admin', 'user']);
```

### `kernel.canViewSection(sectionName)`

Check if current user can view a section.

**Parameters:**
- `sectionName` (string) - Section name

**Returns:** Boolean

**Example:**
```javascript
if (kernel.canViewSection('admin-panel')) {
  console.log('User can access admin panel');
}
```

---

## Debug

### `kernel.debug()`

Log current kernel state to console.

**Example:**
```javascript
kernel.debug();
```

---

## Complete Example

Here's a comprehensive example using multiple APIs:

```javascript
init {
  // State management
  kernel.setState('appReady', true);
  const userData = kernel.getState('userData', { name: 'Guest' });
  
  // Event bus
  kernel.eventBus.on('data-updated', (data) => {
    kernel.notify('Data updated!', 'success');
  });
  
  // Storage
  const prefs = kernel.storage.local.get('preferences', { theme: 'light' });
  kernel.theme.set(prefs.theme);
  
  // Router
  kernel.router.onRouteChange((data) => {
    console.log('Route:', data.route);
  });
  
  // DOM helpers
  const button = kernel.$('#my-button');
  button.addEventListener('click', async () => {
    try {
      const result = await kernel.postJSON('/api/save', { foo: 'bar' });
      kernel.notify('Saved!', 'success');
      kernel.eventBus.emit('data-saved', result);
    } catch (error) {
      kernel.notify('Save failed', 'error');
    }
  });
  
  // Debounced search
  const search = kernel.debounce((query) => {
    console.log('Searching:', query);
  }, 300);
  
  kernel.$('#search').addEventListener('input', (e) => {
    search(e.target.value);
  });
}
```
