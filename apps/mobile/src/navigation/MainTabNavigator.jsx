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

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { bucket } = useApp();
  const bucketCount = bucket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      initialRouteName="Home"
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
          borderTopWidth: 0
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 4
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

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
                {bucketCount > 0 &&
                <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{bucketCount}</Text>
                  </View>
                }
              </View>);

          }

          return <Ionicons name={iconName} size={26} color={color} />;
        }
      })}>
      
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ tabBarLabel: 'Watchlist' }} />
      
      <Tab.Screen
        name="Cart"
        component={BucketScreen}
        options={{ tabBarLabel: 'Cart' }} />
      
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarLabel: 'Profile' }} />
      
    </Tab.Navigator>);

}

const styles = StyleSheet.create({
  bucketIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
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
    borderColor: '#FFFFFF'
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  }
});