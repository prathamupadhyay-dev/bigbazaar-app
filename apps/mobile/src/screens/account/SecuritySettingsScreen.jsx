import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useApp } from '../../context/AppContext';

export default function SecuritySettingsScreen() {
  const navigation = useNavigation();
  const { appLockEnabled, setAppLockEnabled } = useApp();

  return (
    <ScreenContainer noPadding style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Lock & Security</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.heroIcon}>
          <Ionicons name={appLockEnabled ? 'lock-closed' : 'shield-checkmark-outline'} size={34} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Keep your account private</Text>
        <Text style={styles.subtitle}>
          Add an extra layer of protection before viewing saved addresses, payments and bookings. This demo uses local state only.
        </Text>

        <View style={styles.settingCard}>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>App Lock</Text>
            <Text style={styles.settingSubtitle}>Use device biometrics or passcode when you return to BigBazaar.</Text>
          </View>
          <Switch
            value={appLockEnabled}
            onValueChange={setAppLockEnabled}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={appLockEnabled ? '#0A84FF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={19} color={Colors.textSecondary} />
          <Text style={styles.infoText}>You can change this any time from Account settings.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.white
  },
  backButton: { padding: Spacing.xs },
  headerTitle: { ...Typography.heading2, color: Colors.textPrimary },
  content: { padding: Spacing.lg },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg
  },
  title: { ...Typography.heading2, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, lineHeight: 21, marginBottom: Spacing.xl },
  settingCard: {
    backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  settingCopy: { flex: 1, paddingRight: Spacing.md },
  settingTitle: { ...Typography.bodyBold, fontSize: 16, color: Colors.textPrimary, marginBottom: 4 },
  settingSubtitle: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, gap: 8 },
  infoText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 }
});
