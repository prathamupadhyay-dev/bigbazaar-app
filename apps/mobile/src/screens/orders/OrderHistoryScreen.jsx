import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useApp, BookingItem } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';



export const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const { bookings } = useApp();
  const [filter, setFilter] = useState('All');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
      case 'Pending':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'In-Progress':
        return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'Completed':
        return { bg: '#ECFDF5', text: '#059669' };
      case 'Cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const filteredOrders = bookings.filter((order) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return order.status === 'Upcoming' || order.status === 'In-Progress';
    if (filter === 'Completed') return order.status === 'Completed';
    if (filter === 'Cancelled') return order.status === 'Cancelled';
    return true;
  });

  const handleOrderPress = (order) => {
    Alert.alert(
      `Order ${order.bookingId}`,
      `Status: ${order.status}\nService: ${order.serviceName}\nDate: ${order.scheduledDate}\nAmount: $${order.amount}`,
      [
      { text: 'Close' },
      order.status === 'Upcoming' ? { text: 'Cancel Order', style: 'destructive', onPress: () => {} } : null].
      filter(Boolean)
    );
  };

  const renderOrderCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    return (
      <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.bookingId}</Text>
            <Text style={styles.orderDate}>{item.scheduledDate}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.serviceInfo}>
            <View style={styles.serviceIcon}>
              <Ionicons name="construct-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              <Text style={styles.subServiceName}>{item.subCategoryName}</Text>
            </View>
          </View>

          <View style={styles.orderMeta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Time Slot</Text>
              <Text style={styles.metaValue}>{item.scheduledTimeSlot}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment</Text>
              <Text style={styles.metaValue}>{item.paymentMode}</Text>
            </View>
            {item.providerName &&
            <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Provider</Text>
                <View style={styles.providerInfo}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.metaValue}>{item.providerRating}</Text>
                </View>
              </View>
            }
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>${item.amount}</Text>
          </View>
          <View style={styles.orderActions}>
            {item.status === 'Completed' && !item.userRating &&
            <TouchableOpacity style={styles.rateBtn}>
                <Ionicons name="star-outline" size={16} color={Colors.primary} />
                <Text style={styles.rateBtnText}>Rate</Text>
              </TouchableOpacity>
            }
            {item.status === 'Completed' && item.userRating &&
            <View style={styles.ratingDisplay}>
                {[1, 2, 3, 4, 5].map((star) =>
              <Ionicons
                key={star}
                name={star <= (item.userRating || 0) ? "star" : "star-outline"}
                size={14}
                color="#F59E0B" />

              )}
              </View>
            }
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View Details</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>);

  };

  return (
    <ScreenContainer noPadding>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['All', 'Pending', 'Completed', 'Cancelled'].map((tab) =>
        <TouchableOpacity
          key={tab}
          style={[styles.filterTab, filter === tab && styles.filterTabActive]}
          onPress={() => setFilter(tab)}>
          
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'All' ?
            "You haven't placed any orders yet" :
            `No ${filter.toLowerCase()} orders`}
            </Text>
            <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
            
              <Text style={styles.shopNowText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        } />
      
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginRight: Spacing.sm,
    backgroundColor: '#F1F5F9'
  },
  filterTabActive: {
    backgroundColor: Colors.primary
  },
  filterText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary
  },
  filterTextActive: {
    ...Typography.bodyBold,
    color: Colors.white
  },
  ordersList: {
    padding: Spacing.md,
    paddingBottom: 100
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md
  },
  orderId: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 2
  },
  orderDate: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    ...Typography.bodyBold,
    fontSize: 11
  },
  orderBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md
  },
  serviceDetails: {
    flex: 1
  },
  serviceName: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 2
  },
  subServiceName: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary
  },
  orderMeta: {
    backgroundColor: '#F8FAFC',
    padding: Spacing.sm,
    borderRadius: 8
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  metaLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary
  },
  metaValue: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md
  },
  amountContainer: {
    flex: 1
  },
  amountLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary
  },
  amountValue: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.primary
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: Spacing.sm
  },
  rateBtnText: {
    ...Typography.bodyBold,
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 4
  },
  ratingDisplay: {
    flexDirection: 'row',
    marginRight: Spacing.sm
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewBtnText: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.primary,
    marginRight: 2
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },
  emptyTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs
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
  }
});

export default OrderHistoryScreen;