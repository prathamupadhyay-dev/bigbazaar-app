import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export interface ServiceItemData {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  timeEstimate: string; // for service duration, or delivery ETA
  category: string;
  itemType?: 'service' | 'product'; // New discriminator
  endsIn?: string;
  isWinning?: boolean;
  noFees?: boolean;
}

interface ServiceItemCardProps {
  item: ServiceItemData;
  isSaved?: boolean;
  onPress: (item: ServiceItemData) => void;
  onBookPress: (item: ServiceItemData) => void;
  onSavePress: (item: ServiceItemData) => void;
}

export const ServiceItemCard: React.FC<ServiceItemCardProps> = ({
  item,
  isSaved = false,
  onPress,
  onBookPress,
  onSavePress,
}) => {
  const isProduct = item.itemType === 'product';
  const scale = useRef(new Animated.Value(1)).current;
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <TouchableWithoutFeedback 
      onPress={() => onPress(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.imageContainer}>
          {isImageLoading && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.background }]} />
          )}
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)}
          />
          
          {/* Frosted Circular Watchlist Button */}
          <TouchableOpacity 
            style={styles.frostedSaveButton} 
            onPress={(e) => { e.stopPropagation(); onSavePress(item); }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isSaved ? "star" : "star-outline"} 
              size={16} 
              color={isSaved ? Colors.primary : Colors.textPrimary} 
            />
          </TouchableOpacity>

          {item.noFees && (
            <View style={styles.noFeesBadge}>
              <Text style={styles.noFeesText}>No Fees</Text>
            </View>
          )}

          {/* Frosted Floating Pill Badge */}
          <View style={[styles.categoryBadge, isProduct && { backgroundColor: 'rgba(219, 234, 254, 0.9)' }]}>
            <Ionicons name={isProduct ? "cube-outline" : "construct-outline"} size={12} color={isProduct ? "#1E40AF" : "#854D0E"} />
            <Text style={[styles.categoryText, isProduct && { color: '#1E40AF' }]}>
              {isProduct ? 'Product' : 'Service'}
            </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
          
          {item.endsIn ? (
            <Text style={styles.timeEstimate}>
              Ends in <Text style={styles.timeBold}>{item.endsIn}</Text>
            </Text>
          ) : (
            <Text style={styles.timeEstimate}>
              {isProduct ? 'Delivery in ' : 'Estimated '}
              <Text style={styles.timeBold}>{item.timeEstimate}</Text>
            </Text>
          )}

          <TouchableOpacity 
            style={[styles.bookButton, item.isWinning && styles.winningButton, isProduct && styles.buyButton]} 
            onPress={(e) => { e.stopPropagation(); onBookPress(item); }}
            disabled={item.isWinning}
            activeOpacity={0.9}
          >
            <Text style={[styles.bookButtonText, item.isWinning && styles.winningButtonText]}>
              {item.isWinning 
                ? `Winning ${(parseFloat(item.price.replace(/[^0-9.]/g, '')) * 0.1).toFixed(0)}` 
                : (item.endsIn 
                    ? `Bid ${(parseFloat(item.price.replace(/[^0-9.]/g, '')) * 0.45).toFixed(0)}` 
                    : (isProduct ? 'Buy Now' : 'Book Now'))}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
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
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.1, // slightly wider to frame products beautifully
    backgroundColor: Colors.background,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
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
    elevation: 2,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(254, 240, 138, 0.9)', // translucent yellow by default (service)
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16, // floating pill
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  noFeesBadge: {
    position: 'absolute',
    bottom: 38, // Above the shipping badge
    left: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.9)', // Slate-700 translucent
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noFeesText: {
    ...Typography.captionBold,
    color: Colors.white,
    fontSize: 10,
  },
  categoryText: {
    ...Typography.captionBold,
    color: '#854D0E', // dark yellow text
    fontSize: 11,
    marginLeft: 4,
  },
  contentContainer: {
    padding: Spacing.sm,
    paddingTop: Spacing.md,
  },
  itemTitle: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    ...Typography.heading3,
    fontSize: 16,
    color: '#1E293B', // Note: specific accent near-black color not yet tokenized
    marginBottom: 4,
  },
  timeEstimate: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  timeBold: {
    color: '#334155', // Note: specific dark slate color not yet tokenized
    fontWeight: '700',
  },
  bookButton: {
    width: '100%',
    backgroundColor: '#EAB308', // Note: specific yellow service accent color not yet tokenized
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    ...Typography.button,
    fontSize: 13,
    color: Colors.white,
    fontWeight: '700',
  },
  winningButton: {
    backgroundColor: '#F1F5F9', // Gray-100
  },
  winningButtonText: {
    color: '#94A3B8', // Gray-400
  },
  buyButton: {
    backgroundColor: Colors.primary, 
  }
});

export default ServiceItemCard;
