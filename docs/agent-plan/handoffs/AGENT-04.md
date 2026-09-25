# Agent 04 Handoff

## Status
NOT_STARTED

## Objective
Implement the classifieds lifecycle: 6-step Post Ad wizard in mobile, ad management in `MyAdsScreen.jsx` (Active, Under Review, Sold, Paused), and integrate with the Admin Moderation queue (`PendingListings.jsx` & `AllListings.jsx`).

## Completed
- Mobile screens scaffolded.
- Requirements defined in `docs/agent-plan/AGENT-04.md`.

## Remaining
- [ ] Connect `PostAdScreen.jsx` submission to `AppContext.ads` with status `'under_review'`.
- [ ] Implement Promotion package selection in `PostAdScreen.jsx` (Free, Featured +₹99, Urgent +₹149).
- [ ] Complete `MyAdsScreen.jsx` tab filtering (Active, Under Review, Sold) and actions ("Mark as Sold", "Delete", "Edit").
- [ ] Implement backend `apps/api/src/controllers/ad.controller.js` and `apps/api/src/routes/ad.routes.js`.
- [ ] Synchronize `PendingListings.jsx` in Admin to display submitted ads with Approve and Reject actions.

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
- Blocked by BATCH 1 (AGENT-01 for `Listing.model.js` and `AdStatus` enum).

## Next Exact Action
Wait for AGENT-01, then implement `ad.controller.js` and wire `PostAdScreen.jsx` to `MyAdsScreen.jsx`.

## Git Commit
None.

## Notes For Replacement Agent
Ensure rejected ads in Admin capture a rejection reason.
