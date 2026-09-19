import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
















export const MOCK_PRODUCTS = [
{
  id: 'prod-1',
  title: 'Apple iPhone 14 Pro Max - 256GB',
  price: '$899',
  originalPrice: '$1099',
  location: 'Mumbai, MH',
  imageUrl: 'https://picsum.photos/seed/iphone/400/400',
  rating: 4.8,
  reviews: 124,
  category: 'Electronics',
  condition: 'Like New',
  sellerName: 'TechGadget Store',
  sellerRating: 4.9
},
{
  id: 'prod-2',
  title: 'Nike Air Max 270 - Running Shoes',
  price: '$89',
  originalPrice: '$129',
  location: 'Delhi, DL',
  imageUrl: 'https://picsum.photos/seed/nike/400/400',
  rating: 4.6,
  reviews: 89,
  category: 'Fashion',
  condition: 'New',
  sellerName: 'Sports Hub',
  sellerRating: 4.7
},
{
  id: 'prod-3',
  title: 'Samsung 55" 4K Smart TV',
  price: '$499',
  originalPrice: '$699',
  location: 'Bangalore, KA',
  imageUrl: 'https://picsum.photos/seed/samsung/400/400',
  rating: 4.5,
  reviews: 67,
  category: 'Electronics',
  condition: 'Excellent',
  sellerName: 'ElectroWorld',
  sellerRating: 4.6
},
{
  id: 'prod-4',
  title: 'Levi\'s 511 Slim Fit Jeans',
  price: '$45',
  originalPrice: '$70',
  location: 'Pune, MH',
  imageUrl: 'https://picsum.photos/seed/levis/400/400',
  rating: 4.7,
  reviews: 156,
  category: 'Fashion',
  condition: 'New',
  sellerName: 'Fashion Forward',
  sellerRating: 4.8
},
{
  id: 'prod-5',
  title: 'MacBook Pro M2 - 13 inch',
  price: '$1199',
  originalPrice: '$1499',
  location: 'Hyderabad, TS',
  imageUrl: 'https://picsum.photos/seed/macbook/400/400',
  rating: 4.9,
  reviews: 203,
  category: 'Electronics',
  condition: 'Like New',
  sellerName: 'Apple Authorized',
  sellerRating: 5.0
},
{
  id: 'prod-6',
  title: 'Wooden King Size Bed Frame',
  price: '$299',
  originalPrice: '$450',
  location: 'Chennai, TN',
  imageUrl: 'https://picsum.photos/seed/bed/400/400',
  rating: 4.4,
  reviews: 45,
  category: 'Furniture',
  condition: 'Good',
  sellerName: 'Home Essentials',
  sellerRating: 4.5
},
{
  id: 'prod-7',
  title: 'Canon EOS R6 Mirrorless Camera',
  price: '$1799',
  originalPrice: '$2199',
  location: 'Kolkata, WB',
  imageUrl: 'https://picsum.photos/seed/canon/400/400',
  rating: 4.8,
  reviews: 78,
  category: 'Electronics',
  condition: 'Excellent',
  sellerName: 'Photo Pro Shop',
  sellerRating: 4.9
},
{
  id: 'prod-8',
  title: 'Adidas Ultraboost 22 Running Shoes',
  price: '$120',
  originalPrice: '$180',
  location: 'Ahmedabad, GJ',
  imageUrl: 'https://picsum.photos/seed/adidas/400/400',
  rating: 4.7,
  reviews: 112,
  category: 'Fashion',
  condition: 'New',
  sellerName: 'Sports Zone',
  sellerRating: 4.6
}];


const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Furniture', 'Home', 'Sports', 'Books'];

export const ProductListScreen = () => {
  const navigation = useNavigation();
  const { watchlist, toggleWatchlist, requireAuth } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'priceLow') return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleFavourite = (productId) => {
    requireAuth(navigation, () => {
      toggleWatchlist(productId);
    });
  };

  const renderProductCard = ({ item }) => {
    const isFavourited = watchlist.includes(item.id);
    return (
      <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
          <TouchableOpacity
            style={styles.favouriteBtn}
            onPress={() => handleFavourite(item.id)}>
            
            <Ionicons
              name={isFavourited ? "heart" : "heart-outline"}
              size={20}
              color={isFavourited ? Colors.error : Colors.textSecondary} />
            
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
        </View>
      </TouchableOpacity>);

  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}>
          
          <Ionicons name="cart-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery} />
        
        {searchQuery.length > 0 &&
        <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        }
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        
        {CATEGORIES.map((cat) =>
        <TouchableOpacity
          key={cat}
          style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
          onPress={() => setSelectedCategory(cat)}>
          
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sort & Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredProducts.length} items</Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortBy((current) => current === 'popular' ? 'priceLow' : current === 'priceLow' ? 'rating' : 'popular')}>
          <Ionicons name="swap-vertical" size={16} color={Colors.primary} />
          <Text style={styles.sortText}>{sortBy === 'popular' ? 'Popular' : sortBy === 'priceLow' ? 'Price' : 'Rating'}</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        } />
      
    </ScreenContainer>);

};

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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  backBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  cartBtn: {
    padding: Spacing.xs
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    height: 44
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm
  },
  categoryScroll: {
    maxHeight: 50
  },
  categoryContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: Spacing.sm
  },
  categoryChipActive: {
    backgroundColor: Colors.primary
  },
  categoryText: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textSecondary
  },
  categoryTextActive: {
    color: Colors.white
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm
  },
  resultsCount: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4
  },
  productList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100
  },
  productRow: {
    justifyContent: 'space-between'
  },
  productCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative'
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5'
  },
  favouriteBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  productInfo: {
    padding: Spacing.sm
  },
  productTitle: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 4,
    height: 36
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  productPrice: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.primary,
    marginRight: 6
  },
  originalPrice: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  locationText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    ...Typography.bodyBold,
    fontSize: 11,
    color: '#B45309',
    marginLeft: 4
  },
  reviewsText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 2
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  emptyTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.md
  },
  emptySubtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.disabled,
    marginTop: Spacing.xs
  }
});

export default ProductListScreen;