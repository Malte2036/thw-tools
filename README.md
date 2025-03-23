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
pnpm build:backend
pnpm build:thw-tools
pnpm build:inventar
```

### Common Commands

```bash
pnpm lint           # Run linting
pnpm test          # Run tests
pnpm format        # Format code
pnpm clean         # Clean build artifacts and node_modules
```

## Working with Dependencies

```bash
# Add a dependency to a specific workspace
pnpm --filter <workspace-name> add <package-name>

# Add a development dependency
pnpm --filter <workspace-name> add -D <package-name>

# Add a dependency to all workspaces
pnpm add -w <package-name>
```

### Using Shared Components

Import components from the shared component library using:

```typescript
import { Button } from '@web-components/Button';
```

## Workspace Management

This monorepo uses PNPM Workspaces and Turborepo for efficient dependency management and build optimization.
