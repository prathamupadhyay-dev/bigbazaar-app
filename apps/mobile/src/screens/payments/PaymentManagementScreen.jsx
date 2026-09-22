import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp, PaymentStatus, TransactionItem } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatters';

const STATUS_FILTERS = ['All', 'Success', 'Failed', 'Pending'];
const MOCK_REFUNDS = [
  { id: 'refund-1', orderId: 'BB-87321', reason: 'Service cancellation', amount: 499, status: 'Processed', date: '05 Sep 2026' },
  { id: 'refund-2', orderId: 'BB-65120', reason: 'Duplicate payment', amount: 699, status: 'Pending', date: '02 Sep 2026' }
];
const INITIAL_PAYMENT_METHODS = [
  { id: 'pm-1', label: '•••• 4821', type: 'Visa', detail: 'Personal card' },
  { id: 'pm-2', label: 'john@upi', type: 'UPI', detail: 'Primary UPI ID' }
];

export const PaymentManagementScreen = () => {
  const navigation = useNavigation();
  const { transactions } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [paymentMethods, setPaymentMethods] = useState(INITIAL_PAYMENT_METHODS);

  const filteredTransactions = transactions.filter((t) =>
  selectedFilter === 'All' ? true : t.status === selectedFilter
  );

  const handleDownloadInvoice = (txn) => {
    Alert.alert(
      'Invoice Downloaded',
      `Official receipt for ${txn.serviceName} (Txn: ${txn.transactionId}) saved successfully.`
    );
  };

  const handleRetryPayment = (txn) => {
    Alert.alert(
      'Payment Gateway Simulation',
      `Re-initiating payment gateway for ₹${txn.amount} via ${txn.paymentMode}...`,
      [{ text: 'OK' }]
    );
  };

  const handleRemoveMethod = (method) => {
    Alert.alert('Remove payment method?', `${method.type} ${method.label} will be removed from this demo account.`, [
      { text: 'Keep', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setPaymentMethods((prev) => prev.filter((item) => item.id !== method.id)) }
    ]);
  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back">
          
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments & Refunds</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {STATUS_FILTERS.map((f) => {
          const isSelected = selectedFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isSelected && styles.selectedFilterChip]}
              onPress={() => setSelectedFilter(f)}>
              
              <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>
                {f}
              </Text>
            </TouchableOpacity>);

        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Secure Gateway Badge */}
        <View style={styles.gatewayBanner}>
          <Ionicons name="shield-checkmark" size={22} color="#10B981" />
          <View style={styles.gatewayTextContainer}>
            <Text style={styles.gatewayTitle}>100% Secure Payment Gateway</Text>
            <Text style={styles.gatewaySubtitle}>256-bit encrypted UPI, Cards & NetBanking</Text>
          </View>
        </View>

        <View style={styles.methodsHeader}><Text style={styles.sectionHeader}>Saved payment methods</Text><TouchableOpacity onPress={() => Alert.alert('Add payment method', 'Payment method setup is represented locally in this prototype.')}><Text style={styles.addMethodText}>Add new</Text></TouchableOpacity></View>
        {paymentMethods.length === 0 ? <View style={styles.methodEmpty}><Text style={styles.emptySubtitle}>No saved payment methods</Text></View> : paymentMethods.map((method) =>
          <View key={method.id} style={styles.methodCard}>
            <View style={styles.methodIcon}><Ionicons name={method.type === 'UPI' ? 'phone-portrait-outline' : 'card-outline'} size={20} color={Colors.primary} /></View>
            <View style={styles.methodCopy}><Text style={styles.methodLabel}>{method.type} · {method.label}</Text><Text style={styles.methodDetail}>{method.detail}</Text></View>
            <TouchableOpacity onPress={() => handleRemoveMethod(method)} accessibilityLabel={`Remove ${method.type}`}><Ionicons name="trash-outline" size={18} color="#DC2626" /></TouchableOpacity>
          </View>
        )}

        {/* Transactions List */}
        <Text style={styles.sectionHeader}>Transaction History</Text>

        {filteredTransactions.length === 0 ?
        <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={44} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptySubtitle}>There are no {selectedFilter.toLowerCase()} transactions.</Text>
          </View> :

        filteredTransactions.map((txn) =>
        <View key={txn.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.txnIdBox}>
                  <Text style={styles.serviceTitle}>{txn.serviceName}</Text>
                  <Text style={styles.txnId}>Txn ID: {txn.transactionId}</Text>
                </View>
              <Text style={styles.amountText}>{formatCurrency(txn.amount)}</Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.modeBadge}>
                  <Ionicons
                name={txn.paymentMode === 'UPI' ? 'phone-portrait-outline' : 'card-outline'}
                size={12}
                color={Colors.textPrimary} />
              
                  <Text style={styles.modeText}>{txn.paymentMode}</Text>
                </View>
                <Text style={styles.dateText}>• {txn.date}</Text>

                {txn.couponApplied &&
            <View style={styles.couponBadge}>
                    <Text style={styles.couponText}>{txn.couponApplied}</Text>
                  </View>
            }

                <View
              style={[
              styles.statusBadge,
              txn.status === 'Success' && styles.successBadge,
              txn.status === 'Failed' && styles.failedBadge,
              txn.status === 'Pending' && styles.pendingBadge]
              }>
              
                  <Text
                style={[
                styles.statusText,
                txn.status === 'Success' && { color: '#059669' },
                txn.status === 'Failed' && { color: '#DC2626' },
                txn.status === 'Pending' && { color: '#D97706' }]
                }>
                
                    {txn.status}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                {txn.status === 'Success' &&
            <TouchableOpacity
              style={styles.invoiceBtn}
              onPress={() => handleDownloadInvoice(txn)}>
              
                    <Ionicons name="download-outline" size={16} color={Colors.primary} />
                    <Text style={styles.invoiceBtnText}>Download Invoice</Text>
                  </TouchableOpacity>
            }

                {txn.status === 'Failed' &&
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => handleRetryPayment(txn)}>
              
                    <Ionicons name="refresh-outline" size={16} color="#DC2626" />
                    <Text style={styles.retryBtnText}>Retry Payment</Text>
                  </TouchableOpacity>
            }
              </View>
            </View>
        )
        }

        <Text style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>Refunds</Text>
        {MOCK_REFUNDS.map((refund) =>
          <View key={refund.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.txnIdBox}>
                <Text style={styles.serviceTitle}>{refund.reason}</Text>
                <Text style={styles.txnId}>Order: {refund.orderId} · {refund.date}</Text>
              </View>
              <Text style={styles.amountText}>{formatCurrency(refund.amount)}</Text>
            </View>
            <View style={styles.refundStatusRow}>
              <Ionicons name={refund.status === 'Processed' ? 'checkmark-circle' : 'time-outline'} size={16} color={refund.status === 'Processed' ? '#059669' : '#D97706'} />
              <Text style={[styles.refundStatusText, { color: refund.status === 'Processed' ? '#059669' : '#D97706' }]}>{refund.status}</Text>
              <Text style={styles.refundHint}>{refund.status === 'Processed' ? 'Credited to original payment method' : 'Usually completed within 3–5 business days'}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    elevation: 0
  },
  backBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: 8
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9'
  },
  selectedFilterChip: {
    backgroundColor: '#0A84FF'
  },
  filterText: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    fontSize: 12
  },
  selectedFilterText: {
    color: '#FFFFFF'
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl
  },
  gatewayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: Spacing.md
  },
  gatewayTextContainer: {
    marginLeft: Spacing.sm
  },
  gatewayTitle: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: '#065F46'
  },
  gatewaySubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1
  },
  sectionHeader: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  methodsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm },
  addMethodText: { ...Typography.captionBold, color: Colors.primary, marginBottom: Spacing.sm },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm, marginBottom: Spacing.sm },
  methodIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  methodCopy: { flex: 1 },
  methodLabel: { ...Typography.bodyBold, color: Colors.textPrimary, fontSize: 13 },
  methodDetail: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  methodEmpty: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs
  },
  txnIdBox: {
    flex: 1,
    marginRight: Spacing.sm
  },
  serviceTitle: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 14
  },
  txnId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0284C7'
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  modeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 3
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11
  },
  couponBadge: {
    backgroundColor: '#E5F1FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  couponText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7'
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto'
  },
  successBadge: { backgroundColor: '#D1FAE5' },
  failedBadge: { backgroundColor: '#FEE2E2' },
  pendingBadge: { backgroundColor: '#FEF3C7' },
  statusText: {
    fontSize: 10,
    fontWeight: '700'
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  refundStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: 5 },
  refundStatusText: { ...Typography.captionBold, fontSize: 12 },
  refundHint: { ...Typography.caption, color: Colors.textSecondary, flex: 1, marginLeft: 4 },
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  invoiceBtnText: {
    ...Typography.captionBold,
    color: Colors.primary,
    marginLeft: 4
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  retryBtnText: {
    ...Typography.captionBold,
    color: '#DC2626',
    marginLeft: 4
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl
  },
  emptyTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginTop: Spacing.sm
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4
  }
});

export default PaymentManagementScreen;
