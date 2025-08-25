# Svelte Components AGENTS.md

This document provides detailed information about the `@thw-tools/svelte-components` package for AI agents.

## Overview

This package contains a collection of Svelte components that are shared across the `inventar` and `thw-tools` frontend applications. The goal of this package is to ensure a consistent look and feel and to promote code reuse.

## Key Components

- **`Button.svelte`**: A standard button component.
- **`Dialog.svelte`**: A modal dialog component.
- **`Input.svelte`**: A styled input field.
- **`LoadingSpinner.svelte`**: A component to indicate loading states.
- **`Table.svelte`**: A component for displaying data in a table.
- **`Tabs.svelte`**: A component for creating tabbed navigation.

## Project Structure

The source code is located in the `src` directory.

- **`src/index.ts`**: The main entry point that exports all the components.
- **`src/components`**: This directory contains all the individual Svelte components.

## Dependencies

This package depends on `@thw-tools/shared` for common utilities and `@thw-tools/web-components` for some of its underlying component implementations. It also has a peer dependency on `svelte`.

## Usage

Components from this package can be imported directly into Svelte files in other projects within the monorepo.

```svelte
<script>
  import { Button } from '@thw-tools/svelte-components';
</script>

<Button on:click={() => alert('Clicked!')}>Click Me</Button>
```

## Building and Testing

This package is not built directly. It is consumed as source code by the SvelteKit applications that use it.

- To type-check the components, run `pnpm check` from within the `packages/svelte-components` directory.
