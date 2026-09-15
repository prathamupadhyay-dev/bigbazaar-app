import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import ServiceItemCard, { ServiceItemData } from './ServiceItemCard';
import { MOCK_SERVICES } from './ServiceGridList';
import { useApp } from '../../context/AppContext';
import Typography from '../../constants/typography';
import Colors from '../../constants/colors';
import Spacing from '../../constants/spacing';

export const TopServicesSlider: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { watchlist, toggleWatchlist } = useApp();

  const handleViewAll = () => {
    navigation.navigate('AllItems', { type: 'service' } as any);
  };

  // Pick top services to show in slider
  const topServices = MOCK_SERVICES.filter(item => item.itemType === 'service');

  const handlePress = (item: ServiceItemData) => {
    navigation.navigate('ServiceDetails', { item: item as any });
  };

  const handleBookPress = (item: ServiceItemData) => {
    navigation.navigate('ServiceDetails', { item: item as any });
  };

  const handleSavePress = (item: ServiceItemData) => {
    toggleWatchlist(item.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Top Services</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {topServices.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <ServiceItemCard
              item={item}
              isSaved={watchlist.includes(item.id)}
              onPress={handlePress}
              onBookPress={handleBookPress}
              onSavePress={handleSavePress}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  title: {
    ...Typography.heading2,
    color: Colors.textPrimary,
  },
  viewAllText: {
    ...Typography.bodyBold,
    color: Colors.primary,
    fontSize: 14,
  },
  scrollContent: {
    paddingRight: Spacing.md, // For right edge spacing
  },
  cardWrapper: {
    width: 220,
    marginRight: Spacing.md,
  }
});

export default TopServicesSlider;