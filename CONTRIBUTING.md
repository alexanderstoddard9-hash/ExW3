# Contributing to EXW3

Thank you for your interest in contributing to EXW3! This document provides guidelines for contributing to the project.

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Create example mods
- 🔧 Fix issues
- ✨ Add new kernel features

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/exw3.git
   cd exw3
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-new-feature
   ```
4. **Make your changes** and test them
5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```
7. **Create a Pull Request** on GitHub

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: new feature or file`
- `Fix: bug description`
- `Update: changes to existing feature`
- `Docs: documentation changes`
- `Refactor: code restructuring`
- `Style: formatting changes`

Examples:
```
Add: notification system with toast messages
Fix: router not updating on hash change
Update: kernel API with new storage methods
Docs: add examples to KERNEL_API.md
```

## Code Style

### JavaScript
- Use 2 spaces for indentation
- Use semicolons
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Add comments for complex logic

### .exwl3 and .exws3 Files
- Use descriptive `@name` values
- Include `@description` for all mods
- Use semantic versioning for `@version`
- Keep blocks organized and readable
- Add comments in init blocks

### CSS
- Use 2 spaces for indentation
- Use kebab-case for class names
- Prefix custom classes with `exw3-`
- Group related properties

## Creating Example Mods

When creating example mods:

1. **Place in appropriate directory**:
   - Layers: `Mods/Layers/`
   - Sections: `Mods/Sections/`

2. **Include complete metadata**:
   ```
   @name "example-mod"
   @version "1.0.0"
   @description "Clear description of what it does"
   @author "Your Name"
   ```

3. **Add comments** explaining complex logic

4. **Test thoroughly** before submitting

5. **Update documentation** if needed

## Testing

Before submitting a pull request:

1. **Test your changes**:
   - Start the server: `npm start`
   - Open in browser: `http://localhost:3000`
   - Test in multiple browsers if possible

2. **Check for errors**:
   - Open browser console (F12)
   - Look for JavaScript errors
   - Verify functionality works as expected

3. **Test edge cases**:
   - Empty inputs
   - Invalid data
   - Missing elements

## Documentation

When adding features:

1. **Update relevant docs**:
   - `Docs/KERNEL_API.md` for kernel changes
   - `Docs/EXW3_FORMAT.md` for language changes
   - `README.md` for major features

2. **Include examples** in documentation

3. **Keep docs up to date** with code changes

## Pull Request Process

1. **Ensure your code works** and doesn't break existing functionality

2. **Update documentation** if you've added/changed features

3. **Write a clear PR description**:
   - What does this PR do?
   - Why is this change needed?
   - How has it been tested?

4. **Link related issues** if applicable

5. **Be responsive** to feedback and questions

## Reporting Bugs

When reporting bugs, include:

1. **Clear title** describing the issue

2. **Steps to reproduce**:
   ```
   1. Go to '...'
   2. Click on '...'
   3. See error
   ```

3. **Expected behavior**: What should happen

4. **Actual behavior**: What actually happens

5. **Environment**:
   - Browser and version
   - Operating system
   - EXW3 version

6. **Screenshots** if applicable

7. **Console errors** (F12 → Console tab)

## Suggesting Features

When suggesting features:

1. **Check existing issues** to avoid duplicates

2. **Describe the feature** clearly

3. **Explain the use case**: Why is this needed?

4. **Provide examples** if possible

5. **Consider alternatives**: Are there other ways to achieve this?

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

## Questions?

- Open an issue for questions
- Check existing documentation first
- Be specific about what you need help with

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EXW3! 🎉
