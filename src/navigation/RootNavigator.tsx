import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ServiceBookingScreen from '../screens/services/ServiceBookingScreen';
import AddressManagementScreen from '../screens/address/AddressManagementScreen';
import PaymentManagementScreen from '../screens/payments/PaymentManagementScreen';
import HelpSupportScreen from '../screens/support/HelpSupportScreen';
import SearchScreen from '../screens/search/SearchScreen';
import ServiceDetailsScreen from '../screens/services/ServiceDetailsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SavedSearchesScreen from '../screens/search/SavedSearchesScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'ios_from_right' : 'default', // True iOS-style parallax push/pop on Android, default on iOS
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="Bookings" component={require('../screens/bookings/BookingsScreen').default} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ServiceBooking" component={ServiceBookingScreen} />
      <Stack.Screen name="AddressManagement" component={AddressManagementScreen} />
      <Stack.Screen name="PaymentManagement" component={PaymentManagementScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen} 
        options={{ animation: 'fade' }} 
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedSearches" component={SavedSearchesScreen} />
      <Stack.Screen name="FAQ" component={require('../screens/support/FAQScreen').default} />
      <Stack.Screen name="Receipts" component={require('../screens/account/ReceiptsScreen').default} />
      <Stack.Screen name="DeleteAccount" component={require('../screens/account/DeleteAccountScreen').default} />
    </Stack.Navigator>
  );
}
