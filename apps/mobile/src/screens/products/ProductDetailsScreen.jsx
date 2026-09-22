import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { MOCK_PRODUCTS } from './ProductListScreen';

const { width } = Dimensions.get('window');

export const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;
  const { watchlist, toggleWatchlist, bucket, addToBucket, requireAuth } = useApp();

  const [imageExpanded, setImageExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.disabled} />
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>);

  }

  const isSaved = watchlist.includes(product.id);
  const isInCart = bucket.some((b) => b.serviceId === product.id);
  const cartItem = bucket.find((b) => b.serviceId === product.id);

  const images = [
  product.imageUrl,
  `https://picsum.photos/seed/${product.id}2/400/400`,
  `https://picsum.photos/seed/${product.id}3/400/400`];


  const handleFavourite = () => {
    requireAuth(navigation, () => {
      toggleWatchlist(product.id);
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product on BigBazaar: ${product.title} - ${product.price}`,
        title: product.title
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleReport = () => {
    requireAuth(navigation, () => {
      Alert.alert(
        'Report Listing',
        'Why are you reporting this listing?',
        [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Suspicious/Fake', onPress: () => Alert.alert('Reported', 'Thank you for your report. We will review it shortly.') },
        { text: 'Inappropriate', onPress: () => Alert.alert('Reported', 'Thank you for your report. We will review it shortly.') },
        { text: 'Wrong Category', onPress: () => Alert.alert('Reported', 'Thank you for your report. We will review it shortly.') }]

      );
    });
  };

  const handleAddToCart = () => {
    requireAuth(navigation, () => {
      const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ''));
      addToBucket({
        serviceId: product.id,
        serviceName: product.title,
        categoryName: product.category,
        subCategoryName: product.condition,
        price: priceValue,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
        imageUrl: product.imageUrl
      });
      Alert.alert('Added to Cart', `${product.title} has been added to your cart.`, [
      { text: 'Continue Shopping' },
      { text: 'View Cart', onPress: () => navigation.navigate('Main', { screen: 'Cart' }) }]
      );
    });
  };

  const handleBuyNow = () => {
    requireAuth(navigation, () => {
      if (!isInCart) {
        addToBucket({
          serviceId: product.id,
          serviceName: product.title,
          categoryName: product.category,
          subCategoryName: product.condition,
          price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
          quantity,
          size: selectedSize,
          color: selectedColor,
          imageUrl: product.imageUrl,
        });
      }
      navigation.navigate('Checkout');
    });
  };

  const handleChat = () => {
    requireAuth(navigation, () => {
      navigation.navigate('Chat', { sellerName: product.sellerName, listingTitle: product.title });
    });
  };

  const categoryMatches = MOCK_PRODUCTS.filter((item) => item.id !== product.id && item.category === product.category);
  const relatedProducts = (categoryMatches.length ? categoryMatches : MOCK_PRODUCTS.filter((item) => item.id !== product.id)).slice(0, 4);

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={handleFavourite}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={22} color={isSaved ? Colors.error : Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
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
                <Image source={{ uri: img }} style={styles.heroImage} resizeMode="cover" />
              </TouchableOpacity>
            )}
          </ScrollView>
          <View style={styles.paginationDots}>
            {images.map((_, idx) =>
            <View key={idx} style={[styles.dot, currentImageIndex === idx && styles.dotActive]} />
            )}
          </View>
        </View>

        {/* Price & Discount */}
        <View style={styles.priceSection}>
          <View style={styles.priceMain}>
            <Text style={styles.currentPrice}>{product.price}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>33% OFF</Text>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{product.location}</Text>
          </View>
        </View>

        {/* Title & Condition */}
        <View style={styles.titleSection}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Condition:</Text>
            <Text style={styles.conditionValue}>{product.condition}</Text>
          </View>
          <Text style={styles.description}>Well-kept {product.condition.toLowerCase()} item from a verified local seller. Review the listing details and chat with the seller before ordering.</Text>
        </View>

        {/* Size Selection */}
        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>Size</Text>
          <View style={styles.optionRow}>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) =>
            <TouchableOpacity
              key={size}
              style={[styles.optionChip, selectedSize === size && styles.optionChipActive]}
              onPress={() => setSelectedSize(size)}>
              
                <Text style={[styles.optionChipText, selectedSize === size && styles.optionChipTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>Color</Text>
          <View style={styles.optionRow}>
            {['Blue', 'Black', 'White', 'Red', 'Green'].map((color) =>
            <TouchableOpacity
              key={color}
              style={[styles.optionChip, selectedColor === color && styles.optionChipActive]}
              onPress={() => setSelectedColor(color)}>
              
                <Text style={[styles.optionChipText, selectedColor === color && styles.optionChipTextActive]}>
                  {color}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerSection}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
              <View style={styles.sellerRating}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.sellerRatingText}>{product.sellerRating} Seller Rating</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
              <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
              <Text style={styles.chatBtnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Listing action */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
            <Ionicons name="flag-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.reportBtnText}>Report listing</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Delivery Options</Text>
          <View style={styles.deliveryRow}>
            <Ionicons name="car-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.deliveryText}>Free pickup from seller location</Text>
          </View>
          <View style={styles.deliveryRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
            <Text style={styles.deliveryText}>Buyer protection included</Text>
          </View>
        </View>

        {/* Related products */}
        <View style={styles.relatedSection}>
          <View style={styles.relatedHeader}><Text style={styles.sectionTitle}>You may also like</Text><Text style={styles.relatedHint}>Similar {product.category}</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
            {relatedProducts.map((item) =>
            <TouchableOpacity key={item.id} style={styles.relatedCard} onPress={() => navigation.push('ProductDetails', { product: item })}>
                <Image source={{ uri: item.imageUrl }} style={styles.relatedImage} />
                <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.relatedPrice}>{item.price}</Text>
                <Text style={styles.relatedLocation} numberOfLines={1}>{item.location}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Ionicons name="remove" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={20} color={Colors.white} />
          <Text style={styles.addToCartText}>{isInCart ? 'Update Cart' : 'Add to Cart'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
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
    </ScreenContainer>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
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
  headerBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 16,
    color: Colors.textPrimary
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
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
    height: width * 0.8,
    backgroundColor: '#F5F5F5'
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24
  },
  priceSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  priceMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs
  },
  currentPrice: {
    ...Typography.heading1,
    fontSize: 28,
    color: Colors.primary,
    marginRight: Spacing.sm
  },
  originalPrice: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: Spacing.sm
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4
  },
  discountText: {
    ...Typography.bodyBold,
    fontSize: 12,
    color: '#B45309'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4
  },
  titleSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  productTitle: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  conditionLabel: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4
  },
  conditionValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.success
  },
  optionSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  optionTitle: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  optionChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary
  },
  optionChipText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  optionChipTextActive: {
    color: Colors.primary,
    fontWeight: '600'
  },
  sellerSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  sectionTitle: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: Spacing.md,
    borderRadius: 12
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md
  },
  sellerInfo: {
    flex: 1
  },
  sellerName: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 2
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sellerRatingText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8
  },
  chatBtnText: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.primary,
    marginLeft: 4
  },
  actionsSection: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'flex-end'
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginRight: Spacing.sm
  },
  actionBtnText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border
  },
  reportBtnText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4
  },
  deliverySection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  deliveryText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm
  },
  relatedSection: {
    padding: Spacing.md,
    paddingBottom: Spacing.md
  },
  description: { ...Typography.body, fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginTop: Spacing.sm },
  relatedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  relatedHint: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  relatedScroll: { paddingRight: Spacing.md },
  relatedCard: {
    width: 142,
    marginRight: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    paddingBottom: Spacing.sm
  },
  relatedImage: {
    width: '100%',
    height: 104,
    backgroundColor: '#F5F5F5'
  },
  relatedPrice: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
    marginTop: 4
  },
  relatedTitle: { ...Typography.bodyBold, fontSize: 12, color: Colors.textPrimary, paddingHorizontal: Spacing.xs, marginTop: Spacing.xs, lineHeight: 16 },
  relatedLocation: { ...Typography.caption, fontSize: 10, color: Colors.textSecondary, paddingHorizontal: Spacing.xs, marginTop: 2 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: Spacing.xs
  },
  qtyBtn: {
    padding: Spacing.sm
  },
  qtyText: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginLeft: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary
  },
  addToCartText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6
  },
  buyNowBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginLeft: Spacing.sm
  },
  buyNowText: {
    ...Typography.button,
    color: Colors.white
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md
  },
  modalCloseBtn: {
    padding: Spacing.xs
  },
  modalImageWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  modalMainImage: {
    width: width,
    height: width
  },
  modalThumbnailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Spacing.md
  },
  thumbnailBtn: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  thumbnailBtnActive: {
    borderColor: Colors.white
  },
  thumbnailImg: {
    width: '100%',
    height: '100%'
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    ...Typography.heading2,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8
  },
  backButtonText: {
    ...Typography.button,
    color: Colors.white
  }
});

export default ProductDetailsScreen;
