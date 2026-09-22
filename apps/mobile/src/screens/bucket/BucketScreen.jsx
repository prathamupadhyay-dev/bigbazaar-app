import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useApp, BucketItem } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export const BucketScreen = () => {
  const navigation = useNavigation();
  const { bucket, removeFromBucket, updateBucketQuantity, getBucketTotals, appliedCoupon } = useApp();
  const { subtotal, discount, total } = getBucketTotals();

  const handleQuantityChange = (item, delta) => {
    const nextQuantity = item.quantity + delta;
    if (nextQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }
    updateBucketQuantity(item.id, nextQuantity);
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      `Remove "${item.serviceName}" from cart?`,
      [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFromBucket(item.id)
      }]

    );
  };

  const handleCheckout = () => {
    if (bucket.length === 0) {
      Alert.alert('Cart Empty', 'Add items to your cart before checkout.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleContinueShopping = () => {
    navigation.navigate('ProductList');
  };

  const renderCartItem = ({ item }) =>
  <View style={styles.cartItem}>
      {item.imageUrl ?
    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} /> :

    <View style={[styles.itemImage, styles.placeholderImage]}>
          <Ionicons name="cube-outline" size={24} color={Colors.textSecondary} />
        </View>
    }
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.serviceName}</Text>
        {item.subCategoryName &&
      <Text style={styles.itemSubtitle}>{item.subCategoryName}</Text>
      }
        {item.size && item.color &&
      <Text style={styles.itemVariant}>Size: {item.size}, Color: {item.color}</Text>
      }
        {item.serviceDate && item.timeSlot &&
      <Text style={styles.itemSchedule}>
            <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
            {' '}{item.serviceDate} at {item.timeSlot}
          </Text>
      }
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>
            ₹{(item.price * item.quantity).toFixed(2)}
          </Text>
          {item.quantity > 1 &&
        <Text style={styles.unitPrice}>₹{item.price} each</Text>
        }
        </View>
      </View>
      <View style={styles.itemActions}>
        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => handleQuantityChange(item, -1)}>
          
            <Ionicons name="remove" size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => handleQuantityChange(item, 1)}>
          
            <Ionicons name="add" size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveItem(item)}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>;


  return (
    <ScreenContainer noPadding>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.headerRight}>
          {bucket.length > 0 &&
          <Text style={styles.itemCount}>{bucket.length} items</Text>
          }
        </View>
      </View>

      {/* Cart Content */}
      <View style={styles.content}>
        {bucket.length === 0 ?
        <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start shopping to add items to your cart
            </Text>
            <TouchableOpacity style={styles.shopNowBtn} onPress={handleContinueShopping}>
              <Text style={styles.shopNowText}>Browse Products</Text>
            </TouchableOpacity>
          </View> :

        <>
            <FlatList
              data={bucket}
              keyExtractor={(item) => item.id}
              renderItem={renderCartItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={styles.summarySection}>
                <View style={styles.summaryHeading}><Ionicons name="receipt-outline" size={20} color={Colors.primary} /><Text style={styles.summaryTitle}>Order Summary</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={styles.freeValue}>Free</Text></View>
                {discount > 0 && <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={styles.discountValue}>-₹{discount.toFixed(2)}</Text></View>}
                {appliedCoupon && <View style={styles.couponApplied}><Ionicons name="checkmark-circle" size={16} color={Colors.success} /><Text style={styles.couponText}>Coupon "{appliedCoupon}" applied</Text></View>}
                <View style={[styles.summaryRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>₹{total.toFixed(2)}</Text></View>
              </View>}
            />
          </>
        }
      </View>

      {/* Checkout Footer */}
      {bucket.length > 0 &&
      <View style={styles.checkoutFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Ionicons name="card-outline" size={20} color={Colors.white} />
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      }
    </ScreenContainer>);

};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  backBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemCount: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: 205
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: Spacing.md
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemDetails: {
    flex: 1,
    marginRight: Spacing.sm
  },
  itemTitle: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4
  },
  itemSubtitle: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2
  },
  itemVariant: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2
  },
  itemSchedule: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  itemPrice: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.primary
  },
  unitPrice: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 4
  },
  qtyBtn: {
    padding: 8
  },
  qtyText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingHorizontal: 12
  },
  removeBtn: {
    padding: 4
  },
  summarySection: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs
  },
  summaryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  summaryTitle: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  summaryLabel: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  summaryValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary
  },
  discountValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.success
  },
  freeValue: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.success
  },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm
  },
  couponText: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.success,
    marginLeft: 6
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs
  },
  totalLabel: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary
  },
  totalValue: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.primary
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl
  },
  emptyTitle: {
    ...Typography.heading2,
    fontSize: 20,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm
  },
  emptySubtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.disabled,
    textAlign: 'center',
    marginBottom: Spacing.lg
  },
  shopNowBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12
  },
  shopNowText: {
    ...Typography.button,
    color: Colors.white
  },
  checkoutFooter: {
    position: 'absolute',
    // Keep this action clear of the floating tab bar (70px high at bottom: 24).
    bottom: 108,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  totalContainer: {
    flex: 1
  },
  footerTotalLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 2
  },
  footerTotalValue: {
    ...Typography.heading2,
    fontSize: 22,
    color: Colors.textPrimary
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: 12
  },
  checkoutBtnText: {
    ...Typography.button,
    color: Colors.white,
    marginLeft: 8
  }
});

export default BucketScreen;
