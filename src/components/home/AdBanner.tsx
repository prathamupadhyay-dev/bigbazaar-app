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
  { id: '1', image: require('../../assets/images/banner4.jpg') },
  { id: '2', image: require('../../assets/images/banner5.jpg') },
  { id: '3', image: require('../../assets/images/banner6.jpg') },
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
            style={[styles.card, { width: CARD_WIDTH }]}
            activeOpacity={0.9}
          >
            <Image 
              source={ad.image} 
              style={styles.bannerImage} 
              resizeMode="cover"
            />
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
    height: 180, // slightly taller for image banners
    borderRadius: 16, 
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
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
