import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput } from
'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.mobileNumber);
  const [email, setEmail] = useState(user.email);

  const toggleEdit = () => {
    if (isEditing) {
      updateUser({
        fullName: name,
        mobileNumber: phone,
        email: email
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Details</Text>
        <TouchableOpacity onPress={toggleEdit} style={styles.backButton}>
          <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.fieldRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Name</Text>
            {isEditing ?
            <TextInput style={styles.input} value={name} onChangeText={setName} /> :

            <Text style={styles.fieldValue}>{name}</Text>
            }
          </View>
        </View>

        <TouchableOpacity style={styles.fieldRow} disabled={!isEditing}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ?
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" /> :

            <Text style={styles.fieldValue}>{phone}</Text>
            }
          </View>
          {!isEditing && <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldRow} disabled={!isEditing}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Email</Text>
            {isEditing ?
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" /> :

            <Text style={styles.fieldValue}>{email}</Text>
            }
          </View>
          {!isEditing && <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.fieldRow}>
          <Text style={styles.fieldValue}>Change password</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
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
    elevation: 0
  },
  backButton: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  scrollContent: {
    backgroundColor: Colors.white
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0', // lighter thinner line
    marginLeft: Spacing.md, // indent separator line slightly
    paddingLeft: 0
  },
  fieldLabel: {
    ...Typography.captionBold,
    color: Colors.textSecondary,
    marginBottom: 4
  },
  fieldValue: {
    ...Typography.body,
    color: Colors.textPrimary
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    padding: 0,
    margin: 0,
    marginTop: 2
  }
});