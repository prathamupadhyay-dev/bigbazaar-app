# AGENT 04: CLASSIFIEDS LIFECYCLE & SELLER STUDIO

## 1. Role & Objective
You are the **Seller Experience & Ad Lifecycle Specialist**. Your mission is to provide an intuitive selling flow ("Sell on BigBazaar"), comprehensive ad inventory management for sellers ("My Ads"), and seamlessly connect newly posted ads to the Admin Moderation Queue.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/ads/PostAdScreen.jsx`
- `apps/mobile/src/screens/ads/MyAdsScreen.jsx`
- `apps/api/src/controllers/ad.controller.js`
- `apps/api/src/routes/ad.routes.js`
- `apps/admin/src/pages/PendingListings.jsx`
- `apps/admin/src/pages/AllListings.jsx`
- `apps/admin/src/pages/FeaturedListings.jsx`
- `apps/admin/src/pages/FlaggedListings.jsx`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/context/AppContext.jsx`

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/services/`
- `apps/mobile/src/screens/bookings/`
- `apps/mobile/src/screens/auth/`
- `apps/admin/src/pages/UsersList.jsx`

---

## 3. Detailed Tasks & Specifications

1. **Post Ad Flow (`PostAdScreen.jsx`)**:
   - Multi-step or accordion wizard:
     1. **Category & Sub-Category**: Picker for Electronics, Furniture, Vehicles, etc.
     2. **Ad Details**: Title (min 10 chars), Description (min 20 chars), Condition (Brand New, Like New, Good, Fair).
     3. **Photos**: Multi-image picker (up to 5 images), drag-to-reorder, remove thumbnail.
     4. **Price & Negotiation**: Fixed price or "Negotiable" toggle.
     5. **Location & Contact**: City, Area, Contact phone number.
     6. **Promotion Package**: Free Basic Ad, Featured Tag (+₹99), Urgent Sale (+₹149).
     7. **Preview Modal**: Inspect listing card before submitting.
   - On submission: Add to `AppContext.ads` with status `'under_review'`. Show congratulatory success screen with link to "View in My Ads".

2. **My Ads Management (`MyAdsScreen.jsx`)**:
   - Filter Tabs: **Active (Live)**, **Under Review**, **Sold**, **Paused/Expired**.
   - Per-Ad Actions:
     - "Mark as Sold" (moves to Sold tab, disables chat/booking).
     - "Edit Details" (re-opens editor with prefilled data).
     - "Boost / Feature Ad" (opens promotion package modal).
     - "Delete Ad" (confirmation modal before removal).

3. **Backend Classifieds Endpoints (`ad.controller.js`, `ad.routes.js`)**:
   - `POST /api/v1/ads`: create ad with status `'pending_approval'`.
   - `GET /api/v1/ads/my-ads`: returns current authenticated user's ads.
   - `PUT /api/v1/ads/:id/status`: toggle status (`'sold'`, `'paused'`).
   - `PUT /api/v1/ads/:id`: update ad details.
   - `DELETE /api/v1/ads/:id`: soft-delete listing.

4. **Admin Moderation Sync (`PendingListings.jsx`, `AllListings.jsx`)**:
   - `PendingListings.jsx`: Render listings awaiting review. Include "Approve" (moves to Live) and "Reject" (prompts modal for rejection reason: Inappropriate, Fraudulent, Duplicate, Missing Info).
   - `AllListings.jsx`: Search by title, filter by Category and Status (`Live`, `Sold`, `Suspended`), view ad details modal.

---

## 4. Definition of Done (DoD)
- [ ] Submitting an ad in mobile puts it in "Under Review" state in `MyAdsScreen`.
- [ ] Approving the ad in Admin changes status to "Live" and reflects in mobile search.
- [ ] "Mark as Sold" works locally in `MyAdsScreen` and updates the badge.
- [ ] Both mobile and admin compile with 0 errors.
