import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const DeleteAccountScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => (navigation as any).replace('Welcome') }
      ]
    );
  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.warningBox}>
          <Ionicons name="warning-outline" size={48} color="#DC2626" />
          <Text style={styles.warningTitle}>Are you sure?</Text>
          <Text style={styles.warningText}>
            Deleting your account will remove all your personal data, saved searches, payments, and booking history. This action cannot be undone.
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Permanently Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    elevation: 0,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { ...Typography.heading2, color: Colors.textPrimary },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.xl },
  warningBox: {
    backgroundColor: '#FEF2F2',
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  warningTitle: {
    ...Typography.heading3,
    color: '#DC2626',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  warningText: {
    ...Typography.body,
    color: '#991B1B',
    textAlign: 'center',
    lineHeight: 20,
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  }
});

export default DeleteAccountScreen;
