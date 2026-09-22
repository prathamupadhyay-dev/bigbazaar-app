import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';






















import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatPriceText } from '../../utils/formatters';

export const ServiceItemCard = ({
  item,
  isSaved = false,
  onPress,
  onBookPress,
  onSavePress
}) => {
  const navigation = useNavigation();
  const { requireAuth } = useApp();

  const isProduct = item.itemType === 'product';
  const scale = useRef(new Animated.Value(1)).current;
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.imageContainer}>
          {isImageLoading &&
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.background }]} />
          }
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)} />
          
          
          {/* Frosted Circular Wishlist Button */}
          <TouchableOpacity
            style={styles.frostedSaveButton}
            onPress={(e) => {
              e.stopPropagation();
              requireAuth(navigation, () => onSavePress(item));
            }}
            activeOpacity={0.7}>
            
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={16}
              color={isSaved ? Colors.error : Colors.textPrimary} />
            
          </TouchableOpacity>

          {/* Rating Pill */}
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>4.5</Text>
            <Ionicons name="star" size={10} color="#059669" style={{ marginHorizontal: 2 }} />
            <Text style={styles.ratingDivider}>|</Text>
            <Text style={styles.ratingCount}>10.4k</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemCategory} numberOfLines={1}>{item.category}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>{formatCurrency(parseFloat(item.price.replace(/[^0-9.]/g, '')) * 1.15)}</Text>
            <Text style={styles.price}>{formatPriceText(item.price)}</Text>
            <Text style={styles.discountText}>13% OFF</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>);

};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9', // extremely subtle border to lift the card
    overflow: 'hidden',
    marginBottom: Spacing.md,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.35,
    backgroundColor: Colors.background,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  image: {
    width: '100%',
    height: '100%'
  },
  frostedSaveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  ratingPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    ...Typography.captionBold,
    fontSize: 10,
    color: Colors.textPrimary
  },
  ratingDivider: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.disabled,
    marginHorizontal: 2
  },
  ratingCount: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary
  },
  contentContainer: {
    padding: 10,
    paddingTop: 9
  },
  itemTitle: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textPrimary
  },
  itemCategory: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  originalPrice: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
    marginRight: 4
  },
  price: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 4
  },
  discountText: {
    ...Typography.captionBold,
    color: '#D97706' // orange/brown for discount
  }
});

export default ServiceItemCard;
