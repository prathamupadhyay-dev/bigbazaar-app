# AGENT 07: REAL-TIME CHAT, OFFER NEGOTIATION & SAFETY/NOTIFICATIONS

## 1. Role & Objective
You are the **Buyer-Seller Communication & Trust Specialist**. Your mission is to build interactive in-app messaging, a state-driven bargaining/offer negotiation workflow, safe-deal guidance banners, user reporting/blocking, and a centralized notification center.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/chat/ChatsScreen.jsx`
- `apps/mobile/src/screens/chat/ChatScreen.jsx`
- `apps/mobile/src/screens/notifications/NotificationsScreen.jsx`
- `apps/api/src/controllers/chat.controller.js`
- `apps/api/src/controllers/notification.controller.js`
- `apps/api/src/routes/chat.routes.js`
- `apps/api/src/routes/notification.routes.js`
- `apps/admin/src/pages/Notifications.jsx`
- `apps/admin/src/pages/NotificationTemplates.jsx`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/context/AppContext.jsx`
- `apps/mobile/src/screens/products/ProductDetailsScreen.jsx` (Chat initiation trigger)

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/checkout/`
- `apps/mobile/src/screens/services/`
- `apps/admin/src/pages/UsersList.jsx`

---

## 3. Detailed Tasks & Specifications

1. **Conversations List (`ChatsScreen.jsx`)**:
   - Filter Tabs: **All**, **Buying (My Offers)**, **Selling (Inquiries on my ads)**.
   - List item: Partner avatar, partner name, item thumbnail, last message preview, timestamp, unread badge.
   - Swipe-to-delete or mute conversation option.

2. **Interactive Chat Thread (`ChatScreen.jsx`)**:
   - Pinned Top Item Bar: Item thumbnail, title, price, "Make Offer" button, and 3-dot menu (Report User, Block User, View Listing).
   - Safe-Deal Banner: "🛡️ Safe Deal Tip: Meet in public places. Never make advance payments or share OTPs outside BigBazaar."
   - Message Bubbles: Text messages, timestamps, read checkmarks.
   - **Interactive Offer Card Component**:
     - Displays: Offered Amount (e.g. `₹3,500` vs Asking `₹4,200`).
     - Status: `Pending`, `Countered`, `Accepted`, `Declined`.
     - Seller Actions on Pending: **"Accept Offer"**, **"Counter Offer"** (prompts input), **"Decline"**.
     - When Accepted: Card turns green and displays **"Proceed to Pay / Checkout"** button for the buyer.

3. **User Reporting & Safety (`ChatScreen.jsx`)**:
   - Report User Modal: Reason picker (Spam, Harassment, Fraudulent Listing, Asking for external payment).
   - Block User: Confirms block, silences messages, and marks user as blocked locally.

4. **Notifications Center (`NotificationsScreen.jsx`)**:
   - Categories: **All**, **Orders/Bookings**, **Offers**, **Promotions**.
   - Notifications: Booking confirmed, Offer accepted, New message, Ad approved, Price drop alert.
   - "Mark all as read" button.

5. **Admin Notifications Management (`Notifications.jsx`, `NotificationTemplates.jsx`)**:
   - `NotificationTemplates.jsx`: List and edit SMS/Push templates (e.g. Booking Reminder, OTP Verification).
   - `Notifications.jsx`: Broadcast notification composer (title, message, audience: All, Buyers, Sellers).

6. **Backend Messaging Endpoints (`chat.controller.js`, `chat.routes.js`)**:
   - `GET /api/v1/chats`: get current user's threads.
   - `POST /api/v1/chats/:id/messages`: send message or offer.
   - `PUT /api/v1/chats/:id/offers/:offerId`: accept, counter, or decline offer.

---

## 4. Definition of Done (DoD)
- [ ] Submitting an offer in chat generates an interactive Offer Card.
- [ ] Seller can accept or counter the offer, updating the card state in real time.
- [ ] Accepted offers show a "Proceed to Pay" button routing to Checkout.
- [ ] Report user action triggers success confirmation and logs to mock state.
