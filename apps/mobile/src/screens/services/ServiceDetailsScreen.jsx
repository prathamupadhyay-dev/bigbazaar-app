import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { ServiceItemData } from '../../components/home/ServiceItemCard';
import { useApp } from '../../context/AppContext';
import { MOCK_SERVICES } from '../../components/home/ServiceGridList';

const { width } = Dimensions.get('window');

export default function ServiceDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  const { watchlist, toggleWatchlist, bucket, addToBucket, requireAuth, activeAddress } = useApp();

  const [imageExpanded, setImageExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Product specifics
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Blue');

  // Service specifics
  const [selectedDate, setSelectedDate] = useState('Today, 14th');
  const [selectedTime, setSelectedTime] = useState('09:00 AM');

  const [quantity, setQuantity] = useState(1);

  // Mount animation values
  const mountOpacity = React.useRef(new Animated.Value(0.85)).current;
  const mountScale = React.useRef(new Animated.Value(0.98)).current;

  React.useEffect(() => {
    Animated.parallel([
    Animated.timing(mountOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }),
    Animated.timing(mountScale, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    })]
    ).start();
  }, []);

  const isSaved = item ? watchlist.includes(item.id) : false;
  const isInBucket = item ? bucket.some((b) => b.serviceId === item.id) : false;
  const bucketCount = bucket.reduce((sum, b) => sum + b.quantity, 0);
  const relatedServices = MOCK_SERVICES.filter((service) => service.itemType === 'service' && service.id !== item?.id).slice(0, 4);
  const reviews = [
    { name: 'Anita R.', text: 'Arrived on time and explained everything clearly.', rating: '5.0' },
    { name: 'Vikram S.', text: 'Good service and transparent pricing.', rating: '4.8' }
  ];

  if (!item) {
    return (
      <ScreenContainer>
        <Text>Item not found</Text>
      </ScreenContainer>);

  }

  const handleSave = () => {
    requireAuth(navigation, () => {
      toggleWatchlist(item.id);
    });
  };

  const handleBuyNow = () => {
    requireAuth(navigation, () => {
      if (item.itemType === 'service') {
        const categoryMap = { Plumbing: 'Plumber', Tutoring: 'Home Tutor', 'AC Repair': 'AC Repair', 'Home Cleaning': 'Cleaning' };
        navigation.navigate('ServiceBooking', {
          categoryName: categoryMap[item.category] || 'Plumber',
          subCategoryName: item.title
        });
        return;
      }
      if (isInBucket) {
        // Go to cart
        navigation.navigate('Bucket');
        return;
      }

      addToBucket({
        serviceId: item.id,
        serviceName: item.title,
        categoryName: item.category || 'General',
        subCategoryName: item.itemType,
        price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
        quantity: quantity,
        size: item.itemType === 'product' ? selectedSize : undefined,
        color: item.itemType === 'product' ? selectedColor : undefined,
        serviceDate: item.itemType === 'service' ? selectedDate : undefined,
        timeSlot: item.itemType === 'service' ? selectedTime : undefined,
        imageUrl: item.imageUrl
      });
      // Navigate to Cart (Bucket)
      navigation.navigate('Bucket');
    });
  };

  const images = [item.imageUrl, item.imageUrl, item.imageUrl]; // Mock 3 images

  return (
    <Animated.View style={{ flex: 1, opacity: mountOpacity, transform: [{ scale: mountScale }] }}>
      <ScreenContainer noPadding>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleSave}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={isSaved ? Colors.error : Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Bucket')}>
            <Ionicons name="cart-outline" size={24} color={Colors.textPrimary} />
            {bucketCount > 0 &&
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{bucketCount}</Text>
              </View>
              }
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Large Image Slider */}
        <View>
          <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.sliderContainer}
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                setCurrentImageIndex(Math.round(x / width));
              }}
              scrollEventThrottle={16}>
              
            {images.map((img, idx) =>
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => setImageExpanded(true)}>
                <Image source={{ uri: img }} style={styles.heroImage} resizeMode="contain" />
              </TouchableOpacity>
              )}
          </ScrollView>
          <View style={styles.paginationDots}>
            {images.map((_, idx) =>
              <View key={idx} style={[styles.dot, currentImageIndex === idx && styles.dotActive]} />
              )}
          </View>
        </View>
        
        {/* Service summary */}
        <View style={styles.titleSection}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.serviceMetaRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.serviceMetaText}>4.8 (24 reviews)</Text>
            <View style={styles.metaDot} />
            <Text style={styles.serviceMetaText}>Verified professional</Text>
          </View>
          <Text style={styles.serviceDescription}>
            Reliable {item.category || 'local'} service from a verified professional. Choose a convenient slot and we’ll confirm the visit with you.
          </Text>
        </View>

        <View style={styles.serviceInfoCard}>
          <View style={styles.serviceInfoItem}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View><Text style={styles.serviceInfoLabel}>Duration</Text><Text style={styles.serviceInfoValue}>45–90 mins</Text></View>
          </View>
          <View style={styles.serviceInfoItem}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View><Text style={styles.serviceInfoLabel}>Service area</Text><Text style={styles.serviceInfoValue}>{activeAddress?.city || 'Your area'}</Text></View>
          </View>
          <View style={styles.serviceInfoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
            <View><Text style={styles.serviceInfoLabel}>Guarantee</Text><Text style={styles.serviceInfoValue}>Service support</Text></View>
          </View>
        </View>

        {/* Product Variants */}
        {item.itemType === 'product' &&
          <View style={styles.variantsSection}>
            <Text style={styles.variantTitle}>Size</Text>
            <View style={styles.variantRow}>
              {['S', 'M', 'L', 'XL'].map((size) =>
              <TouchableOpacity
                key={size}
                style={[styles.variantBox, selectedSize === size && styles.variantBoxSelected]}
                onPress={() => setSelectedSize(size)}>
                
                  <Text style={[styles.variantText, selectedSize === size && styles.variantTextSelected]}>{size}</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.variantTitle, { marginTop: Spacing.md }]}>Color</Text>
            <View style={styles.variantRow}>
              {['Blue', 'Black', 'White', 'Red'].map((color) =>
              <TouchableOpacity
                key={color}
                style={[styles.variantBox, selectedColor === color && styles.variantBoxSelected]}
                onPress={() => setSelectedColor(color)}>
                
                  <Text style={[styles.variantText, selectedColor === color && styles.variantTextSelected]}>{color}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          }

        {/* Service Scheduling */}
        {item.itemType === 'service' &&
          <View style={styles.variantsSection}>
            <Text style={styles.variantTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              {['Today, 14th', 'Tomorrow, 15th', 'Thu, 16th', 'Fri, 17th'].map((date) =>
              <TouchableOpacity
                key={date}
                style={[styles.variantBox, selectedDate === date && styles.variantBoxSelected]}
                onPress={() => setSelectedDate(date)}>
                
                  <Text style={[styles.variantText, selectedDate === date && styles.variantTextSelected]}>{date}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <Text style={styles.variantTitle}>Select Time</Text>
            <View style={styles.variantRow}>
              {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((time) =>
              <TouchableOpacity
                key={time}
                style={[styles.variantBox, selectedTime === time && styles.variantBoxSelected, { marginBottom: Spacing.sm }]}
                onPress={() => setSelectedTime(time)}>
                
                  <Text style={[styles.variantText, selectedTime === time && styles.variantTextSelected]}>{time}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          }

        {/* Address */}
        <View style={styles.addressSection}>
          <Text style={styles.addressText}>{activeAddress.houseNo}, {activeAddress.street}, {activeAddress.city} - {activeAddress.pincode}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Pickup time for this item</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.listOption}>
          <Text style={styles.listOptionText}>View Terms and Conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.disabled} />
        </TouchableOpacity>

        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}><Text style={styles.sectionTitle}>Similar services</Text><Text style={styles.relatedHint}>More near you</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
            {relatedServices.map((service) => <TouchableOpacity key={service.id} style={styles.relatedCard} onPress={() => navigation.push('ServiceDetails', { item: service })}>
              <Image source={{ uri: service.imageUrl }} style={styles.relatedImage} />
              <Text style={styles.relatedTitle} numberOfLines={2}>{service.title}</Text>
              <Text style={styles.relatedPrice}>{service.price}</Text>
            </TouchableOpacity>)}
          </ScrollView>
        </View>

        <View style={styles.reviewsSection}>
          <View style={styles.relatedHeader}><Text style={styles.sectionTitle}>Customer reviews</Text><View style={styles.ratingSummary}><Ionicons name="star" size={15} color="#F59E0B" /><Text style={styles.ratingSummaryText}>4.8 · 24 reviews</Text></View></View>
          {reviews.map((review) => <View key={review.name} style={styles.reviewCard}><View style={styles.reviewTop}><Text style={styles.reviewName}>{review.name}</Text><Text style={styles.reviewRating}>★ {review.rating}</Text></View><Text style={styles.reviewText}>{review.text}</Text></View>)}
        </View>
        
        {/* Padding for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

        {/* Floating Action Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{item.price}</Text>
          <Text style={styles.priceSubtitle}>{item.itemType === 'product' ? 'Plus taxes' : 'Estimated total'}</Text>
        </View>
        <View style={styles.qtyContainer}>
          <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              
            <Ionicons name="remove" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}>
              
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
            style={[styles.ctaButton, item.itemType === 'product' ? styles.ctaProduct : styles.ctaService]}
            onPress={handleBuyNow}>
            
          <Text style={styles.ctaButtonText}>{item.itemType === 'service' ? 'Book Now' : isInBucket ? 'Go to Cart' : 'Add to Cart'}</Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Image Modal */}
      <Modal visible={imageExpanded} transparent={true} animationType="fade" onRequestClose={() => setImageExpanded(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeaderRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setImageExpanded(false)}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalImageWrapper}>
             <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                setCurrentImageIndex(Math.round(x / width));
              }}
              scrollEventThrottle={16}>
                
                {images.map((img, idx) =>
                <View key={idx} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: img }} style={styles.modalMainImage} resizeMode="contain" />
                  </View>
                )}
             </ScrollView>
          </View>

          <View style={styles.modalThumbnailsRow}>
            {images.map((img, idx) =>
              <TouchableOpacity key={idx} style={[styles.thumbnailBtn, currentImageIndex === idx && styles.thumbnailBtnActive]}>
                <Image source={{ uri: img }} style={styles.thumbnailImg} resizeMode="cover" />
              </TouchableOpacity>
              )}
          </View>
        </SafeAreaView>
      </Modal>

    </ScreenContainer>
    </Animated.View>);

}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  iconBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.white
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white
  },
  sliderContainer: {
    width: width
  },
  heroImage: {
    width: width,
    height: width,
    backgroundColor: Colors.background
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4
  },
  dotActive: {
    backgroundColor: Colors.primary
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  statItem: {
    flex: 1
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  statValueDark: {
    ...Typography.heading2,
    fontSize: 16,
    color: Colors.textPrimary
  },
  statValueRed: {
    ...Typography.heading2,
    fontSize: 16,
    color: Colors.error
  },
  strikeThrough: {
    textDecorationLine: 'line-through'
  },
  titleSection: {
    padding: Spacing.lg
  },
  itemTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.md
  },
  serviceMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  serviceMetaText: { ...Typography.caption, color: Colors.textSecondary, marginLeft: 5 },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.disabled, marginHorizontal: 8 },
  serviceDescription: { ...Typography.body, color: Colors.textSecondary, lineHeight: 21 },
  serviceInfoCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.lg, padding: Spacing.md, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: Colors.border },
  serviceInfoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  serviceInfoLabel: { ...Typography.caption, color: Colors.textSecondary, marginLeft: Spacing.sm },
  serviceInfoValue: { ...Typography.bodyBold, color: Colors.textPrimary, marginLeft: Spacing.sm },
  conditionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20
  },
  conditionValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary
  },
  deliverySection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg
  },
  deliveryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    marginRight: Spacing.sm
  },
  deliveryBoxSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F5F9FF'
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.disabled,
    marginRight: Spacing.xs
  },
  deliveryTitle: {
    ...Typography.body,
    color: Colors.primary
  },
  deliveryTitleInactive: {
    ...Typography.body,
    color: Colors.textSecondary
  },
  deliveryPrice: {
    ...Typography.bodyBold,
    color: Colors.textPrimary
  },
  deliveryPriceInactive: {
    ...Typography.bodyBold,
    color: Colors.textPrimary
  },
  addressSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  addressText: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 4
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  listOptionText: {
    ...Typography.body,
    color: Colors.textPrimary
  },
  relatedSection: { padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.border },
  relatedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  relatedHint: { ...Typography.caption, color: Colors.textSecondary },
  relatedScroll: { paddingRight: Spacing.md },
  relatedCard: { width: 150, marginRight: Spacing.sm, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', paddingBottom: Spacing.sm },
  relatedImage: { width: '100%', height: 90, backgroundColor: '#F1F5F9' },
  relatedTitle: { ...Typography.bodyBold, fontSize: 12, color: Colors.textPrimary, paddingHorizontal: Spacing.sm, marginTop: Spacing.xs },
  relatedPrice: { ...Typography.captionBold, color: Colors.primary, paddingHorizontal: Spacing.sm, marginTop: 3 },
  reviewsSection: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  ratingSummary: { flexDirection: 'row', alignItems: 'center' },
  ratingSummaryText: { ...Typography.captionBold, color: Colors.textSecondary, marginLeft: 4 },
  reviewCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: Spacing.sm, marginBottom: Spacing.sm },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewName: { ...Typography.bodyBold, color: Colors.textPrimary, fontSize: 13 },
  reviewRating: { ...Typography.captionBold, color: '#B45309' },
  reviewText: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg
  },
  priceContainer: {
    flex: 1, // Take available space on left
    justifyContent: 'center'
  },
  priceText: {
    ...Typography.heading2,
    fontSize: 22,
    color: Colors.textPrimary
  },
  priceSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginRight: Spacing.md
  },
  qtyBtn: {
    padding: Spacing.sm
  },
  qtyText: {
    ...Typography.bodyBold,
    paddingHorizontal: Spacing.sm
  },
  variantsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  variantTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.sm
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  variantBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: Spacing.sm
  },
  variantBoxSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F7FF'
  },
  variantText: {
    ...Typography.body,
    color: Colors.textSecondary
  },
  variantTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold'
  },
  ctaButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ctaProduct: {
    backgroundColor: '#0A84FF' // Blue for Product
  },
  ctaService: {
    backgroundColor: '#EAB308' // Yellow for Service
  },
  ctaButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md
  },
  modalCloseBtn: {
    padding: Spacing.sm,
    backgroundColor: '#F1F5F9',
    borderRadius: 20
  },
  modalImageWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  modalMainImage: {
    width: '100%',
    height: '100%'
  },
  modalThumbnailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.lg
  },
  thumbnailBtn: {
    width: 60,
    height: 60,
    marginHorizontal: Spacing.xs,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden'
  },
  thumbnailBtnActive: {
    borderColor: Colors.primary
  },
  thumbnailImg: {
    width: '100%',
    height: '100%'
  }
});
