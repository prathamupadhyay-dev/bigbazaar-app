# Architecture Overview

This monorepo manages the complete BigBazaar ecosystem:

## Applications
- **apps/mobile**: Expo React Native mobile application (The primary customer/provider mobile app).
- **apps/web**: Next.js responsive website matching mobile capabilities.
- **apps/admin**: React/Vite administration dashboard for moderation and platform management.
- **apps/api**: Node.js backend providing REST/GraphQL APIs connecting to the database.

## Packages
- **@my-big-bazaar/types**: Shared TypeScript definitions (User, Listing, Booking, Cart).
- **@my-big-bazaar/shared**: Shared business logic, constants, and helpers.
- **@my-big-bazaar/api-client**: API client wrapper to be used across Mobile, Web, and Admin.
- **@my-big-bazaar/design-system**: Cross-platform design tokens and UI primitives.

## Current State
- The frontend (Mobile) uses mock data and local Context state.
- Database (`infrastructure/database`) and Real Backend are not yet fully implemented but the skeleton is ready.
