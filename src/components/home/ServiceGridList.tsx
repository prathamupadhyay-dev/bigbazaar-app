import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import ServiceItemCard, { ServiceItemData } from './ServiceItemCard';
import Spacing from '../../constants/spacing';

export const MOCK_SERVICES: ServiceItemData[] = [
  {
    id: 's1',
    title: 'Expert Plumbing Repair & Leak Fix',
    imageUrl: 'https://loremflickr.com/400/400/plumber',
    price: '$45.00',
    timeEstimate: '2h',
    category: 'Plumbing',
    itemType: 'service'
  },
  {
    id: 's2',
    title: 'AC Servicing & Deep Clean',
    imageUrl: 'https://loremflickr.com/400/400/hvac',
    price: '$60.00',
    timeEstimate: '1h 30m',
    category: 'AC Repair',
    itemType: 'service'
  },
  {
    id: 'p1',
    title: 'Sony Noise Cancelling Headphones',
    imageUrl: 'https://loremflickr.com/400/400/headphones',
    price: '$299.00',
    timeEstimate: '2 days',
    category: 'Electronics',
    itemType: 'product'
  },
  {
    id: 'p2',
    title: 'Organic Cotton T-Shirt',
    imageUrl: 'https://loremflickr.com/400/400/tshirt',
    price: '$25.00',
    timeEstimate: '3 days',
    category: 'Fashion',
    itemType: 'product'
  },
  {
    id: 's3',
    title: 'High School Math Tutoring',
    imageUrl: 'https://loremflickr.com/400/400/tutoring',
    price: '$30.00 / hr',
    timeEstimate: 'Flexible',
    category: 'Tutoring',
    itemType: 'service'
  },
  {
    id: 'p3',
    title: 'Stainless Steel Water Bottle',
    imageUrl: 'https://loremflickr.com/400/400/bottle',
    price: '$15.00',
    timeEstimate: 'Tomorrow',
    category: 'Accessories',
    itemType: 'product'
  },
];

import { useApp } from '../../context/AppContext';
import { Animated } from 'react-native';

const AnimatedCard = ({ item, index, handlePress, handleBookPress, handleSavePress, isSaved }: any) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 100, // Stagger effect
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <ServiceItemCard 
        item={item} 
        isSaved={isSaved}
        onPress={handlePress}
        onBookPress={handleBookPress}
        onSavePress={handleSavePress}
      />
    </Animated.View>
  );
};

export interface ServiceGridListProps {
  typeFilter?: 'all' | 'product' | 'service';
}

export const ServiceGridList: React.FC<ServiceGridListProps> = ({ typeFilter = 'all' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { watchlist, toggleWatchlist } = useApp();

  const handlePress = (item: ServiceItemData) => {
    navigation.navigate('ServiceDetails', { item: item as any });
  };

  const handleBookPress = (item: ServiceItemData) => {
    navigation.navigate('ServiceDetails', { item: item as any });
  };

  const handleSavePress = (item: ServiceItemData) => {
    toggleWatchlist(item.id);
  };

  const filteredServices = MOCK_SERVICES.filter(item => {
    if (typeFilter === 'all') return true;
    return item.itemType === typeFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Left Column */}
        <View style={styles.column}>
          {filteredServices.filter((_, i) => i % 2 === 0).map((item, colIndex) => (
            <AnimatedCard 
              key={item.id} 
              item={item}
              index={colIndex * 2} // Absolute index for staggering
              isSaved={watchlist.includes(item.id)}
              handlePress={handlePress}
              handleBookPress={handleBookPress}
              handleSavePress={handleSavePress}
            />
          ))}
        </View>
        
        {/* Right Column */}
        <View style={styles.column}>
          {filteredServices.filter((_, i) => i % 2 !== 0).map((item, colIndex) => (
            <AnimatedCard 
              key={item.id} 
              item={item}
              index={colIndex * 2 + 1}
              isSaved={watchlist.includes(item.id)}
              handlePress={handlePress}
              handleBookPress={handleBookPress}
              handleSavePress={handleSavePress}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48.5%', // Slightly less than 50 to leave gap
    flexDirection: 'column',
  }
});

export default ServiceGridList;
