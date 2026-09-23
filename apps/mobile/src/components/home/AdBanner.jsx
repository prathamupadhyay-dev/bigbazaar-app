import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const ADS = [
  { id: '1', colors: ['#E96D0F', '#C24A08'], eyebrow: 'Sell with ease', title: 'Turn unused things into cash', subtitle: 'List locally and meet nearby buyers', cta: 'Post an ad', icon: 'pricetag-outline', route: 'PostAd' },
  { id: '2', colors: ['#6E4CC7', '#4D338E'], eyebrow: 'Services at your door', title: 'Experts at your doorstep', subtitle: 'Book trusted professionals in minutes', cta: 'Explore services', icon: 'construct-outline', route: 'Services' },
  { id: '3', colors: ['#E96D0F', '#C24A08'], eyebrow: 'Sell with ease', title: 'Your next buyer is nearby', subtitle: 'Reach people looking in your area', cta: 'Post an ad', icon: 'people-outline', route: 'PostAd' }
];

export const AdBanner = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollInterval = useRef(null);

  useEffect(() => {
    scrollInterval.current = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % ADS.length;
        scrollViewRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
        return next;
      });
    }, 3500);
    return () => scrollInterval.current && clearInterval(scrollInterval.current);
  }, []);

  const pauseAutoScroll = () => scrollInterval.current && clearInterval(scrollInterval.current);
  const resumeAutoScroll = () => {
    pauseAutoScroll();
    scrollInterval.current = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % ADS.length;
        scrollViewRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
        return next;
      });
    }, 3500);
  };

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / slideSize));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollBeginDrag={pauseAutoScroll}
        onScrollEndDrag={resumeAutoScroll}
        scrollEventThrottle={16}>
        {ADS.map((ad) => (
          <TouchableOpacity key={ad.id} activeOpacity={0.92} style={{ width: CARD_WIDTH }} onPress={() => navigation.navigate(ad.route)}>
            <LinearGradient colors={ad.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
              <View style={styles.copy}>
                <Text style={styles.eyebrow}>{ad.eyebrow}</Text>
                <Text style={styles.title}>{ad.title}</Text>
                <Text style={styles.subtitle}>{ad.subtitle}</Text>
                <View style={styles.cta}><Text style={[styles.ctaText, ad.route === 'Services' && { color: Colors.brandPurple }]}>{ad.cta}</Text><Ionicons name="arrow-forward" size={15} color={ad.route === 'Services' ? Colors.brandPurple : Colors.brandOrange} /></View>
              </View>
              <View style={styles.artwork}><View style={styles.artworkGlow} /><Ionicons name={ad.icon} size={58} color="rgba(255,255,255,0.92)" /></View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {ADS.map((ad, index) => <View key={ad.id} style={[styles.dot, index === activeIndex ? styles.dotActive : styles.dotInactive]} />)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: Spacing.sm, marginBottom: Spacing.md },
  card: { height: 178, borderRadius: 22, overflow: 'hidden', paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  copy: { flex: 1, zIndex: 1 },
  eyebrow: { ...Typography.captionBold, color: 'rgba(255,255,255,0.86)', fontSize: 13, marginBottom: 8 },
  title: { ...Typography.heading2, color: Colors.white, fontSize: 24, lineHeight: 28, marginBottom: 7 },
  subtitle: { ...Typography.caption, color: 'rgba(255,255,255,0.82)', fontSize: 12, marginBottom: 13 },
  cta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  ctaText: { ...Typography.captionBold, color: Colors.brandOrange, marginRight: 5 },
  artwork: { width: 112, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  artworkGlow: { position: 'absolute', width: 118, height: 118, borderRadius: 59, backgroundColor: 'rgba(255,255,255,0.14)' },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 9 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  dotActive: { width: 19, backgroundColor: Colors.brandOrange },
  dotInactive: { width: 6, backgroundColor: Colors.hairline }
});

export default AdBanner;