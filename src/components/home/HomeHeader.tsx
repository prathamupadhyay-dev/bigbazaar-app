import React from 'react';
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
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onFilterPress, scrollY, onTypePress, typeFilter = 'all' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSearchPress = () => {
    (navigation as any).navigate('Search');
  };

  const handleSavedSearchesPress = () => {
    (navigation as any).navigate('SavedSearches');
  };

  const handleNotificationsPress = () => {
    (navigation as any).navigate('Notifications');
  };

  // If scrollY is provided, we can animate the height or padding
  const headerHeight = scrollY ? scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [70, 50],
    extrapolate: 'clamp'
  }) : 70;

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
      <Animated.View style={[styles.topRow, { transform: [{ scale: searchPillScale }] }]}>
        
        {/* Pill Search Bar */}
        <TouchableOpacity 
          style={styles.searchContainer} 
          onPress={handleSearchPress}
          activeOpacity={0.9}
        >
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <View style={styles.searchTexts}>
            <Text style={styles.searchTextPrimary}>Search</Text>
          </View>
        </TouchableOpacity>

        {/* Secondary Action Icons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleSavedSearchesPress}>
            <Ionicons name="heart-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleNotificationsPress}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onFilterPress}>
            <Ionicons name="options-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    borderBottomWidth: 0,
    zIndex: 10,
    elevation: 0, // removed heavy shadow
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
    backgroundColor: '#F1F5F9', // slightly different shade than white
    borderRadius: 30, // Fully rounded pill
    height: 48, // slightly smaller height since it's single line now
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  searchTextPrimary: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  searchTextSecondary: {
    ...Typography.caption,
    fontSize: 11,
    color: '#64748B',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginLeft: 6,
  }
});

export default HomeHeader;
