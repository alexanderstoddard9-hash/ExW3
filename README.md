# EXW3 - Modular Web Framework

A powerful, modular web framework with automatic mod discovery and a protected kernel system.

## 🚀 Quick Start

### For Users

1. **Download** the distribution from the `dist/` folder
2. **Run** the launcher:
   - **Windows**: Double-click `launch.bat`
   - **Mac/Linux**: Run `./launch.sh` or `python3 launch.py`
3. **Customize** by adding `.ex3` mods to the `mods/` folder

That's it! No configuration needed - mods are discovered automatically.

### For Developers

See the [Documentation](Docs/) folder for complete guides on:
- Creating custom mods
- Understanding the .ex3 format
- Using advanced features
- Building custom distributions

## 📦 What's Included

The distribution (`dist/` folder) contains:

```
dist/
├── exw3.xkernel         # Everything in one file (PROTECTED)
├── launch.py            # Python launcher
├── launch.bat           # Windows launcher
├── launch.sh            # Mac/Linux launcher
├── mod-config.json      # Configuration (auto-discovery enabled)
├── mods/                # Your mods go here
│   ├── *.ex3            # Example mods included
│   └── admin/           # Admin-only mods
├── KERNEL-LICENSE.txt   # License terms
└── README.md            # User guide
```

## ✨ Key Features

- **🔍 Auto-Discovery**: Drop `.ex3` files in the mods folder - they load automatically
- **🔒 Protected Kernel**: Single `.xkernel` file that users cannot modify
- **🎨 Modular Design**: Create layers (styling) or sections (components)
- **⚡ Zero Config**: Works out of the box with sensible defaults
- **🌐 Cross-Platform**: Python launcher works on Windows, Mac, and Linux
- **📝 Easy Customization**: All customization through simple `.ex3` mod files

## 📚 Documentation

Complete documentation is available in the [Docs/](Docs/) folder:

- **[Getting Started](Docs/GETTING_STARTED.md)** - Create your first mod
- **[EX3 Format](Docs/EX3_FORMAT.md)** - Mod file format specification
- **[XKernel Format](Docs/XKERNEL_FORMAT.md)** - Understanding the kernel file
- **[Auto-Discovery](Docs/AUTO_DISCOVERY.md)** - How automatic mod loading works
- **[Advanced Features](Docs/ADVANCED_FEATURES.md)** - Middleware, plugins, animations
- **[Kernel API](Docs/KERNEL_API.md)** - Complete API reference

## 🎯 Creating Mods

Create a file `my-mod.ex3` in the `mods/` folder:

```
@name "my-mod"
@description "My awesome feature"
@type both

css {
  .my-feature {
    color: #007bff;
    padding: 20px;
  }
}

html {
  <div class="my-feature">
    <h2>Hello from my mod!</h2>
  </div>
}

script {
  console.log('My mod loaded!');
}
```

Reload the page - your mod loads automatically! No configuration needed.

## 🔧 Configuration

The `mod-config.json` file uses auto-discovery by default:

```json
{
  "name": "My EXW3 Site",
  "version": "1.0.0",
  "mods": ["*"]
}
```

The `"*"` means "load all mods automatically". You can also list specific mods:

```json
{
  "mods": ["dashboard", "about", "my-mod"]
}
```

## 🛡️ License

The EXW3 kernel is protected by license. See [KERNEL-LICENSE.txt](KERNEL-LICENSE.txt) for terms.

**You MAY:**
- ✅ Use the kernel in your projects
- ✅ Create and distribute mods
- ✅ Configure via mod-config.json
- ✅ Create custom launchers

**You MAY NOT:**
- ❌ Edit or modify the kernel file
- ❌ Reverse engineer the kernel
- ❌ Redistribute modified versions

All customization must be done through the mod system.

## 🌟 Example Mods

The distribution includes example mods:
- **dashboard** - Main dashboard section
- **about** - About page
- **calc** - Calculator widget
- **clock** - Live clock
- **dark-mode** - Dark theme toggle
- **settings** - Settings panel
- And more!

Check the `mods/` folder for examples.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📞 Support

- **Documentation**: [Docs/](Docs/)
- **Issues**: GitHub Issues
- **License**: [KERNEL-LICENSE.txt](KERNEL-LICENSE.txt)

## 🎉 What Makes EXW3 Special?

1. **Zero Configuration**: Auto-discovery means no manual mod lists
2. **Protected Kernel**: Users can't break the core system
3. **Simple Mods**: Easy `.ex3` format anyone can learn
4. **Instant Updates**: Drop a file, reload the page
5. **Cross-Platform**: Works everywhere Python runs
6. **Production Ready**: Single file deployment

---

**Ready to get started?** Head to the `dist/` folder and run the launcher!

For developers: Check out the [Documentation](Docs/) to learn how to create powerful mods.
