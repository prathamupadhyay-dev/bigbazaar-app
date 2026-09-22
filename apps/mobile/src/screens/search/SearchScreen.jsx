import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard, ScrollView, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import ServiceItemCard, { ServiceItemData } from '../../components/home/ServiceItemCard';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import FilterModal from './FilterModal';
import SortModal from './SortModal';

import { MOCK_SERVICES } from '../../components/home/ServiceGridList';

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { query: initialQuery, autoFocusSaved } = route.params || {};

  const [query, setQuery] = useState(initialQuery || '');
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery || '');
  const [showSaved, setShowSaved] = useState(autoFocusSaved || !initialQuery);
  const {
    watchlist, toggleWatchlist,
    savedSearches, addSavedSearch, removeSavedSearch,
    recentSearches, addRecentSearch, removeRecentSearch
  } = useApp();

  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setSubmittedQuery(initialQuery);
      setShowSaved(false);
    }
  }, [initialQuery]);

  const handleSearchTextChange = (text) => {
    setQuery(text);
    if (text.length === 0) {
      setSubmittedQuery('');
      setShowSaved(true);
    }
  };

  const handleSubmitSearch = () => {
    const trimmed = query.trim();
    setSubmittedQuery(query);
    if (trimmed.length > 0) {
      addRecentSearch(trimmed);
      setShowSaved(false);
    }
  };

  const handleRecentSearchPress = (term) => {
    setQuery(term);
    setSubmittedQuery(term);
    addRecentSearch(term);
    setShowSaved(false);
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setQuery('');
    setSubmittedQuery('');
    setShowSaved(true);
    Keyboard.dismiss();
  };

  const handleItemPress = (item) => {
    navigation.navigate('ServiceDetails', { item });
  };

  const isSearchSaved = savedSearches.includes(query.trim());

  const toggleSearchSaved = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (isSearchSaved) {
      removeSavedSearch(trimmed);
    } else {
      addSavedSearch(trimmed);
    }
  };

  const results = MOCK_SERVICES.filter((i) => {
    return i.title.toLowerCase().includes(submittedQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(submittedQuery.toLowerCase());
  }).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <ScreenContainer noPadding style={{ backgroundColor: Colors.white }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSubmitSearch}
            returnKeyType="search"
            autoFocus={!initialQuery && !autoFocusSaved} />
          
          {query.trim().length > 0 ?
          <TouchableOpacity style={styles.heartBtn} onPress={toggleSearchSaved}>
              <Ionicons
              name={isSearchSaved ? "star" : "star-outline"}
              size={20}
              color={isSearchSaved ? '#F59E0B' : Colors.textSecondary} />
            
            </TouchableOpacity> :
          null}
        </View>

        {/* Filter icons, only shown when there's a search term or results */}
        {query.length > 0 &&
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
              <Ionicons name="options-outline" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        }
      </View>

      <View style={styles.content}>
        {showSaved ?
        <View style={styles.savedSearchesContainer}>
            <TouchableOpacity
            style={styles.savedHeaderRow}
            onPress={() => navigation.navigate('SavedSearches')}>
            
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
                <Text style={styles.savedHeaderTitle}>View Saved Searches</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />
            </TouchableOpacity>
            
            <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }}>
              <Text style={{ ...Typography.captionBold, color: Colors.textSecondary }}>RECENT SEARCHES</Text>
            </View>
            
            <ScrollView keyboardShouldPersistTaps="always">
              {recentSearches.slice(0, 5).map((term, idx) =>
            <View key={idx} style={styles.savedSearchItem}>
                  <TouchableOpacity
                style={{ flex: 1, paddingVertical: Spacing.md }}
                onPress={() => handleRecentSearchPress(term)}>
                
                    <Text style={styles.savedSearchText}>{term}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => removeRecentSearch(term)}>
                
                    <Ionicons name="close" size={18} color={Colors.disabled} />
                  </TouchableOpacity>
                </View>
            )}
              {recentSearches.length === 0 &&
            <View style={{ padding: Spacing.xl, alignItems: 'center' }}>
                  <Text style={styles.emptyText}>No recent searches</Text>
                </View>
            }

              {/* Trending Categories */}
              <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
                <Text style={{ ...Typography.captionBold, color: Colors.textSecondary }}>TRENDING CATEGORIES</Text>
              </View>
              <View style={styles.pillContainer}>
                {['Sneakers', 'Dresses', 'Watches', 'Handbags', 'Activewear', 'Jeans'].map((cat, idx) =>
              <TouchableOpacity key={idx} style={styles.pill} onPress={() => handleRecentSearchPress(cat)}>
                    <Text style={styles.pillText}>{cat}</Text>
                  </TouchableOpacity>
              )}
              </View>

              {/* Popular Brands */}
              <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
                <Text style={{ ...Typography.captionBold, color: Colors.textSecondary }}>POPULAR BRANDS</Text>
              </View>
              <View style={styles.pillContainer}>
                {['Nike', 'Puma', 'Adidas', 'Levi\'s', 'Zara', 'H&M'].map((brand, idx) =>
              <TouchableOpacity key={idx} style={styles.pill} onPress={() => handleRecentSearchPress(brand)}>
                    <Text style={styles.pillText}>{brand}</Text>
                  </TouchableOpacity>
              )}
              </View>
              <View style={{ height: 100 }} />
            </ScrollView>
          </View> :

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) =>
          <View style={styles.cardWrapper}>
                <ServiceItemCard
              item={item}
              isSaved={watchlist.includes(item.id)}
              onPress={handleItemPress}
              onBookPress={handleItemPress}
              onSavePress={() => toggleWatchlist(item.id)} />
            
              </View>
          }
          ListEmptyComponent={
          <Text style={styles.emptyText}>No items found for "{query}"</Text>
          } />

        }
      </View>

      {/* Modals */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onOpenSort={() => {
          setFilterVisible(false);
          // Small delay to let Filter modal close before opening Sort modal for smoother animation
          setTimeout(() => setSortVisible(true), 150);
        }} />
      
      
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)} />
      

    </ScreenContainer>);

}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 0, // removed border
    elevation: 0 // removed shadow
  },
  backBtn: {
    paddingRight: Spacing.md
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // light gray background for search bar
    borderRadius: 30, // fully rounded pill
    height: 48,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0
  },
  heartBtn: {
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44
  },
  filterBtn: {
    paddingLeft: Spacing.md
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white
  },
  savedSearchesContainer: {
    flex: 1,
    paddingTop: Spacing.md
  },
  savedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md
  },
  savedHeaderTitle: {
    ...Typography.heading3,
    fontSize: 16,
    color: '#3F3F46' // slightly dark gray
  },
  savedSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  savedSearchText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500'
  },
  closeBtn: {
    padding: Spacing.xs
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg
  },
  pill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm
  },
  pillText: {
    ...Typography.body,
    color: Colors.textPrimary
  },
  listContainer: {
    padding: Spacing.md,
    backgroundColor: '#F8FAFC'
  },
  row: {
    justifyContent: 'space-between'
  },
  cardWrapper: {
    width: '48.5%',
    marginBottom: Spacing.md
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  typeSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl + 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10
  },
  typeSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg
  },
  typeSheetTitle: {
    ...Typography.heading2,
    color: '#0F172A',
    marginBottom: Spacing.lg,
    textAlign: 'center'
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  typeOptionText: {
    ...Typography.body,
    fontSize: 16,
    color: '#64748B'
  },
  typeOptionActive: {
    color: '#0F172A',
    fontWeight: '700'
  }
});
