import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const FAQScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyBox}>
          <Ionicons name="help-circle-outline" size={64} color={Colors.disabled} />
          <Text style={styles.emptyTitle}>Frequently Asked Questions</Text>
          <Text style={styles.emptySubtitle}>We are currently updating our knowledge base.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>);

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
    elevation: 0
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { ...Typography.heading2, color: Colors.textPrimary },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.xl },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100 },
  emptyTitle: { ...Typography.heading3, color: Colors.textPrimary, marginTop: Spacing.md },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' }
});

export default FAQScreen;