# MyBigBazaar Project State & Technical Baseline

**Document Version:** 1.0.0  
**Generated Date:** September 25, 2026  
**Audience:** Autonomous Coding Agents (AGENTS 01–10) & Technical Lead  
**Rule:** Every agent MUST read this document before beginning work to prevent token waste and architectural drift.

---

## 1. Monorepo Architecture Overview

MyBigBazaar is a multi-application monorepo managed with **pnpm workspaces** (`pnpm-workspace.yaml`).

```text
E:\BigBazaar\
├── apps/
│   ├── mobile/            # React Native Expo Mobile App (Buyer, Seller, Customer, Provider)
│   ├── admin/             # Vite + React Admin & Moderation Web Dashboard
│   ├── api/               # Node.js + Express + MongoDB REST API Backend
│   └── web/               # Next.js Public Landing / Marketing Web App (Skeleton)
├── packages/
│   ├── types/             # Shared entities, enums, DTO interfaces (JS/JSDoc)
│   ├── shared/            # Shared constants, helpers, formatting utils
│   └── validation/        # Shared form/schema validation rules
├── infrastructure/        # Database schemas, seed data, Docker/cloud configs (Pending)
├── docs/
│   ├── architecture/      # High-level architecture notes
│   └── agent-plan/        # Master orchestration plan and individual agent briefs
├── pnpm-workspace.yaml    # Workspace definition
└── package.json           # Root scripts and workspace devDependencies
```

---

## 2. Technology Stacks & Runtime Versions

| Workspace / Target | Framework / Engine | Key Dependencies & Versions | State Management / Style | Language |
| :--- | :--- | :--- | :--- | :--- |
| **`apps/mobile`** | React Native 0.86.3<br>Expo ~57.0.24 | `@react-navigation/*` 7.x, `@expo/vector-icons` 15.x, `@react-native-async-storage` 2.2.0, `expo-location` ~57.0.19 | React Context (`AppContext.jsx`), React Native `StyleSheet`, Design Tokens (`colors.js`, `typography.js`, `spacing.js`) | **JavaScript (JSX)** |
| **`apps/admin`** | Vite 8.2.0<br>React 19.2.8 | `react-router-dom` 7.18.2, `oxlint` 1.75.0 | Local `useState`, Component State, Raw CSS (`App.css`), Lazy-loaded routes | **JavaScript (JSX)** |
| **`apps/api`** | Node.js (v18+ with `webcrypto` polyfill)<br>Express 4.18.2 | `mongoose` 9.10.1, `jsonwebtoken` 9.0.3, `bcryptjs` 3.0.3, `cors` 2.8.5, `dotenv` 16.3.1, `nodemailer` 10.0.10 | Express Middleware, MongoDB Atlas / Local MongoDB, ES Modules (`"type": "module"`) | **JavaScript (ESM)** |
| **`apps/web`** | Next.js (installed) | `react` 19.x, `react-dom` 19.x | To be implemented as lightweight landing page | **JavaScript (JSX)** |
| **Monorepo** | pnpm 12.x | Root scripts, `@babel/core` 8.x (used for code transforms) | `pnpm.onlyBuiltDependencies: ["esbuild"]` strictly required for EAS builds | **JavaScript** |

---

## 3. High-Priority Conventions & Critical Rules

1. **Pure JavaScript / No TypeScript**: The user requested that the mobile app, admin panel, and backend remain **pure JavaScript (`.js`, `.jsx`)**. Do NOT introduce `.ts` or `.tsx` files. Use JSDoc annotations where type clarity is needed.
2. **Package Management**: **NEVER run `npm install`**. Always use `pnpm` from root (e.g. `npx pnpm --filter <package-name> add <dep>`). Running `npm` creates duplicate `package-lock.json` files and breaks workspace symlinks.
3. **EAS Build Compatibility**: Do NOT remove `pnpm.onlyBuiltDependencies: ["esbuild"]` from root `package.json`. EAS Cloud Builder requires this block to pass build-script security without prompting interactive approval.
4. **Admin Package Naming**: `apps/admin/package.json` is named `"admin-panel"`. When targeting admin with pnpm, use `--filter admin-panel`.
5. **No Blind Code Rewrites**: The mobile UI is rich and detailed. Do NOT rewrite working screens from scratch. Extend existing screens, hook them up to shared state, and connect API clients.
6. **Destructive Actions**: All destructive actions (Delete Account, Cancel Booking, Ban User, Reject Listing) MUST trigger a confirmation modal/dialog before execution.

---

## 4. Current Implementation Status Overview

