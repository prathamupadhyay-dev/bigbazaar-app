# BigBazaar

A React Native marketplace app for browsing/booking home services and buying products.

Built with Expo + TypeScript.

---

## What it does

- Browse products and home services in one feed
- Book services (plumbing, cleaning, electrical, etc.)
- Add products to cart and checkout
- Manage bookings, saved items, addresses, and payments
- Search with recent history and product/service filtering

## Tech

- React Native 0.86 / Expo SDK 57
- TypeScript
- React Navigation v7 (native stack + bottom tabs)
- Context API for state

## Screens

| Tab | What's there |
|-----|-------------|
| Home | Feed, search, item detail |
| Watchlist | Saved items |
| Bookings | Active and past bookings |
| Cart | Checkout flow |
| Account | Profile, addresses, payments, help |

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go or press `a` / `i` for emulator.

## Folder structure

```
src/
  components/   reusable UI
  constants/    colors, typography, spacing tokens
  context/      global state
  navigation/   navigators
  screens/      screens grouped by feature
```
