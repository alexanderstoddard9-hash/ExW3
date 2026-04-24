# .ex3 Format Specification - Unified Mod Format

## Overview

The `.ex3` format is EXW3's **unified mod format** that combines the capabilities of both layers (`.exwl3`) and sections (`.exws3`) into a single, powerful file format.

With `.ex3`, you can create mods that:
- Act as **layers** (global modifications, CSS, HTML injection)
- Act as **sections** (self-contained UI components)
- Act as **both** simultaneously (hybrid mods)

## Why .ex3?

### Before (Separate Formats)
- `.exwl3` - Layers only (global modifications)
- `.exws3` - Sections only (UI components)
- Had to create two files for mods that needed both capabilities

### After (Unified Format)
- `.ex3` - Can do everything!
- One file for simple or complex mods
- Mix and match layer and section features
- Backward compatible (`.exwl3` and `.exws3` still work)

## Basic Structure

```
@name "my-mod"
@version "1.0.0"
@description "A unified mod"
@type both
@author "Your Name"
@priority 10
@modifies kernel
@dependencies []

// Layer features: CSS, HTML injection, validators, etc.
css {
  /* Global styles */
}

html prepend body {
  <!-- Inject HTML globally -->
}

// Section features: HTML content, state, methods
html {
  <!-- Section content -->
}

state {
  "count": 0
}

method "increment" {
  context.state.count++;
}

init {
  // Initialization code
}
```

## Metadata Fields

| Field | Required | Default | Description |
|---|---|---|---|
| `@name` | yes | — | Unique identifier |
| `@version` | no | `"1.0.0"` | Semantic version |
| `@description` | no | — | Human-readable description |
| `@author` | no | — | Author name |
| `@type` | no | `both` | `layer`, `section`, or `both` |
| `@priority` | no | `10` | Load order (higher = first) |
| `@disabled` | no | — | Skip without removing from config |
| `@modifies` | no | — | What this mod targets |
| `@dependencies` | no | `[]` | Required mods |

## Type Modes

### `@type layer`
Mod acts as a layer only (global modifications).

```
@name "theme-layer"
@type layer

css {
  body { background: #f5f5f5; }
}
```

### `@type section`
Mod acts as a section only (UI component).

```
@name "counter-section"
@type section

html {
  <div>Count: <span id="count">0</span></div>
}
```

### `@type both` (Default)
Mod can act as both layer and section.

```
@name "hybrid-mod"
@type both

// Layer features
css {
  .my-class { color: blue; }
}

// Section features
html {
  <div class="my-class">Hello</div>
}
```

## Layer Features

All layer features from `.exwl3` are available:

### CSS Blocks (Multiple Allowed)

```
css {
  body {
    font-family: Arial, sans-serif;
  }
}

css {
  .button {
    padding: 10px;
  }
}
```

### HTML Injection

```
// Prepend to body (default)
html prepend body {
  <header>My Header</header>
}

// Append to element
html append #app {
  <footer>My Footer</footer>
}
```

### Remove Elements

```
remove #old-element;
remove .deprecated-class;
```

### Validators

```
validator "username" {
  if (!value) return 'Username required';
  if (value.length < 3) return 'Too short';
  return true;
}
```

### Transformers

```
transformer "reverse" {
  return data.split('').reverse().join('');
}
```

### Middleware

```
middleware "logger" {
  console.log('Operation:', context, data);
  return data;
}
```

### DOM Watchers

```
watch #dynamic-content {
  console.log('Content changed!', mutations);
}
```

### Internationalization

```
i18n "en" {
  "welcome": "Welcome",
  "goodbye": "Goodbye"
}

i18n "es" {
  "welcome": "Bienvenido",
  "goodbye": "Adiós"
}
```

### Lifecycle Hooks (Layer)

```
onLoad {
  console.log('Layer loading');
}

onActivate {
  console.log('Layer activated');
}

onDeactivate {
  console.log('Layer deactivated');
}

onUnload {
  console.log('Layer unloading');
}
```

## Section Features

All section features from `.exws3` are available:

### HTML Content

```
html {
  <div class="exw3-container">
    <h2>My Section</h2>
    <p>Content here</p>
  </div>
}
```

### State Management

```
state {
  "count": 0,
  "name": "Guest",
  "items": []
}
```

### Methods

```
method "increment" {
  context.state.count++;
  kernel.$('#count').textContent = context.state.count;
}

method "reset" {
  context.state.count = 0;
  kernel.$('#count').textContent = 0;
}
```

### Computed Properties

```
computed "fullName" {
  return context.state.firstName + ' ' + context.state.lastName;
}

computed "itemCount" {
  return context.state.items.length;
}
```

### State Watchers

