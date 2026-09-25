# AGENT 01: FOUNDATION, SHARED TYPES, VALIDATION & DB SCHEMAS

## 1. Role & Objective
You are the **Data Architect & Backend Schema Specialist**. Your mission is to establish the single source of truth for all data models, shared types, validation schemas, and database seed fixtures across the MyBigBazaar ecosystem.

---

## 2. File Ownership Boundaries

### Owned Files & Directories (You May Create / Edit)
- `packages/types/index.js` (Convert from `.ts` or export pure JS/JSDoc types)
- `packages/shared/index.js` (Shared constants, categories, fee calculations, status enums)
- `packages/validation/index.js` (Lightweight validation helpers for forms and APIs)
- `apps/api/src/models/Listing.model.js` (Product & classified ad schema)
- `apps/api/src/models/Service.model.js` (Service catalog, category, sub-category, package tiers)
- `apps/api/src/models/Booking.model.js` (Service booking, slots, address, status machine)
- `apps/api/src/models/Order.model.js` (Physical product orders, tracking, item lines)
- `apps/api/src/models/Chat.model.js` (Conversation threads, offer messages, safe-deal status)
- `apps/api/src/models/Review.model.js` (Ratings, verified reviews for products & providers)
- `apps/api/src/models/Notification.model.js` (User notifications, push payloads)
- `apps/api/src/models/Payment.model.js` (Transactions, escrow/safe-deal ledger)
- `infrastructure/seed/seedData.js` (Rich mock seed script populating MongoDB Atlas/local)

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `.claude/PRD_TRD.md`
- `apps/mobile/src/context/AppContext.jsx` (Extract current mock data shapes)

### FORBIDDEN Files (Do NOT Touch)
- Any screen file in `apps/mobile/src/screens/`
- Navigation files in `apps/mobile/src/navigation/`
- Admin pages in `apps/admin/src/pages/`
- Root config files (`package.json`, `pnpm-lock.yaml`)

---

## 3. Detailed Tasks & Specifications

1. **Populate `packages/shared/index.js`**:
   - Status Enums:
     - `AdStatus`: `'draft'`, `'pending_approval'`, `'live'`, `'sold'`, `'paused'`, `'rejected'`, `'expired'`
     - `BookingStatus`: `'pending'`, `'confirmed'`, `'assigned'`, `'in_progress'`, `'completed'`, `'cancelled'`, `'disputed'`
     - `OrderStatus`: `'placed'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`, `'returned'`
     - `OfferStatus`: `'pending'`, `'countered'`, `'accepted'`, `'declined'`, `'expired'`
     - `Role`: `'guest'`, `'buyer'`, `'seller'`, `'provider'`, `'moderator'`, `'admin'`
   - Categories Catalog:
     - Marketplace Categories: Electronics, Fashion, Furniture, Bikes, Books, Appliances, Other
     - Service Categories: Plumbing, Electrician, Tutoring, Home Cleaning, AC Repair, Painting, Carpentry, Salon, Pest Control

2. **Define Mongoose Models in `apps/api/src/models/`**:
   - `Listing.model.js`: Title, description, price, category, subcategory, condition, location (city, area, coords), images (array), sellerId (ref: User), status (`AdStatus`), views, featured (`isFeatured`), attributes.
   - `Service.model.js`: Title, category, subcategory, description, providerId (ref: User), basePrice, packages: `[{ name, price, duration, features }]`, images, rating, reviewCount, isAvailable.
   - `Booking.model.js`: bookingNumber (e.g. `BB-XXXXX`), customerId, providerId, serviceId, subCategoryName, packageSelected, scheduledDate, scheduledTimeSlot, address (structured), amount, paymentMode, paymentStatus, status (`BookingStatus`), cancellationReason.
   - `Order.model.js`: orderNumber, buyerId, sellerId, items: `[{ listingId, title, price, quantity, image }]`, totalAmount, shippingAddress, paymentStatus, trackingStatus.
   - `Chat.model.js`: participants `[User]`, listingId, serviceId, lastMessage, messages: `[{ senderId, text, messageType: 'text'|'offer'|'system', offerDetails: { amount, status }, createdAt }]`.
   - `Review.model.js`: targetType (`'service'` | `'product'` | `'provider'`), targetId, reviewerId, rating (1-5), reviewText, images, createdAt.
   - `Payment.model.js`: transactionId (`TXN-XXXXX`), userId, amount, currency, purpose (`'booking'` | `'order'` | `'seller_package'`), status, paymentGateway, gatewayRef.

3. **Create Database Seeder (`infrastructure/seed/seedData.js`)**:
   - Create a standalone Node script that connects to MongoDB via `apps/api/src/config/db.js` and seeds 10 verified services, 10 active product listings, 5 verified providers, sample reviews, and demo users.

---

## 4. Definition of Done (DoD)
- [ ] All 8 Mongoose models syntax check cleanly (`node -c <file>`).
- [ ] `packages/shared/index.js` exports all domain enums and categories without external build requirements.
- [ ] The seed script executes cleanly and can seed a fresh Mongo instance.
- [ ] Zero TypeScript dependencies or `.ts` files introduced.
