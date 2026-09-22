import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useApp } from '../../context/AppContext';






export const LocationSheet = ({ visible, onClose }) => {
  const [pincode, setPincode] = useState('452006');
  const [locationQuery, setLocationQuery] = useState('');
  const { activeAddress, setActiveAddress } = useApp();
  const locationSuggestions = [
    { city: 'Indore', area: 'Vijay Nagar', pincode: '452010' },
    { city: 'Mumbai', area: 'Andheri West', pincode: '400053' },
    { city: 'Delhi', area: 'Connaught Place', pincode: '110001' },
    { city: 'Bengaluru', area: 'Koramangala', pincode: '560034' },
    { city: 'Pune', area: 'Kothrud', pincode: '411038' }
  ];

  if (!visible) return null;

  const applyPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      Alert.alert('Enter a valid pincode', 'Please enter a 6-digit delivery pincode.');
      return;
    }
    setActiveAddress({ ...activeAddress, pincode });
    onClose?.();
  };

  const useCurrentLocation = () => {
    const detectedLocation = { city: 'Indore', street: 'Vijay Nagar', pincode: '452010' };
    setPincode(detectedLocation.pincode);
    setActiveAddress({ ...activeAddress, ...detectedLocation });
    onClose?.();
  };

  const chooseLocation = (location) => {
    setPincode(location.pincode);
    setLocationQuery(`${location.area}, ${location.city}`);
    setActiveAddress({ ...activeAddress, city: location.city, street: location.area, pincode: location.pincode });
    onClose?.();
  };

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBg} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Delivery Location</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Pincode Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6} />
            
            <TouchableOpacity onPress={applyPincode} accessibilityLabel="Check pincode">
              <Text style={styles.checkText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Search city or locality</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={19} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={locationQuery}
              onChangeText={setLocationQuery}
              placeholder="e.g. Vijay Nagar, Mumbai"
              placeholderTextColor={Colors.disabled}
              autoCorrect={false}
            />
            {locationQuery.length > 0 && <TouchableOpacity onPress={() => setLocationQuery('')}><Ionicons name="close-circle" size={18} color={Colors.textSecondary} /></TouchableOpacity>}
          </View>
          {locationQuery.trim().length > 0 && <View style={styles.suggestions}>
            {locationSuggestions.filter((location) => `${location.area} ${location.city}`.toLowerCase().includes(locationQuery.toLowerCase())).map((location) =>
              <TouchableOpacity key={location.pincode} style={styles.suggestionRow} onPress={() => chooseLocation(location)}>
                <View style={styles.suggestionIcon}><Ionicons name="location-outline" size={17} color={Colors.primary} /></View>
                <View style={styles.suggestionCopy}><Text style={styles.suggestionTitle}>{location.area}</Text><Text style={styles.suggestionMeta}>{location.city} · {location.pincode}</Text></View>
                <Ionicons name="chevron-forward" size={17} color={Colors.disabled} />
              </TouchableOpacity>
            )}
          </View>}

          {/* Use Current Location */}
          <TouchableOpacity style={styles.actionRow} onPress={useCurrentLocation}>
            <Ionicons name="locate" size={20} color={Colors.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Use my current location</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} style={styles.chevron} />
          </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>);

};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  overlayBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '86%'
  },
  sheetContent: { paddingBottom: Spacing.sm },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl
  },
  title: {
    ...Typography.heading2,
    fontSize: 18,
    color: '#0F172A'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 50,
    marginBottom: Spacing.xl
  },
  input: {
    flex: 1,
    ...Typography.body,
    fontSize: 16,
    color: Colors.textPrimary
  },
  fieldLabel: { ...Typography.captionBold, color: Colors.textSecondary, marginBottom: 6 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: Spacing.md, backgroundColor: '#F8FAFC' },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary, marginLeft: Spacing.sm },
  suggestions: { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, marginTop: 6, overflow: 'hidden', backgroundColor: Colors.white },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  suggestionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  suggestionCopy: { flex: 1 },
  suggestionTitle: { ...Typography.bodyBold, fontSize: 13, color: Colors.textPrimary },
  suggestionMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  checkText: {
    ...Typography.bodyBold,
    color: Colors.primary,
    fontSize: 14
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md
  },
  actionIcon: {
    marginRight: Spacing.md
  },
  actionText: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.primary,
    flex: 1
  },
  chevron: {
    marginLeft: 'auto'
  }
});

export default LocationSheet;
