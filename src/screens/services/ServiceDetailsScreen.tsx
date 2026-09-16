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

const { width } = Dimensions.get('window');

export default function ServiceDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = (route.params as any) || {};
  const { watchlist, toggleWatchlist, addToBucket } = useApp();
  
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
        useNativeDriver: true,
      }),
      Animated.timing(mountScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const isSaved = item ? watchlist.includes(item.id) : false;
  
  if (!item) {
    return (
      <ScreenContainer>
        <Text>Item not found</Text>
      </ScreenContainer>
    );
  }

  const handleSave = () => {
    toggleWatchlist(item.id);
  };

  const handleBuyNow = () => {
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
      imageUrl: item.imageUrl,
    });
    // Navigate to Cart (Bucket)
    (navigation as any).navigate('Main', { screen: 'Cart' });
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
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleSave}>
            <Ionicons name={isSaved ? "star" : "star-outline"} size={24} color={isSaved ? Colors.primary : Colors.textPrimary} />
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
            scrollEventThrottle={16}
          >
            {images.map((img, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.9} onPress={() => setImageExpanded(true)}>
                <Image source={{ uri: img }} style={styles.heroImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.paginationDots}>
            {images.map((_, idx) => (
              <View key={idx} style={[styles.dot, currentImageIndex === idx && styles.dotActive]} />
            ))}
          </View>
        </View>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Retail price</Text>
            <Text style={[styles.statValueDark, styles.strikeThrough]}>${(parseFloat(item.price.replace(/[^0-9.]/g, '')) * 1.5).toFixed(2)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Save</Text>
            <Text style={styles.statValueRed}>33%</Text>
          </View>
        </View>

        {/* Title & Condition */}
        <View style={styles.titleSection}>
          <Text style={styles.itemTitle}>{item.title}, Premium Service, Verified Professional</Text>
          <Text style={styles.conditionText}>
            Condition{'\n'}
            <Text style={styles.conditionValue}>New. Best By: 09/21/2026</Text>
          </Text>
        </View>

        {/* Delivery Options */}
        <View style={styles.deliverySection}>
          <View style={[styles.deliveryBox, styles.deliveryBoxSelected]}>
            <View style={styles.deliveryHeader}>
              <View style={styles.radioSelected}>
                <View style={styles.radioInner} />
              </View>
              <Text style={styles.deliveryTitle}>Pickup</Text>
            </View>
            <Text style={styles.deliveryPrice}>Free</Text>
          </View>
          
          <View style={styles.deliveryBox}>
            <View style={styles.deliveryHeader}>
              <View style={styles.radioUnselected} />
              <Text style={styles.deliveryTitleInactive}>Shipping</Text>
            </View>
            <Text style={styles.deliveryPriceInactive}>$15</Text>
          </View>
        </View>

        {/* Product Variants */}
        {item.itemType === 'product' && (
          <View style={styles.variantsSection}>
            <Text style={styles.variantTitle}>Size</Text>
            <View style={styles.variantRow}>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.variantBox, selectedSize === size && styles.variantBoxSelected]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.variantText, selectedSize === size && styles.variantTextSelected]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.variantTitle, { marginTop: Spacing.md }]}>Color</Text>
            <View style={styles.variantRow}>
              {['Blue', 'Black', 'White', 'Red'].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.variantBox, selectedColor === color && styles.variantBoxSelected]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[styles.variantText, selectedColor === color && styles.variantTextSelected]}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Service Scheduling */}
        {item.itemType === 'service' && (
          <View style={styles.variantsSection}>
            <Text style={styles.variantTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              {['Today, 14th', 'Tomorrow, 15th', 'Thu, 16th', 'Fri, 17th'].map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[styles.variantBox, selectedDate === date && styles.variantBoxSelected]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.variantText, selectedDate === date && styles.variantTextSelected]}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.variantTitle}>Select Time</Text>
            <View style={styles.variantRow}>
              {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.variantBox, selectedTime === time && styles.variantBoxSelected, { marginBottom: Spacing.sm }]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.variantText, selectedTime === time && styles.variantTextSelected]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Address */}
        <View style={styles.addressSection}>
          <Text style={styles.addressText}>1550 Commerce Drive, Stow, OH 44224 USA</Text>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>Pickup time for this item</Text>
          </View>
        </View>

        {/* List Options */}
        <TouchableOpacity style={styles.listOption}>
          <Text style={styles.listOptionText}>Bids (7)</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.disabled} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listOption}>
          <Text style={styles.listOptionText}>View Terms and Conditions</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.disabled} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listOption}>
          <Text style={styles.listOptionText}>Look up on Google</Text>
          <Ionicons name="open-outline" size={20} color={Colors.disabled} />
        </TouchableOpacity>

        {/* SKU */}
        <View style={styles.skuSection}>
          <Text style={styles.skuLabel}>SKU number</Text>
          <Text style={styles.skuValue}>OLARA{Math.floor(Math.random() * 10000000)}</Text>
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
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn} 
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.ctaButton, item.itemType === 'product' ? styles.ctaProduct : styles.ctaService]}
          onPress={handleBuyNow}
        >
          <Text style={styles.ctaButtonText}>{item.itemType === 'product' ? 'Add to Cart' : 'Book Now'}</Text>
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
              scrollEventThrottle={16}
             >
                {images.map((img, idx) => (
                  <View key={idx} style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: img }} style={styles.modalMainImage} resizeMode="contain" />
                  </View>
                ))}
             </ScrollView>
          </View>

          <View style={styles.modalThumbnailsRow}>
            {images.map((img, idx) => (
              <TouchableOpacity key={idx} style={[styles.thumbnailBtn, currentImageIndex === idx && styles.thumbnailBtnActive]}>
                <Image source={{ uri: img }} style={styles.thumbnailImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </Modal>

    </ScreenContainer>
    </Animated.View>
  );
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
    borderBottomColor: Colors.border,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  sliderContainer: {
    width: width,
  },
  heroImage: {
    width: width,
    height: width,
    backgroundColor: Colors.background,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValueDark: {
    ...Typography.heading2,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  statValueRed: {
    ...Typography.heading2,
    fontSize: 16,
    color: Colors.error,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
  },
  titleSection: {
    padding: Spacing.lg,
  },
  itemTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  conditionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  conditionValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  deliverySection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  deliveryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    marginRight: Spacing.sm,
  },
  deliveryBoxSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F5F9FF',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.disabled,
    marginRight: Spacing.xs,
  },
  deliveryTitle: {
    ...Typography.body,
    color: Colors.primary,
  },
  deliveryTitleInactive: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  deliveryPrice: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  deliveryPriceInactive: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  addressSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addressText: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listOptionText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  skuSection: {
    padding: Spacing.lg,
  },
  skuLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  skuValue: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
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
    paddingBottom: Spacing.lg,
  },
  priceContainer: {
    flex: 1, // Take available space on left
    justifyContent: 'center',
  },
  priceText: {
    ...Typography.heading2,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  priceSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginRight: Spacing.md,
  },
  qtyBtn: {
    padding: Spacing.sm,
  },
  qtyText: {
    ...Typography.bodyBold,
    paddingHorizontal: Spacing.sm,
  },
  variantsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  variantTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.sm,
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: Spacing.sm,
  },
  variantBoxSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F7FF',
  },
  variantText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  variantTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  ctaButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaProduct: {
    backgroundColor: '#0A84FF', // Blue for Product
  },
  ctaService: {
    backgroundColor: '#EAB308', // Yellow for Service
  },
  ctaButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCloseBtn: {
    padding: Spacing.sm,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
  },
  modalImageWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  modalMainImage: {
    width: '100%',
    height: '100%',
  },
  modalThumbnailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  thumbnailBtn: {
    width: 60,
    height: 60,
    marginHorizontal: Spacing.xs,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailBtnActive: {
    borderColor: Colors.primary,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
});
