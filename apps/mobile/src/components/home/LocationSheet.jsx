import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';






export const LocationSheet = ({ visible, onClose }) => {
  const [pincode, setPincode] = useState('452006');

  if (!visible) return null;

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBg} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.sheet}>
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
            
            <TouchableOpacity>
              <Text style={styles.checkText}>Check Pincode</Text>
            </TouchableOpacity>
          </View>

          {/* Use Current Location */}
          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="locate" size={20} color="#F41E68" style={styles.actionIcon} />
            <Text style={styles.actionText}>Use my current location</Text>
            <Ionicons name="chevron-forward" size={16} color="#F41E68" style={styles.chevron} />
          </TouchableOpacity>

          {/* Search Location */}
          <TouchableOpacity style={styles.actionRow}>
            <Ionicons name="map-outline" size={20} color="#F41E68" style={styles.actionIcon} />
            <Text style={styles.actionText}>Search location</Text>
            <Ionicons name="chevron-forward" size={16} color="#F41E68" style={styles.chevron} />
          </TouchableOpacity>
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
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
  checkText: {
    ...Typography.bodyBold,
    color: '#94A3B8' // Grayish
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
    color: '#F41E68',
    flex: 1
  },
  chevron: {
    marginLeft: 'auto'
  }
});

export default LocationSheet;