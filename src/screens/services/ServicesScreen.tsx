import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

interface SubCategory {
  id: string;
  name: string;
  price: number;
  duration: string;
  rating: number;
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  subCategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    id: 'cat-plumber',
    name: 'Plumber',
    icon: 'construct-outline',
    subCategories: [
      {
        id: 'plumb-1',
        name: 'Tap Repair & Washbasin Fix',
        price: 249,
        duration: '45 mins',
        rating: 4.8,
        description: 'Fix dripping faucets, mixer taps, washers, and washbasin pipe blockages.',
      },
      {
        id: 'plumb-2',
        name: 'Water Pipe Leakage & Seepage',
        price: 399,
        duration: '1 hour',
        rating: 4.9,
        description: 'Concealed or exposed pipeline leak detection and joint sealing.',
      },
      {
        id: 'plumb-3',
        name: 'Toilet Flush Tank & Commode Fix',
        price: 349,
        duration: '50 mins',
        rating: 4.7,
        description: 'Internal flush valve replacement, siphon repair, or commode re-grouting.',
      },
      {
        id: 'plumb-4',
        name: 'Water Motor & Tank Connection',
        price: 599,
        duration: '1.5 hours',
        rating: 4.8,
        description: 'Overhead tank float valve replacement and motor inlet/outlet pipe fitting.',
      },
    ],
  },
  {
    id: 'cat-electrician',
    name: 'Electrician',
    icon: 'flash-outline',
    subCategories: [
      {
        id: 'elec-1',
        name: 'Switchboard & Socket Repair',
        price: 199,
        duration: '30 mins',
        rating: 4.9,
        description: 'Repair burned sockets, loose connections, or switchboard replacements.',
      },
      {
        id: 'elec-2',
        name: 'MCB Fuse Tripping & Short Circuit',
        price: 449,
        duration: '1 hour',
        rating: 4.8,
        description: 'Diagnosis of power trips, high load faults, and MCB box restoration.',
      },
      {
        id: 'elec-3',
        name: 'Ceiling Fan Installation / Fix',
        price: 299,
        duration: '45 mins',
        rating: 4.7,
        description: 'New fan hanging, regulator replacement, or blade balancing.',
      },
      {
        id: 'elec-4',
        name: 'Complete Inverter Wiring Setup',
        price: 699,
        duration: '2 hours',
        rating: 5.0,
        description: 'Battery terminal connection and line distribution for emergency power.',
      },
    ],
  },
  {
    id: 'cat-tutor',
    name: 'Home Tutor',
    icon: 'school-outline',
    subCategories: [
      {
        id: 'tut-1',
        name: 'Class 10 Mathematics (1-on-1)',
        price: 599,
        duration: '1.5 hours',
        rating: 5.0,
        description: 'Trigonometry, Geometry, and board exam practice with verified subject master.',
      },
      {
        id: 'tut-2',
        name: 'Physics & Chemistry Mastery',
        price: 649,
        duration: '1.5 hours',
        rating: 4.9,
        description: 'Conceptual understanding, numerical problem solving, and lab fundamentals.',
      },
      {
        id: 'tut-3',
        name: 'Spoken English & Communication',
        price: 499,
        duration: '1 hour',
        rating: 4.8,
        description: 'Grammar fluency, vocabulary building, and interview confidence.',
      },
      {
        id: 'tut-4',
        name: 'Coding Fundamentals (Python/JS)',
        price: 799,
        duration: '1.5 hours',
        rating: 4.9,
        description: 'Hands-on programming logic, syntax, and building first mini-projects.',
      },
    ],
  },
  {
    id: 'cat-clean',
    name: 'Cleaning',
    icon: 'sparkles-outline',
    subCategories: [
      {
        id: 'cln-1',
        name: 'Full Bathroom Deep Scrubbing',
        price: 499,
        duration: '1.5 hours',
        rating: 4.8,
        description: 'Hard water tile stain removal, chrome fittings shine, and sanitization.',
      },
      {
        id: 'cln-2',
        name: 'Kitchen Chimney & Degreasing',
        price: 699,
        duration: '2 hours',
        rating: 4.7,
        description: 'Heavy grease baffle filter wash, exhaust blade cleaning, and counter scrub.',
      },
    ],
  },
  {
    id: 'cat-ac',
    name: 'AC Repair',
    icon: 'snow-outline',
    subCategories: [
      {
        id: 'ac-1',
        name: 'AC Foam Jet Deep Service',
        price: 549,
        duration: '1 hour',
        rating: 4.9,
        description: 'Cooling coil high-pressure wash, blower cleaning, and drain tray flush.',
      },
      {
        id: 'ac-2',
        name: 'AC Gas Refill & Leak Check',
        price: 1899,
        duration: '1.5 hours',
        rating: 4.8,
        description: 'Nitrogen leak testing, compressor vacuuming, and genuine R32/R410 gas refill.',
      },
    ],
  },
  {
    id: 'cat-pest',
    name: 'Pest Control',
    icon: 'bug-outline',
    subCategories: [
      {
        id: 'pest-1',
        name: 'Kitchen Cockroach Gel Treatment',
        price: 799,
        duration: '45 mins',
        rating: 4.8,
        description: 'Odorless Bayer gel applied at key nesting corners with 90-day warranty.',
      },
    ],
  },
];

