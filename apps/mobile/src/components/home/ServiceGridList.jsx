import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import ServiceItemCard, { ServiceItemData } from './ServiceItemCard';
import Spacing from '../../constants/spacing';

export const MOCK_SERVICES = [
{
  id: 'p1',
  title: 'Nike Air Jordan 1 Retro',
  imageUrl: 'https://loremflickr.com/400/400/sneakers',
  price: '₹180.00',
  timeEstimate: '3 days',
  category: 'Fashion',
  itemType: 'product'
},
{
  id: 's1',
  title: 'Expert Plumbing Repair & Leak Fix',
  imageUrl: 'https://loremflickr.com/400/400/plumber',
  price: '₹45.00',
  timeEstimate: '2h',
  category: 'Plumbing',
  itemType: 'service'
},
{
  id: 'p4',
  title: 'Apple Watch Series 9 GPS',
  imageUrl: 'https://loremflickr.com/400/400/watch',
  price: '₹399.00',
  timeEstimate: '1 day',
  category: 'Electronics',
  itemType: 'product'
},
{
  id: 's2',
  title: 'AC Servicing & Deep Clean',
  imageUrl: 'https://loremflickr.com/400/400/hvac',
  price: '₹60.00',
  timeEstimate: '1h 30m',
  category: 'AC Repair',
  itemType: 'service'
},
{
  id: 'p2',
  title: 'Organic Cotton T-Shirt',
  imageUrl: 'https://loremflickr.com/400/400/tshirt',
  price: '₹25.00',
  timeEstimate: '3 days',
  category: 'Fashion',
  itemType: 'product'
},
{
  id: 's4',
  title: 'Sofa & Carpet Dry Cleaning',
  imageUrl: 'https://loremflickr.com/400/400/cleaning',
  price: '₹35.00',
  timeEstimate: '1h',
  category: 'Home Cleaning',
  itemType: 'service'
},
{
  id: 'p5',
  title: 'Levi\'s 501 Original Fit Jeans',
  imageUrl: 'https://loremflickr.com/400/400/jeans',
  price: '₹59.50',
  timeEstimate: '2 days',
  category: 'Fashion',
  itemType: 'product'
},
{
  id: 's3',
  title: 'High School Math Tutoring',
  imageUrl: 'https://loremflickr.com/400/400/tutoring',
  price: '₹30.00 / hr',
  timeEstimate: 'Flexible',
  category: 'Tutoring',
  itemType: 'service'
},
{
  id: 'p3',
  title: 'Sony Noise Cancelling Headphones',
  imageUrl: 'https://loremflickr.com/400/400/headphones',
  price: '₹299.00',
  timeEstimate: '2 days',
  category: 'Electronics',
  itemType: 'product'
},
{
  id: 's5',
  title: 'Professional Home Painting',
  imageUrl: 'https://loremflickr.com/400/400/painting',
  price: '₹400.00',
  timeEstimate: '3 Days',
  category: 'Home Service',
  itemType: 'service'
},
{
  id: 'p6',
  title: 'Premium Leather Wallet',
  imageUrl: 'https://loremflickr.com/400/400/wallet',
  price: '₹45.00',
  timeEstimate: 'Tomorrow',
  category: 'Accessories',
  itemType: 'product'
},
{
  id: 's6',
  title: 'Deep Tissue Massage Therapy',
  imageUrl: 'https://loremflickr.com/400/400/massage',
  price: '₹75.00',
  timeEstimate: '60m',
  category: 'Wellness',
  itemType: 'service'
},
{
  id: 'p7',
  title: 'MacBook Pro M3 14-inch',
  imageUrl: 'https://loremflickr.com/400/400/macbook',
  price: '₹1599.00',
  timeEstimate: '1 week',
  category: 'Electronics',
  itemType: 'product'
},
{
  id: 'p8',
  title: 'Designer Aviator Sunglasses',
  imageUrl: 'https://loremflickr.com/400/400/sunglasses',
  price: '₹120.00',
  timeEstimate: '3 days',
  category: 'Accessories',
  itemType: 'product'
}];


import { useApp } from '../../context/AppContext';
import { Animated } from 'react-native';

const AnimatedCard = ({ item, index, handlePress, handleBookPress, handleSavePress, isSaved }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      delay: index * 100, // Stagger effect
      useNativeDriver: true
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true
    })]
    ).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <ServiceItemCard
        item={item}
        isSaved={isSaved}
        onPress={handlePress}
        onBookPress={handleBookPress}
        onSavePress={handleSavePress} />
      
    </Animated.View>);

};





export const ServiceGridList = ({ typeFilter = 'all', filters = {} }) => {
  const navigation = useNavigation();
  const { watchlist, toggleWatchlist } = useApp();

  const handlePress = (item) => {
    navigation.navigate('ServiceDetails', { item: item });
  };

  const handleBookPress = (item) => {
    navigation.navigate('ServiceDetails', { item: item });
  };

  const handleSavePress = (item) => {
    toggleWatchlist(item.id);
  };

  let filteredServices = MOCK_SERVICES.filter((item) => {
    if (typeFilter === 'all') return true;
    return item.itemType === typeFilter;
  });
  if (filters.Categories && filters.Categories !== 'All') {
    filteredServices = filteredServices.filter((item) => item.category === filters.Categories);
  }
  if (filters.Gender && filters.Gender !== 'All') {
    const genderKeywords = { Men: ['Nike', 'Levi', 'Sony', 'MacBook'], Women: ['Apple', 'Cotton', 'Sunglasses'], Kids: ['Jordan', 'Watch'] };
    const keywords = genderKeywords[filters.Gender] || [];
    filteredServices = filteredServices.filter((item) => keywords.some((keyword) => item.title.includes(keyword)));
  }
  if (filters['Top Brands'] && filters['Top Brands'] !== 'All') {
    filteredServices = filteredServices.filter((item) => item.title.toLowerCase().includes(filters['Top Brands'].toLowerCase()));
  }
  if (filters['Top Rated'] || filters.Sort === 'Top Rated') {
    filteredServices = filteredServices.filter((_, index) => index < 4);
  }
  if (filters.Sort === 'Price: Low to High') {
    filteredServices = [...filteredServices].sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
  } else if (filters.Sort === 'Price: High to Low') {
    filteredServices = [...filteredServices].sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Left Column */}
        <View style={styles.column}>
          {filteredServices.filter((_, i) => i % 2 === 0).map((item, colIndex) =>
          <AnimatedCard
            key={item.id}
            item={item}
            index={colIndex * 2} // Absolute index for staggering
            isSaved={watchlist.includes(item.id)}
            handlePress={handlePress}
            handleBookPress={handleBookPress}
            handleSavePress={handleSavePress} />

          )}
        </View>
        
        {/* Right Column */}
        <View style={styles.column}>
          {filteredServices.filter((_, i) => i % 2 !== 0).map((item, colIndex) =>
          <AnimatedCard
            key={item.id}
            item={item}
            index={colIndex * 2 + 1}
            isSaved={watchlist.includes(item.id)}
            handlePress={handlePress}
            handleBookPress={handleBookPress}
            handleSavePress={handleSavePress} />

          )}
        </View>
      </View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    width: '48.5%', // Slightly less than 50 to leave gap
    flexDirection: 'column'
  }
});

export default ServiceGridList;
