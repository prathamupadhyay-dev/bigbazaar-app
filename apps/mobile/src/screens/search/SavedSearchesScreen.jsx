import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useApp } from '../../context/AppContext';



export default function SavedSearchesScreen({ navigation }) {
  const { savedSearches } = useApp();

  const handleEditPress = () => {
    Alert.alert('Edit Saved Search', 'Run this search again from the search screen to update its filters.');
  };

  const handleSearchItemPress = (keyword) => {
    navigation.navigate('Search', { query: keyword });
  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#64748B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Saved Searches</Text>
        
        <TouchableOpacity style={styles.headerBtn} onPress={handleEditPress}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitleText}>
          Looking for something specific? We'll send you the notification when new items match your list of keywords
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={savedSearches}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) =>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => handleSearchItemPress(item)}>
          
            <View style={styles.itemLeft}>
              <Ionicons name="star" size={17} color="#F59E0B" style={styles.savedIcon} />
              <Text style={styles.itemText}>{item}</Text>
              <View style={styles.blueDot} />
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        }
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved searches yet.</Text>
          </View>
        } />
      
    </ScreenContainer>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: '#FFFFFF'
  },
  headerBtn: {
    padding: Spacing.xs,
    minWidth: 44 // Ensures touch target size and spacing symmetry
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: '#1E293B'
  },
  editBtnText: {
    ...Typography.bodyBold,
    color: '#0A84FF', // BigBazaar/iOS Blue
    fontSize: 15,
    textAlign: 'right'
  },
  subtitleContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9' // Very light separator
  },
  subtitleText: {
    ...Typography.body,
    color: '#94A3B8', // Lighter grey for this subtitle
    fontSize: 13,
    lineHeight: 18
  },
  listContainer: {
    paddingBottom: Spacing.xxl
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC'
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  savedIcon: {
    marginRight: Spacing.sm,
  },
  itemText: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: '#0F172A' // Dark navy black
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0A84FF',
    marginLeft: 8
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary
  }
});
