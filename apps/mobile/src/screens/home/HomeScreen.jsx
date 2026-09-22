import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Animated, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import HomeHeader from '../../components/home/HomeHeader';
import AdBanner from '../../components/home/AdBanner';
import ServiceGridList from '../../components/home/ServiceGridList';
import ReviewSlider from '../../components/home/ReviewSlider';
import FilterModal from '../search/FilterModal';
import SortModal from '../search/SortModal';
import LocationSheet from '../../components/home/LocationSheet';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const HAS_SEEN_LOCATION_PICKER_KEY = '@has_seen_location_picker';
const MARKETPLACE_CATEGORIES = [
  { label: 'Cars', icon: 'car-outline', query: 'Cars' },
  { label: 'Properties', icon: 'business-outline', query: 'Properties' },
  { label: 'Mobiles', icon: 'phone-portrait-outline', query: 'Electronics' },
  { label: 'Jobs', icon: 'briefcase-outline', query: 'Jobs' },
  { label: 'Bikes', icon: 'bicycle-outline', query: 'Bikes' },
  { label: 'Electronics', icon: 'laptop-outline', query: 'Electronics' },
  { label: 'Furniture', icon: 'bed-outline', query: 'Furniture' },
  { label: 'Fashion', icon: 'shirt-outline', query: 'Fashion' }
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Modals state
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);

  // Tooltip state

  React.useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const hasSeenLocationPicker = await AsyncStorage.getItem(HAS_SEEN_LOCATION_PICKER_KEY);
        if (hasSeenLocationPicker === 'true') return;

        // Mark it before opening so closing the sheet or returning from checkout
        // does not trigger the prompt again. The header remains the manual entry point.
        await AsyncStorage.setItem(HAS_SEEN_LOCATION_PICKER_KEY, 'true');
        if (isMounted) setLocationVisible(true);
      } catch (error) {
        // Keep the app usable if storage is unavailable; the user can still use
        // the location pill in the header to choose a location manually.
        if (isMounted) setLocationVisible(true);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Root fixed gradient that the transparent top elements reveal */}
      <LinearGradient
        colors={['#E6F4FE', '#FFFFFF']}
        style={styles.absoluteGradient} />
      

      <HomeHeader
        scrollY={scrollY}
        onFilterPress={() => setFilterVisible(true)}
        onLocationPress={() => setLocationVisible(true)} />
      

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // we'll use it for height animation which requires false, or transform which can be true. Let's stick to true for transforms and opacity
        )}
        scrollEventThrottle={16}>
        
        <View style={styles.topSection}>
          <AdBanner />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
            {MARKETPLACE_CATEGORIES.map((category) => (
              <TouchableOpacity key={category.label} style={styles.categoryItem} onPress={() => navigation.navigate('ProductList', { category: category.query })} accessibilityLabel={`Browse ${category.label}`}>
                <View style={styles.categoryIcon}><Ionicons name={category.icon} size={21} color={Colors.primary} /></View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.quickPanel}>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('ProductList')}>
              <View style={[styles.quickIcon, { backgroundColor: Colors.primaryLight }]}><Ionicons name="grid-outline" size={21} color={Colors.primary} /></View>
              <Text style={styles.quickText}>Marketplace</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('OrderHistory')}>
              <View style={[styles.quickIcon, { backgroundColor: '#F5F3FF' }]}><Ionicons name="receipt-outline" size={21} color="#7C3AED" /></View>
              <Text style={styles.quickText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Bucket')}>
              <View style={[styles.quickIcon, { backgroundColor: '#ECFDF5' }]}><Ionicons name="cart-outline" size={21} color={Colors.success} /></View>
              <Text style={styles.quickText}>Cart</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
          </View>
          <ServiceGridList typeFilter="product" />
          <ReviewSlider />
        </View>
      </Animated.ScrollView>

      {/* Modals */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onOpenSort={() => {
          setFilterVisible(false);
          // Slight delay to let Filter modal close
          setTimeout(() => setSortVisible(true), 150);
        }} />
      
      
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)} />
      

      <LocationSheet
        visible={locationVisible}
        onClose={() => setLocationVisible(false)} />
      
    </ScreenContainer>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  absoluteGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400 // Covers the top portion of the screen
  },
  scrollContent: {
    paddingBottom: 130, // Keeps final content above the floating tab bar
    flexGrow: 1
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    minHeight: 800 // Ensures the white background covers the rest of the page when scrolled up
  },
  topSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: 'transparent'
  },
  categoryRail: { paddingVertical: Spacing.sm, gap: Spacing.md },
  categoryItem: { width: 62, alignItems: 'center' },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  categoryLabel: { ...Typography.micro, color: Colors.textPrimary, textAlign: 'center', marginTop: 4 },
  quickPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 16,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickAction: { alignItems: 'center', flex: 1 },
  quickIcon: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickText: { ...Typography.captionBold, fontSize: 11, color: Colors.textPrimary },
  sectionTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm
  },
  viewAllText: {
    ...Typography.bodyBold,
    color: Colors.primary,
    fontSize: 14
  },
  tooltipContainer: {
    position: 'absolute',
    top: 90,
    right: 35,
    alignItems: 'flex-end',
    zIndex: 999
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2C3E50',
    marginRight: 20
  },
  tooltipBox: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: Spacing.md,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  tooltipText: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm
  },
  tooltipBtnText: {
    ...Typography.bodyBold,
    color: Colors.white,
    textAlign: 'right',
    fontSize: 14,
    marginTop: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  typeSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl + 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10
  },
  typeSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg
  },
  typeSheetTitle: {
    ...Typography.heading2,
    color: '#0F172A',
    marginBottom: Spacing.lg,
    textAlign: 'center'
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  typeOptionText: {
    ...Typography.body,
    fontSize: 16,
    color: '#64748B'
  },
  typeOptionActive: {
    color: '#0F172A',
    fontWeight: '700'
  }
});
