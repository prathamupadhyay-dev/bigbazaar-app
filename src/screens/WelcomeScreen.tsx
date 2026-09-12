import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import ScreenContainer from '../components/ScreenContainer';
import BigBazaarLogo from '../components/common/BigBazaarLogo';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import Spacing from '../constants/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  isLogoSlide?: boolean;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 0,
    title: 'Welcome to Big Bazaar',
    subtitle: 'Your one-stop destination for premium home services and expert tutoring.',
    badge: '🌟 Premium Experience',
    iconName: 'home-outline',
    iconColor: '#0A84FF',
    iconBg: '#E5F1FF',
    isLogoSlide: true,
  },
  {
    id: 1,
    title: 'Verified Home Experts',
    subtitle: 'Book certified plumbers, electricians, AC technicians, and cleaners with flexible arrival time slots.',
    badge: '🛡️ 100% Background Checked',
    iconName: 'construct-outline',
    iconColor: '#0A84FF',
    iconBg: '#E5F1FF',
  },
  {
    id: 2,
    title: 'Home Tutoring On-Demand',
    subtitle: 'Connect with expert tutors for 1-on-1 personalized lessons in Math, Science, Languages, and Coding.',
    badge: '🎓 Top Rated Academic Mentors',
    iconName: 'school-outline',
    iconColor: '#0A84FF',
    iconBg: '#E5F1FF',
  },
  {
    id: 3,
    title: 'Flexible Payments & Booking',
    subtitle: 'Upfront pricing with no hidden charges. Choose to Pay Online with UPI/Card or Cash After Service.',
    badge: '💳 Pay Now or After Service',
    iconName: 'shield-checkmark-outline',
    iconColor: '#0A84FF',
    iconBg: '#E5F1FF',
  },
];

export default function WelcomeScreen({ navigation }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    navigation.replace('Main');
  };

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Bar with Skip Button */}
      <View style={styles.topBar}>
        {currentSlide > 0 ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrev}
            accessibilityRole="button"
            accessibilityLabel="Previous slide"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleFinish}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Content */}
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {slide.isLogoSlide ? (
            <View style={styles.logoCardWrapper}>
              <BigBazaarLogo size="large" showTagline={false} />
            </View>
          ) : (
            <View style={[styles.iconCardWrapper, { backgroundColor: slide.iconBg }]}>
              <Ionicons name={slide.iconName} size={80} color={slide.iconColor} />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          {slide.title ? <Text style={styles.title}>{slide.title}</Text> : null}
          {slide.subtitle ? <Text style={styles.subtitle}>{slide.subtitle}</Text> : null}
        </View>
      </View>

      {/* Bottom Controls: Dots + Next Button */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentSlide(index)}
              style={[
                styles.dot,
                currentSlide === index ? styles.activeDot : styles.inactiveDot,
              ]}
              accessibilityLabel={`Slide ${index + 1}`}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.nextButton, isLastSlide && styles.getStartedButton]}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Get Started' : 'Next slide'}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={isLastSlide ? 'arrow-forward' : 'chevron-forward'}
            size={18}
            color="#FFFFFF"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    height: 44,
  },
  backButton: {
    padding: Spacing.xs,
  },
  spacer: {
    width: 32,
  },
  skipButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: '15%',
  },
  imageContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  textContainer: {
    height: 140,
    alignItems: 'center',
  },
  logoCardWrapper: {
    width: 180,
    height: 180,
    borderRadius: 48,
    backgroundColor: '#FFFFFF', 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  iconCardWrapper: {
    width: 180,
    height: 180,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  badgeContainer: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginBottom: Spacing.md,
  },
  badgeText: {
    ...Typography.captionBold,
    color: Colors.primaryDark,
    fontSize: 12,
  },
  title: {
    ...Typography.heading1,
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    color: '#64748B', // Softer secondary text
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: Colors.disabled,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
    borderRadius: 14,
    minWidth: 130,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  getStartedButton: {
    backgroundColor: Colors.textPrimary, // True black for high end feel
    shadowColor: Colors.textPrimary,
  },
  nextButtonText: {
    ...Typography.button,
    fontSize: 15,
  },
  buttonIcon: {
    marginLeft: Spacing.xs,
  },
});
