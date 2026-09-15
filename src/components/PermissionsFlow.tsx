import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import Typography from '../constants/typography';
import Spacing from '../constants/spacing';

const HAS_COMPLETED_PERMISSIONS_KEY = '@has_completed_permissions_flow';

export const PermissionsFlow: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    checkFirstLoad();
  }, []);

  const checkFirstLoad = async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem(HAS_COMPLETED_PERMISSIONS_KEY);
      if (hasCompleted !== 'true') {
        setIsVisible(true);
        // Add a slight delay before triggering the location permission
        // so it doesn't interrupt the splash screen abruptly
        setTimeout(() => {
          requestLocationPermission();
        }, 1000);
      }
    } catch (e) {
      console.error('Error reading async storage', e);
    }
  };

  const markCompleted = async () => {
    try {
      await AsyncStorage.setItem(HAS_COMPLETED_PERMISSIONS_KEY, 'true');
      setIsVisible(false);
      setShowNotificationModal(false);
    } catch (e) {
      console.error('Error saving async storage', e);
    }
  };

  const requestLocationPermission = async () => {
    try {
      // Native location prompt
      await Location.requestForegroundPermissionsAsync();
    } catch (e) {
      console.error('Location permission error', e);
    } finally {
      // After location is answered (or denied), show the custom notification modal
      setShowNotificationModal(true);
    }
  };

  const handleGiveNotificationPermission = async () => {
    try {
      // Show native notification prompt
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      console.error('Notification permission error', e);
    } finally {
      markCompleted();
    }
  };

  const handleLater = () => {
    markCompleted();
  };

  if (!isVisible || !showNotificationModal) {
    return null;
  }

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          {/* Notification Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="notifications-outline" size={32} color={Colors.textPrimary} />
            <View style={styles.badge} />
          </View>
          
          <Text style={styles.title}>Push Notifications</Text>
          <Text style={styles.description}>
            Stay informed with order updates, promotional offers, and platform communications.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handleGiveNotificationPermission}>
            <Text style={styles.primaryButtonText}>GIVE PERMISSION</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLater}>
            <Text style={styles.secondaryButtonText}>LATER, TAKE ME BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  title: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  primaryButton: {
    backgroundColor: '#FF1493', // Pinkish red from screenshot
    width: '100%',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.textPrimary,
  }
});

export default PermissionsFlow;
