# AGENT 05: SERVICES CATALOG, BOOKING WIZARD & CART/BUCKET

## 1. Role & Objective
You are the **On-Demand Services & Booking Flow Specialist**. Your mission is to provide an end-to-end service discovery, booking, and management workflow for domestic and educational services (Plumbers, Electricians, Tutors, Cleaners, etc.) as mandated by the MyBigBazaar PRD.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/services/ServicesScreen.jsx`
- `apps/mobile/src/screens/services/ServiceDetailsScreen.jsx`
- `apps/mobile/src/screens/services/ServiceBookingScreen.jsx`
- `apps/mobile/src/screens/bookings/BookingsScreen.jsx`
- `apps/mobile/src/screens/bucket/BucketScreen.jsx`
- `apps/mobile/src/components/home/TopServicesSlider.jsx`
- `apps/api/src/controllers/service.controller.js`
- `apps/api/src/controllers/booking.controller.js`
- `apps/api/src/routes/service.routes.js`
- `apps/api/src/routes/booking.routes.js`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/context/AppContext.jsx`
- `apps/mobile/src/screens/address/AddressManagementScreen.jsx`

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/ads/`
- `apps/mobile/src/screens/chat/`
- `apps/mobile/src/screens/products/`
- `apps/admin/`

---

## 3. Detailed Tasks & Specifications

1. **Services Directory (`ServicesScreen.jsx`, `TopServicesSlider.jsx`)**:
   - 3x3 Grid of core categories: Plumber, Electrician, Tutor, Painter, Cleaning, AC Repair, Carpenter, Salon, Pest Control.
   - Sub-category lists with icons and estimated durations/starting rates.
   - RTL-friendly Home Tutoring slider ("Math", "Science", "English", "Coding", "Music").

2. **Service Details Page (`ServiceDetailsScreen.jsx`)**:
   - Provider profile banner (verified badge, completed jobs counter, star rating).
   - Package selection tabs: **Basic** (Inspection & Minor Fix), **Standard** (Full Repair / 1-Month Guarantee), **Premium** (Complete Overhaul).
   - Inclusions vs Exclusions checklist.
   - Sticky bottom bar: "Add to Bucket" or "Book Now" (launches Booking Wizard).

3. **Service Booking Wizard (`ServiceBookingScreen.jsx`)**:
   - Step 1: Package Confirmation & Add-ons (e.g. Spare Parts Protection +₹199).
   - Step 2: Date & Slot Picker (Today, Tomorrow, Pick Date + Morning/Afternoon/Evening slots).
   - Step 3: Service Address (select from saved addresses or add new via sheet).
   - Step 4: Payment Option: **Prepaid** (UPI/Cards) or **Pay After Service** (Cash/UPI upon completion).
   - Submission: Creates booking in `AppContext.bookings`, clears related cart items, returns booking ID (`BB-XXXXX`), and redirects to confirmation.

4. **Bucket / Cart Management (`BucketScreen.jsx`)**:
   - Unified holding area for product purchases AND scheduled service bookings.
   - Coupon system: Apply `FIRST20` (deducts 20%), error on invalid codes.
   - Price breakdown: Subtotal, Delivery/Convenience Fee, Taxes (GST 18%), Discount, Grand Total.
   - "Proceed to Checkout" button.

5. **My Bookings Screen (`BookingsScreen.jsx`)**:
   - Two Tabs: **Upcoming** and **History (Completed/Cancelled)**.
   - Actions on Upcoming:
     - "Reschedule Slot" (modal to pick new date/time).
     - "Cancel Booking" (modal asking cancellation reason).
     - "Call Provider" / "Chat with Provider".
   - Actions on History:
     - "Rate & Review Service" (1-5 stars, comments, tags: On-time, Polite, Clean work).
     - "Book Again" (prefills wizard).

6. **Backend Services & Bookings Endpoints**:
   - `GET /api/v1/services`: list and filter services.
   - `GET /api/v1/services/:id`: detailed service with packages and reviews.
   - `POST /api/v1/bookings`: create booking record.
   - `GET /api/v1/bookings/my-bookings`: retrieve user's booking history.
   - `PUT /api/v1/bookings/:id/reschedule`: update date/slot.
   - `PUT /api/v1/bookings/:id/cancel`: cancel with reason.

---

## 4. Definition of Done (DoD)
- [ ] Completing the 4-step booking wizard creates a booking record in `BookingsScreen`.
- [ ] Rescheduling a booking updates its scheduled time in the UI.
- [ ] Cart coupon `FIRST20` accurately discounts the total amount.
- [ ] Rating a completed service adds review feedback in local state.
