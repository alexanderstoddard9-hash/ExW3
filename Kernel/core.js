/**
 * EXW3 Kernel Core
 * The foundation for all mods to extend
 */

class EXW3Kernel {
  constructor() {
    this.layers = new Map();
    this.sections = new Map();
    this.hooks = new Map();
    this.config = {};
    this.sectionPermissions = new Map(); // sectionName -> string[] of allowed roles
    this.globalState = new Map(); // Shared state between mods
    this.eventBus = this._createEventBus(); // Global event system
    this.storage = this._createStorageAPI(); // Enhanced storage API
    this.router = this._createRouter(); // Navigation router
    this.theme = this._createThemeAPI(); // Theme management
    this.notifications = []; // Notification queue

    // Initialize default hooks
    this.registerHook('before-init');
    this.registerHook('after-init');
    this.registerHook('before-render');
    this.registerHook('after-render');
    this.registerHook('section-register');
    this.registerHook('layer-apply');
    this.registerHook('route-change');
    this.registerHook('state-change');
    this.registerHook('theme-change');
  }

  /**
   * Register a hook that mods can attach to
   */
  registerHook(hookName) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
  }

  /**
   * Attach a callback to a hook
   */
  onHook(hookName, callback, priority = 10) {
    if (!this.hooks.has(hookName)) {
      console.warn(`Hook '${hookName}' not registered`);
      return;
    }
    this.hooks.get(hookName).push({ callback, priority });
    // Sort by priority (higher = runs first)
    this.hooks.get(hookName).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Execute all callbacks for a hook
   */
  async executeHook(hookName, data = {}) {
    if (!this.hooks.has(hookName)) return;
    
    const callbacks = this.hooks.get(hookName);
    for (const { callback } of callbacks) {
      try {
        await callback(data);
      } catch (error) {
        console.error(`Error in hook '${hookName}':`, error);
      }
    }
  }

  /**
   * Register a section (app-like module)
   */
  registerSection(name, sectionModule) {
    this.sections.set(name, sectionModule);
    this.executeHook('section-register', { name, module: sectionModule });
    console.log(`✓ Section registered: ${name}`);
  }

  /**
   * Get a registered section
   */
  getSection(name) {
    return this.sections.get(name);
  }

  /**
   * Register a layer (modifies kernel or sections)
   */
  registerLayer(name, layerModule) {
    this.layers.set(name, layerModule);
    console.log(`✓ Layer registered: ${name}`);
  }

  /**
   * Get a registered layer
   */
  getLayer(name) {
    return this.layers.get(name);
  }

  /**
   * Apply a layer's modifications
   */
  applyLayer(layerName) {
    const layer = this.layers.get(layerName);
    if (!layer) {
      console.error(`Layer '${layerName}' not found`);
      return false;
    }

    try {
      if (layer.onApply) {
        layer.onApply(this);
      }
      this.executeHook('layer-apply', { name: layerName, layer });
      console.log(`✓ Layer applied: ${layerName}`);
      return true;
    } catch (error) {
      console.error(`Error applying layer '${layerName}':`, error);
      return false;
    }
  }

  /**
   * Initialize the kernel and load all configured mods
   */
  async init(configData = {}) {
    this.config = configData;
    await this.executeHook('before-init');

    // Init sections (CSS injection, JS globals, init blocks)
    if (configData.sections && Array.isArray(configData.sections)) {
      for (const sectionName of configData.sections) {
        const section = this.getSection(sectionName);
        if (section && section.init) {
          await section.init(this);
        }
      }
    }

    await this.executeHook('after-init');
  }

  /**
   * Render the site with active sections
   */
  async render(containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container '#${containerId}' not found`);
      return;
    }

    await this.executeHook('before-render');

    container.innerHTML = '';
    
    // Create section containers in config order
    const sectionOrder = this.config.sections || [];
    for (const name of sectionOrder) {
      const section = this.sections.get(name);
      if (!section) continue;

      // Skip sections the current user doesn't have permission to see
      if (!this.canViewSection(name)) continue;

      const sectionEl = document.createElement('div');
      sectionEl.id = `section-${name}`;
      sectionEl.className = 'exw3-section';
      container.appendChild(sectionEl);

      if (section.render) {
        await section.render(sectionEl, this);
      }
    }

    await this.executeHook('after-render');
  }

  /**
   * Register required roles for a section.
   * roles: string[] e.g. ['admin'] or ['admin','moderator']
   * Empty/omitted = visible to everyone.
   */
  registerSectionPermission(sectionName, roles = []) {
    this.sectionPermissions.set(sectionName, roles);
  }

  /**
   * Check if the current user can see a section.
   */
  canViewSection(sectionName) {
    const required = this.sectionPermissions.get(sectionName);
    if (!required || required.length === 0) return true;
    const user = window.exw3CurrentUser ? window.exw3CurrentUser() : null;
    if (!user) return false;
    const users = JSON.parse(localStorage.getItem('exw3-users') || '{}');
    const role = (users[user] && users[user].role) || 'user';
    return required.includes(role);
  }

  /**
   * Show a full-screen overlay above everything
   */
  showOverlay(html = '', css = '') {
    this.hideOverlay(); // remove any existing one first

    if (css) {
      const style = document.createElement('style');
      style.id = 'exw3-overlay-style';
      style.textContent = css;
      document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.id = 'exw3-overlay';
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:10000',
      'display:flex', 'align-items:center', 'justify-content:center',
      'background:rgba(0,0,0,0.85)', 'backdrop-filter:blur(4px)'
    ].join(';');
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    return overlay;
  }

  /**
   * Remove the overlay
   */
  hideOverlay() {
    document.getElementById('exw3-overlay')?.remove();
    document.getElementById('exw3-overlay-style')?.remove();
  }

  /**
   * Get all registered sections
   */
  listSections() {
    return Array.from(this.sections.keys());
  }

  /**
   * Get all registered layers
   */
  listLayers() {
    return Array.from(this.layers.keys());
  }

  /**
   * Debug: log current state
   */
  debug() {
    console.log('=== EXW3 Kernel State ===');
    console.log('Sections:', this.listSections());
    console.log('Layers:', this.listLayers());
    console.log('Config:', this.config);
    console.log('Global State:', Object.fromEntries(this.globalState));
    console.log('Router:', this.router.getCurrentRoute());
  }

  // ========== GLOBAL STATE MANAGEMENT ==========

  /**
   * Set a global state value accessible to all mods
   */
  setState(key, value) {
    const oldValue = this.globalState.get(key);
    this.globalState.set(key, value);
    this.executeHook('state-change', { key, value, oldValue });
    this.eventBus.emit('state:' + key, { value, oldValue });
  }

  /**
   * Get a global state value
   */
  getState(key, defaultValue = null) {
    return this.globalState.has(key) ? this.globalState.get(key) : defaultValue;
  }

  /**
   * Watch for state changes
   */
  watchState(key, callback) {
    this.eventBus.on('state:' + key, callback);
  }

  /**
   * Remove all state
   */
  clearState() {
    this.globalState.clear();
  }

  // ========== EVENT BUS ==========

  _createEventBus() {
    const listeners = new Map();
    return {
      on: (event, handler) => {
        if (!listeners.has(event)) listeners.set(event, []);
        listeners.get(event).push(handler);
      },
      off: (event, handler) => {
        if (listeners.has(event)) {
          listeners.set(event, listeners.get(event).filter(h => h !== handler));
        }
      },
      emit: (event, data) => {
        if (listeners.has(event)) {
          listeners.get(event).forEach(handler => {
            try { handler(data); } catch (e) { console.error('Event handler error:', e); }
          });
        }
      },
      once: (event, handler) => {
        const wrapper = (data) => {
          handler(data);
          this.eventBus.off(event, wrapper);
        };
        this.eventBus.on(event, wrapper);
      },
      listEvents: () => Array.from(listeners.keys())
    };
  }

  // ========== STORAGE API ==========

  _createStorageAPI() {
    return {
      local: {
        get: (key, defaultValue = null) => {
          const val = localStorage.getItem('exw3:' + key);
          return val ? JSON.parse(val) : defaultValue;
        },
        set: (key, value) => {
          localStorage.setItem('exw3:' + key, JSON.stringify(value));
        },
        remove: (key) => localStorage.removeItem('exw3:' + key),
        clear: () => {
          Object.keys(localStorage).forEach(k => {
            if (k.startsWith('exw3:')) localStorage.removeItem(k);
          });
        },
        keys: () => Object.keys(localStorage).filter(k => k.startsWith('exw3:')).map(k => k.slice(5))
      },
      session: {
        get: (key, defaultValue = null) => {
          const val = sessionStorage.getItem('exw3:' + key);
          return val ? JSON.parse(val) : defaultValue;
        },
        set: (key, value) => {
          sessionStorage.setItem('exw3:' + key, JSON.stringify(value));
        },
        remove: (key) => sessionStorage.removeItem('exw3:' + key),
        clear: () => {
          Object.keys(sessionStorage).forEach(k => {
            if (k.startsWith('exw3:')) sessionStorage.removeItem(k);
          });
        },
        keys: () => Object.keys(sessionStorage).filter(k => k.startsWith('exw3:')).map(k => k.slice(5))
      }
    };
  }

  // ========== ROUTER API ==========

  _createRouter() {
    let currentRoute = window.location.hash.slice(1) || 'dashboard';
    
    const router = {
      navigate: (route) => {
        window.location.hash = route;
      },
      getCurrentRoute: () => currentRoute,
      onRouteChange: (callback) => {
        this.eventBus.on('route-change', callback);
      },
      getParams: () => {
        const params = {};
        const search = window.location.search.slice(1);
        search.split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return params;
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const newRoute = window.location.hash.slice(1) || 'dashboard';
      const oldRoute = currentRoute;
      currentRoute = newRoute;
      this.executeHook('route-change', { route: newRoute, oldRoute });
      this.eventBus.emit('route-change', { route: newRoute, oldRoute });
    });

    return router;
  }

  // ========== THEME API ==========

  _createThemeAPI() {
    return {
      set: (themeName) => {
        document.body.className = document.body.className.replace(/exw3-theme-\S+/g, '');
        document.body.classList.add('exw3-theme-' + themeName);
        this.executeHook('theme-change', { theme: themeName });
        this.eventBus.emit('theme-change', { theme: themeName });
      },
      get: () => {
        const match = document.body.className.match(/exw3-theme-(\S+)/);
        return match ? match[1] : 'default';
      },
      toggle: (theme1, theme2) => {
        const current = this.theme.get();
        this.theme.set(current === theme1 ? theme2 : theme1);
      },
      addCustomCSS: (css, id = null) => {
        const style = document.createElement('style');
        if (id) style.id = 'exw3-theme-' + id;
        style.textContent = css;
        document.head.appendChild(style);
      }
    };
  }

  // ========== NOTIFICATION API ==========

  /**
   * Show a notification to the user
   */
  notify(message, type = 'info', duration = 3000) {
    const notification = { message, type, duration, id: Date.now() };
    this.notifications.push(notification);
    this.eventBus.emit('notification', notification);
    
    // Auto-create notification UI if not exists
    if (!document.getElementById('exw3-notifications')) {
      this._createNotificationContainer();
    }
    
    this._showNotification(notification);
    
    if (duration > 0) {
      setTimeout(() => this._removeNotification(notification.id), duration);
    }
    
    return notification.id;
  }

  _createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'exw3-notifications';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:400px;';
    document.body.appendChild(container);
  }

  _showNotification(notification) {
    const container = document.getElementById('exw3-notifications');
    if (!container) return;

    const el = document.createElement('div');
    el.id = 'exw3-notif-' + notification.id;
    el.className = 'exw3-notification exw3-notification-' + notification.type;
    el.style.cssText = 'padding:12px 16px;border-radius:6px;background:white;box-shadow:0 4px 12px rgba(0,0,0,0.15);border-left:4px solid;animation:slideIn 0.3s;cursor:pointer;';
    
    const colors = {
      info: '#3498db',
      success: '#2ecc71',
      warning: '#f39c12',
      error: '#e74c3c'
    };
    el.style.borderLeftColor = colors[notification.type] || colors.info;
    el.textContent = notification.message;
    
    el.addEventListener('click', () => this._removeNotification(notification.id));
    container.appendChild(el);
  }

  _removeNotification(id) {
    const el = document.getElementById('exw3-notif-' + id);
    if (el) {
      el.style.animation = 'slideOut 0.3s';
      setTimeout(() => el.remove(), 300);
    }
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  // ========== DOM MANIPULATION HELPERS ==========

  /**
   * Query selector helper
   */
  $(selector) {
    return document.querySelector(selector);
  }

  /**
   * Query selector all helper
   */
  $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  /**
   * Create element helper
   */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key === 'class') {
        el.className = value;
      } else if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
    return el;
  }

  // ========== AJAX HELPERS ==========

  /**
   * Fetch JSON helper
   */
  async fetchJSON(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * POST JSON helper
   */
  async postJSON(url, data, options = {}) {
    return this.fetchJSON(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ========== UTILITY METHODS ==========

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Deep clone object
   */
  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects deeply
   */
  merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (typeof target === 'object' && typeof source === 'object') {
      for (const key in source) {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    
    return this.merge(target, ...sources);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXW3Kernel;
}
