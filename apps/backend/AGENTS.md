# Backend AGENTS.md

This document provides detailed information about the backend application for AI agents.

## Overview

The backend is a [NestJS](https://nestjs.com/) application written in TypeScript. It serves as the central API for all frontend applications in the THW-Tools monorepo.

## Key Technologies

- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT with `jose` library
- **API Documentation**: Swagger

## Project Structure

The source code is located in the `src` directory and is organized into modules, each representing a different domain of the application.

- **`src/main.ts`**: The application entry point.
- **`src/app.module.ts`**: The root module of the application.
- **`src/prisma`**: Contains the Prisma client and service.
- **`src/auth`**: Handles user authentication and authorization.
- **`src/user`**: Manages user-related operations.
- **`src/organisation`**: Manages organizations and user memberships.
- **`src/inventory`**: Handles inventory management logic.
- **`src/vehicles`**: Manages vehicle and vehicle rental data.
- **`src/quiz-stats`**: Manages statistics for the quiz features.
- **`src/ai`**: Contains AI-related features.
- **`src/email`**: Handles sending emails.
- **`src/funk`**: Related to radio communication features.

## Database

The application uses a PostgreSQL database managed by Prisma. The schema is defined in `prisma/schema.prisma`.

- To generate the Prisma client, run `pnpm prisma:generate` from the root of the monorepo.
- To create a new migration, run `pnpm prisma:migrate:dev` from the root of the monorepo.
- To view the database, run `pnpm prisma:studio` from the root of the monorepo.

## Running the Application

- **Development**: `pnpm dev:backend`
- **Production**: `pnpm build:backend` followed by `pnpm start:prod` inside `apps/backend`.

## Testing

- Run unit tests with `pnpm test` inside `apps/backend`.
- Run end-to-end tests with `pnpm test:e2e` inside `apps/backend`.

## API

The API is documented using Swagger. When the application is running in development mode, the Swagger UI is available at `http://localhost:3000/api`.
