import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { PaymentMode } from '../../context/AppContext';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { activeAddress, bucket, getBucketTotals, createBookingFromBucket } = useApp();
  const { subtotal, total } = getBucketTotals();

  const [selectedPayment, setSelectedPayment] = useState('Card');

  const handlePlaceOrder = () => {
    if (bucket.length === 0) {
      navigation.navigate('Main', { screen: 'Cart' });
      return;
    }
    // Create the booking/order and get the ID
    const orderId = createBookingFromBucket(selectedPayment);
    // Navigate to success screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }, { name: 'OrderSuccess', params: { orderId } }]
    });
  };

  const paymentOptions = [
  { id: 'Card', title: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'UPI', title: 'UPI / Google Pay', icon: 'phone-portrait-outline' },
  { id: 'Cash on Delivery', title: 'Cash on Delivery', icon: 'cash-outline' }];


  return (
    <ScreenContainer noPadding>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddressManagement')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <View style={styles.addressRow}>
              <View style={styles.addressIconBg}>
                <Ionicons name="location" size={20} color={Colors.primary} />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressType}>{activeAddress.type}</Text>
                <Text style={styles.addressText}>{activeAddress.houseNo}, {activeAddress.street}</Text>
                <Text style={styles.addressText}>{activeAddress.city}, {activeAddress.pincode}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
            {bucket.map((item) => <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemThumb}><Ionicons name="cube-outline" size={18} color={Colors.primary} /></View>
              <View style={styles.itemInfo}><Text style={styles.itemName} numberOfLines={1}>{item.serviceName}</Text><Text style={styles.itemMeta}>Qty {item.quantity}</Text></View>
              <Text style={styles.itemAmount}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>)}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValueFree}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>${total}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.card}>
            {paymentOptions.map((option, index) =>
            <TouchableOpacity
              key={option.id}
              style={[
              styles.paymentOption,
              index < paymentOptions.length - 1 && styles.borderBottom,
              selectedPayment === option.id && styles.paymentOptionSelected]
              }
              onPress={() => setSelectedPayment(option.id)}>
              
                <View style={styles.paymentIconBg}>
                  <Ionicons name={option.icon} size={20} color={selectedPayment === option.id ? Colors.primary : Colors.textSecondary} />
                </View>
                <Text style={[styles.paymentTitle, selectedPayment === option.id && styles.paymentTitleSelected]}>
                  {option.title}
                </Text>
                <View style={styles.radioContainer}>
                  {selectedPayment === option.id ?
                <View style={styles.radioSelected}>
                      <View style={styles.radioInner} />
                    </View> :

                <View style={styles.radioUnselected} />
                }
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.assurance}><Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} /><Text style={styles.assuranceText}>Secure mock checkout · No payment will be processed</Text></View>

        <View style={{ height: 135 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Total Payment</Text>
          <Text style={styles.footerTotalValue}>${total}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderBtnText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>);

}

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
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm
  },
  sectionTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  changeText: {
    ...Typography.bodyBold,
    color: Colors.primary
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md
  },
  addressInfo: {
    flex: 1
  },
  addressType: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginBottom: 2
  },
  addressText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  itemThumb: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  itemInfo: { flex: 1 },
  itemName: { ...Typography.bodyBold, fontSize: 13, color: Colors.textPrimary },
  itemMeta: { ...Typography.caption, fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  itemAmount: { ...Typography.bodyBold, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.md },
  assurance: { flexDirection: 'row', alignItems: 'center', margin: Spacing.lg, padding: Spacing.sm, backgroundColor: '#ECFDF5', borderRadius: 10 },
  assuranceText: { ...Typography.caption, color: Colors.success, marginLeft: Spacing.xs, flex: 1 },
  summaryTotalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 0
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary
  },
  summaryValue: {
    ...Typography.bodyBold,
    color: Colors.textPrimary
  },
  summaryValueFree: {
    ...Typography.bodyBold,
    color: Colors.success
  },
  summaryTotalLabel: {
    ...Typography.heading2,
    fontSize: 16,
    color: Colors.textPrimary
  },
  summaryTotalValue: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  paymentOptionSelected: {
    backgroundColor: 'transparent'
  },
  paymentIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md
  },
  paymentTitle: {
    ...Typography.body,
    flex: 1,
    color: Colors.textPrimary
  },
  paymentTitleSelected: {
    ...Typography.bodyBold,
    color: Colors.textPrimary
  },
  radioContainer: {
    justifyContent: 'center'
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.disabled
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8
  },
  totalContainer: {
    flex: 1
  },
  footerTotalLabel: {
    ...Typography.caption,
    color: Colors.textSecondary
  },
  footerTotalValue: {
    ...Typography.heading1,
    fontSize: 24,
    color: Colors.textPrimary
  },
  placeOrderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: 14,
    borderRadius: 8
  },
  placeOrderBtnText: {
    ...Typography.button,
    color: Colors.white
  }
});
