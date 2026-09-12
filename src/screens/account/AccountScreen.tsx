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

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useApp();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => navigation.replace('Welcome'),
      },
    ]);
  };

  const renderMenuItem = (icon: keyof typeof Ionicons.glyphMap, label: string, onPress: () => void, color: string = Colors.primary) => (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, color !== Colors.primary && { color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greetingTitle}>Hi, {user.fullName.split(' ')[0]}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.menuList}>
          {renderMenuItem('person-outline', 'My Details', () => navigation.navigate('EditProfile'))}
          {renderMenuItem('cube-outline', 'Delivery Methods', () => navigation.navigate('AddressManagement'))}
          {renderMenuItem('card-outline', 'Payment Methods', () => navigation.navigate('PaymentManagement'))}
          {renderMenuItem('receipt-outline', 'Receipts', () => navigation.navigate('Receipts'))}
          {renderMenuItem('search-outline', 'Saved Searches', () => (navigation as any).navigate('Search', { autoFocusSaved: true }))}
          {renderMenuItem('help-circle-outline', 'FAQ', () => navigation.navigate('FAQ'))}
          {renderMenuItem('mail-outline', 'Support', () => navigation.navigate('HelpSupport'))}
          {renderMenuItem('trash-outline', 'Delete Account', () => navigation.navigate('DeleteAccount'), '#DC2626')}
          {renderMenuItem('log-out-outline', 'Log Out', handleLogout, Colors.textSecondary)}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>v.3.0.4-389557</Text>
          <TouchableOpacity>
            <Text style={styles.footerText}>Send logs</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  greetingTitle: {
    ...Typography.heading1,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  scrollContent: {
    backgroundColor: Colors.white,
  },
  menuList: {
    paddingHorizontal: Spacing.lg,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuLabel: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.lg,
  },
  footerText: {
    ...Typography.body,
    color: Colors.disabled,
  },
});

export default AccountScreen;
