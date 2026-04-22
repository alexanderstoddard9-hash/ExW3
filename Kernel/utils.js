/**
 * EXW3 Kernel Utilities
 * Helper functions for mods and kernel
 */

const EXW3Utils = {
  /**
   * Parse .exwl3 layer files
   */
  parseExwl3(content) {
    content = content.replace(/\r/g, '');
    const result = {
      name: '',
      type: 'layer',
      version: '1.0.0',
      description: '',
      author: '',
      priority: 10,
      disabled: false,
      modifies: [],
      dependencies: [],
      modifications: [],
      inits: []
    };

    // Extract metadata
    const nameMatch    = content.match(/@name\s+"([^"]+)"/);
    const versionMatch = content.match(/@version\s+"([^"]+)"/);
    const descMatch    = content.match(/@description\s+"([^"]+)"/);
    const authorMatch  = content.match(/@author\s+"([^"]+)"/);
    const priorityMatch= content.match(/@priority\s+(\d+)/);
    const disabledMatch= content.match(/@disabled/);
    const modifiesMatch= content.match(/@modifies\s+([^\n]+)/);
    const depsMatch    = content.match(/@dependencies\s*\[([^\]]*)\]/);

    if (nameMatch)     result.name        = nameMatch[1];
    if (versionMatch)  result.version     = versionMatch[1];
    if (descMatch)     result.description = descMatch[1];
    if (authorMatch)   result.author      = authorMatch[1];
    if (priorityMatch) result.priority    = parseInt(priorityMatch[1], 10);
    if (disabledMatch) result.disabled    = true;
    if (modifiesMatch) result.modifies    = modifiesMatch[1].trim().split(/\s*,\s*/);
    if (depsMatch && depsMatch[1]) {
      result.dependencies = depsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    }

    // Parse CSS blocks (multiple allowed)
    const cssRegex = /^css\s*\{([\s\S]*?)\n^\}/gm;
    let cssMatch;
    while ((cssMatch = cssRegex.exec(content)) !== null) {
      result.modifications.push({
        type: 'css',
        content: cssMatch[1].trim()
      });
    }

    // Parse HTML blocks — syntax: html [prepend|append] <selector> { ... }
    const htmlRegex = /^html\s+(prepend|append)?\s*([^\s{]+)\s*\{([\s\S]*?)\n^\}/gm;
    let htmlMatch;
    while ((htmlMatch = htmlRegex.exec(content)) !== null) {
      const position = htmlMatch[1] || 'prepend';
      result.modifications.push({
        type: 'html',
        position,
        target: htmlMatch[2],
        content: htmlMatch[3].trim()
      });
    }

    // Parse remove blocks
    const removeRegex = /^remove\s+([^\s{;\n]+)\s*(?:\{[^}]*\}|;)/gm;
    let removeMatch;
    while ((removeMatch = removeRegex.exec(content)) !== null) {
      result.modifications.push({
        type: 'remove',
        target: removeMatch[1].trim()
      });
    }

    // Parse init blocks (multiple allowed)
    const initRegex = /^init\s*\{([\s\S]*?)\n^\}/gm;
    let initMatch;
    while ((initMatch = initRegex.exec(content)) !== null) {
      result.inits.push(initMatch[1].trim());
    }

    // Back-compat: expose first init as result.init
    result.init = result.inits[0] || null;

    return result;
  },

  /**
   * Parse .exws3 section files
   */
  parseExws3(content) {
    content = content.replace(/\r/g, '');
    const result = {
      name: '',
      type: 'section',
      version: '1.0.0',
      description: '',
      dependencies: [],
      html: '',
      css: '',
      javascript: '',
      init: null,
      render: null
    };

    // Extract metadata
    const nameMatch = content.match(/@name\s+"([^"]+)"/);
    const versionMatch = content.match(/@version\s+"([^"]+)"/);
    const descMatch = content.match(/@description\s+"([^"]+)"/);
    const depsMatch = content.match(/@dependencies\s*\[([^\]]*)\]/);

    if (nameMatch) result.name = nameMatch[1];
    if (versionMatch) result.version = versionMatch[1];
    if (descMatch) result.description = descMatch[1];
    if (depsMatch && depsMatch[1]) {
      result.dependencies = depsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    }

    // Parse HTML block
    const htmlRegex = /^html\s*\{([\s\S]*?)\n^\}/m;
    const htmlMatch = htmlRegex.exec(content);
    if (htmlMatch) {
      result.html = htmlMatch[1].trim();
    }

    // Parse CSS block
    const cssRegex = /^css\s*\{([\s\S]*?)\n^\}/m;
    const cssMatch = cssRegex.exec(content);
    if (cssMatch) {
      result.css = cssMatch[1].trim();
    }

    // Parse JavaScript block
    const jsRegex = /^javascript\s*\{([\s\S]*?)\n^\}/m;
    const jsMatch = jsRegex.exec(content);
    if (jsMatch) {
      result.javascript = jsMatch[1].trim();
    }

    // Parse init block
    const initRegex = /^init\s*\{([\s\S]*?)\n^\}/m;
    const initMatch = initRegex.exec(content);
    if (initMatch) {
      result.init = initMatch[1].trim();
    }

    // Parse render block
    const renderRegex = /^render\s*\{([\s\S]*?)\n^\}/m;
    const renderMatch = renderRegex.exec(content);
    if (renderMatch) {
      result.render = renderMatch[1].trim();
    }

    return result;
  },

  /**
   * Create a layer from .exwl3 definition
   */
  createLayerFromExwl3(exwl3Data, name) {
    return {
      name: exwl3Data.name || name,
      description: exwl3Data.description || '',
      author: exwl3Data.author || '',
      version: exwl3Data.version || '1.0.0',
      priority: exwl3Data.priority ?? 10,
      disabled: exwl3Data.disabled || false,
      modifies: exwl3Data.modifies || [],
      dependencies: exwl3Data.dependencies || [],

      onApply(kernel) {
        if (this.disabled) {
          console.log(`⊘ Layer '${this.name}' is disabled, skipping`);
          return;
        }

        // Execute modifications
        if (exwl3Data.modifications) {
          exwl3Data.modifications.forEach(mod => {
            if (mod.type === 'css') {
              EXW3Utils.injectCSS(mod.content);
            } else if (mod.type === 'html') {
              EXW3Utils.injectHTML(mod.target, mod.content, mod.position);
            } else if (mod.type === 'remove') {
              EXW3Utils.removeElement(mod.target);
            }
          });
        }

        // Execute all init blocks in order
        const inits = exwl3Data.inits && exwl3Data.inits.length
          ? exwl3Data.inits
          : (exwl3Data.init ? [exwl3Data.init] : []);

        for (const initCode of inits) {
          try {
            // Use Function constructor instead of eval to avoid parsing issues with comments
            const fn = new Function('kernel', initCode);
            fn(kernel);
          } catch (error) {
            console.error(`Error in layer '${this.name}' init:`, error);
            const errEl = document.createElement('div');
            errEl.style.cssText = 'background:#fee;border:1px solid #f99;padding:10px;margin:10px;border-radius:4px;font-family:monospace;font-size:13px;color:#900;position:fixed;bottom:10px;right:10px;z-index:9999;max-width:400px;';
            errEl.textContent = '[layer:' + this.name + '] ' + error.message;
            document.body.appendChild(errEl);
          }
        }
      }
    };
  },

  /**
   * Create a section from .exws3 definition
   */
  createSectionFromExws3(exws3Data, name) {
    return {
      name: exws3Data.name || name,
      description: exws3Data.description || '',
      version: exws3Data.version || '1.0.0',
      dependencies: exws3Data.dependencies || [],

      async init(kernel) {
        // CSS is injected during render to avoid id conflicts with section container
      },

      async render(container, kernel) {
        // Set HTML first so DOM elements exist before scripts run
        if (exws3Data.render) {
          try {
            // Use Function constructor instead of eval to avoid parsing issues with comments
            const fn = new Function('container', 'kernel', exws3Data.render);
            fn(container, kernel);
          } catch (error) {
            console.error('Error rendering section ' + this.name + ':', error);
          }
        } else if (exws3Data.html) {
          container.innerHTML = exws3Data.html;
        }

        // Inject CSS into head (done here so it's scoped to render lifecycle)
        if (exws3Data.css) {
          const existingStyle = document.getElementById(`style-section-${this.name}`);
          if (!existingStyle) {
            EXW3Utils.injectCSS(exws3Data.css, `style-section-${this.name}`);
          }
        }

        // Run javascript + init together in one scope so they share variables
        const jsCode = (exws3Data.javascript || '') + '\n' + (exws3Data.init || '');
        if (jsCode.trim()) {
          try {
            // Use Function constructor instead of eval to avoid parsing issues with comments
            const fn = new Function('kernel', jsCode);
            fn(kernel);
          } catch (error) {
            console.error('Error in section ' + this.name + ' script:', error);
            const errEl = document.createElement('div');
            errEl.style.cssText = 'background:#fee;border:1px solid #f99;padding:10px;margin:10px;border-radius:4px;font-family:monospace;font-size:13px;color:#900;';
            errEl.textContent = '[' + this.name + '] ' + error.message;
            container.appendChild(errEl);
          }
        }
      }
    };
  },

  /**
   * Load an .exwl3 or .exws3 file from URL or path
   */
  async loadModFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const content = await response.text();
      
      if (url.endsWith('.exwl3')) {
        return this.parseExwl3(content);
      } else if (url.endsWith('.exws3')) {
        return this.parseExws3(content);
      } else {
        throw new Error('Unsupported file format. Use .exwl3 or .exws3');
      }
    } catch (error) {
      console.error(`Failed to load mod file from ${url}:`, error);
      return null;
    }
  },

  /**
   * Load an .exwl3 file specifically
   */
  async loadExwl3File(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const content = await response.text();
      return this.parseExwl3(content);
    } catch (error) {
      console.error(`Failed to load .exwl3 file from ${url}:`, error);
      return null;
    }
  },

  /**
   * Load an .exws3 file specifically
   */
  async loadExws3File(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const content = await response.text();
      return this.parseExws3(content);
    } catch (error) {
      console.error(`Failed to load .exws3 file from ${url}:`, error);
      return null;
    }
  },

  /**
   * Inject CSS into the page
   */
  injectCSS(cssContent, id = '') {
    const style = document.createElement('style');
    if (id) style.id = id;
    style.textContent = cssContent;
    document.head.appendChild(style);
  },

  /**
   * Inject HTML into a target element
   * position: 'prepend' (default) | 'append'
   */
  injectHTML(target, htmlContent, position = 'prepend') {
    const el = document.querySelector(target);
    if (el) {
      el.insertAdjacentHTML(position === 'append' ? 'beforeend' : 'afterbegin', htmlContent);
    } else {
      console.warn(`injectHTML: target '${target}' not found`);
    }
  },

  /**
   * Remove elements matching a selector
   */
  removeElement(selector) {
    document.querySelectorAll(selector).forEach(el => el.remove());
  },

  /**
   * Get DOM element safely
   */
  getElement(selector) {
    return document.querySelector(selector);
  },

  /**
   * Event emitter helper for sections
   */
  createEventBus() {
    const listeners = {};
    return {
      on(event, handler) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(handler);
      },
      off(event, handler) {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(h => h !== handler);
        }
      },
      emit(event, data) {
        if (listeners[event]) {
          listeners[event].forEach(handler => handler(data));
        }
      }
    };
  },

  /**
   * Validate .exwl3 or .exws3 structure
   */
  validateMod(data) {
    const errors = [];
    
    if (!data.name) errors.push('Missing required field: name');
    if (!data.type) errors.push('Missing required field: type (layer or section)');
    if (data.type && !['layer', 'section'].includes(data.type)) {
      errors.push(`Invalid type: ${data.type} (must be 'layer' or 'section')`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate .exwl3 structure (legacy)
   */
  validateExwl3(data) {
    return this.validateMod(data);
  },

  /**
   * Validate .exws3 structure (legacy)
   */
  validateExws3(data) {
    return this.validateMod(data);
  },

  /**
   * Validate .exw3 structure (legacy - for backward compatibility)
   */
  validateExw3(data) {
    return this.validateMod(data);
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXW3Utils;
}
