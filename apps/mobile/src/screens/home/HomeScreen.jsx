import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import HomeHeader from '../../components/home/HomeHeader';
import AdBanner from '../../components/home/AdBanner';
import ServiceGridList from '../../components/home/ServiceGridList';
import FilterModal from '../search/FilterModal';
import SortModal from '../search/SortModal';
import LocationSheet from '../../components/home/LocationSheet';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const HAS_SEEN_LOCATION_PICKER_KEY = '@has_seen_location_picker';
const MARKETPLACE_CATEGORIES = [
  { label: 'Cars', icon: 'car-outline', query: 'All' },
  { label: 'Properties', icon: 'business-outline', query: 'All' },
  { label: 'Mobiles', icon: 'phone-portrait-outline', query: 'Electronics' },
  { label: 'Jobs', icon: 'briefcase-outline', query: 'All' },
  { label: 'Bikes', icon: 'bicycle-outline', query: 'All' },
  { label: 'Electronics', icon: 'laptop-outline', query: 'Electronics' },
  { label: 'Furniture', icon: 'bed-outline', query: 'Furniture' },
  { label: 'Fashion', icon: 'shirt-outline', query: 'Fashion' }
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const hasSeen = await AsyncStorage.getItem(HAS_SEEN_LOCATION_PICKER_KEY);
        if (hasSeen === 'true') return;
        await AsyncStorage.setItem(HAS_SEEN_LOCATION_PICKER_KEY, 'true');
        if (isMounted) setLocationVisible(true);
      } catch (error) {
        if (isMounted) setLocationVisible(true);
      }
    }, 700);
    return () => { isMounted = false; clearTimeout(timer); };
  }, []);

  return (
    <ScreenContainer noPadding style={styles.container}>
      <HomeHeader scrollY={scrollY} onFilterPress={() => setFilterVisible(true)} onLocationPress={() => setLocationVisible(true)} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}>
        <View style={styles.topSection}>
          <AdBanner />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
            {MARKETPLACE_CATEGORIES.map((category) => (
              <TouchableOpacity key={category.label} style={styles.categoryItem} onPress={() => navigation.navigate('ProductList', { category: category.query })} accessibilityRole="button" accessibilityLabel={`Browse ${category.label}`}>
                <View style={styles.categoryIcon}><Ionicons name={category.icon} size={23} color={Colors.brandBlue} /></View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.body}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured listings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')} accessibilityRole="button"><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
          </View>
          <ServiceGridList typeFilter="product" />

          <View style={styles.servicesTeaser}>
            <View style={styles.servicesIcon}><Ionicons name="construct-outline" size={24} color={Colors.brandPurple} /></View>
            <View style={styles.servicesCopy}>
              <Text style={styles.servicesTitle}>Services at your door</Text>
              <Text style={styles.servicesText}>Book trusted local services — electricians, cleaners, and more.</Text>
            </View>
            <TouchableOpacity style={styles.servicesButton} onPress={() => navigation.navigate('Services')} accessibilityRole="button"><Text style={styles.servicesButtonText}>Explore</Text><Ionicons name="arrow-forward" size={15} color={Colors.brandPurple} /></TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} onOpenSort={() => { setFilterVisible(false); setTimeout(() => setSortVisible(true), 150); }} />
      <SortModal visible={sortVisible} onClose={() => setSortVisible(false)} />
      <LocationSheet visible={locationVisible} onClose={() => setLocationVisible(false)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceBase },
  scrollContent: { paddingBottom: 130 },
  topSection: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm },
  categoryRail: { paddingVertical: Spacing.base, paddingRight: Spacing.base },
  categoryItem: { width: 72, alignItems: 'center', marginRight: Spacing.sm },
  categoryIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.hairline },
  categoryLabel: { ...Typography.secondary, color: Colors.textPrimary, textAlign: 'center', marginTop: 6, fontSize: 12 },
  body: { paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, backgroundColor: Colors.surfaceBase },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { ...Typography.heading2, color: Colors.textPrimary, fontSize: 20 },
  viewAllText: { ...Typography.bodyBold, color: Colors.brandBlue, fontSize: 14 },
  servicesTeaser: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.base, marginBottom: Spacing.base, padding: Spacing.base, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(110,76,199,0.22)', backgroundColor: 'rgba(110,76,199,0.08)' },
  servicesIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(110,76,199,0.14)', marginRight: Spacing.md },
  servicesCopy: { flex: 1, paddingRight: Spacing.sm },
  servicesTitle: { ...Typography.bodyBold, color: Colors.textPrimary, fontSize: 16, marginBottom: 3 },
  servicesText: { ...Typography.secondary, color: Colors.textSecondary, lineHeight: 18 },
  servicesButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1, borderColor: Colors.brandPurple, paddingHorizontal: 10 },
  servicesButtonText: { ...Typography.captionBold, color: Colors.brandPurple, marginRight: 4 }
});