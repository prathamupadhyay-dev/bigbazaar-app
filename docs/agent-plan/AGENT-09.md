# AGENT 09: ADMIN PANEL OPERATIONS, CATEGORY CMS & AUDITABILITY

## 1. Role & Objective
You are the **Admin Operations & Platform Governance Specialist**. Your mission is to eradicate all ~25 placeholder cards in the Admin Panel (`apps/admin/src/pages/`) by transforming them into fully interactive, functional operational consoles matching the MyBigBazaar PRD requirements.

---

## 2. File Ownership Boundaries

### Owned Files & Directories (Admin Operations & CMS Pages)
- `apps/admin/src/pages/AllBookings.jsx`, `UpcomingBookings.jsx`, `InProgressBookings.jsx`, `CompletedBookings.jsx`, `CancelledBookings.jsx`
- `apps/admin/src/pages/ServiceCatalogue.jsx`, `ServiceCategories.jsx`, `ServicePackages.jsx`
- `apps/admin/src/pages/MarketplaceCategories.jsx`, `SellerPackages.jsx`
- `apps/admin/src/pages/Analytics.jsx`
- `apps/admin/src/pages/AuditLogs.jsx`
- `apps/admin/src/pages/RiskFlags.jsx`, `Appeals.jsx`, `FlaggedUsers.jsx`, `SuspendedUsers.jsx`
- `apps/admin/src/pages/Banners.jsx`, `HomeModules.jsx`, `StaticPages.jsx`, `SafetyContent.jsx`
- `apps/admin/src/pages/SystemSettings.jsx`, `Configuration.jsx`, `RolesPermissions.jsx`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/admin/src/App.css` (Use existing styling classes: `admin-card`, `admin-table`, `badge`, `btn-primary`, `btn-secondary`)
- `apps/admin/src/components/Sidebar.jsx`

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/` (All mobile screens)
- `apps/api/` (Backend code)
- `apps/admin/src/components/Sidebar.jsx` (Routing tree is already wired)
- `apps/admin/src/pages/Dashboard.jsx` (Routes are established)

---

## 3. Detailed Tasks & Specifications

1. **Bookings Operations Console**:
   - `AllBookings.jsx`, `UpcomingBookings.jsx`, `InProgressBookings.jsx`, `CompletedBookings.jsx`, `CancelledBookings.jsx`:
     - Render searchable booking tables: Booking ID, Customer, Service Name, Provider Assigned, Scheduled Slot, Amount, Payment Mode, Status Badge.
     - Actions: "Reassign Provider", "Force Cancel", "View Details Modal".
     - Tab-filtered views using shared state or dedicated mock fixtures.

2. **Category & Package Catalog CMS**:
   - `MarketplaceCategories.jsx` & `ServiceCategories.jsx`:
     - Table of active categories, icon preview, item count, sort order, and active/inactive status toggle.
     - "Add Category" modal with name, slug, and icon name.
   - `ServicePackages.jsx` & `SellerPackages.jsx`:
     - List pricing tiers (Free, Featured Ad ₹99, Urgent Sale ₹149; Basic, Standard, Premium service packages).
     - Ability to edit pricing and features.

3. **Risk, Moderation & Safety**:
   - `RiskFlags.jsx`: High-risk keywords monitor (e.g. offensive language, off-platform payment attempts).
   - `FlaggedUsers.jsx` & `SuspendedUsers.jsx`: List users with report counts; "Unban" and "Permanently Delete" actions.
   - `Appeals.jsx`: Queue of seller/user appeals against suspensions.

4. **CMS & Visual Customization**:
   - `Banners.jsx`: Upload/manage promotional sliders displayed on mobile Home (`AdBanner.jsx`).
   - `StaticPages.jsx` & `SafetyContent.jsx`: Edit terms of service, privacy policy, and safe-deal guidelines.

5. **Platform Analytics & Audit Trail**:
   - `Analytics.jsx`: KPI metric cards (GMV, Service Bookings, Classifieds Volume, Commission Earned), bar charts, top performing categories.
   - `AuditLogs.jsx`: Chronological log of admin actions (e.g. "Admin Govind approved listing #1042 at 10:14 AM").

---

## 4. Definition of Done (DoD)
- [ ] ZERO placeholder cards remaining in the Admin Panel. Every sidebar link renders a complete, responsive operational view.
- [ ] Modals for adding categories, viewing booking details, and approving appeals function cleanly using local state.
- [ ] `npx pnpm --filter admin-panel run build` succeeds in under 6 seconds with 0 warnings/errors.
