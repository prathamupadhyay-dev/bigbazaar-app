# Agent 02 Handoff

## Status
NOT_STARTED

## Objective
Implement comprehensive authentication session persistence, GPS/manual location handling, profile editing, biometric/app lock security settings, address management, and account deletion.

## Completed
- Backend `/auth/signup` and `/auth/verify-otp` integrated into `LoginScreen.jsx`, `SignupScreen.jsx`, and `VerifyOtpScreen.jsx`.
- Requirements defined in `docs/agent-plan/AGENT-02.md`.

## Remaining
- [ ] Connect `expo-location` in `LocationSheet.jsx` to update header city and persist to `AsyncStorage`.
- [ ] Implement profile editing in `EditProfileScreen.jsx` with avatar picker and read-only email.
- [ ] Complete `AddressManagementScreen.jsx` with Add, Edit, Delete, and Default address actions.
- [ ] Implement App Lock toggle in `SecuritySettingsScreen.jsx`.
- [ ] Add `PUT /auth/profile` and `PUT /auth/change-password` endpoints in `apps/api/src/controllers/user.auth.controller.js`.

## Files Changed
- None yet in this run.

## Shared Files Touched
- None.

## Validation
- `npx pnpm --filter mobile exec expo export --platform android`
- `node -c apps/api/src/controllers/user.auth.controller.js`

## Known Errors
- None.

## Dependencies
- Can start immediately in Batch 1.

## Next Exact Action
Open `apps/mobile/src/components/home/LocationSheet.jsx` and wire GPS location detection with manual Indian cities fallback.

## Git Commit
None.

## Notes For Replacement Agent
Ensure that `updateUser` and `currentLocation` persist properly to `AsyncStorage` so closing the app does not wipe user changes.
