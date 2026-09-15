import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Watchlist: undefined;
  Cart: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Account: undefined;
  Bookings: undefined;
  EditProfile: undefined;
  ServiceBooking: { categoryName?: string; subCategoryName?: string } | undefined;
  AddressManagement: undefined;
  PaymentManagement: undefined;
  HelpSupport: undefined;
  Search: { query?: string; autoFocusSaved?: boolean } | undefined;
  AllItems: { type: 'product' | 'service' | 'all' };
  ServiceDetails: { item: any };
  Notifications: undefined;
  SavedSearches: undefined;
  FAQ: undefined;
  Receipts: undefined;
  DeleteAccount: undefined;
};
