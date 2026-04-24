# .ex3 Format - Unified Mod System

## What Changed?

EXW3 now has a **unified mod format** called `.ex3` that combines the power of both layers and sections!

### Before
- `.exwl3` - Layers only (global CSS, HTML injection, validators, etc.)
- `.exws3` - Sections only (UI components with HTML, state, methods)
- Two separate file formats with different capabilities

### After
- `.ex3` - **Unified format** that can do EVERYTHING!
- Use layer features, section features, or both in one file
- Backward compatible - `.exwl3` and `.exws3` still work

## Quick Comparison

| Feature | .exwl3 | .exws3 | .ex3 |
|---------|--------|--------|------|
| Global CSS | ✅ | ❌ | ✅ |
| HTML Injection | ✅ | ❌ | ✅ |
| Section HTML | ❌ | ✅ | ✅ |
| State Management | ❌ | ✅ | ✅ |
| Methods | ❌ | ✅ | ✅ |
| Validators | ✅ | ❌ | ✅ |
| Transformers | ✅ | ❌ | ✅ |
| Middleware | ✅ | ❌ | ✅ |
| i18n | ✅ | ❌ | ✅ |
| DOM Watchers | ✅ | ❌ | ✅ |
| Computed Props | ❌ | ✅ | ✅ |
| Lifecycle Hooks | ✅ | ✅ | ✅ |

## Simple Example

```
@name "my-mod"
@version "1.0.0"
@type both

// Layer feature: Global CSS
css {
  .highlight { background: yellow; }
}

// Section feature: UI Component
html {
  <div class="exw3-container">
    <h2 class="highlight">Hello World!</h2>
    <button id="btn">Click Me</button>
  </div>
}

// Section feature: State
state {
  "clicks": 0
}

// Section feature: Method
method "handleClick" {
  context.state.clicks++;
  kernel.notify('Clicked ' + context.state.clicks + ' times!', 'success');
}

// Initialization
init {
  kernel.$('#btn').addEventListener('click', context.handleClick);
}
```

## Type Modes

Control how your mod behaves with `@type`:

### `@type layer`
Acts as a layer only (global modifications)

```
@name "theme"
@type layer

css {
  body { background: #f5f5f5; }
}
```

### `@type section`
Acts as a section only (UI component)

```
@name "counter"
@type section

html {
  <div>Count: <span id="count">0</span></div>
}
```

### `@type both` (Default)
Can act as both layer and section

```
@name "hybrid"
@type both

css {
  .my-class { color: blue; }
}

html {
  <div class="my-class">Hello</div>
}
```

## All Available Features

### Layer Features (Global)
- ✅ CSS blocks (multiple)
- ✅ HTML injection (prepend/append)
- ✅ Remove elements
- ✅ Custom validators
- ✅ Custom transformers
- ✅ Middleware
- ✅ DOM watchers
- ✅ Internationalization (i18n)
- ✅ Lifecycle hooks (onLoad, onActivate, onDeactivate, onUnload)

### Section Features (Component)
- ✅ HTML content
- ✅ CSS styling
- ✅ JavaScript code
- ✅ State management
- ✅ Methods
- ✅ Computed properties
- ✅ State watchers
- ✅ Props (configuration)
- ✅ Lifecycle hooks (onMount, onUpdate, onUnmount, onDestroy)
- ✅ Render function

## Migration

### No Migration Needed!
- `.exwl3` and `.exws3` files still work
- System automatically detects file type
- Migrate when you're ready

### To Migrate
1. Rename `.exwl3` or `.exws3` to `.ex3`
2. Optionally add `@type layer` or `@type section`
3. That's it!

### To Combine
Merge a `.exwl3` and `.exws3` into one `.ex3`:

```
@name "combined-mod"
@type both

// Copy layer features from .exwl3
css {
  /* ... */
}

// Copy section features from .exws3
html {
  <!-- ... -->
}

state {
  /* ... */
}
```

## File Loading Priority

The system tries `.ex3` first, then falls back:

1. Try `Mods/Layers/my-mod.ex3`
2. If not found, try `Mods/Layers/my-mod.exwl3`
3. Same for sections

## Documentation

- **Full Specification**: `Docs/EX3_FORMAT.md`
- **Advanced Features**: `Docs/ADVANCED_FEATURES.md`
- **Kernel API**: `Docs/KERNEL_API.md`
- **Example**: `Mods/Examples/demo-unified.ex3`

## Benefits

### For Simple Mods
- One file instead of two
- Less boilerplate
- Easier to understand

### For Complex Mods
- Mix layer and section features
- Share code between global and component logic
- More powerful and flexible

### For Everyone
- Backward compatible
- No breaking changes
- Migrate at your own pace

## Example Use Cases

### Use Case 1: Theme with Settings
```
@type both

// Layer: Apply theme globally
css {
  body { background: var(--bg-color); }
}

// Section: Theme settings UI
html {
  <div>
    <h2>Theme Settings</h2>
    <button id="toggle">Toggle Theme</button>
  </div>
}

init {
  kernel.$('#toggle').addEventListener('click', () => {
    kernel.theme.toggle('light', 'dark');
  });
}
```

### Use Case 2: Validation Library with Form
```
@type both

// Layer: Add validators
validator "email" {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email';
}

validator "phone" {
  return /^\d{3}-\d{3}-\d{4}$/.test(value) || 'Invalid phone';
}

// Section: Form that uses validators
html {
  <form id="contact-form">
    <input type="text" id="email" placeholder="Email">
    <input type="text" id="phone" placeholder="Phone">
    <button type="submit">Submit</button>
  </form>
}

init {
  kernel.$('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const result = kernel.validate({
      email: kernel.$('#email').value,
      phone: kernel.$('#phone').value
    }, {
      email: ['required', 'email'],
      phone: ['required', 'phone']
    });
    
    if (result.valid) {
      kernel.notify('Form valid!', 'success');
    } else {
      kernel.notify('Please fix errors', 'error');
    }
  });
}
```

### Use Case 3: Analytics with Dashboard
```
@type both

// Layer: Track events globally
init {
  window.trackEvent = (event, data) => {
    const events = kernel.getState('analytics-events', []);
    events.push({ event, data, timestamp: Date.now() });
    kernel.setState('analytics-events', events);
    console.log('📊 Event:', event, data);
  };
}

// Section: Analytics dashboard
state {
  "events": []
}

watch analytics-events {
  context.state.events = newValue;
  context.render();
}

method "render" {
  const list = kernel.$('#event-list');
  list.innerHTML = context.state.events.map(e => `
    <li>${e.event} - ${new Date(e.timestamp).toLocaleTimeString()}</li>
  `).join('');
}

html {
  <div class="exw3-container">
    <h2>Analytics Dashboard</h2>
    <ul id="event-list"></ul>
  </div>
}

onMount {
  context.state.events = kernel.getState('analytics-events', []);
  context.render();
}
```

## Summary

The `.ex3` format is:
- ✅ **Unified** - One format for everything
- ✅ **Powerful** - All features in one file
- ✅ **Flexible** - Use what you need
- ✅ **Compatible** - Works with existing mods
- ✅ **Simple** - Easy to learn and use

**Start using `.ex3` for your next mod!**
