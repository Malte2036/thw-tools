# THW Tools Monorepo

This monorepo contains all THW Tools applications and shared packages.

## Structure

```
/thw-tools-monorepo
├── apps
│   ├── backend          # NestJS backend (thw-tools-backend)
│   ├── thw-tools        # SvelteKit main frontend (thw-tools)
│   └── inventar         # SvelteKit second frontend (thw-inventar)
└── packages
    └── web-components   # Shared component library
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [PNPM](https://pnpm.io/) (v7 or later)

### Installation

```bash
# Install dependencies for all workspaces
pnpm install
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start individual applications
pnpm dev:backend     # Runs NestJS backend with --watch
pnpm dev:thw-tools   # Runs SvelteKit thw-tools frontend
pnpm dev:inventar    # Runs SvelteKit inventar frontend
```

### Building

```bash
# Build all applications
pnpm build

# Build specific applications
pnpm build:backend     # Build thw-tools-backend
pnpm build:thw-tools   # Build thw-tools
pnpm build:inventar    # Build thw-inventar
```

### Other Commands

```bash
# Run linting across all workspaces
pnpm lint

# Run tests across all workspaces
pnpm test

# Format code using Prettier
pnpm format

# Clean all build artifacts and node_modules
pnpm clean
```

## Working with the Monorepo

### Adding Dependencies

```bash
# Add a dependency to a specific workspace
pnpm --filter <workspace-name> add <package-name>

# Examples:
pnpm --filter thw-tools-backend add @nestjs/jwt
pnpm --filter thw-tools add svelte-navigator
pnpm --filter thw-inventar add dexie

# Add a development dependency to a specific workspace
pnpm --filter <workspace-name> add -D <package-name>

# Add a dependency to all workspaces
pnpm add -w <package-name>
```

### Using Shared Packages

The component library in `packages/web-components` can be used in any of the frontend applications. Import components using the path alias:

```typescript
import { Button } from '@web-components/Button';
```

## Workspace Management

This monorepo uses PNPM Workspaces and Turborepo for efficient dependency management and build optimization.

## License

[MIT](LICENSE)
