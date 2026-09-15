import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import PermissionsFlow from './src/components/PermissionsFlow';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="dark" />
          <PermissionsFlow />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
