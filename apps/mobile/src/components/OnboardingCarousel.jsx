import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import Spacing from '../constants/spacing';

const { width, height } = Dimensions.get('window');

const SLIDES = [
{
  id: '1',
  title: 'Unbeatable Prices!',
  subtitle: 'Exclusive discounts, limited-time deals & the best prices',
  color: '#FCF3FE'
},
{
  id: '2',
  title: 'Your Favorite Brands,\nAll in One Place',
  subtitle: 'From premium labels to everyday essentials.',
  color: '#FCF3FE'
},
{
  id: '3',
  title: 'Fashion for Everyone,\nEvery Occasion',
  subtitle: 'Find styles that match your vibe',
  color: '#FCF3FE'
}];






export const OnboardingCarousel = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress and close button */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {SLIDES.map((_, index) =>
          <View
            key={index}
            style={[
            styles.progressBar,
            index === currentIndex ? styles.progressBarActive : styles.progressBarInactive]
            } />

          )}
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onComplete}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollContainer}>
        
        {SLIDES.map((slide, index) =>
        <View key={slide.id} style={[styles.slide, { backgroundColor: slide.color }]}>
            {/* Mock Image Placeholder */}
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={64} color={Colors.disabled} />
              <Text style={{ color: Colors.disabled, marginTop: 8 }}>Slide {index + 1} Visuals</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
          <Text style={styles.primaryButtonText}>Get Flat ₹300 Off</Text>
          <Text style={styles.primaryButtonSubText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF3FE'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    zIndex: 10,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0
  },
  progressContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: Spacing.lg,
    gap: 8
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2
  },
  progressBarActive: {
    backgroundColor: Colors.textPrimary
  },
  progressBarInactive: {
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  scrollContainer: {
    flex: 1
  },
  slide: {
    width,
    height: height,
    paddingTop: height * 0.15
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 24,
    marginBottom: 40
  },
  textContainer: {
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    paddingBottom: height * 0.2 // Leave room for button
  },
  title: {
    ...Typography.heading1,
    fontSize: 26,
    color: '#2D334A', // Dark navy text
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 34
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    lineHeight: 22
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'transparent'
  },
  primaryButton: {
    backgroundColor: '#F41E68', // The pink red color
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16,
    marginBottom: 2
  },
  primaryButtonSubText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11
  }
});

export default OnboardingCarousel;