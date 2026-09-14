import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Watchlist: undefined;
  Cart: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Bookings: undefined;
  EditProfile: undefined;
  ServiceBooking: { categoryName?: string; subCategoryName?: string } | undefined;
  AddressManagement: undefined;
  PaymentManagement: undefined;
  HelpSupport: undefined;
  Search: { query?: string; autoFocusSaved?: boolean } | undefined;
  ServiceDetails: { item: any };
  Notifications: undefined;
  SavedSearches: undefined;
  FAQ: undefined;
  Receipts: undefined;
  DeleteAccount: undefined;
};
