# EXW3 Advanced Features

This document covers the advanced and unique features that make EXW3 a powerful framework.

## Table of Contents

- [Middleware System](#middleware-system)
- [Plugin Architecture](#plugin-architecture)
- [DOM Watchers](#dom-watchers)
- [Animation API](#animation-api)
- [Validation System](#validation-system)
- [Data Transformers](#data-transformers)
- [Cache System](#cache-system)
- [Task Scheduler](#task-scheduler)
- [Internationalization](#internationalization)
- [Security Utilities](#security-utilities)
- [Advanced Language Features](#advanced-language-features)

---

## Middleware System

Middleware allows you to intercept and modify operations before/after they execute.

### Register Middleware

```javascript
kernel.registerMiddleware('logger', async (context, data, kernel) => {
  console.log('Operation:', context, 'Data:', data);
  return data; // Return modified data
}, {
  priority: 10,
  enabled: true,
  type: 'before' // 'before' | 'after' | 'around'
});
```

### Execute Middleware Chain

```javascript
const result = await kernel.executeMiddleware('save-operation', {
  id: 123,
  name: 'John'
});
```

### In .ex3 Files (Layer Type)

```
@name "auth-middleware"
@type layer

middleware "authenticate" {
  if (!kernel.getState('user')) {
    kernel.notify('Please log in', 'warning');
    return null;
  }
  return data;
}

middleware "log-requests" {
  console.log('[Request]', context, data);
  return data;
}
```

---

## Plugin Architecture

Plugins are reusable packages with lifecycle methods.

### Register a Plugin

```javascript
kernel.registerPlugin('analytics', {
  version: '1.0.0',
  dependencies: [],
  
  install(kernel) {
    kernel.setState('analytics-enabled', true);
    window.trackEvent = (event, data) => {
      console.log('Track:', event, data);
    };
  },
  
  uninstall(kernel) {
    kernel.setState('analytics-enabled', false);
    delete window.trackEvent;
  },
  
  config: {
    trackingId: 'UA-XXXXX-Y'
  }
});
```

### Install/Uninstall Plugins

```javascript
await kernel.installPlugin('analytics');
await kernel.uninstallPlugin('analytics');
```

---

## DOM Watchers

Watch DOM elements for changes using MutationObserver.

### Watch an Element

```javascript
const watcherId = kernel.watchElement('#my-element', (mutations, element) => {
  console.log('Element changed:', mutations);
}, {
  childList: true,
  attributes: true,
  subtree: true
});

// Stop watching
kernel.unwatchElement(watcherId);
```

### In .ex3 Files (Layer Type)

```
@name "dom-watcher-example"
@type layer

watch #dynamic-content {
  console.log('Content changed!', mutations);
  kernel.notify('Content updated', 'info');
}

watch .user-list {
  const count = element.children.length;
  kernel.setState('userCount', count);
}
```

---

## Animation API

Built-in animation utilities using Web Animations API.

### Basic Animations

```javascript
// Fade in
kernel.animations.fadeIn('#element', 300);

// Fade out
kernel.animations.fadeOut('#element', 300);

// Slide in from direction
kernel.animations.slideIn('#element', 'left', 300);
kernel.animations.slideIn('#element', 'right', 300);
kernel.animations.slideIn('#element', 'up', 300);
kernel.animations.slideIn('#element', 'down', 300);

// Pulse effect
kernel.animations.pulse('#element', 600);

// Shake effect
kernel.animations.shake('#element', 500);
```

### Custom Animations

```javascript
kernel.animations.animate('#element', [
  { transform: 'scale(1)', opacity: 1 },
  { transform: 'scale(1.2)', opacity: 0.8 },
  { transform: 'scale(1)', opacity: 1 }
], {
  duration: 500,
  easing: 'ease-in-out',
  fill: 'forwards'
});
```

### Example Usage

```javascript
init {
  const button = kernel.$('#save-btn');
  button.addEventListener('click', async () => {
    kernel.animations.pulse(button);
    await saveData();
    kernel.animations.fadeIn('#success-message');
  });
}
```

---

## Validation System

Powerful validation with custom rules.

### Built-in Validators

- `required` - Field must have a value
- `email` - Valid email format
- `min:X` - Minimum length
- `max:X` - Maximum length
- `numeric` - Must be a number
- `url` - Valid URL format

### Validate Data

```javascript
const result = kernel.validate({
  email: 'user@example.com',
  password: '12345',
  age: '25'
}, {
  email: ['required', 'email'],
  password: ['required', 'min:6'],
  age: ['required', 'numeric']
});

if (!result.valid) {
  console.log('Errors:', result.errors);
  // { password: ['Minimum length is 6'] }
}
```

### Register Custom Validators

```javascript
kernel.registerValidator('phone', (value) => {
  const regex = /^\d{3}-\d{3}-\d{4}$/;
  return regex.test(value) || 'Invalid phone format (XXX-XXX-XXXX)';
});
```

### In .ex3 Files (Layer Type)

```
@name "custom-validators"
@type layer

validator "username" {
  if (!value) return 'Username is required';
  if (value.length < 3) return 'Username must be at least 3 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
  return true;
}

validator "strong-password" {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(value)) return 'Password must contain a number';
  return true;
}
```

---

## Data Transformers

Transform data with reusable functions.

### Built-in Transformers

```javascript
kernel.transform('hello world', 'uppercase'); // 'HELLO WORLD'
kernel.transform('HELLO WORLD', 'lowercase'); // 'hello world'
kernel.transform('hello world', 'capitalize'); // 'Hello world'
kernel.transform('  hello  ', 'trim'); // 'hello'
kernel.transform('Very long text...', 'truncate', 10); // 'Very long ...'
kernel.transform('Hello World!', 'slugify'); // 'hello-world'
kernel.transform(19.99, 'currency', '$'); // '$19.99'
kernel.transform(0.75, 'percentage'); // '75.00%'
```

### Register Custom Transformers

```javascript
kernel.registerTransformer('reverse', (str) => {
  return String(str).split('').reverse().join('');
});

kernel.transform('hello', 'reverse'); // 'olleh'
```

### In .ex3 Files (Layer Type)

```
@name "custom-transformers"
@type layer

transformer "titleCase" {
  return data.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

transformer "maskEmail" {
  const [name, domain] = data.split('@');
  const masked = name.charAt(0) + '***' + name.charAt(name.length - 1);
  return masked + '@' + domain;
}
```

---

## Cache System

In-memory caching with TTL support.

### Set Cache

```javascript
// Cache forever
kernel.setCache('user-data', { name: 'John', age: 30 });

// Cache with TTL (5 minutes)
kernel.setCache('api-response', data, 5 * 60 * 1000);
```

### Get Cache

```javascript
const data = kernel.getCache('user-data', { name: 'Guest' });
```

### Clear Cache

```javascript
// Clear all
kernel.clearCache();

// Clear by pattern
kernel.clearCache('api-.*'); // Clears all keys starting with 'api-'
```

### Example: Cache API Responses

```javascript
init {
  async function fetchUsers() {
    // Check cache first
    let users = kernel.getCache('users');
    if (users) {
      console.log('Using cached data');
      return users;
    }
    
    // Fetch from API
    users = await kernel.fetchJSON('/api/users');
    
    // Cache for 5 minutes
    kernel.setCache('users', users, 5 * 60 * 1000);
    
    return users;
  }
}
```

---

## Task Scheduler

Schedule recurring or one-time tasks.

### Schedule Recurring Task

```javascript
kernel.scheduler.schedule('auto-save', () => {
  console.log('Auto-saving...');
  saveData();
}, 30000); // Every 30 seconds
```

### Schedule One-Time Task

```javascript
kernel.scheduler.scheduleOnce('delayed-notification', () => {
  kernel.notify('Welcome back!', 'info');
}, 5000); // After 5 seconds
```

### Cancel Tasks

```javascript
kernel.scheduler.cancel('auto-save');
kernel.scheduler.cancelAll();
```

### List Scheduled Tasks

```javascript
const tasks = kernel.scheduler.list();
console.log('Scheduled tasks:', tasks);
```

---

## Internationalization

Multi-language support with translation system.

### Add Translations

```javascript
kernel.i18n.addTranslations('en', {
  'welcome': 'Welcome',
  'hello': 'Hello, {name}!',
  'items_count': 'You have {count} items'
});

kernel.i18n.addTranslations('es', {
  'welcome': 'Bienvenido',
  'hello': '¡Hola, {name}!',
  'items_count': 'Tienes {count} artículos'
});
```

### Set Locale

```javascript
kernel.i18n.setLocale('es');
```

### Translate

```javascript
kernel.i18n.t('welcome'); // 'Bienvenido'
kernel.i18n.t('hello', { name: 'Juan' }); // '¡Hola, Juan!'
kernel.i18n.t('items_count', { count: 5 }); // 'Tienes 5 artículos'
```

### In .ex3 Files (Layer Type)

```
@name "i18n-example"
@type layer

i18n "en" {
  "app.title": "My Application",
  "app.subtitle": "Welcome to EXW3",
  "button.save": "Save",
  "button.cancel": "Cancel"
}

i18n "fr" {
  "app.title": "Mon Application",
  "app.subtitle": "Bienvenue à EXW3",
  "button.save": "Enregistrer",
  "button.cancel": "Annuler"
}

init {
  document.title = kernel.i18n.t('app.title');
}
```

---

## Security Utilities

Built-in security helpers.

### Sanitize HTML

```javascript
const safe = kernel.security.sanitizeHTML('<script>alert("xss")</script>');
// Returns: '&lt;script&gt;alert("xss")&lt;/script&gt;'
```

### Escape HTML

```javascript
const escaped = kernel.security.escapeHTML('<div>Hello</div>');
```

### Sanitize URL

```javascript
const safe = kernel.security.sanitizeURL('javascript:alert("xss")');
// Returns: '#'

const safe2 = kernel.security.sanitizeURL('https://example.com');
// Returns: 'https://example.com'
```

### Generate Token

```javascript
const token = kernel.security.generateToken(32);
// Returns: random 32-character string
```

### Hash String

```javascript
const hash = await kernel.security.hash('password123');
// Returns: SHA-256 hash
```

### CSRF Protection

```javascript
// Generate CSRF token
const token = kernel.security.generateCSRF();

// Validate CSRF token
if (kernel.security.validateCSRF(token)) {
  // Token is valid
}
```

---

## Advanced Language Features

### .ex3 Layer Advanced Blocks

#### Lifecycle Hooks

```
@name "lifecycle-example"

onLoad {
  console.log('Layer is loading');
}

onActivate {
  console.log('Layer is now active');
}

onDeactivate {
  console.log('Layer is deactivating');
}

onUnload {
  console.log('Layer is unloading');
}
```

### .ex3 Section Advanced Blocks

#### State Management

```
@name "counter-section"

state {
  "count": 0,
  "max": 100
}

method "increment" {
  context.state.count++;
  kernel.$('#count').textContent = context.state.count;
}

method "reset" {
  context.state.count = 0;
  kernel.$('#count').textContent = context.state.count;
}

html {
  <div>
    <h2>Count: <span id="count">0</span></h2>
    <button id="inc-btn">Increment</button>
    <button id="reset-btn">Reset</button>
  </div>
}

init {
  kernel.$('#inc-btn').addEventListener('click', context.increment);
  kernel.$('#reset-btn').addEventListener('click', context.reset);
}
```

#### Computed Properties

```
@name "user-profile"

state {
  "firstName": "John",
  "lastName": "Doe"
}

computed "fullName" {
  return context.state.firstName + ' ' + context.state.lastName;
}

init {
  kernel.$('#full-name').textContent = context.computed.fullName(kernel);
}
```

#### Watchers

```
@name "reactive-section"

watch "theme" {
  console.log('Theme changed from', oldValue, 'to', newValue);
  document.body.className = 'theme-' + newValue;
}

watch "userData" {
  kernel.$('#username').textContent = newValue.name;
}
```

#### Lifecycle Hooks

```
@name "lifecycle-section"

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

---

## Complete Advanced Example

Here's a section using multiple advanced features:

```
@name "advanced-todo"
@version "2.0.0"
@description "Advanced todo list with all features"

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
  
  if (filter === 'active') {
    return todos.filter(t => !t.done);
  } else if (filter === 'completed') {
    return todos.filter(t => t.done);
  }
  return todos;
}

method "addTodo" {
  const input = kernel.$('#todo-input');
  const text = input.value.trim();
  
  if (!text) {
    kernel.animations.shake(input);
    return;
  }
  
  // Validate
  const result = kernel.validate({ text }, {
    text: ['required', 'min:3', 'max:100']
  });
  
  if (!result.valid) {
    kernel.notify(result.errors.text[0], 'error');
    return;
  }
  
  context.state.todos.push({
    id: Date.now(),
    text: kernel.transform(text, 'trim'),
    done: false,
    created: new Date()
  });
  
  input.value = '';
  context.render();
  kernel.animations.fadeIn('#todo-' + (context.state.todos.length - 1));
  
  if (context.props.autoSave) {
    kernel.setCache('todos', context.state.todos);
  }
}

method "render" {
  const list = kernel.$('#todo-list');
  const todos = context.computed.filteredTodos(kernel);
  
  list.innerHTML = todos.map((todo, i) => `
    <li id="todo-${i}" class="${todo.done ? 'done' : ''}">
      <input type="checkbox" ${todo.done ? 'checked' : ''} 
             onchange="toggleTodo(${i})">
      <span>${kernel.security.escapeHTML(todo.text)}</span>
      <button onclick="deleteTodo(${i})">Delete</button>
    </li>
  `).join('');
}

watch "filter" {
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
    kernel.setCache('todos', context.state.todos);
  }, 30000);
}

onUnmount {
  kernel.scheduler.cancel('todo-autosave');
}

html {
  <div class="exw3-container">
    <h2>Advanced Todo List</h2>
    <input type="text" id="todo-input" placeholder="Add todo...">
    <button class="exw3-button" id="add-btn">Add</button>
    
    <div class="filters">
      <button onclick="setFilter('all')">All</button>
      <button onclick="setFilter('active')">Active</button>
      <button onclick="setFilter('completed')">Completed</button>
    </div>
    
    <ul id="todo-list"></ul>
  </div>
}

css {
  .done span {
    text-decoration: line-through;
    opacity: 0.6;
  }
  .filters button {
    margin: 5px;
  }
}

init {
  kernel.$('#add-btn').addEventListener('click', context.addTodo);
  
  window.setFilter = (filter) => {
    context.state.filter = filter;
  };
  
  window.toggleTodo = (index) => {
    context.state.todos[index].done = !context.state.todos[index].done;
    context.render();
  };
  
  window.deleteTodo = (index) => {
    kernel.animations.fadeOut('#todo-' + index).finished.then(() => {
      context.state.todos.splice(index, 1);
      context.render();
    });
  };
}
```

This example demonstrates:
- State management
- Computed properties
- Methods
- Watchers
- Lifecycle hooks
- Validation
- Transformers
- Animations
- Caching
- Scheduling
- Security (HTML escaping)

---

**These advanced features make EXW3 a truly unique and powerful framework!**
