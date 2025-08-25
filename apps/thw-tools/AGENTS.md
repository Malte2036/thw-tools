# THW-Tools AGENTS.md

This document provides detailed information about the `thw-tools` frontend application for AI agents.

## Overview

`thw-tools` is a [SvelteKit](https://kit.svelte.dev/) application written in TypeScript. It serves as the main portal for a variety of tools designed for THW (Technisches Hilfswerk) members.

## Features

- **Clothing Calculator**: Helps determine the correct clothing sizes based on measurements.
- **CBRN Protective Suit Information**: Provides data and information about CBRN (Chemical, Biological, Radiological, Nuclear) protective suits.
- **Quizzes**: A collection of quizzes on various THW-related topics to help with training and knowledge retention.
- **Radio Call Signs**: A tool for managing and looking up radio call signs.

## Key Technologies

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shared components from `@thw-tools/svelte-components` and `@thw-tools/web-components`.

## Project Structure

The source code is located in the `src` directory.

- **`src/routes`**: Contains the application's pages and API routes, following SvelteKit's file-based routing system. Each tool is typically implemented as a separate route.
- **`src/lib`**: Contains reusable components, utility functions, API clients, and data models.
  - **`src/lib/api`**: Contains functions for interacting with the backend API.
  - **`src/lib/clothing`**: Logic and components for the clothing calculator.
  - **`src/lib/cbrn`**: Logic and components for the CBRN suit information tool.
  - **`src/lib/quiz`**: Logic, components, and data for the quiz features.

## Interaction with Backend

This application communicates with the `apps/backend` application to fetch data for quizzes, manage user data, and store quiz statistics. The API client in `src/lib/api` handles these interactions.

## Running the Application

- **Development**: `pnpm dev:thw-tools` from the root of the monorepo.
- **Production Build**: `pnpm build:thw-tools` from the root of the monorepo.

## Testing

- Run tests with `vitest` by running `pnpm test` inside the `apps/thw-tools` directory.

## Code Style

This application uses Prettier for formatting and ESLint for linting, configured at the root of the monorepo. Run `pnpm format` and `pnpm lint` from the root to check and fix code style.
