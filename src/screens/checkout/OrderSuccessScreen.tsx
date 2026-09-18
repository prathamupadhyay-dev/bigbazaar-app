import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export default function OrderSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = (route.params as any) || { orderId: 'BB-00000' };

  const scaleValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

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
          onPress={() => (navigation as any).navigate('OrderHistory')}
        >
          <Text style={styles.primaryBtnText}>View Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryBtn} 
          onPress={() => (navigation as any).navigate('Main', { screen: 'Home' })}
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.heading1,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  orderIdBox: {
    backgroundColor: '#F8FAFC',
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderIdLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  orderIdValue: {
    ...Typography.heading2,
    color: Colors.primary,
    letterSpacing: 1,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryBtnText: {
    ...Typography.button,
    color: Colors.primary,
    fontSize: 16,
  },
});
