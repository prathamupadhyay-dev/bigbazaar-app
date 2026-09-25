# AGENT 02: IDENTITY, AUTH, LOCATION & USER PROFILE LIFECYCLE

## 1. Role & Objective
You are the **Identity & User Experience Specialist**. Your mission is to deliver bulletproof user onboarding, authentication, session persistence, location detection, and comprehensive account management across the mobile app and backend.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/auth/LoginScreen.jsx`
- `apps/mobile/src/screens/auth/SignupScreen.jsx`
- `apps/mobile/src/screens/auth/VerifyOtpScreen.jsx`
- `apps/mobile/src/screens/profile/EditProfileScreen.jsx`
- `apps/mobile/src/screens/account/AccountScreen.jsx`
- `apps/mobile/src/screens/account/SecuritySettingsScreen.jsx`
- `apps/mobile/src/screens/account/DeleteAccountScreen.jsx`
- `apps/mobile/src/screens/address/AddressManagementScreen.jsx`
- `apps/mobile/src/components/home/LocationSheet.jsx`
- `apps/mobile/src/services/authApi.js`
- `apps/api/src/controllers/user.auth.controller.js`
- `apps/api/src/routes/user.auth.routes.js`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/navigation/RootNavigator.jsx`
- `apps/mobile/src/context/AppContext.jsx`

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/products/`
- `apps/mobile/src/screens/services/`
- `apps/mobile/src/screens/ads/`
- `apps/admin/`

---

## 3. Detailed Tasks & Specifications

1. **Authentication & Session Persistence**:
   - Ensure `authApi.js` handles token storage and auto-restores user session on app launch via `AsyncStorage`.
   - In `LoginScreen.jsx` & `SignupScreen.jsx`, ensure invalid credentials display actionable inline errors.
   - Support social login buttons ("Sign in with Google / Apple") with clean simulated callbacks so users are not blocked.

2. **Location Architecture (`LocationSheet.jsx`)**:
   - Support GPS auto-detection via `expo-location` (already in `package.json`).
   - If permission is denied or device is offline, allow one-tap selection from popular Indian cities (Kottayam, Kochi, Bengaluru, Mumbai, Delhi, Hyderabad).
   - Save selected city to `AppContext.currentLocation` and persist to `AsyncStorage`.

3. **Account & Profile Management**:
   - `EditProfileScreen.jsx`: Full Name, Phone (+91), Gender, Bio, Avatar image picker (or placeholder avatars). Email must be marked as read-only per PRD.
   - `AddressManagementScreen.jsx`: Add new address (House/Flat, Street, Landmark, City, Pincode), edit address, delete address, and toggle "Set as Default".
   - `SecuritySettingsScreen.jsx`: App Lock toggle (persisting to `@app_lock_enabled`), change password modal, two-factor auth simulation.
   - `DeleteAccountScreen.jsx`: Requires password verification and reason selection before confirming deletion.

4. **Backend Auth Enhancements (`user.auth.controller.js`)**:
   - Add `updateProfile` endpoint: `PUT /auth/profile`.
   - Add `changePassword` endpoint: `PUT /auth/change-password`.
   - Add `deleteAccount` endpoint: `DELETE /auth/account`.

---

## 4. Definition of Done (DoD)
- [ ] Signup -> OTP Verification -> Auto-login flow functions seamlessly.
- [ ] Changing name, phone, or avatar in `EditProfileScreen` reflects immediately in `AccountScreen` and persists.
- [ ] Location selection in `LocationSheet` updates the top header city on `HomeScreen`.
- [ ] Both mobile and API pass validation with 0 syntax or runtime errors.
