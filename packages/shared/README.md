# @thw-tools/shared

This package contains shared utilities, types, and code that can be used across all frontend projects in the THW Tools monorepo.

## Installation

Since this is a workspace package, you can add it to your project's dependencies in `package.json`:

```json
{
  "dependencies": {
    "@thw-tools/shared": "workspace:*"
  }
}
```

## Usage

Import the utilities and types you need:

```typescript
import { formatDate, type User, UserRole } from '@thw-tools/shared';

// Use types
const user: User = {
  id: '1',
  name: 'John Doe',
};

// Use utilities
const formattedDate = formatDate(new Date());

// Use enums
const role = UserRole.USER;
```

## Package Structure

- `src/` - Source code
  - `index.ts` - Main entry point and exports
- `dist/` - Compiled JavaScript and type definitions

## Development

- `npm run build` - Build the package
- `npm run dev` - Watch mode during development
- `npm run lint` - Lint the source code
- `npm run clean` - Clean build artifacts
