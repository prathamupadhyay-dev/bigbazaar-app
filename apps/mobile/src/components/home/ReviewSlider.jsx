import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const REVIEWS = [
{
  id: '1',
  name: 'Sarah M.',
  rating: 5,
  text: '"The plumbing service was incredibly fast and professional. Highly recommended!"',
  avatar: 'SM'
},
{
  id: '2',
  name: 'Rahul K.',
  rating: 5,
  text: '"My AC works perfectly now. The technician was polite and on time."',
  avatar: 'RK'
},
{
  id: '3',
  name: 'Emily J.',
  rating: 4,
  text: '"Great home tutoring service for my son. He loves the math sessions."',
  avatar: 'EJ'
}];


export const ReviewSlider = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>What Our Customers Say</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {REVIEWS.map((review) =>
        <View key={review.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{review.avatar}</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.name}>{review.name}</Text>
                <View style={styles.stars}>
                  {[...Array(review.rating)].map((_, i) =>
                <Ionicons key={i} name="star" size={14} color={Colors.warning} />
                )}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        )}
      </ScrollView>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg
  },
  sectionTitle: {
    ...Typography.heading2,
    marginBottom: Spacing.sm
  },
  scrollContent: {
    paddingVertical: Spacing.sm
  },
  card: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.md,
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm
  },
  avatarText: {
    ...Typography.bodyBold,
    color: Colors.primary
  },
  headerText: {
    flex: 1
  },
  name: {
    ...Typography.bodyBold,
    marginBottom: 2
  },
  stars: {
    flexDirection: 'row'
  },
  reviewText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic'
  }
});

export default ReviewSlider;