import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp, BookingItem } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { formatCurrency } from '../../utils/formatters';

export default function BookingsScreen() {
  const navigation = useNavigation();
  const { bookings, cancelBooking } = useApp();
  const steps = ['Confirmed', 'Provider Assigned', 'In Progress', 'Completed'];
  const getStepIndex = (status) => ({ Upcoming: 1, Pending: 0, 'In-Progress': 2, Completed: 3, Cancelled: 0 }[status] ?? 0);
  const render = ({ item }) => {
    const activeStep = getStepIndex(item.status);
    return <View style={styles.card}>
      <View style={styles.top}><View style={styles.icon}><Ionicons name="construct-outline" size={22} color={Colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.name}>{item.serviceName}</Text><Text style={styles.provider}>{item.providerName}</Text></View><Text style={[styles.status, item.status === 'Cancelled' && { color: Colors.error }]}>{item.status}</Text></View>
      <View style={styles.details}><Text style={styles.detail}>📅 {item.scheduledDate}</Text><Text style={styles.detail}>◷ {item.scheduledTimeSlot}</Text><Text style={styles.detail}>Booking #{item.bookingId} · {formatCurrency(item.amount)}</Text></View>
      {item.status !== 'Cancelled' && <View style={styles.stepper}>{steps.map((step, index) => <View key={step} style={styles.stepItem}><View style={[styles.stepDot, index <= activeStep && styles.stepDotActive]} /><Text style={[styles.stepLabel, index <= activeStep && styles.stepLabelActive]} numberOfLines={1}>{step}</Text>{index < steps.length - 1 && <View style={[styles.stepLine, index < activeStep && styles.stepLineActive]} />}</View>)}</View>}
      {(item.status === 'Upcoming' || item.status === 'In-Progress') && <TouchableOpacity style={styles.cancel} onPress={() => cancelBooking(item.id)}><Text style={styles.cancelText}>Cancel Booking</Text></TouchableOpacity>}
    </View>;
  };
  return <ScreenContainer noPadding style={styles.screen}><View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back"><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity><Text style={styles.title}>My Bookings</Text><View style={{ width: 24 }} /></View><FlatList data={bookings} keyExtractor={(item) => item.id} renderItem={render} contentContainerStyle={styles.list} ListEmptyComponent={<View style={styles.empty}><Ionicons name="calendar-outline" size={62} color={Colors.disabled} /><Text style={styles.emptyTitle}>No bookings yet</Text><TouchableOpacity style={styles.book} onPress={() => navigation.navigate('Main', { screen: 'Services' })}><Text style={styles.bookText}>Browse Services</Text></TouchableOpacity></View>} /></ScreenContainer>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F8FAFC' }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: Colors.white }, title: { ...Typography.heading2, color: Colors.textPrimary }, list: { padding: Spacing.md, paddingBottom: 130 }, card: { backgroundColor: Colors.white, borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border }, top: { flexDirection: 'row', alignItems: 'center' }, icon: { width: 42, height: 42, borderRadius: 10, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm }, name: { ...Typography.bodyBold, color: Colors.textPrimary }, provider: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 }, status: { ...Typography.captionBold, color: Colors.primary }, details: { backgroundColor: '#F8FAFC', padding: Spacing.sm, borderRadius: 8, marginTop: Spacing.sm, gap: 4 }, detail: { ...Typography.caption, color: Colors.textSecondary }, stepper: { flexDirection: 'row', alignItems: 'flex-start', marginTop: Spacing.md, paddingHorizontal: 2 }, stepItem: { flex: 1, alignItems: 'center', position: 'relative' }, stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CBD5E1', zIndex: 2 }, stepDotActive: { backgroundColor: Colors.primary }, stepLine: { position: 'absolute', top: 4, left: '50%', right: '-50%', height: 2, backgroundColor: '#E2E8F0' }, stepLineActive: { backgroundColor: Colors.primary }, stepLabel: { ...Typography.caption, color: Colors.disabled, fontSize: 9, textAlign: 'center', marginTop: 5 }, stepLabelActive: { color: Colors.primary, fontWeight: '700' }, cancel: { alignSelf: 'flex-end', marginTop: Spacing.sm }, cancelText: { ...Typography.captionBold, color: Colors.error }, empty: { alignItems: 'center', marginTop: 100 }, emptyTitle: { ...Typography.heading2, color: Colors.textSecondary, margin: Spacing.md }, book: { backgroundColor: Colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 }, bookText: { ...Typography.button, color: Colors.white } });