```
watch theme {
  document.body.className = 'theme-' + newValue;
}

watch userData {
  kernel.$('#username').textContent = newValue.name;
}
```

### Props (Configuration)

```
props {
  "maxItems": 100,
  "autoSave": true,
  "theme": "light"
}
```

### Lifecycle Hooks (Section)

```
onMount {
  console.log('Section mounted');
}

onUpdate {
  console.log('Section updated');
}

onUnmount {
  console.log('Section unmounting');
}

onDestroy {
  console.log('Section destroyed');
}
```

### JavaScript Block

```
javascript {
  const API_URL = 'https://api.example.com';
  
  async function fetchData() {
    return await kernel.fetchJSON(API_URL + '/data');
  }
}
```

### Init Block

```
init {
  kernel.$('#my-button').addEventListener('click', () => {
    context.increment();
  });
}
```

### Render Block

```
render {
  container.innerHTML = `
    <div>
      <h2>Dynamic Content</h2>
      <p>Rendered at: ${new Date().toLocaleTimeString()}</p>
    </div>
  `;
}
```

## Complete Examples

### Example 1: Simple Layer

```
@name "custom-theme"
@version "1.0.0"
@type layer

css {
  :root {
    --primary: #667eea;
    --secondary: #764ba2;
  }
  
  body {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
  }
}
```

### Example 2: Simple Section

```
@name "hello-world"
@version "1.0.0"
@type section

html {
  <div class="exw3-container">
    <h2>Hello World!</h2>
    <p>Welcome to EXW3</p>
  </div>
}

css {
  .exw3-container {
    text-align: center;
    padding: 40px;
  }
}
```

### Example 3: Hybrid Mod (Both)

```
@name "notification-system"
@version "1.0.0"
@type both
@description "Global notification system with UI"

// Layer: Add global notification container
html prepend body {
  <div id="notifications"></div>
}

css {
  #notifications {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
  }
  
  .notification {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s;
  }
}

// Layer: Add global notification function
init {
  window.showNotification = (message, type = 'info') => {
    const notif = kernel.createElement('div', {
      class: 'notification notification-' + type
    }, [message]);
    
    kernel.$('#notifications').appendChild(notif);
    
    setTimeout(() => {
      kernel.animations.fadeOut(notif).finished.then(() => {
        notif.remove();
      });
    }, 3000);
  };
}

// Section: Notification control panel
html {
  <div class="exw3-container">
    <h2>Notification System</h2>
    <button class="exw3-button" id="test-notif">Test Notification</button>
    <button class="exw3-button secondary" id="test-error">Test Error</button>
  </div>
}

init {
  kernel.$('#test-notif').addEventListener('click', () => {
    window.showNotification('This is a test notification!', 'success');
  });
  
  kernel.$('#test-error').addEventListener('click', () => {
    window.showNotification('This is an error!', 'error');
  });
}
```

### Example 4: Advanced Todo App

