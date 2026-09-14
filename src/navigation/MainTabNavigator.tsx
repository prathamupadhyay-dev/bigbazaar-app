import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import WatchlistScreen from '../screens/watchlist/WatchlistScreen';
import BucketScreen from '../screens/bucket/BucketScreen';
import AccountScreen from '../screens/account/AccountScreen';
import { MainTabParamList } from './types';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { bucket } = useApp();
  const bucketCount = bucket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => (
        <View style={styles.tabBarWrapper} pointerEvents="box-none">
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
            locations={[0, 0.6, 1]}
            style={styles.fadeOverlay}
            pointerEvents="none"
          />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0A84FF', // Big Bazaar premium blue
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: Colors.white,
          borderRadius: 30,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Watchlist':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          if (route.name === 'Cart') {
            return (
              <View style={styles.bucketIconWrapper}>
                <Ionicons name={iconName} size={26} color={color} />
                {bucketCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{bucketCount}</Text>
                  </View>
                )}
              </View>
            );
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ tabBarLabel: 'Watchlist' }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarLabel: 'Account' }}
      />
      <Tab.Screen
        name="Cart"
        component={BucketScreen}
        options={{ tabBarLabel: 'Cart' }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130, // tall enough to cover the tab bar and the fade area
    justifyContent: 'flex-end',
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120, // fade height
  },
  bucketIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#0A84FF',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
