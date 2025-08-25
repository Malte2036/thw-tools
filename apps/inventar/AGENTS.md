# Inventar AGENTS.md

This document provides detailed information about the `inventar` frontend application for AI agents.

## Overview

`inventar` is a [SvelteKit](https://kit.svelte.dev/) application written in TypeScript. It provides a user interface for inventory management, allowing users to track items, manage stock levels, and view inventory history.

## Key Technologies

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shared components from `@thw-tools/svelte-components` and `@thw-tools/web-components`.

## Project Structure

The source code is located in the `src` directory.

- **`src/routes`**: Contains the application's pages and API routes. The file-based routing is handled by SvelteKit.
- **`src/lib`**: Contains reusable components, utility functions, and API clients.
  - **`src/lib/api`**: Contains functions for making API calls to the backend.
  - **`src/lib/components`**: Contains application-specific Svelte components.
  - **`src/lib/shared/stores`**: Contains Svelte stores for managing application state.

## Interaction with Backend

This application is a client to the `apps/backend` application. It uses the API client in `src/lib/api` to make REST API calls for all data operations, including fetching inventory, updating items, and managing user sessions.

## Running the Application

- **Development**: `pnpm dev:inventar` from the root of the monorepo.
- **Production Build**: `pnpm build:inventar` from the root of the monorepo.

## Testing

- Run tests with `vitest` by running `pnpm test` inside the `apps/inventar` directory.

## Code Style

This application uses Prettier for formatting and ESLint for linting, configured at the root of the monorepo. Run `pnpm format` and `pnpm lint` from the root to check and fix code style.
