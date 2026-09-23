import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ServiceItemCard from './ServiceItemCard';
import Spacing from '../../constants/spacing';
import { useApp } from '../../context/AppContext';

export const MOCK_SERVICES = [
  { id: 'p1', title: 'Used commuter bicycle', imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=900', price: '₹8,500', timeEstimate: '2h ago', location: 'Kottayam', category: 'Bikes', itemType: 'product' },
  { id: 's1', title: 'Expert Plumbing Repair & Leak Fix', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900', price: '₹450', timeEstimate: '2h', location: 'Kottayam', category: 'Plumbing', itemType: 'service' },
  { id: 'p4', title: 'Wooden study desk with chair', imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900', price: '₹4,200', timeEstimate: '3h ago', location: 'Kochi', category: 'Furniture', itemType: 'product' },
  { id: 's2', title: 'AC Servicing & Deep Clean', imageUrl: 'https://images.unsplash.com/photo-1631545806609-7e7f7c8c6f27?w=900', price: '₹699', timeEstimate: '1h 30m', location: 'Kottayam', category: 'AC Repair', itemType: 'service' },
  { id: 'p2', title: 'Cotton winter jacket', imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=900', price: '₹1,200', timeEstimate: '5h ago', location: 'Thrissur', category: 'Fashion', itemType: 'product' },
  { id: 's4', title: 'Sofa & Carpet Dry Cleaning', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900', price: '₹899', timeEstimate: '1h', location: 'Kochi', category: 'Home Cleaning', itemType: 'service' },
  { id: 'p5', title: 'Two-seater sofa in good condition', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900', price: '₹12,500', timeEstimate: '1d ago', location: 'Alappuzha', category: 'Furniture', itemType: 'product' },
  { id: 's3', title: 'High School Math Tutoring', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900', price: '₹600 / hr', timeEstimate: 'Flexible', location: 'Kottayam', category: 'Tutoring', itemType: 'service' },
  { id: 'p3', title: 'Noise cancelling headphones', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900', price: '₹4,800', timeEstimate: '2d ago', location: 'Bengaluru', category: 'Electronics', itemType: 'product' },
  { id: 's5', title: 'Professional Home Painting', imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900', price: '₹400 / hr', timeEstimate: '3 days', location: 'Kochi', category: 'Home Service', itemType: 'service' },
  { id: 'p6', title: 'Solid wood side table', imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900', price: '₹2,700', timeEstimate: '4h ago', location: 'Kottayam', category: 'Furniture', itemType: 'product' },
  { id: 's6', title: 'Deep Tissue Massage Therapy', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900', price: '₹1,200', timeEstimate: '60m', location: 'Kottayam', category: 'Wellness', itemType: 'service' },
  { id: 'p7', title: 'Dining table set for four', imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900', price: '₹9,500', timeEstimate: '1d ago', location: 'Kochi', category: 'Furniture', itemType: 'product' },
  { id: 'p8', title: 'Classic aviator sunglasses', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900', price: '₹1,100', timeEstimate: '6h ago', location: 'Kottayam', category: 'Fashion', itemType: 'product' }
];

const AnimatedCard = ({ item, index, handlePress, handleSavePress, isSaved }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(12)).current;
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, delay: index * 45, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 260, delay: index * 45, useNativeDriver: true })
    ]).start();
  }, []);
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}><ServiceItemCard item={item} isSaved={isSaved} onPress={handlePress} onSavePress={handleSavePress} /></Animated.View>;
};

export const ServiceGridList = ({ typeFilter = 'all', filters = {} }) => {
  const navigation = useNavigation();
  const { watchlist, toggleWatchlist } = useApp();
  const handlePress = (item) => {
    if (item.itemType === 'product') {
      const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      navigation.navigate('ProductDetails', { product: { ...item, originalPrice: '₹' + Math.round(numericPrice * 1.15), condition: 'Used - good condition', sellerName: 'Local seller', sellerRating: 4.7, rating: 4.7, reviews: 8 } });
      return;
    }
    navigation.navigate('ServiceDetails', { item });
  };
  let filteredItems = MOCK_SERVICES.filter((item) => typeFilter === 'all' || item.itemType === typeFilter);
  if (filters.Categories && filters.Categories !== 'All') filteredItems = filteredItems.filter((item) => item.category === filters.Categories);
  if (filters['Top Brands'] && filters['Top Brands'] !== 'All') filteredItems = filteredItems.filter((item) => item.title.toLowerCase().includes(filters['Top Brands'].toLowerCase()));
  if (filters['Top Rated'] || filters.Sort === 'Top Rated') filteredItems = filteredItems.slice(0, 4);
  if (filters.Sort === 'Price: Low to High') filteredItems = [...filteredItems].sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
  if (filters.Sort === 'Price: High to Low') filteredItems = [...filteredItems].sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
  const left = filteredItems.filter((_, index) => index % 2 === 0);
  const right = filteredItems.filter((_, index) => index % 2 !== 0);
  const renderColumn = (items, offset) => <View style={styles.column}>{items.map((item, index) => <AnimatedCard key={item.id} item={item} index={offset + index * 2} isSaved={watchlist.includes(item.id)} handlePress={handlePress} handleSavePress={(selected) => toggleWatchlist(selected.id)} />)}</View>;
  return <View style={styles.container}><View style={styles.row}>{renderColumn(left, 0)}{renderColumn(right, 1)}</View></View>;
};

const styles = StyleSheet.create({ container: { marginVertical: Spacing.sm }, row: { flexDirection: 'row', justifyContent: 'space-between' }, column: { width: '48.5%' } });
export default ServiceGridList;