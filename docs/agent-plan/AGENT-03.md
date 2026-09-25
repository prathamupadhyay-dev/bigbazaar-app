# AGENT 03: MARKETPLACE, SEARCH, FILTERING & PRODUCT DETAIL

## 1. Role & Objective
You are the **Discovery & E-Commerce Catalog Specialist**. Your mission is to build an engaging, frictionless browsing and shopping experience for physical products and classified goods, including lightning-fast search, multi-faceted filtering, watchlist toggling, and rich product detail pages.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/products/ProductListScreen.jsx`
- `apps/mobile/src/screens/products/ProductDetailsScreen.jsx`
- `apps/mobile/src/screens/search/SearchScreen.jsx`
- `apps/mobile/src/screens/search/SavedSearchesScreen.jsx`
- `apps/mobile/src/screens/search/FilterModal.jsx`
- `apps/mobile/src/screens/search/SortModal.jsx`
- `apps/mobile/src/screens/search/AllItemsScreen.jsx`
- `apps/mobile/src/screens/watchlist/WatchlistScreen.jsx`
- `apps/mobile/src/components/home/ServiceGridList.jsx`
- `apps/mobile/src/components/home/ServiceItemCard.jsx`
- `apps/api/src/controllers/product.controller.js`
- `apps/api/src/routes/product.routes.js`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/context/AppContext.jsx`
- `apps/mobile/src/navigation/`

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/auth/`
- `apps/mobile/src/screens/services/`
- `apps/mobile/src/screens/checkout/`
- `apps/admin/`

---

## 3. Detailed Tasks & Specifications

1. **Unified Feed & Discrimination (`ServiceItemCard.jsx`)**:
   - Maintain the `itemType: 'product' | 'service'` discriminator.
   - For products: display badge with condition (New, Like New, Good), price with currency (`₹`), location, and favorite star.
   - Touching the card routes to `ProductDetails` (for products) or `ServiceDetails` (for services).

2. **Search & Filter Pipeline (`SearchScreen.jsx`, `FilterModal.jsx`, `SortModal.jsx`)**:
   - Submitting search text logs to `AppContext.recentSearches`.
   - Tapping the heart inside the search bar adds to `AppContext.savedSearches`.
   - Filter Modal: Price range slider/inputs (Min-Max), Category checkboxes, Condition selector, Location radius, "Show Only Verified Sellers" toggle.
   - Sort Modal: Featured, Price: Low to High, Price: High to Low, Newest First.

3. **Product Details Page (`ProductDetailsScreen.jsx`)**:
   - Fullscreen horizontal swipeable image gallery with pagination dots.
   - Verified seller card with seller rating, join date, and active listings count.
   - Specifications & description expanders.
   - Sticky bottom action bar:
     - "Add to Bucket / Cart" button (calls `addToBucket(item)` in `AppContext`).
     - "Chat / Make Offer" button (routes to `ChatScreen` with initial item payload).
     - "Call Seller" button (launches phone dialer with phone number).
   - "Related Items" horizontal slider at the bottom.

4. **Watchlist Flow (`WatchlistScreen.jsx`)**:
   - Display all saved items in a clean 2-column grid.
   - One-tap removal with undo snackbar/toast.
   - Empty state with "Browse Products" action button.

5. **Backend Catalog API (`product.controller.js`, `product.routes.js`)**:
   - `GET /api/v1/products`: query params `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`.
   - `GET /api/v1/products/:id`: returns full product details with seller preview and related listings.

---

## 4. Definition of Done (DoD)
- [ ] Searching a term correctly filters the product grid and adds it to Recent Searches.
- [ ] Tapping favorite star on any product adds it to `WatchlistScreen` immediately.
- [ ] ProductDetails carousel swipes smoothly and "Add to Cart" increments the tab bar badge.
- [ ] `npx pnpm --filter mobile exec expo export --platform android` passes without bundling errors.
