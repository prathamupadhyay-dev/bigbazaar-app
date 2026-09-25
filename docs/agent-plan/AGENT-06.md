# AGENT 06: PROVIDER ONBOARDING, KYC & PROVIDER MANAGEMENT DASHBOARD

## 1. Role & Objective
You are the **Service Provider Lifecycle & Operations Specialist**. Your mission is to build the dedicated provider experience in MyBigBazaar: empowering professionals (plumbers, tutors, electricians) to register, complete KYC verification, manage their service catalog, accept/reject booking leads, and toggle live availability.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/provider/ProviderOnboardingScreen.jsx` (New)
- `apps/mobile/src/screens/provider/ProviderDashboardScreen.jsx` (New)
- `apps/mobile/src/screens/provider/ProviderKYCScreen.jsx` (New)
- `apps/mobile/src/screens/provider/ProviderServiceFormScreen.jsx` (New)
- `apps/api/src/controllers/provider.controller.js`
- `apps/api/src/routes/provider.routes.js`
- `apps/admin/src/pages/AllProviders.jsx`
- `apps/admin/src/pages/ProviderAvailability.jsx`
- `apps/admin/src/pages/ProviderServiceAds.jsx`
- `apps/admin/src/pages/KYC.jsx`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/context/AppContext.jsx`
- `apps/mobile/src/screens/account/AccountScreen.jsx` (Link entry to "Switch to Provider Mode")

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/products/`
- `apps/mobile/src/screens/checkout/`
- `apps/admin/src/pages/UsersList.jsx`

---

## 3. Detailed Tasks & Specifications

1. **Provider Onboarding & KYC Flow (`ProviderOnboardingScreen.jsx`, `ProviderKYCScreen.jsx`)**:
   - Entry point: Button in `AccountScreen.jsx` -> "Become a Service Partner".
   - Step 1: Business / Profession Info (Category: Plumber/Electrician/Tutor, Years of experience, Service cities/areas).
   - Step 2: KYC Verification (Document Type: Aadhaar, PAN, Trade License; document photo upload placeholder, ID number).
   - Step 3: Payout Details (UPI ID or Bank Account Number + IFSC).
   - State: Sets provider status to `'under_verification'`. Displays pending banner in dashboard until approved by Admin.

2. **Provider Dashboard (`ProviderDashboardScreen.jsx`)**:
   - Header with Availability Toggle: **"Online (Taking Bookings)"** vs **"Offline"**.
   - Metric Cards: Today's Earnings, Pending Jobs, Completed Jobs, Partner Rating (e.g. ⭐ 4.9).
   - Incoming Job Requests:
     - Customer name, address, chosen slot, package price.
     - Action buttons: **"Accept Job"** (moves to Active Bookings) and **"Decline"**.
   - Active Jobs Card with "Start Service" and "Mark Completed (Collect Payment)" buttons.

3. **Post / Edit Provider Service (`ProviderServiceFormScreen.jsx`)**:
   - Form for providers to list specific sub-services with custom pricing and tiers.

4. **Admin Provider Management (`AllProviders.jsx`, `KYC.jsx`, `ProviderAvailability.jsx`)**:
   - Replace placeholder cards in Admin with functional tables:
     - `KYC.jsx`: Queue of pending provider KYC submissions. Actions: "Verify Partner" and "Reject Partner" (with reason).
     - `AllProviders.jsx`: Table of active service partners, ratings, assigned jobs, and ban/suspend actions.
     - `ProviderAvailability.jsx`: Live monitor showing which providers are currently online by city/category.

5. **Backend Provider Endpoints (`provider.controller.js`, `provider.routes.js`)**:
   - `POST /api/v1/providers/apply`: submit onboarding and KYC.
   - `GET /api/v1/providers/dashboard`: get earnings, incoming requests, active jobs.
   - `PUT /api/v1/providers/availability`: toggle online status.
   - `PUT /api/v1/providers/bookings/:id/respond`: accept or reject job.

---

## 4. Definition of Done (DoD)
- [ ] Users can apply as a Service Provider from the mobile Account screen.
- [ ] Submitted KYC appears in Admin `KYC.jsx` and can be approved.
- [ ] Provider Dashboard displays incoming bookings with working Accept/Decline state.
- [ ] Online/Offline switch toggles properly in local state.
