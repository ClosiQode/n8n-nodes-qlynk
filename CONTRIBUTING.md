# Contributing to n8n-nodes-qlynk

Thank you for considering contributing to n8n-nodes-qlynk! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your n8n version and Qlynk node version

### Suggesting Features

We welcome feature suggestions! Please open an issue with:

- A clear, descriptive title
- Detailed description of the proposed feature
- Use cases and examples
- Any relevant mockups or diagrams

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/ClosiQode/n8n-nodes-qlynk.git
   cd n8n-nodes-qlynk
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

5. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link any related issues

## Development Guidelines

### Code Style

- Use TypeScript
- Follow the existing code structure
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Use async/await instead of callbacks

### Testing

Before submitting a PR:

```bash
# Build the project
npm run build

# Run linting
npm run lint

# Test locally with n8n
npm link
cd ~/.n8n/custom
npm link n8n-nodes-qlynk
n8n start
```

### Documentation

- Update README.md if you add new features
- Add JSDoc comments to your code
- Update CHANGELOG.md with your changes
- Include examples for new operations

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at contact@qlynk.fr. All complaints will be reviewed and investigated promptly and fairly.

## Questions?

Feel free to:
- Open an issue on GitHub
- Contact us at contact@qlynk.fr
- Check our [documentation](https://qlynk.fr/docs)

Thank you for contributing! 🎉
