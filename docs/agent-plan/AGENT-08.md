# AGENT 08: ORDERS, CHECKOUT FLOW, PAYMENTS & CUSTOMER SUPPORT

## 1. Role & Objective
You are the **Checkout, Financial Transactions & Customer Support Specialist**. Your mission is to deliver a seamless order fulfillment journey, multi-mode payment handling (UPI, Cards, COD, Escrow), downloadable/viewable transaction receipts, and an end-to-end customer support dispute ticketing flow.

---

## 2. File Ownership Boundaries

### Owned Files & Directories
- `apps/mobile/src/screens/checkout/CheckoutScreen.jsx`
- `apps/mobile/src/screens/checkout/OrderSuccessScreen.jsx`
- `apps/mobile/src/screens/orders/OrderHistoryScreen.jsx`
- `apps/mobile/src/screens/payments/PaymentManagementScreen.jsx`
- `apps/mobile/src/screens/account/ReceiptsScreen.jsx`
- `apps/mobile/src/screens/support/FAQScreen.jsx`
- `apps/mobile/src/screens/support/HelpSupportScreen.jsx`
- `apps/api/src/controllers/payment.controller.js`
- `apps/api/src/routes/payment.routes.js`
- `apps/admin/src/pages/Transactions.jsx`
- `apps/admin/src/pages/Invoices.jsx`
- `apps/admin/src/pages/Refunds.jsx`

### Read-Only References
- `docs/agent-plan/PROJECT_STATE.md`
- `packages/shared/index.js`
- `apps/mobile/src/context/AppContext.jsx`

### FORBIDDEN Files (Do NOT Touch)
- `apps/mobile/src/screens/products/ProductListScreen.jsx`
- `apps/mobile/src/screens/services/`
- `apps/admin/src/pages/UsersList.jsx`

---

## 3. Detailed Tasks & Specifications

1. **Checkout Flow (`CheckoutScreen.jsx`, `OrderSuccessScreen.jsx`)**:
   - Order Items Summary (quantities, pricing, item thumbnails).
   - Delivery Address Selector (with "Change Address" trigger opening saved addresses).
   - Payment Methods List:
     - **UPI** (Google Pay, PhonePe, Paytm, Enter UPI ID).
     - **Credit / Debit Cards** (Card number, Expiry, CVV).
     - **Net Banking** (HDFC, SBI, ICICI, Axis).
     - **Cash on Delivery (COD)** / Pay After Service.
   - Price Breakdown: Subtotal, Delivery Fee, Taxes (18% GST), Applied Coupon, Grand Total.
   - Processing Modal: Simulated 1.5s payment gateway authorization.
   - On success: Navigate to `OrderSuccessScreen.jsx` with Order ID (`ORD-XXXXX`), ETA date, and "View Order History" button. Clears items from cart!

2. **Order History & Tracking (`OrderHistoryScreen.jsx`)**:
   - Filter Tabs: **Active Orders**, **Completed**, **Cancelled**.
   - Order Card: Order ID, order date, total amount, item thumbnail, status badge.
   - Order Tracking Timeline: **Order Placed** -> **Confirmed** -> **Shipped / Assigned** -> **Out for Delivery** -> **Delivered**.
   - Actions: "Cancel Order" (if placed), "Download Invoice / Receipt", "Need Help?".

3. **Receipts & Payment Methods (`ReceiptsScreen.jsx`, `PaymentManagementScreen.jsx`)**:
   - `PaymentManagementScreen.jsx`: Saved UPI IDs, Saved Cards, Add New Card modal, Default payment toggle.
   - `ReceiptsScreen.jsx`: Formatted tax receipts with printable/shareable invoice modal view.

4. **Help & Support Ticketing (`HelpSupportScreen.jsx`, `FAQScreen.jsx`)**:
   - `FAQScreen.jsx`: Expandable accordion FAQ categories (Account, Payments, Bookings, Returns, Safety).
   - `HelpSupportScreen.jsx`:
     - "Submit a Dispute / Complaint" form: Category picker, Order/Booking reference, description, screenshot attachment.
     - Live Support Ticket Thread: User can send followup messages to customer care.

5. **Admin Financial Management (`Transactions.jsx`, `Invoices.jsx`, `Refunds.jsx`)**:
   - Replace placeholder cards with data tables:
     - `Transactions.jsx`: All gateway transactions, transaction IDs, statuses (Success, Pending, Failed).
     - `Invoices.jsx`: GST invoice ledger with download action.
     - `Refunds.jsx`: Refund queue for cancelled bookings/orders. Actions: "Approve Refund" and "Reject".

---

## 4. Definition of Done (DoD)
- [ ] Completing checkout clears the cart and places order in `OrderHistoryScreen`.
- [ ] Order Tracking shows step-by-step progress timeline.
- [ ] Submitting a support ticket creates an interactive ticket thread in `HelpSupportScreen`.
- [ ] Admin `Transactions.jsx` and `Refunds.jsx` show operational mock tables.