export const ServicesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addToBucket } = useApp();
  const [selectedCatId, setSelectedCatId] = useState('cat-plumber');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];

  const filteredSubCategories = activeCategory.subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToBucket = (sub: SubCategory) => {
    addToBucket({
      serviceId: sub.id,
      serviceName: activeCategory.name,
      categoryName: activeCategory.name,
      subCategoryName: sub.name,
      price: sub.price,
      timeSlot: '10:00 AM - 12:00 PM',
      serviceDate: 'Tomorrow',
      paymentChoice: 'Prepaid',
      quantity: 1,
    });
    Alert.alert('Added to Bucket', `${sub.name} (₹${sub.price}) added to your bucket!`, [
      { text: 'Continue Browsing' },
      { text: 'Go to Bucket', onPress: () => (navigation as any).navigate('Bucket') },
    ]);
  };

  const handleBookSlot = (sub: SubCategory) => {
    navigation.navigate('ServiceBooking', {
      categoryName: activeCategory.name,
      subCategoryName: sub.name,
    });
  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>All Services</Text>
          <Text style={styles.headerSubtitle}>Verified professionals with upfront pricing</Text>
        </View>
        <TouchableOpacity
          style={styles.headerBucketBtn}
          onPress={() => (navigation as any).navigate('Bucket')}
        >
          <Ionicons name="basket-outline" size={22} color="#0A84FF" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBoxContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search in ${activeCategory.name}...`}
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills Slider */}
      <View style={styles.catTabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catTabsContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCatId;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catTab, isSelected && styles.selectedCatTab]}
                onPress={() => setSelectedCatId(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isSelected ? '#FFFFFF' : Colors.textSecondary}
                  style={styles.catTabIcon}
                />
                <Text style={[styles.catTabText, isSelected && styles.selectedCatTabText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sub-categories List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{activeCategory.name} Solutions</Text>
          <Text style={styles.resultsCount}>{filteredSubCategories.length} options available</Text>
        </View>

        {filteredSubCategories.map((sub) => (
          <View key={sub.id} style={styles.serviceCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBox}>
                <Text style={styles.serviceName}>{sub.name}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{sub.rating}</Text>
                  </View>
                  <Text style={styles.durationText}>• {sub.duration}</Text>
                </View>
              </View>
              <Text style={styles.priceTag}>₹{sub.price}</Text>
            </View>

            <Text style={styles.serviceDesc}>{sub.description}</Text>

            <View style={styles.perksRow}>
              <View style={styles.perk}>
                <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                <Text style={styles.perkText}>30-Day Guarantee</Text>
              </View>
              <View style={styles.perk}>
                <Ionicons name="checkmark-circle" size={14} color="#0284C7" />
                <Text style={styles.perkText}>Standard Rate</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.addBucketBtn}
                onPress={() => handleAddToBucket(sub)}
              >
                <Ionicons name="basket-outline" size={16} color="#0A84FF" />
                <Text style={styles.addBucketText}>Add to Bucket</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => handleBookSlot(sub)}
              >
                <Text style={styles.bookNowText}>Book Slot</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerBucketBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E5F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0A84FF',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 42,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  catTabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.xs,
  },
  catTabsContent: {
    paddingHorizontal: Spacing.md,
  },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: Spacing.xs,
  },
  selectedCatTab: {
    backgroundColor: '#0A84FF', // Big Bazaar orange
  },
  catTabIcon: {
    marginRight: 6,
  },
  catTabText: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectedCatTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
  },
  resultsCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  cardTitleBox: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  serviceName: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 3,
  },
  durationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  priceTag: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284C7',
  },
  serviceDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  perksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: Spacing.xs,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  perkText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBucketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0A84FF',
    backgroundColor: '#E5F1FF',
    flex: 1,
    marginRight: Spacing.sm,
  },
  addBucketText: {
    ...Typography.bodyBold,
    color: '#0A84FF',
    fontSize: 13,
    marginLeft: 4,
  },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    flex: 1,
  },
  bookNowText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 13,
    marginRight: 4,
  },
});

export default ServicesScreen;
