# Agent 06 Handoff

## Status
NOT_STARTED

## Objective
Implement dedicated Service Partner ecosystem: Provider Onboarding, ID/KYC document upload, Partner Dashboard with Online/Offline availability toggle, lead management (Accept/Decline incoming bookings), and Admin partner verification.

## Completed
- Requirements defined in `docs/agent-plan/AGENT-06.md`.

## Remaining
- [ ] Create `apps/mobile/src/screens/provider/ProviderOnboardingScreen.jsx`.
- [ ] Create `apps/mobile/src/screens/provider/ProviderKYCScreen.jsx`.
- [ ] Create `apps/mobile/src/screens/provider/ProviderDashboardScreen.jsx`.
- [ ] Implement backend `apps/api/src/controllers/provider.controller.js` and `apps/api/src/routes/provider.routes.js`.
- [ ] Replace placeholder cards in Admin: `KYC.jsx`, `AllProviders.jsx`, `ProviderAvailability.jsx`.

## Files Changed
- None yet.

## Shared Files Touched
- None.

## Validation
- `npx pnpm --filter mobile exec expo export --platform android`
- `npx pnpm --filter admin-panel run build`

## Known Errors
- None.

## Dependencies
- Blocked by BATCH 1 (AGENT-01 and AGENT-02).

## Next Exact Action
Wait for AGENT-01 & AGENT-02 completion, then create `ProviderOnboardingScreen.jsx` and `ProviderDashboardScreen.jsx`.

## Git Commit
None.

## Notes For Replacement Agent
Link entry point from "Become a Service Partner" button in `AccountScreen.jsx`.
