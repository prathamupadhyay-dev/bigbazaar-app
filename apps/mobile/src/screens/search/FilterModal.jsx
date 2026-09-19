import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';







export default function FilterModal({ visible, onClose, onOpenSort }) {
  const [alwaysUseLocations, setAlwaysUseLocations] = useState(false);
  const [pickupChecked, setPickupChecked] = useState(true);
  const [shippingChecked, setShippingChecked] = useState(true);

  // Addresses mock
  const addresses = [
  { id: 1, text: '123 Main Street, New York, NY', checked: true },
  { id: 2, text: '456 Elm Street, San Francisco, CA', checked: false },
  { id: 3, text: '789 Oak Avenue, Austin, TX', checked: false },
  { id: 4, text: '101 Pine Road, Seattle, WA', checked: true },
  { id: 5, text: '202 Maple Drive, Chicago, IL', checked: true }];


  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filter</Text>
            <TouchableOpacity>
              <Text style={styles.headerRight}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Retail Price */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Retail Price</Text>
                <Ionicons name="chevron-up" size={20} color={Colors.disabled} />
              </View>
              <View style={styles.priceInputs}>
                <View style={styles.priceInputBox}>
                  <Text style={styles.priceInputText}>From <Text style={styles.priceValue}>$1</Text></Text>
                </View>
                <View style={styles.priceInputBox}>
                  <Text style={styles.priceInputText}>To <Text style={styles.priceValue}>$2000+</Text></Text>
                </View>
              </View>
              {/* Fake Slider */}
              <View style={styles.sliderMock}>
                <View style={styles.sliderTrack} />
                <View style={[styles.sliderThumb, { left: 0 }]} />
                <View style={[styles.sliderThumb, { right: 0 }]} />
              </View>
            </View>

            {/* Sorting */}
            <TouchableOpacity style={styles.sectionHeader} onPress={onOpenSort}>
              <Text style={styles.sectionTitle}>Sorting</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.disabled} />
            </TouchableOpacity>

            {/* Categories */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <Ionicons name="chevron-up" size={20} color={Colors.disabled} />
              </View>
              <View style={styles.chipContainer}>
                {['Men', 'Women', 'Kids', 'Beauty', 'Home'].map((cat, idx) =>
                <TouchableOpacity key={idx} style={[styles.chip, idx === 1 && styles.chipActive]}>
                    <Text style={[styles.chipText, idx === 1 && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Brands */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Brands</Text>
                <Ionicons name="chevron-up" size={20} color={Colors.disabled} />
              </View>
              <View style={styles.checkboxContainer}>
                {['Nike', 'Puma', 'Adidas', 'Levi\'s', 'H&M'].map((brand, idx) =>
                <View key={idx} style={styles.checkboxRow}>
                    <TouchableOpacity style={styles.checkbox}>
                      {idx < 2 ? <Ionicons name="checkbox" size={24} color={Colors.primary} /> : <Ionicons name="square-outline" size={24} color={Colors.disabled} />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>{brand}</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>);

}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  iconBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  headerRight: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '500'
  },
  scrollContent: {
    flex: 1
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.md
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  sectionTitle: {
    ...Typography.body,
    color: Colors.primary,
    fontSize: 16
  },
  priceInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md
  },
  priceInputBox: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    alignItems: 'center'
  },
  priceInputText: {
    ...Typography.body,
    color: Colors.textSecondary
  },
  priceValue: {
    color: Colors.primary,
    fontWeight: '600'
  },
  sliderMock: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md
  },
  sliderTrack: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    width: '100%'
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.primary,
    position: 'absolute'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm
  },
  chipActive: {
    backgroundColor: Colors.primary
  },
  chipText: {
    ...Typography.body,
    color: Colors.textSecondary
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  checkboxContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  checkbox: {
    marginRight: Spacing.md
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.textPrimary
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  applyBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16
  }
});