import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';



const CATEGORIES = ['Plumber', 'Electrician', 'Home Tutor', 'Cleaning', 'AC Repair'];

const SUB_CATEGORIES = {
  Plumber: [
  { name: 'Tap Repair & Washbasin Fix', price: 249 },
  { name: 'Water Pipe Leakage & Seepage', price: 399 },
  { name: 'Toilet Flush Tank & Commode Fix', price: 349 },
  { name: 'Water Motor Connection', price: 599 }],

  Electrician: [
  { name: 'Switchboard & Socket Repair', price: 199 },
  { name: 'MCB Fuse Tripping & Short Circuit', price: 449 },
  { name: 'Ceiling Fan Installation / Fix', price: 299 },
  { name: 'Inverter Wiring Setup', price: 699 }],

  'Home Tutor': [
  { name: 'Class 10 Mathematics (1-on-1)', price: 599 },
  { name: 'Physics & Chemistry Mastery', price: 649 },
  { name: 'Spoken English & Communication', price: 499 },
  { name: 'Coding Fundamentals (Python/JS)', price: 799 }],

  Cleaning: [
  { name: 'Full Bathroom Deep Scrubbing', price: 499 },
  { name: 'Kitchen Chimney & Degreasing', price: 699 }],

  'AC Repair': [
  { name: 'AC Foam Jet Deep Service', price: 549 },
  { name: 'AC Gas Refill & Leak Check', price: 1899 }]

};

