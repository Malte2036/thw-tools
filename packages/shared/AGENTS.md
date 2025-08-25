# Shared Package AGENTS.md

This document provides detailed information about the `@thw-tools/shared` package for AI agents.

## Overview

This package contains shared TypeScript code, including utility functions, data models, and constants, that are used across multiple applications and packages within the monorepo.

## Key Features

- **Utilities**: Common utility functions for tasks such as date formatting (`date.ts`), color manipulation (`color.ts`), and array operations (`array.ts`).
- **Analytics**: Shared analytics functions (`analytics.ts`).
- **Randomization**: Utility for random operations (`random.ts`).

## Project Structure

The source code is located in the `src` directory. Each file typically contains a set of related functions or constants.

- **`src/index.ts`**: The main entry point of the package, which exports all the shared modules.

## Usage

This package is intended to be used by other projects in the monorepo. It is imported as `@thw-tools/shared`.

## Building

- To build the package, run `pnpm build` from within the `packages/shared` directory. This will compile the TypeScript code to JavaScript in the `dist` directory.

## Testing and Linting

- This package is linted as part of the monorepo's linting process (`pnpm lint` from the root). It does not currently have its own test suite.
