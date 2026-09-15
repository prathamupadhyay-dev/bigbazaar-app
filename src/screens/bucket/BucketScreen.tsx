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

export const BucketScreen: React.FC = () => {
  const { watchlist, toggleWatchlist, bucket, removeFromBucket, getBucketTotals } = useApp();
  const navigation = useNavigation();

  const handlePress = (item: any) => {
    // Actually we'd navigate to ServiceDetails with the original item
  };

  const { total } = getBucketTotals();

  return (
    <ScreenContainer noPadding>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={bucket}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.cartImgPlaceholder} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemTitle}>{item.serviceName}</Text>
                {item.size && item.color && (
                  <Text style={styles.cartItemVariant}>Size: {item.size}, Color: {item.color}</Text>
                )}
                <Text style={styles.cartItemPrice}>${item.price} x {item.quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromBucket(item.id)}>
                <Ionicons name="trash-outline" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={100} color="#E2E8F0" style={{ marginBottom: 20 }} />
              <Text style={styles.emptyTitle}>No items yet</Text>
              <Text style={styles.emptySubtitle}>Your cart items will appear here.</Text>
            </View>
          }
        />
      </View>
      {bucket.length > 0 && (
        <View style={styles.checkoutFooter}>
          <View>
            <Text style={styles.checkoutTotalLabel}>Total</Text>
            <Text style={styles.checkoutTotalValue}>${total}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => (navigation as any).navigate('Checkout')}>
            <Text style={styles.checkoutBtnText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.heading2,
    color: '#1E293B',
    fontSize: 18,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContainer: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cartImgPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    marginRight: Spacing.md,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  cartItemVariant: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cartItemPrice: {
    ...Typography.bodyBold,
    color: Colors.primary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '35%', 
  },
  emptyTitle: {
    ...Typography.heading2,
    color: '#64748B', 
    fontSize: 22,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: '#94A3B8', 
    fontSize: 14,
  },
  checkoutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  checkoutTotalLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  checkoutTotalValue: {
    ...Typography.heading2,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: 8,
  },
  checkoutBtnText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default BucketScreen;
