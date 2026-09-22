import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useApp } from '../../context/AppContext';

export default function OrderSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || { orderId: 'BB-00000' };
  const { appLockEnabled, setAppLockEnabled, appLockPromptShown, setAppLockPromptShown } = useApp();

  const scaleValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true
    }).start();
  }, []);

  useEffect(() => {
    if (appLockEnabled || appLockPromptShown) return undefined;
    setAppLockPromptShown(true);
    const promptTimer = setTimeout(() => {
      Alert.alert(
        'Protect your account',
        'Would you like to turn on App Lock for faster, safer access to your orders and payments?',
        [
          { text: 'Maybe later', style: 'cancel' },
          { text: 'Enable App Lock', onPress: () => setAppLockEnabled(true) }
        ]
      );
    }, 650);
    return () => clearTimeout(promptTimer);
  }, [appLockEnabled, appLockPromptShown, setAppLockEnabled, setAppLockPromptShown]);

  return (
    <ScreenContainer noPadding style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}>
          <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
        </Animated.View>
        
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your order has been placed successfully.</Text>
        
        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>{orderId}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('OrderHistory')}>
          
          <Text style={styles.primaryBtnText}>View Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl
  },
  iconContainer: {
    marginBottom: Spacing.xl
  },
  title: {
    ...Typography.heading1,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl
  },
  orderIdBox: {
    backgroundColor: '#F8FAFC',
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border
  },
  orderIdLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  orderIdValue: {
    ...Typography.heading2,
    color: Colors.primary,
    letterSpacing: 1
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  primaryBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary
  },
  secondaryBtnText: {
    ...Typography.button,
    color: Colors.primary,
    fontSize: 16
  }
});
