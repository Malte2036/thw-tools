# AGENTS.md

This document provides instructions for AI agents to effectively work with this monorepo.

**Note for Developers:** Please keep this file and the nested `AGENTS.md` files up-to-date. When adding new features or making structural or architectural changes, update the relevant `AGENTS.md` to reflect these changes.

## Project Overview

This is a monorepo for the THW-Tools project, managed with pnpm workspaces and Nx. It contains a backend application, two frontend applications, and several shared packages. For more detailed information about a specific project, please refer to the nested `AGENTS.md` file within its directory.

### Applications

- **`apps/backend`**: A NestJS application that serves as the backend. It uses Prisma for database access. It provides a REST API for the frontend applications.
- **`apps/inventar`**: A SvelteKit frontend application for inventory management. It allows users to track items, manage stock, and view inventory history. It interacts with the backend to fetch and store data.
- **`apps/thw-tools`**: A SvelteKit frontend application that provides a collection of tools for THW members. This includes tools for clothing management, CBRN protective suit information, and various quizzes. It interacts with the backend for data and user management.

### Packages

- **`packages/shared`**: A TypeScript package containing shared code used by other applications and packages. This includes utility functions, type definitions, and constants.
- **`packages/svelte-components`**: A package containing Svelte components that are shared between the `inventar` and `thw-tools` frontend applications.
- **`packages/web-components`**: A package for web components built with Lit. These components are used in the SvelteKit applications.

### Interactions

The `inventar` and `thw-tools` frontend applications are clients of the `backend` application. They make API calls to the backend to fetch and store data. The `svelte-components` and `web-components` packages are used by the frontend applications to provide a consistent user interface. The `shared` package provides common functionality to all other packages and applications.

## Build and Test Commands

### Building the entire project

To build all applications and packages, run the following command from the root of the repository:

```bash
pnpm build
```

### Building a specific application

To build a specific application, use the `nx build` command followed by the application name:

```bash
# Build the backend
pnpm build:backend

# Build the inventar app
pnpm build:inventar

# Build the thw-tools app
pnpm build:thw-tools
```

### Running tests

To run tests for all applications and packages, run the following command from the root of the repository:

```bash
pnpm test
```

To run tests for a specific application, you can use the `nx test` command, but it's recommended to `cd` into the application's directory and run the test command from there.

- **backend**: `cd apps/backend && pnpm test`
- **inventar**: `cd apps/inventar && pnpm test`
- **thw-tools**: `cd apps/thw-tools && pnpm test`

## Development

To start all applications in development mode, run the following command from the root of the repository:

```bash
pnpm dev
```

To start a specific application in development mode, you can use the following commands:

- **backend**: `pnpm dev:backend`
- **inventar**: `pnpm dev:inventar`
- **thw-tools**: `pnpm dev:thw-tools`

## Code Style and Linting

This project uses Prettier for code formatting and ESLint for linting.

- To format all files, run: `pnpm format`
- To lint all files, run: `pnpm lint`

## Database

The backend application uses Prisma for database access. The Prisma schema is located at `apps/backend/prisma/schema.prisma`.

### Database Migrations

To create a new database migration, run the following command from the root of the repository:

```bash
pnpm prisma:migrate:dev
```

### Prisma Studio

To open Prisma Studio, run the following command from the root of the repository:

```bash
pnpm prisma:studio
```
