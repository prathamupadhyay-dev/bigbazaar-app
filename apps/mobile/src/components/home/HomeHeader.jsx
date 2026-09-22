import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';









const SEARCH_TERMS = ['"Shoes"', '"Tops"', '"Jeans"', '"Watches"', '"Bags"'];

export const HomeHeader = ({ onFilterPress, scrollY, onTypePress, typeFilter = 'all', onLocationPress }) => {
  const navigation = useNavigation();
  const { activeAddress } = useApp();
  const [searchTermIndex, setSearchTermIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTermIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleSavedSearchesPress = () => {
    navigation.navigate('SavedSearches');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleMenuPress = () => {
    if (onFilterPress) {
      onFilterPress();
    }
  };

  const headerBgColor = scrollY ? scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
    extrapolate: 'clamp'
  }) : 'transparent';

  return (
    <Animated.View style={[styles.headerWrapper, { backgroundColor: headerBgColor }]}>
      
      {/* Location Row */}
      <View style={styles.locationRow}>
        <TouchableOpacity style={styles.locationBtn} onPress={onLocationPress}>
          <Ionicons name="location-sharp" size={16} color="#1E293B" />
          <Text style={styles.locationText} numberOfLines={1}>
            Deliver to {activeAddress ? `${activeAddress.city} ${activeAddress.pincode}` : 'Select Location'}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1E293B" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.topRow}>
        
        {/* Rectangular Search Bar with rounded corners */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.9}>
          
          <View style={styles.searchTexts}>
            <Text style={styles.searchTextPrimary}>{SEARCH_TERMS[searchTermIndex]}</Text>
          </View>
          <View style={styles.searchIconsRight}>
            <Ionicons name="mic-outline" size={20} color="#64748B" style={styles.rightIcon} />
          </View>
        </TouchableOpacity>

        {/* Secondary Action Icons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleNotificationsPress}>
            <Ionicons name="notifications-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleSavedSearchesPress}>
            <Ionicons name="star-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
            <Ionicons name="menu-outline" size={28} color="#1E293B" />
          </TouchableOpacity>
        </View>

      </View>
    </Animated.View>);

};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    borderBottomWidth: 0,
    zIndex: 10,
    elevation: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  locationText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 4,
    marginRight: 2,
    flexShrink: 1
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24, // Pill shape
    height: 48,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0' // faint border to make it pop on white
  },
  searchTexts: {
    flex: 1,
    justifyContent: 'center'
  },
  searchTextPrimary: {
    ...Typography.body,
    fontSize: 16,
    color: '#64748B'
  },
  searchIconsRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightIcon: {
    marginLeft: 12
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  }
});

export default HomeHeader;
