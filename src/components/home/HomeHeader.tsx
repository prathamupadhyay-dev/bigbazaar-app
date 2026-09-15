import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

interface HomeHeaderProps {
  onFilterPress?: () => void;
  scrollY?: Animated.Value;
  onTypePress?: () => void;
  typeFilter?: 'all' | 'product' | 'service';
  onLocationPress?: () => void;
}

const SEARCH_TERMS = ['"Shoes"', '"Tops"', '"Jeans"', '"Watches"', '"Bags"'];

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onFilterPress, scrollY, onTypePress, typeFilter = 'all', onLocationPress }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchTermIndex, setSearchTermIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTermIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchPress = () => {
    (navigation as any).navigate('Search');
  };

  const handleSavedSearchesPress = () => {
    (navigation as any).navigate('SavedSearches');
  };

  const handleNotificationsPress = () => {
    (navigation as any).navigate('Notifications');
  };

  const handleProfilePress = () => {
    // Navigate to profile or menu
  };

  // If scrollY is provided, we can animate the height or padding
  const headerHeight = scrollY ? scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [105, 85],
    extrapolate: 'clamp'
  }) : 105;

  const searchPillScale = scrollY ? scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp'
  }) : 1;

  const getTypeIconColor = () => {
    if (typeFilter === 'service') return '#EAB308';
    if (typeFilter === 'product') return '#0A84FF';
    return Colors.textPrimary; // Default when both are shown
  };

  return (
    <Animated.View style={[styles.headerWrapper, { height: headerHeight }]}>
      
      {/* Location Row */}
      <View style={styles.locationRow}>
        <TouchableOpacity style={styles.locationBtn} onPress={onLocationPress}>
          <Ionicons name="location-sharp" size={16} color="#1E293B" />
          <Text style={styles.locationText} numberOfLines={1}>
            Deliver to 462023
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1E293B" style={{marginLeft: 2}} />
        </TouchableOpacity>
        
        <View style={styles.uptoTag}>
          <Text style={styles.uptoTagText}>upto ₹100</Text>
          <View style={styles.rupeeBox}>
             <Text style={styles.rupeeSymbol}>₹</Text>
          </View>
        </View>
      </View>

      <Animated.View style={[styles.topRow, { transform: [{ scale: searchPillScale }] }]}>
        
        {/* Pill Search Bar */}
        <TouchableOpacity 
          style={styles.searchContainer} 
          onPress={handleSearchPress}
          activeOpacity={0.9}
        >
          <View style={styles.searchTexts}>
            <Text style={styles.searchTextPrimary}>{SEARCH_TERMS[searchTermIndex]}</Text>
          </View>
          <View style={styles.searchIconsRight}>
            <Ionicons name="mic-outline" size={20} color="#64748B" style={styles.rightIcon} />
            <Ionicons name="camera-outline" size={20} color="#64748B" style={styles.rightIcon} />
          </View>
        </TouchableOpacity>

        {/* Secondary Action Icons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleNotificationsPress}>
            <Ionicons name="notifications-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleSavedSearchesPress}>
            <Ionicons name="heart-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="#1E293B" />
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    borderBottomWidth: 0,
    zIndex: 10,
    elevation: 0,
    paddingTop: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 4,
    marginRight: 2,
    flexShrink: 1,
  },
  uptoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uptoTagText: {
    ...Typography.bodyBold,
    color: '#1E293B',
    marginRight: 6,
    fontSize: 13,
  },
  rupeeBox: {
    backgroundColor: '#10B981', // Emerald 500
    borderRadius: 6,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '15deg' }],
  },
  rupeeSymbol: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    transform: [{ rotate: '-15deg' }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24, // Fully rounded pill
    height: 48,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  searchTextPrimary: {
    ...Typography.body,
    fontSize: 16,
    color: '#64748B',
  },
  searchIconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  }
});

export default HomeHeader;
