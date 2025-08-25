# Web Components AGENTS.md

This document provides detailed information about the `@thw-tools/web-components` package for AI agents.

## Overview

This package contains a set of framework-agnostic web components built with [Lit](https://lit.dev/). These components are used as the foundation for some of the Svelte components in the `@thw-tools/svelte-components` package and can be used in any of the frontend applications.

## Key Technologies

- **Library**: Lit
- **Language**: TypeScript

## Key Components

- **`thw-button`**: A custom button element.
- **`thw-dialog`**: A custom dialog element.
- **`thw-loading-spinner`**: A custom loading spinner.
- **`thw-table`**: A custom table element.
- **`thw-tabs`**: A custom tabs element.

## Project Structure

The source code is located in the `src` directory.

- **`src/index.ts`**: The main entry point that exports all the web components.
- Each component is defined in its own TypeScript file (e.g., `src/thw-button.ts`).

## Usage

These web components can be used in any HTML or JavaScript-based project. In the SvelteKit applications, they are typically wrapped by Svelte components.

## Building

- To build the web components, run `pnpm build` from within the `packages/web-components` directory. This will compile the TypeScript code and bundle it into the `dist` directory.

## Testing

- Run tests with `vitest` by running `pnpm test` from within the `packages/web-components` directory.
