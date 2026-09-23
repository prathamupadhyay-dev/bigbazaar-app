import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatPriceText } from '../../utils/formatters';

const LISTING_META = {
  p1: { location: 'Kottayam', postedAgo: '2h ago', rating: 4.7, reviews: 8 },
  p2: { location: 'Kochi', postedAgo: '5h ago', rating: 4.4, reviews: 3 },
  p3: { location: 'Bengaluru', postedAgo: '1d ago', rating: 4.9, reviews: 12 },
  p4: { location: 'Kottayam', postedAgo: '3h ago', rating: 4.6, reviews: 5 },
  p5: { location: 'Kochi', postedAgo: '2d ago', rating: 4.8, reviews: 7 },
  p6: { location: 'Alappuzha', postedAgo: '4h ago', rating: 0, reviews: 0 },
  p7: { location: 'Thrissur', postedAgo: '1d ago', rating: 4.5, reviews: 2 },
  p8: { location: 'Kottayam', postedAgo: '6h ago', rating: 0, reviews: 0 }
};

export const ServiceItemCard = ({ item, isSaved = false, onPress, onBookPress, onSavePress }) => {
  const navigation = useNavigation();
  const { requireAuth } = useApp();
  const scale = useRef(new Animated.Value(1)).current;
  const [isImageLoading, setIsImageLoading] = useState(true);
  const metadata = { ...(LISTING_META[item.id] || {}), ...item };
  const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
  const hasRatings = Number(metadata.reviews) > 0;

  return (
    <TouchableWithoutFeedback onPress={() => onPress(item)} onPressIn={() => Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 20, bounciness: 5 }).start()} onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 5 }).start()}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.imageContainer}>
          {isImageLoading && <View style={[StyleSheet.absoluteFill, styles.imagePlaceholder]} />}
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" onLoadStart={() => setIsImageLoading(true)} onLoadEnd={() => setIsImageLoading(false)} />
          <TouchableOpacity style={styles.saveButton} onPress={(event) => { event.stopPropagation(); requireAuth(navigation, () => onSavePress(item)); }} activeOpacity={0.8} accessibilityLabel={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}>
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={20} color={isSaved ? Colors.brandOrange : Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.ratingRow}>
            {hasRatings ? <><Ionicons name="star" size={13} color={Colors.brandGreen} /><Text style={styles.ratingText}>{Number(metadata.rating).toFixed(1)}</Text><Text style={styles.ratingCount}>({metadata.reviews})</Text></> : <Text style={styles.noRating}>No ratings yet</Text>}
          </View>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.itemMeta} numberOfLines={1}>{metadata.location || 'Nearby'}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.itemMeta}>{metadata.postedAgo || 'Recently'}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPriceText(item.price)}</Text>
            <Text style={styles.originalPrice}>{formatCurrency(priceValue * 1.15)}</Text>
            <Text style={styles.discountText}>13% off</Text>
          </View>
          <View style={styles.bottomRow}><Text style={styles.actionHint}>View details</Text><Ionicons name="arrow-forward" size={15} color={Colors.brandBlue} /></View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surfaceRaised, borderRadius: 16, overflow: 'hidden', marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.hairline },
  imageContainer: { width: '100%', aspectRatio: 1.33, backgroundColor: Colors.surfaceBase, position: 'relative', overflow: 'hidden' },
  imagePlaceholder: { backgroundColor: '#EEF0F4' },
  image: { width: '100%', height: '100%' },
  saveButton: { position: 'absolute', top: 8, right: 8, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  contentContainer: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 11 },
  ratingRow: { minHeight: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  ratingText: { ...Typography.captionBold, color: Colors.textPrimary, marginLeft: 4, fontSize: 11 },
  ratingCount: { ...Typography.caption, color: Colors.textSecondary, marginLeft: 3, fontSize: 11 },
  noRating: { ...Typography.caption, color: Colors.textSecondary, fontSize: 11 },
  itemTitle: { ...Typography.bodyBold, color: Colors.textPrimary, fontSize: 14, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, minWidth: 0 },
  itemMeta: { ...Typography.secondary, color: Colors.textSecondary, fontSize: 11, marginLeft: 3, flexShrink: 1 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.disabled, marginHorizontal: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 8 },
  price: { ...Typography.bodyBold, fontSize: 16, color: Colors.textPrimary, marginRight: 6 },
  originalPrice: { ...Typography.secondary, color: Colors.textSecondary, textDecorationLine: 'line-through', marginRight: 5, fontSize: 11 },
  discountText: { ...Typography.captionBold, color: Colors.brandGreen, fontSize: 10 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.hairline },
  actionHint: { ...Typography.captionBold, color: Colors.brandBlue, fontSize: 11 }
});

export default ServiceItemCard;