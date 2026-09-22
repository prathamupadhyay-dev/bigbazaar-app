import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import AccountScreen from '../screens/account/AccountScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import ChatsScreen from '../screens/chat/ChatsScreen';
import PostAdScreen from '../screens/ads/PostAdScreen';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
          tabBarActiveTintColor: route.name === 'Services' ? '#6E4CC7' : '#1548A6',
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 72,
          elevation: 0,
          backgroundColor: Colors.white,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          overflow: 'visible'
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
            case 'Chats':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Sell':
              iconName = 'add';
              break;
            case 'Services':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Account':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          if (route.name === 'Sell') {
            return <View style={styles.sellIcon}><Ionicons name="add" size={27} color={Colors.white} /></View>;
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        }
      })}>
      
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ tabBarLabel: 'Chats' }} />

      <Tab.Screen
        name="Sell"
        component={PostAdScreen}
        options={{
          tabBarLabel: 'Sell',
          tabBarButton: (props) => (
            <View style={styles.sellTabSlot}>
              <TouchableOpacity {...props} style={styles.sellTabButton} accessibilityLabel="Sell an item">
                <View style={styles.sellIcon}><Ionicons name="add" size={27} color={Colors.white} /></View>
                <Text style={styles.sellLabel}>Sell</Text>
              </TouchableOpacity>
            </View>
          )
        }} />

      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ tabBarLabel: 'Services' }} />
      
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarLabel: 'Account' }} />
      
    </Tab.Navigator>);

}

const styles = StyleSheet.create({
  bucketIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sellTabSlot: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  sellTabButton: { alignItems: 'center', justifyContent: 'center', minWidth: 62, marginTop: -18 },
  sellIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E96D0F', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: Colors.white, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 6 },
  sellLabel: { fontSize: 10, fontWeight: '800', color: '#E96D0F', marginTop: 2 },
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
