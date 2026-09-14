import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export const AddressManagementScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Methods</Text>
        <TouchableOpacity>
          <Text style={styles.headerEdit}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.methodSection}>
          <View style={styles.methodHeaderRow}>
            <Text style={styles.methodLabel}>Shipping</Text>
            <Ionicons name="checkmark" size={16} color={Colors.disabled} style={{ marginLeft: Spacing.sm }} />
            <Text style={styles.defaultBadge}>Default delivery method</Text>
          </View>
          <Text style={styles.methodValue}>
            123 Main Street, Downtown Avenue, New York,{'\n'}10001
          </Text>
        </View>

        <View style={styles.methodSection}>
          <Text style={styles.methodLabel}>Pickup</Text>
          <Text style={styles.methodValue}>Local pickup</Text>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 0,
    elevation: 0,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerEdit: {
    ...Typography.body,
    color: Colors.primary,
  },
  scrollContent: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  methodSection: {
    marginBottom: Spacing.xl,
  },
  methodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  methodLabel: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
  },
  defaultBadge: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  methodValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginTop: 4,
  },
});

export default AddressManagementScreen;
