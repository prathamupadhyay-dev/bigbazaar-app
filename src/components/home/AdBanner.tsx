import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const ADS = [
  {
    id: '1',
    category: 'Service',
    title: 'Certified Experts',
    subtitle: 'Top-rated professionals for your home',
    bgColor: '#EFF6FF', // Blue-50
    accentColor: '#2563EB', // Blue-600
    icon: 'shield-checkmark',
  },
  {
    id: '2',
    category: 'Product',
    title: 'Lightning Fast',
    subtitle: 'Get your products delivered today',
    bgColor: '#FEF2F2', // Red-50
    accentColor: '#DC2626', // Red-600
    icon: 'flash',
  },
  {
    id: '3',
    category: 'Deals',
    title: 'No Hidden Fees',
    subtitle: '100% transparent pricing guarantees',
    bgColor: '#F0FDF4', // Green-50
    accentColor: '#16A34A', // Green-600
    icon: 'pricetag',
  },
];

export const AdBanner: React.FC = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollInterval = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoScroll = () => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);
    
    scrollInterval.current = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= ADS.length) {
        nextIndex = 0;
      }
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * CARD_WIDTH,
        animated: true,
      });
      
      setActiveIndex(nextIndex);
    }, 4000); 
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [activeIndex]);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleDragBegin = () => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);
  };

  const handleDragEnd = () => {
    startAutoScroll();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollBeginDrag={handleDragBegin}
        onScrollEndDrag={handleDragEnd}
        scrollEventThrottle={16}
      >
        {ADS.map((ad) => (
          <TouchableOpacity
            key={ad.id}
            style={[styles.card, { width: CARD_WIDTH, backgroundColor: ad.bgColor }]}
            activeOpacity={0.9}
            onPress={() => (navigation as any).navigate('Search', { query: ad.category })}
          >
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={[styles.adCategory, { color: ad.accentColor }]}>{ad.category.toUpperCase()}</Text>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <Text style={styles.adSubtitle}>{ad.subtitle}</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: ad.accentColor + '15' }]}>
                <Ionicons name={ad.icon as any} size={42} color={ad.accentColor} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {ADS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i ? styles.dotActive : styles.dotInactive
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  card: {
    height: 140, 
    borderRadius: 16, 
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  adCategory: {
    ...Typography.captionBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  adTitle: {
    ...Typography.heading2,
    color: '#0F172A',
    fontSize: 20,
    marginBottom: 4,
  },
  adSubtitle: {
    ...Typography.body,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: Colors.disabled,
  },
});

export default AdBanner;
