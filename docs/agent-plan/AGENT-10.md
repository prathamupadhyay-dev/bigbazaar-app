# AGENT 10: WEB LANDING PAGE, MONOREPO DEVOPS & INTEGRATION QA

## 1. Role & Objective
You are the **Lead DevOps, Web Architect & Quality Assurance Specialist**. Your mission is to build the public Next.js marketing web landing page (`apps/web`), align monorepo build scripts across all 4 apps, and execute the final end-to-end user-flow validation pass to ensure production readiness.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/web/app/` (Create Next.js App Router structure: `layout.jsx`, `page.jsx`, `globals.css`)
- `apps/web/components/` (HeroBanner, CategoryShowcase, AppDownloadSection, ProviderCTA, Footer)
- `package.json` (Root scripts only: fix `"admin": "pnpm --filter admin-panel dev"`, add test scripts)
- `docs/agent-plan/INTEGRATION_CHECKLIST.md`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `apps/mobile/src/navigation/RootNavigator.jsx`
- `apps/admin/src/App.css`

### FORBIDDEN Files (Do NOT Touch)
- Individual screen files in `apps/mobile/src/screens/`
- Individual page files in `apps/admin/src/pages/`
- Backend controllers in `apps/api/src/controllers/`

---

## 3. Detailed Tasks & Specifications

1. **Build Public Marketing Landing Page (`apps/web`)**:
   - Create a fast, beautiful Next.js responsive landing page (pure JavaScript/JSX).
   - Sections:
     - **Navbar**: Brand Logo, "Buy Products", "Book Services", "Become a Partner", "Admin Portal Link".
     - **Hero Section**: "India's Unified Marketplace & On-Demand Services Platform" with phone mockup illustration and App Store / Google Play download badges.
     - **Core Verticals Grid**: Dual tabs showcasing Top Classifieds Categories (Electronics, Vehicles, Furniture) and Home Services (Plumbing, Electrical, Tutoring, AC Repair).
     - **Seller & Provider Callouts**: "Sell in 30 Seconds" (free listings) and "Earn with BigBazaar" (partner registration link).
     - **Trust & Safe-Deal Section**: Verified sellers, KYC-checked technicians, secure in-app payments.
     - **Footer**: Legal links, FAQs, Contact support, City directory.

2. **Monorepo Script Alignment & Developer Experience**:
   - Fix root `package.json` script:
     Change `"admin": "pnpm --filter admin dev"` -> `"admin": "pnpm --filter admin-panel dev"`.
   - Add `"build:all": "pnpm -r run build"`.
   - Verify `pnpm-workspace.yaml` and `esbuild` build permissions.

3. **Master End-to-End User-Flow Audit**:
   - Test and document all 6 primary user flows in `docs/agent-plan/INTEGRATION_CHECKLIST.md`:
     1. **GUEST Flow**: Open app -> Browse Home -> Search -> View Listing -> Favorite -> Login Prompt -> Resume.
     2. **BUYER Flow**: Login -> Search -> Make Offer in Chat -> Add to Cart -> Checkout -> Place Order -> Track in History.
     3. **SELLER Flow**: Login -> Sell Button -> Post Ad 6-step form -> View in My Ads -> Admin approve -> Mark as Sold.
     4. **CUSTOMER Flow**: Services Tab -> Pick Plumber -> Select Package -> Pick Date & Slot -> Select Address -> Pay -> Booking Confirmation.
     5. **PROVIDER Flow**: Become a Partner -> Submit KYC -> Open Provider Dashboard -> Toggle Online -> Accept Booking.
     6. **ADMIN Flow**: Login -> Overview -> Approve Pending Listing -> Verify KYC -> View Bookings & Analytics.

---

## 4. Definition of Done (DoD)
- [ ] `apps/web` builds and runs cleanly with `pnpm --filter web dev` and exports without errors.
- [ ] Root commands (`pnpm mobile`, `pnpm admin`, `pnpm api`, `pnpm web`) all launch their respective apps.
- [ ] `docs/agent-plan/INTEGRATION_CHECKLIST.md` is populated with pass/fail verification for all user journeys.
