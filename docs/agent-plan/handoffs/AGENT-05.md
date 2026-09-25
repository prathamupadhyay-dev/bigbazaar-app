# Agent 05 Handoff

## Status
NOT_STARTED

## Objective
Implement on-demand domestic and educational services: 9-category directory, sub-categories, Service Details with tier packages (Basic/Standard/Premium), 4-step Booking Wizard, Cart/Bucket coupon calculation, and Bookings management (reschedule/cancel/review).

## Completed
- UI screens scaffolded.
- Requirements defined in `docs/agent-plan/AGENT-05.md`.

## Remaining
- [ ] Connect `ServiceBookingScreen.jsx` 4-step wizard to `AppContext.bookings`.
- [ ] Implement `FIRST20` coupon calculation in `BucketScreen.jsx`.
- [ ] Implement Reschedule, Cancel, and Rate actions in `BookingsScreen.jsx`.
- [ ] Implement backend `apps/api/src/controllers/service.controller.js` and `apps/api/src/controllers/booking.controller.js`.

## Files Changed
- None yet.

## Shared Files Touched
- None.

## Validation
- `npx pnpm --filter mobile exec expo export --platform android`

## Known Errors
- None.

## Dependencies
- Blocked by BATCH 1 (AGENT-01 for `Service.model.js` and `Booking.model.js`).

## Next Exact Action
Wait for AGENT-01, then build `service.controller.js` and `booking.controller.js`.

## Git Commit
None.

## Notes For Replacement Agent
Booking ID must follow the `BB-XXXXX` format.
