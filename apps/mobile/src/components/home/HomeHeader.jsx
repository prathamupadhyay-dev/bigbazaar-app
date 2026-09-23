import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export const HomeHeader = ({ onFilterPress, scrollY, onLocationPress }) => {
  const navigation = useNavigation();
  const { activeAddress } = useApp();
  const headerBgColor = scrollY ? scrollY.interpolate({ inputRange: [0, 80], outputRange: ['rgba(250,250,250,0)', 'rgba(250,250,250,1)'], extrapolate: 'clamp' }) : Colors.surfaceBase;
  const location = activeAddress || { city: 'Kottayam', street: 'Kumarakom', pincode: '686001' };
  const stateByCity = { Kottayam: 'Kerala', Kochi: 'Kerala', Mumbai: 'Maharashtra', Delhi: 'Delhi', Bengaluru: 'Karnataka', Pune: 'Maharashtra', Indore: 'Madhya Pradesh' };
  const locationLabel = (location.city || 'Kottayam') + ', ' + (stateByCity[location.city] || location.street || 'Kerala') + ' ' + (location.pincode || '686001');

  return (
    <Animated.View style={[styles.headerWrapper, { backgroundColor: headerBgColor }]}>
      <TouchableOpacity style={styles.locationBtn} onPress={onLocationPress} accessibilityLabel="Change location">
        <Ionicons name="location-outline" size={18} color={Colors.brandBlue} />
        <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
        <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.topRow}>
        <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('Search')} activeOpacity={0.9} accessibilityLabel="Search listings and services">
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search cars, mobiles, furniture, services...</Text>
          <TouchableOpacity style={styles.filterButton} onPress={(event) => { event.stopPropagation(); onFilterPress?.(); }} accessibilityLabel="Open filters">
            <Ionicons name="options-outline" size={20} color={Colors.brandBlue} />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')} accessibilityLabel="Open notifications">
          <Ionicons name="notifications-outline" size={23} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: { paddingHorizontal: Spacing.base, paddingTop: 10, paddingBottom: 10, zIndex: 10 },
  locationBtn: { minHeight: 48, flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { ...Typography.bodyBold, fontSize: 14, color: Colors.textPrimary, marginHorizontal: 7, flexShrink: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  searchContainer: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceRaised, borderRadius: 12, paddingLeft: 14, borderWidth: 1, borderColor: Colors.hairline },
  searchPlaceholder: { ...Typography.secondary, color: Colors.textSecondary, flex: 1, marginLeft: 8 },
  filterButton: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  notificationButton: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginLeft: 6 }
});

export default HomeHeader;