# BigBazaar Monorepo

Welcome to the BigBazaar platform monorepo. This repository contains the mobile app, web app, admin dashboard, backend API, and all shared packages.

## Structure

- `apps/mobile`: Expo React Native mobile application
- `apps/web`: React/Next.js website
- `apps/admin`: React/Vite admin dashboard
- `apps/api`: Node.js/Express backend API
- `packages/*`: Shared internal packages (`types`, `shared`, `validation`, `config`, etc.)
- `infrastructure/*`: Database schemas, migrations, seed scripts, and Docker configs.

## Installation

This project uses `pnpm` workspaces. 

1. Install dependencies at the root:
```bash
pnpm install
```

## Running the Apps

You can run applications individually from the root using `pnpm --filter`.

### Run Mobile App
```bash
pnpm mobile
```
*(Runs `expo start` inside `apps/mobile`)*

### Run Web App
```bash
pnpm web
```

### Run Admin Dashboard
```bash
pnpm admin
```

### Run Backend API
```bash
pnpm api
```

## Environment Config
Copy `.env.example` to `.env` and fill in the required variables for your local setup.
