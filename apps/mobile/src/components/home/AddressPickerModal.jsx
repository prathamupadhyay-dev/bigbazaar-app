import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp, AddressItem } from '../../context/AppContext';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';






export const AddressPickerModal = ({ visible, onClose }) => {
  const { addresses, activeAddress, setActiveAddress } = useApp();
  const navigation = useNavigation();

  const handleSelect = (addr) => {
    setActiveAddress(addr);
    onClose();
  };

  const handleManage = () => {
    onClose();
    navigation.navigate('AddressManagement');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Drag Handle */}
              <View style={styles.handle} />

              {/* Title Row */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>Select Service Location</Text>
                  <Text style={styles.subtitle}>Choose where you need services delivered</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Address List */}
              <ScrollView style={styles.list}>
                {addresses.map((item) => {
                  const isSelected = activeAddress.id === item.id;
                  const iconName =
                  item.type === 'Home' ?
                  'home-outline' :
                  item.type === 'Office' ?
                  'briefcase-outline' :
                  'location-outline';

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.addressCard, isSelected && styles.selectedCard]}
                      onPress={() => handleSelect(item)}
                      activeOpacity={0.7}>
                      
                      <View style={[styles.iconBox, isSelected && styles.selectedIconBox]}>
                        <Ionicons
                          name={iconName}
                          size={20}
                          color={isSelected ? Colors.primary : Colors.textSecondary} />
                        
                      </View>

                      <View style={styles.addressInfo}>
                        <View style={styles.typeBadgeRow}>
                          <Text style={styles.addressType}>{item.type}</Text>
                          {item.isDefault &&
                          <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                            </View>
                          }
                        </View>
                        <Text style={styles.addressText} numberOfLines={2}>
                          {item.houseNo}, {item.street}, {item.city} - {item.pincode}
                        </Text>
                      </View>

                      <View style={styles.radioBox}>
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={22}
                          color={isSelected ? Colors.primary : Colors.disabled} />
                        
                      </View>
                    </TouchableOpacity>);

                })}
              </ScrollView>

              {/* Bottom Actions */}
              <TouchableOpacity style={styles.manageButton} onPress={handleManage}>
                <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
                <Text style={styles.manageButtonText}>Add or Manage Addresses</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>);

};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
    maxHeight: '65%'
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  title: {
    ...Typography.heading3,
    color: Colors.textPrimary
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2
  },
  closeBtn: {
    padding: Spacing.xs
  },
  list: {
    marginBottom: Spacing.md
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    marginBottom: Spacing.sm
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm
  },
  selectedIconBox: {
    backgroundColor: '#FFFFFF'
  },
  addressInfo: {
    flex: 1
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  addressType: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    marginRight: Spacing.xs
  },
  defaultBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary
  },
  addressText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16
  },
  radioBox: {
    marginLeft: Spacing.sm
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF'
  },
  manageButtonText: {
    ...Typography.bodyBold,
    color: Colors.primary,
    marginLeft: Spacing.xs
  }
});

export default AddressPickerModal;