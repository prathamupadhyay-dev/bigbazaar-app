# MyBigBazaar Architecture Decision Records (ADRs)

**Last Updated:** September 25, 2026  
**Audience:** All Engineering Agents & Developers  
**Rule:** These decisions are authoritative and MUST be adhered to unless explicitly overridden by the User.

---

## ADR-01: Pure JavaScript (No TypeScript) Mandate
- **Context:** The User commanded the complete removal of TypeScript from the monorepo (`apps/mobile`, `apps/admin`, `apps/api`, `packages/*`).
- **Decision:** All application code, configuration files, and future feature modules must be written in **pure JavaScript (`.js`, `.jsx`)**.
- **Rule for Agents:** Do NOT introduce `.ts` or `.tsx` files. Do NOT add `@types/*` dependencies. Use JSDoc comments for type hints and interface definitions where necessary.

---

## ADR-02: Workspace Package Manager & EAS Build Authorization
- **Context:** The repository uses `pnpm` workspaces for local multi-package linking and builds mobile APKs via EAS Cloud Build.
- **Decision:**
  1. `pnpm` is the sole authorized package manager. Running `npm install` inside subfolders is strictly prohibited.
  2. Root `package.json` must permanently preserve `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` alongside `pnpm-workspace.yaml` `allowBuilds: esbuild: true`. This prevents EAS cloud builds from stalling with `ERR_PNPM_IGNORED_BUILDS`.

---

## ADR-03: Zero-Overlap File Ownership for Parallel Agents
- **Context:** Running 5–10 autonomous coding agents concurrently in a monorepo risks severe merge conflicts if multiple agents modify the same files.
- **Decision:** Strict file ownership boundaries are enforced across 10 agent tracks (documented in `AGENT-01.md` through `AGENT-10.md`). No agent may edit files outside its assigned domain. Shared files (`RootNavigator.jsx`, `AppContext.jsx`, root `package.json`) are modified ONLY by designated integration owners.

---

## ADR-04: Dual-Channel Marketplace Discriminator
- **Context:** MyBigBazaar unifies classified goods and on-demand services in a single feed.
- **Decision:** All feed items and listing models must maintain an `itemType: 'product' | 'service'` discriminator:
  - If `itemType === 'product'`: card displays condition, location, price, and routes to `ProductDetailsScreen.jsx`.
  - If `itemType === 'service'`: card displays starting rate, duration/estimate, and routes to `ServiceDetailsScreen.jsx`.

---

## ADR-05: Offline-Tolerant Mobile Authentication & Demo Fallback
- **Context:** Mobile developers, QA testers, and reviewer agents may test the Expo client without a live MongoDB instance running on `localhost:3000`.
- **Decision:** `apps/mobile/src/services/authApi.js` attempts live network calls to `POST /auth/signup` and `POST /auth/verify-otp`. If the server is unreachable (connection refused, timeout), the client gracefully logs in using the demo test code `123456`, preventing testing deadlocks.

---

## ADR-06: Admin Panel UI Framework Policy
- **Context:** The Admin Panel template was integrated with raw CSS and utility classes (`App.css`).
- **Decision:** Do NOT install heavy external component frameworks (Tailwind, Material UI, AntD, Chakra) into `apps/admin`. All admin pages must use standard HTML elements styled with existing classes:
  - `.admin-card`
  - `.admin-table`
  - `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`
  - `.btn-primary`, `.btn-secondary`, `.btn-danger`
  This guarantees instant build times (<6s) and zero CSS bundle bloat.

---

## ADR-07: Persistent Continuation & Handoff Protocol
- **Context:** AI agent sessions are subject to token limits, model switches, and process restarts. Chat context is ephemeral and cannot be trusted as project memory.
- **Decision:** All project state, progress tracking, and handoffs must be committed directly to repository files in `docs/agent-plan/`:
  - Master Status: `EXECUTION_STATUS.md`
  - Technical Baseline: `PROJECT_STATE.md`
  - Architecture Decisions: `DECISIONS.md`
  - Individual Agent Handoffs: `handoffs/AGENT-XX.md`
