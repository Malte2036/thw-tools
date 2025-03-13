# 🚀 Using Nx in THW Tools Monorepo

This document provides guidance on how to use Nx in our monorepo to improve development workflow and build performance.

## What is Nx?

Nx is a smart, extensible build framework that helps you architect, test, and build at any scale. It provides tools for monorepo management with features like:

- Intelligent caching of build artifacts
- Dependency graph visualization
- Affected commands that only run tasks for projects affected by changes
- Parallel task execution
- Code generation tools

## Getting Started

Nx has been integrated into our monorepo alongside our existing pnpm workspace setup. The main scripts in `package.json` have been updated to use Nx instead of Turborepo.

### Key Commands

```bash
# Build all projects
pnpm build

# Build a specific project
pnpm build:thw-tools
pnpm build:backend
pnpm build:inventar

# Run tests across all projects
pnpm test

# Run linting across all projects
pnpm lint

# Visualize the project dependency graph
pnpm graph
```

## Advanced Nx Usage

### Running Tasks Only on Affected Projects

One of the most powerful features of Nx is the ability to run tasks only on projects affected by your changes:

```bash
# Run build only on affected projects
pnpm exec nx affected -t build

# Run tests only on affected projects
pnpm exec nx affected -t test

# See which projects would be affected by your changes
pnpm exec nx graph --affected
```

### Caching

Nx automatically caches task results. If you run a task that has been run before with the same inputs, Nx will use the cached result instead of running the task again:

```bash
# Clear the Nx cache
pnpm exec nx reset

# Run a task with verbose output to see caching in action
pnpm exec nx build thw-tools --verbose
```

### Running Tasks in Parallel

Nx automatically runs tasks in parallel when possible:

```bash
# Run multiple tasks in parallel
pnpm exec nx run-many -t build,test,lint
```

### Project-specific Commands

You can run any npm script defined in a project's package.json using Nx:

```bash
# Run a specific command for a project
pnpm exec nx run thw-tools:dev
pnpm exec nx run thw-tools-backend:start:dev
```

## CI/CD Integration

Nx provides powerful features for optimizing your CI/CD pipelines:

### GitHub Actions Integration

Create or update your GitHub Actions workflow file (`.github/workflows/ci.yml`):

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v2
        with:
          version: 9.7.0
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      # Run lint on affected projects
      - run: pnpm exec nx affected -t lint --parallel=3

      # Run tests on affected projects
      - run: pnpm exec nx affected -t test --parallel=3

      # Build affected projects
      - run: pnpm exec nx affected -t build --parallel=3
```

### Nx Cloud for Remote Caching

For even faster builds, consider setting up Nx Cloud:

1. Run `npx nx connect-to-nx-cloud` to connect your workspace to Nx Cloud
2. Add the following to your CI configuration:

```yaml
# Additional step for GitHub Actions
- name: Set up Nx Cloud
  run: pnpm exec nx-cloud start-ci-run
```

### Distributed Task Execution

For large monorepos, you can distribute task execution across multiple CI agents:

```yaml
# Example for GitHub Actions
jobs:
  agents:
    runs-on: ubuntu-latest
    name: Agent ${{ matrix.agent }}
    strategy:
      matrix:
        agent: [1, 2, 3]
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 9.7.0
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Start Nx Agent ${{ matrix.agent }}
        run: pnpm exec nx-cloud start-ci-run --agent --agent-number=${{ matrix.agent }}

  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 9.7.0
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Start Nx Coordination
        run: pnpm exec nx-cloud start-ci-run
      - run: pnpm exec nx affected -t lint,test,build --parallel=3
```

## Project Structure

Our monorepo is organized as follows:

- `apps/` - Contains all applications
  - `thw-tools/` - THW Tools web application
  - `inventar/` - Inventory management application
  - `backend/` - Backend API server
- `packages/` - Contains shared libraries
  - `web-components/` - Shared web components
  - `svelte-components/` - Shared Svelte components

## Further Reading

- [Nx Documentation](https://nx.dev/getting-started/intro)
- [Nx Affected Commands](https://nx.dev/concepts/affected)
- [Nx Caching](https://nx.dev/concepts/how-caching-works)
