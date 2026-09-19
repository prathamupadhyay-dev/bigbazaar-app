import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export const AccountScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, setAuthenticated } = useApp();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Log Out',
      style: 'destructive',
      onPress: () => {
        setAuthenticated(false);
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    }]
    );
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const renderMenuItem = (icon, label, onPress, color = Colors.primary) =>
  <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, color !== Colors.primary && { color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />
    </TouchableOpacity>;


  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}><Ionicons name="person" size={28} color={Colors.primary} /></View>
        <Text style={styles.greetingTitle}>Hi, {isAuthenticated ? user.fullName.split(' ')[0] : 'there'}</Text>
        <Text style={styles.greetingSubtitle}>{isAuthenticated ? `${user.mobileNumber} · ${user.email}` : 'Sign in to manage your account'}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Quick Actions */}
        {isAuthenticated &&
        <View style={styles.quickActions}>
            <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('OrderHistory')}>
            
              <View style={[styles.quickActionIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="receipt-outline" size={20} color={Colors.success} />
              </View>
              <Text style={styles.quickActionText}>My Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Bookings')}>
            
              <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="calendar-outline" size={20} color='#1D4ED8' />
              </View>
              <Text style={styles.quickActionText}>Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Main', { screen: 'Watchlist' })}>
            
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="heart-outline" size={20} color={Colors.error} />
              </View>
              <Text style={styles.quickActionText}>Wishlist</Text>
            </TouchableOpacity>
          </View>
        }

        <View style={styles.menuList}>
          {isAuthenticated &&
          <>
              {renderMenuItem('person-outline', 'My Details', () => navigation.navigate('EditProfile'))}
              {renderMenuItem('pricetags-outline', 'My Ads', () => navigation.navigate('MyAds'))}
              {renderMenuItem('add-circle-outline', 'Sell an Item', () => navigation.navigate('PostAd'))}
              {renderMenuItem('chatbubbles-outline', 'Chats', () => navigation.navigate('Chat'))}
              {renderMenuItem('cube-outline', 'Delivery Address', () => navigation.navigate('AddressManagement'))}
              {renderMenuItem('card-outline', 'Payment Methods', () => navigation.navigate('PaymentManagement'))}
              {renderMenuItem('receipt-outline', 'Receipts', () => navigation.navigate('Receipts'))}
              {renderMenuItem('search-outline', 'Saved Searches', () => navigation.navigate('Search', { autoFocusSaved: true }))}
            </>
          }
          {renderMenuItem('help-circle-outline', 'FAQ', () => navigation.navigate('FAQ'))}
          {renderMenuItem('mail-outline', 'Support', () => navigation.navigate('HelpSupport'))}
          {isAuthenticated && renderMenuItem('trash-outline', 'Delete Account', () => navigation.navigate('DeleteAccount'), '#DC2626')}
          {isAuthenticated ? renderMenuItem('log-out-outline', 'Log Out', handleLogout, Colors.textSecondary) : renderMenuItem('log-in-outline', 'Log In', handleLogin, Colors.primary)}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>v.3.0.4-389557</Text>
          <TouchableOpacity>
            <Text style={styles.footerText}>Send logs</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  greetingTitle: {
    ...Typography.heading1,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 4
  },
  greetingSubtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  scrollContent: {
    backgroundColor: Colors.white
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: Spacing.lg
  },
  quickActionItem: {
    alignItems: 'center'
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  quickActionText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary
  },
  menuList: {
    paddingHorizontal: Spacing.lg
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuIcon: {
    marginRight: Spacing.md
  },
  menuLabel: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.lg
  },
  footerText: {
    ...Typography.body,
    color: Colors.disabled
  }
});

export default AccountScreen;