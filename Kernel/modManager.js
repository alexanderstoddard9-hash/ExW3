/**
 * EXW3 Mod Manager
 * Handles loading and managing layers and sections from .exw3 files
 */

class EXW3ModManager {
  constructor(kernel) {
    this.kernel = kernel;
    this.loadedMods = new Map();
    this.baseDir = 'Mods';
  }

  /**
   * Load all mods from configuration
   */
  async loadAllMods(config) {
    console.log('Starting mod load...');

    // Load layers
    if (config.layers && Array.isArray(config.layers)) {
      for (const layerConfig of config.layers) {
        await this.loadLayer(layerConfig);
      }
    }

    // Load sections
    if (config.sections && Array.isArray(config.sections)) {
      for (const sectionConfig of config.sections) {
        await this.loadSection(sectionConfig);
      }
    }

    console.log('✓ All mods loaded');
  }

  /**
   * Load a single layer from .exwl3 file
   */
  async loadLayer(layerConfig) {
    let layerName, layerPath;

    if (typeof layerConfig === 'string') {
      layerName = layerConfig;
      layerPath = `${this.baseDir}/Layers/${layerName}.exwl3`;
    } else {
      layerName = layerConfig.name;
      layerPath = layerConfig.path || `${this.baseDir}/Layers/${layerName}.exwl3`;
    }

    try {
      const exwl3Data = await EXW3Utils.loadExwl3File(layerPath);
      if (!exwl3Data) throw new Error('Failed to parse file');

      const validation = EXW3Utils.validateMod({
        name: exwl3Data.name,
        type: exwl3Data.type
      });

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const layerModule = EXW3Utils.createLayerFromExwl3(exwl3Data, layerName);
      this.kernel.registerLayer(layerName, layerModule);
      this.loadedMods.set(`layer:${layerName}`, exwl3Data);

      return true;
    } catch (error) {
      console.error(`Failed to load layer '${layerName}':`, error);
      return false;
    }
  }

  /**
   * Load a single section from .exws3 file
   */
  async loadSection(sectionConfig) {
    let sectionName, sectionPath;

    if (typeof sectionConfig === 'string') {
      sectionName = sectionConfig;
      sectionPath = `${this.baseDir}/Sections/${sectionName}.exws3`;
    } else {
      sectionName = sectionConfig.name;
      sectionPath = sectionConfig.path || `${this.baseDir}/Sections/${sectionName}.exws3`;
    }

    try {
      const exws3Data = await EXW3Utils.loadExws3File(sectionPath);
      if (!exws3Data) throw new Error('Failed to parse file');

      const validation = EXW3Utils.validateMod({
        name: exws3Data.name,
        type: exws3Data.type
      });

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const sectionModule = EXW3Utils.createSectionFromExws3(exws3Data, sectionName);
      this.kernel.registerSection(sectionName, sectionModule);
      this.loadedMods.set(`section:${sectionName}`, exws3Data);

      return true;
    } catch (error) {
      console.error(`Failed to load section '${sectionName}':`, error);
      return false;
    }
  }

  /**
   * Hot-reload a mod (reload from file)
   */
  async reloadMod(modId) {
    const [type, name] = modId.split(':');
    if (type === 'layer') {
      return await this.loadLayer(name);
    } else if (type === 'section') {
      return await this.loadSection(name);
    }
    return false;
  }

  /**
   * List all loaded mods
   */
  listLoadedMods() {
    return Array.from(this.loadedMods.keys());
  }

  /**
   * Get info about a loaded mod
   */
  getModInfo(modId) {
    return this.loadedMods.get(modId) || null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXW3ModManager;
}