const DATES = ['Today', 'Tomorrow', 'Day After', '12 Sep', '13 Sep'];
const TIME_SLOTS = ['10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '06:00 PM - 08:00 PM'];

export const ServiceBookingScreen = ({ route, navigation }) => {
  const initialCat = route.params?.categoryName || 'Plumber';
  const initialSub = route.params?.subCategoryName || '';

  const { activeAddress, addToBucket, createInstantBooking } = useApp();

  const [category, setCategory] = useState(initialCat);
  const currentSubList = SUB_CATEGORIES[category] || SUB_CATEGORIES['Plumber'];
  const [selectedSub, setSelectedSub] = useState(
    initialSub && currentSubList.some((s) => s.name === initialSub) ?
    initialSub :
    currentSubList[0].name
  );

  const activeSubObj = currentSubList.find((s) => s.name === selectedSub) || currentSubList[0];

  const [selectedDate, setSelectedDate] = useState(DATES[1]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [paymentChoice, setPaymentChoice] = useState('Prepaid');
  const [problemDescription, setProblemDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const subs = SUB_CATEGORIES[cat] || [];
    if (subs.length > 0) {
      setSelectedSub(subs[0].name);
    }
  };

  const handleTogglePhoto = () => {
    setHasPhoto(!hasPhoto);
  };

  const handleAddToBucket = () => {
    addToBucket({
      serviceId: `srv-${Date.now()}`,
      serviceName: category,
      categoryName: category,
      subCategoryName: selectedSub,
      price: activeSubObj.price,
      timeSlot: selectedTimeSlot,
      serviceDate: selectedDate,
      paymentChoice,
      problemDescription,
      quantity: 1
    });
    Alert.alert('Added to Bucket', `${selectedSub} has been added to your bucket.`, [
    { text: 'Keep Exploring', onPress: () => navigation.goBack() },
    { text: 'View Bucket', onPress: () => navigation.navigate('Bucket') }]
    );
  };

  const handleConfirmBooking = () => {
    const bookingId = createInstantBooking({
      serviceName: category,
      subCategoryName: selectedSub,
      category,
      scheduledDate: selectedDate,
      scheduledTimeSlot: selectedTimeSlot,
      providerName: 'Certified Expert Partner',
      providerContact: '+91 98765 00000',
      providerRating: 4.9,
      amount: activeSubObj.price,
      status: 'Upcoming',
      serviceAddress: `${activeAddress.houseNo}, ${activeAddress.street}, ${activeAddress.city}`,
      paymentMode: paymentChoice === 'Prepaid' ? 'UPI' : 'Cash on Delivery'
    });

    Alert.alert(
      'Booking Confirmed! 🎉',
      `Your booking #${bookingId} has been scheduled for ${selectedDate} (${selectedTimeSlot}).`,
      [
      {
        text: 'View in Bookings',
        onPress: () => {
          navigation.navigate('Bookings');
        }
      }]

    );
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
        <Text style={styles.headerTitle}>Schedule Service</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Step 1: Category Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = cat === category;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pill, isSelected && styles.selectedPill]}
                  onPress={() => handleCategoryChange(cat)}>
                  
                  <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>{cat}</Text>
                </TouchableOpacity>);

            })}
          </ScrollView>
        </View>

        {/* Step 2: Sub-Category Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Choose Sub-Service</Text>
          {currentSubList.map((sub) => {
            const isSelected = sub.name === selectedSub;
            return (
              <TouchableOpacity
                key={sub.name}
                style={[styles.subCard, isSelected && styles.selectedSubCard]}
                onPress={() => setSelectedSub(sub.name)}>
                
                <View style={styles.subLeft}>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? '#0A84FF' : Colors.disabled}
                    style={styles.radioIcon} />
                  
                  <Text style={[styles.subName, isSelected && styles.selectedSubName]}>{sub.name}</Text>
                </View>
                <Text style={styles.subPrice}>₹{sub.price}</Text>
              </TouchableOpacity>);

          })}
        </View>

        {/* Step 3: Date Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Preferred Arrival Date</Text>
          <View style={styles.datesRow}>
            {DATES.map((dt) => {
              const isSelected = dt === selectedDate;
              return (
                <TouchableOpacity
                  key={dt}
                  style={[styles.dateChip, isSelected && styles.selectedDateChip]}
                  onPress={() => setSelectedDate(dt)}>
                  
                  <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>{dt}</Text>
                </TouchableOpacity>);

            })}
          </View>
        </View>

        {/* Step 4: Arrival Time Slot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Arrival Time Slot</Text>
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot === selectedTimeSlot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slotCard, isSelected && styles.selectedSlotCard]}
                onPress={() => setSelectedTimeSlot(slot)}>
                
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={isSelected ? Colors.primary : Colors.textSecondary}
                  style={styles.slotIcon} />
                
                <Text style={[styles.slotText, isSelected && styles.selectedSlotText]}>{slot}</Text>
                {isSelected &&
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={styles.checkIcon} />
                }
              </TouchableOpacity>);

          })}
        </View>

        {/* Step 5: Service Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>5. Service Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddressManagement')}>
              <Text style={styles.changeAddressLink}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={20} color="#0A84FF" style={styles.addrPin} />
            <View style={styles.addrTextContainer}>
              <Text style={styles.addrType}>{activeAddress.type} Address</Text>
              <Text style={styles.addrLine}>
                {activeAddress.houseNo}, {activeAddress.street}, {activeAddress.city} - {activeAddress.pincode}
              </Text>
            </View>
          </View>
        </View>

        {/* Step 6: Problem Description & Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Problem Details (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the issue (e.g. leaking since 2 days, model number, specific requirements)..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
            value={problemDescription}
            onChangeText={setProblemDescription} />
          

          <TouchableOpacity style={styles.photoUploadBtn} onPress={handleTogglePhoto}>
            <Ionicons
              name={hasPhoto ? 'checkmark-circle' : 'camera-outline'}
              size={20}
              color={hasPhoto ? '#10B981' : Colors.primary} />
            
            <Text style={[styles.photoUploadText, hasPhoto && { color: '#10B981' }]}>
              {hasPhoto ? 'Photo Attached (tap to remove)' : 'Upload Problem Photo / Bill (Optional)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step 7: Payment Choice */}
        <View style={styles.section}>
          <View style={styles.policyBox}>
            <View style={styles.policyTitleRow}><Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} /><Text style={styles.policyTitle}>Booking policy</Text></View>
            <Text style={styles.policyText}>Free cancellation up to 2 hours before the slot. Any prepaid refund is returned to the original payment method after review.</Text>
          </View>
          <Text style={styles.sectionTitle}>7. Payment Choice</Text>
          <View style={styles.paymentOptionsRow}>
            <TouchableOpacity
              style={[styles.paymentCard, paymentChoice === 'Prepaid' && styles.selectedPaymentCard]}
              onPress={() => setPaymentChoice('Prepaid')}>
              
              <Ionicons
                name="card-outline"
                size={22}
                color={paymentChoice === 'Prepaid' ? Colors.primary : Colors.textSecondary} />
              
              <Text style={[styles.paymentCardTitle, paymentChoice === 'Prepaid' && styles.selectedPaymentText]}>
                Prepaid (UPI / Card)
              </Text>
              <Text style={styles.paymentCardSub}>Instant confirmation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentCard, paymentChoice === 'Cash on Delivery' && styles.selectedPaymentCard]}
              onPress={() => setPaymentChoice('Cash on Delivery')}>
              
              <Ionicons
                name="cash-outline"
                size={22}
                color={paymentChoice === 'Cash on Delivery' ? '#0A84FF' : Colors.textSecondary} />
              
              <Text
                style={[
                styles.paymentCardTitle,
                paymentChoice === 'Cash on Delivery' && { color: '#0A84FF' }]
                }>
                
                Cash on Delivery
              </Text>
              <Text style={styles.paymentCardSub}>Pay after inspection</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Summary Banner */}
        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryLabel}>Total Payable Amount</Text>
            <Text style={styles.summaryPrice}>₹{activeSubObj.price}</Text>
          </View>
          <View style={styles.guaranteeTag}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={styles.guaranteeText}>30-Day Free Rework</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.addToBucketBtn} onPress={handleAddToBucket}>
          <Ionicons name="basket-outline" size={20} color="#0A84FF" />
          <Text style={styles.addToBucketText}>Add to Bucket</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmBookingBtn} onPress={handleConfirmBooking}>
          <Text style={styles.confirmBookingText}>Confirm Booking</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  backBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs
  },
  sectionTitle: {
    ...Typography.heading3,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  horizontalScroll: {
    marginHorizontal: -Spacing.xs
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: Spacing.xs
  },
  selectedPill: {
    backgroundColor: '#0A84FF'
  },
  pillText: {
    ...Typography.captionBold,
    color: Colors.textSecondary
  },
  selectedPillText: {
    color: '#FFFFFF'
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedSubCard: {
    borderColor: '#0A84FF',
    backgroundColor: '#E5F1FF'
  },
  subLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  radioIcon: {
    marginRight: Spacing.xs
  },
  subName: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1
  },
  selectedSubName: {
    fontWeight: '700',
    color: '#0A84FF'
  },
  subPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0284C7',
    marginLeft: Spacing.xs
  },
  datesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  dateChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border
  },
  selectedDateChip: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary
  },
  dateText: {
    ...Typography.captionBold,
    color: Colors.textSecondary
  },
  selectedDateText: {
    color: Colors.primary
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border
  },
  selectedSlotCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  slotIcon: {
    marginRight: Spacing.sm
  },
  slotText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1
  },
  selectedSlotText: {
    fontWeight: '700',
    color: Colors.primary
  },
  checkIcon: {
    marginLeft: Spacing.xs
  },
  changeAddressLink: {
    ...Typography.captionBold,
    color: Colors.primary
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: Spacing.sm,
    borderRadius: 10
  },
  addrPin: {
    marginRight: Spacing.xs,
    marginTop: 2
  },
  addrTextContainer: {
    flex: 1
  },
  addrType: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textPrimary
  },
  addrLine: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 70
  },
  photoUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF'
  },
  photoUploadText: {
    ...Typography.captionBold,
    color: Colors.primary,
    marginLeft: Spacing.xs
  },
  policyBox: { backgroundColor: '#EFF6FF', borderRadius: 10, padding: Spacing.sm, marginBottom: Spacing.md, borderWidth: 1, borderColor: '#BFDBFE' },
  policyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  policyTitle: { ...Typography.captionBold, color: Colors.primary },
  policyText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
  paymentOptionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  paymentCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    alignItems: 'center'
  },
  selectedPaymentCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  paymentCardTitle: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginTop: 6,
    textAlign: 'center'
  },
  selectedPaymentText: {
    color: Colors.primary
  },
  paymentCardSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center'
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.textSecondary
  },
  summaryPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0284C7'
  },
  guaranteeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 4
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10
  },
  addToBucketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0A84FF',
    backgroundColor: '#E5F1FF',
    flex: 1
  },
  addToBucketText: {
    ...Typography.bodyBold,
    color: '#0A84FF',
    fontSize: 14,
    marginLeft: 6
  },
  confirmBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: '#0A84FF',
    flex: 1.2
  },
  confirmBookingText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 6
  }
});

export default ServiceBookingScreen;
