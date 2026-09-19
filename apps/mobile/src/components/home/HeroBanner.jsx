import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export const HeroBanner = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Good Morning, User!</Text>
        <Text style={styles.headline}>Ready for your next premium service?</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Services')}
          activeOpacity={0.8}>
          
          <Text style={styles.ctaText}>Explore Now</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.white} style={styles.ctaIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.iconWrapper}>
        <Ionicons name="sparkles" size={54} color={Colors.primary} style={styles.heroIcon} />
      </View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.08)'
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md
  },
  greeting: {
    ...Typography.captionBold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  headline: {
    ...Typography.heading2,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: Spacing.md
  },
  ctaButton: {
    backgroundColor: Colors.textPrimary, // Premium dark feel
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2
  },
  ctaText: {
    ...Typography.button,
    fontSize: 14
  },
  ctaIcon: {
    marginLeft: 6
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroIcon: {
    opacity: 0.9
  }
});

export default HeroBanner;