import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { useApp } from '../../context/AppContext';
import ServiceItemCard, { ServiceItemData } from '../../components/home/ServiceItemCard';
import { MOCK_SERVICES } from '../../components/home/ServiceGridList';
import { MOCK_PRODUCTS } from '../products/ProductListScreen';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function WatchlistScreen() {
  const { watchlist, toggleWatchlist } = useApp();
  const navigation = useNavigation();

  const handlePress = (item: ServiceItemData) => {
    (navigation as any).navigate('ServiceDetails', { item });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your watchlist is empty.</Text>
    </View>
  );

  const savedItems = [
    ...MOCK_SERVICES.filter(item => watchlist.includes(item.id)),
    ...MOCK_PRODUCTS.filter(item => watchlist.includes(item.id)).map((item) => ({ id: item.id, title: item.title, imageUrl: item.imageUrl, price: item.price, timeEstimate: item.location, category: item.category, itemType: 'product' as const })),
  ];

  return (
    <ScreenContainer noPadding>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => alert('Sort options coming soon')}>
          <Ionicons name="swap-vertical" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watchlist</Text>
        <TouchableOpacity onPress={() => alert('History coming soon')}>
          <Text style={styles.headerRightText}>History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ServiceItemCard
                item={item}
                isSaved={true} 
                onPress={handlePress}
                onBookPress={handlePress}
                onSavePress={() => toggleWatchlist(item.id)}
              />
            </View>
          )}
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 0,
    elevation: 0,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontSize: 18,
  },
  headerRightText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48.5%',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    ...Typography.heading2,
    color: Colors.textPrimary,
  },
});