### 4.1 Mobile App (`apps/mobile`) — ~65% UI Complete
- **Authentication**: `LoginScreen.jsx`, `SignupScreen.jsx`, `VerifyOtpScreen.jsx` connected to `authApi.js`. Full validation, buyer/seller toggle, OTP entry with auto-focus and resend countdown.
- **Home & Feed**: `HomeScreen.jsx`, `HomeHeader.jsx`, `AdBanner.jsx`, `ServiceGridList.jsx`, `TopServicesSlider.jsx`, `LocationSheet.jsx`. Dual-filter (Products vs Services vs All) works via local state.
- **Search & Filter**: `SearchScreen.jsx`, `SavedSearchesScreen.jsx`, `FilterModal.jsx`, `SortModal.jsx`, `AllItemsScreen.jsx`.
- **Marketplace / Products**: `ProductListScreen.jsx`, `ProductDetailsScreen.jsx` with photo carousel, seller preview, specs, make offer modal, chat trigger, cart button.
- **Services**: `ServicesScreen.jsx`, `ServiceDetailsScreen.jsx`, `ServiceBookingScreen.jsx` with 4-step wizard (Package -> Schedule -> Address -> Payment).
- **Cart & Orders**: `BucketScreen.jsx` with coupon application (`FIRST20`), quantity increment, `CheckoutScreen.jsx`, `OrderSuccessScreen.jsx`, `OrderHistoryScreen.jsx`.
- **Bookings**: `BookingsScreen.jsx` with Upcoming/Past tabs, reschedule/cancel/rate modal hooks.
- **Classifieds / Seller**: `PostAdScreen.jsx` (category, title, price, photo picker, preview, submit), `MyAdsScreen.jsx` (active, under review, sold).
- **Chat & Offers**: `ChatsScreen.jsx` (conversations list), `ChatScreen.jsx` (thread with make offer modal, status badge).
- **Profile & Account**: `AccountScreen.jsx`, `EditProfileScreen.jsx`, `SecuritySettingsScreen.jsx`, `AddressManagementScreen.jsx`, `PaymentManagementScreen.jsx`, `FAQScreen.jsx`, `HelpSupportScreen.jsx`, `ReceiptsScreen.jsx`, `DeleteAccountScreen.jsx`.

### 4.2 Admin Panel (`apps/admin`) — ~30% Complete
- **Authentication**: Bypassed for demo mode (`demo-admin-token` in `App.jsx`). `Login.jsx`, `OTP.jsx`, `ForgotPassword.jsx`, `NewPassword.jsx` exist.
- **Fully Implemented Pages**:
  - `Overview.jsx`: Metrics KPI cards, revenue charts, recent transactions table.
  - `UsersList.jsx`: Searchable table, role filters, suspend/ban action modals.
  - `UserVerification.jsx`: KYC moderation queue, document viewer modal, approve/reject actions.
  - `AllListings.jsx`: Classifieds table, status badges, price filters.
  - `PendingListings.jsx`: Moderation queue, approve, reject with reason modal.
- **Placeholder Pages (~35 pages)**: Basic shell cards needing interactive tables, filters, and local state simulation (`AllBookings.jsx`, `AllProviders.jsx`, `ServiceCatalogue.jsx`, `Analytics.jsx`, `SystemSettings.jsx`, etc.).

### 4.3 Backend API (`apps/api`) — ~20% Complete
- **Working Endpoints**:
  - `GET /api/health`
  - `POST /auth/signup` (`fullName`, `email`, `password`, `phoneNumber`, `role`, `userTypes`, `status`)
  - `POST /auth/verify-otp` (`email`, `otp`)
  - `POST /auth/login`
  - `POST /api/v1/auth/admin/login`, `register`, `forgot-password`
- **Missing Endpoints**:
  - Listings / Products CRUD, search, filter, moderation endpoints.
  - Services & Categories catalog, packages, availability endpoints.
  - Bookings creation, status transitions, assignment endpoints.
  - Cart & Checkout endpoints.
  - Chat threads, messages, offer submission/counter endpoints.
  - Provider onboarding, KYC submission endpoints.
  - Payments & mock webhook endpoints.
  - Admin analytics, audit logs, CMS endpoints.

### 4.4 Web Landing (`apps/web`) — 0% Complete
- Empty package skeleton. Needs modern Next.js responsive landing page highlighting App download links, Service Provider registration, and marketplace preview.

---

## 5. Known Gaps & Flow Failure Points

1. **Guest to Authenticated Transition**:
   - `requireAuth` helper exists in `AppContext.jsx`, but certain flows (like "Make Offer" in `ProductDetailsScreen` or "Book Now" in `ServiceDetailsScreen`) don't consistently stash `pendingAction` before pushing to `LoginScreen`.
2. **Provider Workspace Isolation**:
   - The PRD requires a distinct "Provider Mode / Dashboard" for plumbers/electricians/tutors to manage leads, incoming bookings, and KYC status. Currently, provider screens are scattered or missing from mobile navigation.
3. **Data Disconnect between Mobile and Admin**:
   - Mobile uses hardcoded mocks in `AppContext.jsx` and components; Admin uses its own separate mocks. When an ad is posted in Mobile, it does not appear in Admin's `PendingListings.jsx`.
4. **Offer Negotiation Lifecycle**:
   - Chat has UI for making an offer, but lack of a structured state machine (Pending -> Countered -> Accepted -> Awaiting Payment -> Completed) makes it feel like disconnected chat text rather than an e-commerce transaction.
5. **Admin Placeholders**:
   - Clicking on Booking Management, Services Catalog, Provider Verification, CMS Banners, or Financial Reports in Admin navigates to a card saying "Page coming soon".

---

## 6. Shared Key File Locations

- **Mobile Navigation**: `apps/mobile/src/navigation/RootNavigator.jsx`, `apps/mobile/src/navigation/MainTabNavigator.jsx`
- **Mobile Global State**: `apps/mobile/src/context/AppContext.jsx`
- **Mobile Theme Tokens**: `apps/mobile/src/constants/colors.js`, `typography.js`, `spacing.js`
- **Mobile API Client**: `apps/mobile/src/services/authApi.js`
- **Admin Routing**: `apps/admin/src/pages/Dashboard.jsx`, `apps/admin/src/components/Sidebar.jsx`
- **Admin Styles**: `apps/admin/src/App.css`
- **Backend Entry**: `apps/api/src/server.js`, `apps/api/src/config/db.js`
- **Backend Models**: `apps/api/src/models/`
- **Backend Controllers**: `apps/api/src/controllers/`
- **Backend Routes**: `apps/api/src/routes/`
