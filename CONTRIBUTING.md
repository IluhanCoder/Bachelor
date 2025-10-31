# 🤝 Contributing to Backlogger

Thank you for your interest in contributing to Backlogger! This document provides guidelines for contributing to the project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards
- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ❌ Using sexualized language or imagery
- ❌ Trolling, insulting/derogatory comments
- ❌ Public or private harassment

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/Bachelor.git
   cd Bachelor
   ```

2. **Set up development environment**
   ```bash
   # Install dependencies
   cd client && npm install
   cd ../server && npm install
   
   # Create .env file in server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

## 💻 Development Workflow

### Running the Application

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Ensure code follows style guidelines
4. Commit with clear, descriptive messages
5. Push to your fork
6. Create a Pull Request

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

```typescript
// ✅ Good - Use clear, descriptive names
const calculateTotalStoryPoints = (tasks: TaskResponse[]): number => {
  return tasks.reduce((sum, task) => sum + getStoryPoints(task.difficulty), 0);
}

// ❌ Bad - Unclear abbreviations
const calcSP = (t: any): number => {
  return t.reduce((s, x) => s + gSP(x.diff), 0);
}
```

**Rules:**
- Use TypeScript for all new files
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Add types to all function parameters and returns
- Use meaningful variable names (no `x`, `temp`, `data` without context)
- Extract magic numbers to named constants

### React Components

```tsx
// ✅ Good - Functional component with props interface
interface TaskCardProps {
  task: TaskResponse;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  // Component logic
  return (
    <div className="task-card">
      {/* JSX */}
    </div>
  );
}

export default TaskCard;
```

**Rules:**
- Use functional components with hooks
- Define props interface above component
- Extract complex logic to custom hooks
- Keep components under 200 lines (extract if larger)
- One component per file (except small helper components)

### File Naming

```
✅ Good:
task-service.ts
TaskCard.tsx
quick-stats-cards.tsx
useProjectData.ts

❌ Bad:
TaskService.ts
taskcard.tsx
QuickStatsCards.tsx
projectData.ts
```

**Rules:**
- React components: PascalCase.tsx
- Services/utilities: kebab-case.ts
- Hooks: camelCase starting with 'use'
- Constants: UPPER_SNAKE_CASE

### Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Calculate velocity using last 10 sprints to avoid skewing from early project phases
const recentSprints = allSprints.slice(-10);

// ✅ Good - Document complex business logic
/**
 * Three-tier permission check:
 * 1. Project owner has full access
 * 2. Participant with specific right
 * 3. Task creator (if they have create right)
 */
async canUserEditTask(taskId: string, userId: string) { ... }

// ❌ Bad - Stating the obvious
// Loop through tasks
tasks.forEach(task => { ... })
```

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(analytics): add velocity chart component

- Created VelocityChart component with Recharts
- Added Story Points calculation per sprint
- Implemented last 10 sprints filtering

Closes #42

---

fix(auth): prevent token expiration during active session

Modified JWT refresh logic to extend token when user is active.
Previously tokens would expire even during active use.

Fixes #38

---

docs(readme): update installation instructions

Added environment variables section and MongoDB setup guide.

---

refactor(task-service): simplify permission check logic

Extracted common permission validation into reusable helper.
Reduces code duplication across task operations.
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code builds without errors
- [ ] All existing tests pass
- [ ] New features have tests (if applicable)
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] No console.log statements left in code
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. Submit PR against `main` branch
2. Wait for automated checks (if configured)
3. Address review comments
4. Maintainer will merge when approved

## 🐛 Reporting Bugs

### Before Reporting
- Check existing issues to avoid duplicates
- Test with latest version
- Gather error messages and logs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Problem**
Describe the problem this feature would solve

**Proposed Solution**
How you envision this working

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ❓ Questions?

Feel free to:
- Open a discussion on GitHub
- Contact the maintainer: [Your Contact Info]

---

**Thank you for contributing to Backlogger! 🎉**

Your contributions help make this project better for everyone.