```
@name "advanced-todo"
@version "2.0.0"
@type both
@description "Full-featured todo app with validation and i18n"

// Layer: Add global validator
validator "todo-text" {
  if (!value) return 'Todo text is required';
  if (value.length < 3) return 'Todo must be at least 3 characters';
  if (value.length > 100) return 'Todo must be less than 100 characters';
  return true;
}

// Layer: Add transformer
transformer "todo-format" {
  return data.trim().charAt(0).toUpperCase() + data.trim().slice(1);
}

// Layer: Add i18n
i18n "en" {
  "todo.title": "Todo List",
  "todo.add": "Add Todo",
  "todo.placeholder": "Enter todo...",
  "todo.empty": "No todos yet"
}

i18n "es" {
  "todo.title": "Lista de Tareas",
  "todo.add": "Agregar Tarea",
  "todo.placeholder": "Ingrese tarea...",
  "todo.empty": "No hay tareas aún"
}

// Section: Todo UI
state {
  "todos": [],
  "filter": "all"
}

props {
  "maxTodos": 50,
  "autoSave": true
}

computed "filteredTodos" {
  const todos = context.state.todos;
  const filter = context.state.filter;
  
  if (filter === 'active') return todos.filter(t => !t.done);
  if (filter === 'completed') return todos.filter(t => t.done);
  return todos;
}

method "addTodo" {
  const input = kernel.$('#todo-input');
  const text = input.value;
  
  // Validate
  const result = kernel.validate({ text }, {
    text: ['todo-text']
  });
  
  if (!result.valid) {
    kernel.notify(result.errors.text[0], 'error');
    kernel.animations.shake(input);
    return;
  }
  
  // Transform and add
  const formatted = kernel.transform(text, 'todo-format');
  context.state.todos.push({
    id: Date.now(),
    text: formatted,
    done: false,
    created: new Date()
  });
  
  input.value = '';
  context.render();
  
  // Auto-save
  if (context.props.autoSave) {
    kernel.setCache('todos', context.state.todos);
  }
  
  kernel.notify('Todo added!', 'success');
}

method "render" {
  const list = kernel.$('#todo-list');
  const todos = context.computed.filteredTodos(kernel);
  
  if (todos.length === 0) {
    list.innerHTML = `<li class="empty">${kernel.i18n.t('todo.empty')}</li>`;
    return;
  }
  
  list.innerHTML = todos.map((todo, i) => `
    <li class="${todo.done ? 'done' : ''}">
      <input type="checkbox" ${todo.done ? 'checked' : ''} 
             onchange="window.toggleTodo(${todo.id})">
      <span>${kernel.security.escapeHTML(todo.text)}</span>
      <button onclick="window.deleteTodo(${todo.id})">×</button>
    </li>
  `).join('');
}

watch filter {
  context.render();
}

onMount {
  // Load from cache
  const cached = kernel.getCache('todos');
  if (cached) {
    context.state.todos = cached;
    context.render();
  }
  
  // Auto-save every 30 seconds
  kernel.scheduler.schedule('todo-autosave', () => {
    if (context.props.autoSave) {
      kernel.setCache('todos', context.state.todos);
    }
  }, 30000);
}

onUnmount {
  kernel.scheduler.cancel('todo-autosave');
}

html {
  <div class="exw3-container">
    <h2>{kernel.i18n.t('todo.title')}</h2>
    
    <div class="todo-input-group">
      <input type="text" id="todo-input" 
             placeholder="{kernel.i18n.t('todo.placeholder')}">
      <button class="exw3-button" id="add-btn">
        {kernel.i18n.t('todo.add')}
      </button>
    </div>
    
    <div class="filters">
      <button onclick="window.setFilter('all')">All</button>
      <button onclick="window.setFilter('active')">Active</button>
      <button onclick="window.setFilter('completed')">Completed</button>
    </div>
    
    <ul id="todo-list"></ul>
  </div>
}

css {
  .todo-input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  #todo-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
  
  .filters {
    margin-bottom: 20px;
  }
  
  .filters button {
    margin-right: 10px;
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .filters button:hover {
    background: #f5f5f5;
  }
  
  #todo-list {
    list-style: none;
    padding: 0;
  }
  
  #todo-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: white;
    margin-bottom: 8px;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }
  
  #todo-list li.done span {
    text-decoration: line-through;
    opacity: 0.6;
  }
  
  #todo-list li.empty {
    text-align: center;
    color: #999;
  }
  
  #todo-list li span {
    flex: 1;
  }
  
  #todo-list li button {
    background: #f44336;
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
  }
}

init {
  kernel.$('#add-btn').addEventListener('click', context.addTodo);
  kernel.$('#todo-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') context.addTodo();
  });
  
  window.setFilter = (filter) => {
    context.state.filter = filter;
  };
  
  window.toggleTodo = (id) => {
    const todo = context.state.todos.find(t => t.id === id);
    if (todo) {
      todo.done = !todo.done;
      context.render();
    }
  };
  
  window.deleteTodo = (id) => {
    const index = context.state.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      context.state.todos.splice(index, 1);
      context.render();
      kernel.notify('Todo deleted', 'info');
    }
  };
  
  context.render();
}
```

## Migration Guide

### From .exwl3 to .ex3

Simply rename the file and optionally add `@type layer`:

```
// Before: my-layer.exwl3
@name "my-layer"

css {
  /* styles */
}

// After: my-layer.ex3
@name "my-layer"
@type layer

css {
  /* styles */
}
```

### From .exws3 to .ex3

Simply rename the file and optionally add `@type section`:

```
// Before: my-section.exws3
@name "my-section"

html {
  <!-- content -->
}

// After: my-section.ex3
@name "my-section"
@type section

html {
  <!-- content -->
}
```

### Combining Both

Merge both files into one `.ex3` file:

```
@name "my-mod"
@type both

// Layer features from .exwl3
css {
  /* global styles */
}

// Section features from .exws3
html {
  <!-- section content -->
}

init {
  // shared initialization
}
```

## Best Practices

1. **Use `@type` explicitly** for clarity
2. **Organize blocks logically** (layer features first, then section features)
3. **Comment your code** to explain complex logic
4. **Use semantic names** for methods, computed properties, etc.
5. **Validate user input** with validators
6. **Transform data** consistently with transformers
7. **Handle errors gracefully** in init blocks
8. **Clean up resources** in lifecycle hooks

## Backward Compatibility

- `.exwl3` and `.exws3` files still work
- No need to migrate existing mods
- `.ex3` is preferred for new mods
- All three formats can coexist

---

**The `.ex3` format gives you the best of both worlds - use it to create powerful, flexible mods!**
