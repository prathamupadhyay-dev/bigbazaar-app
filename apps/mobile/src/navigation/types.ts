import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Watchlist: undefined;
  Cart: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Bookings: undefined;
  EditProfile: undefined;
  ServiceBooking: { categoryName?: string; subCategoryName?: string } | undefined;
  AddressManagement: undefined;
  PaymentManagement: undefined;
  HelpSupport: undefined;
  Search: { query?: string; autoFocusSaved?: boolean } | undefined;
  AllItems: { type: 'product' | 'service' | 'all' };
  ServiceDetails: { item: any };
  ProductList: undefined;
  ProductDetails: { product: any };
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  Notifications: undefined;
  SavedSearches: undefined;
  FAQ: undefined;
  Receipts: undefined;
  DeleteAccount: undefined;
  OrderHistory: undefined;
  Login: undefined;
  Signup: undefined;
  MyAds: undefined;
  PostAd: undefined;
  Chat: { sellerName?: string; listingTitle?: string } | undefined;
};
