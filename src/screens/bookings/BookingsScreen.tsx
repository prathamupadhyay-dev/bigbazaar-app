import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { useApp } from '../../context/AppContext';
import ServiceItemCard, { ServiceItemData } from '../../components/home/ServiceItemCard';
import { MOCK_SERVICES } from '../../components/home/ServiceGridList';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const BookingsScreen: React.FC = () => {
  const { watchlist, toggleWatchlist } = useApp();
  const navigation = useNavigation();

  const handlePress = (item: ServiceItemData) => {
    (navigation as any).navigate('ServiceDetails', { item });
  };


  const mockServiceBookings: ServiceItemData[] = []; // Empty for empty state

  return (
    <ScreenContainer noPadding>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={mockServiceBookings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ServiceItemCard
                item={item}
                isSaved={watchlist.includes(item.id)}
                onPress={handlePress}
                onBookPress={handlePress}
                onSavePress={() => toggleWatchlist(item.id)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={100} color="#E2E8F0" style={{ marginBottom: 20 }} />
              <Text style={styles.emptyTitle}>No bookings found</Text>
              <Text style={styles.emptySubtitle}>Your service bookings will appear here.</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerTitle: {
    ...Typography.heading2,
    color: '#1E293B',
    fontSize: 18,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: Spacing.md,
    flexGrow: 1, // needed for empty state to center properly
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48.5%',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '35%', // center it vertically in the visual space
  },
  emptyTitle: {
    ...Typography.heading2,
    color: '#64748B', // Muted slate color like the screenshot
    fontSize: 22,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: '#94A3B8', // Lighter slate
    fontSize: 14,
  },
});

export default BookingsScreen;
