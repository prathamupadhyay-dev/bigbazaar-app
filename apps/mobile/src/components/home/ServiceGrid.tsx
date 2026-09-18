import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

interface ServiceItem {
  id: string;
  name: string;
  categoryName: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SERVICES: ServiceItem[] = [
  { id: '1', name: 'Plumber', categoryName: 'Plumber', icon: 'construct-outline' },
  { id: '2', name: 'Electrician', categoryName: 'Electrician', icon: 'flash-outline' },
  { id: '3', name: 'Tutor', categoryName: 'Home Tutor', icon: 'school-outline' },
  { id: '4', name: 'Painter', categoryName: 'Plumber', icon: 'color-palette-outline' },
  { id: '5', name: 'Cleaning', categoryName: 'Cleaning', icon: 'sparkles-outline' },
  { id: '6', name: 'AC Repair', categoryName: 'AC Repair', icon: 'snow-outline' },
  { id: '7', name: 'Carpenter', categoryName: 'Plumber', icon: 'hammer-outline' },
  { id: '8', name: 'Salon', categoryName: 'Cleaning', icon: 'cut-outline' },
  { id: '9', name: 'Pest Control', categoryName: 'Pest Control', icon: 'bug-outline' },
];

export const ServiceGrid: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleServicePress = (categoryName: string) => {
    navigation.navigate('ServiceBooking', { categoryName });
  };

  const handleViewAllPress = () => {
    (navigation as any).navigate('Services');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Our Services</Text>

      <View style={styles.grid}>
        {SERVICES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={() => handleServicePress(item.categoryName)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={item.name}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={24} color={Colors.primary} />
            </View>
            <Text style={styles.itemLabel} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.viewAllContainer}
        onPress={handleViewAllPress}
        accessibilityRole="button"
        accessibilityLabel="View All Services"
      >
        <Text style={styles.viewAllText}>View All Services</Text>
        <Ionicons name="chevron-forward-outline" size={16} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  gridItem: {
    width: '33.333%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30, // Perfectly circular
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemLabel: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  viewAllText: {
    ...Typography.bodyBold,
    color: Colors.primary,
    marginRight: 4,
    fontSize: 14,
  },
});

export default ServiceGrid;
