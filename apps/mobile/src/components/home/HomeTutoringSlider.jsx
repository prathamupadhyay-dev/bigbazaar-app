import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';








const ORIGINAL_SUBJECTS = [
{ id: '1', name: 'Math', subCategoryName: 'Class 10 Mathematics (1-on-1)', icon: 'calculator-outline' },
{ id: '2', name: 'Science', subCategoryName: 'Physics & Chemistry Mastery', icon: 'flask-outline' },
{ id: '3', name: 'English', subCategoryName: 'Spoken English & Communication', icon: 'book-outline' },
{ id: '4', name: 'Coding', subCategoryName: 'Coding Fundamentals (Python/JS)', icon: 'code-slash-outline' },
{ id: '5', name: 'Music', subCategoryName: 'Spoken English & Communication', icon: 'musical-notes-outline' },
{ id: '6', name: 'Art', subCategoryName: 'Class 10 Mathematics (1-on-1)', icon: 'brush-outline' }];


/**
 * RTL IMPLEMENTATION NOTE:
 * We implemented right-to-left flow by reversing the array of placeholder items
 * (approach b per AG-6 instructions). This avoids the layout inconsistencies,
 * inversion flickers, and gesture collision issues that often arise with true
 * native RTL/inverted ScrollViews on Android and iOS in React Native.
 */
const RTL_ORDERED_SUBJECTS = [...ORIGINAL_SUBJECTS].reverse();

export const HomeTutoringSlider = () => {
  const navigation = useNavigation();

  const handleSubjectPress = (item) => {
    navigation.navigate('ServiceBooking', {
      categoryName: 'Home Tutor',
      subCategoryName: item.subCategoryName
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Home Tutoring</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Services')}>
          <Text style={styles.sectionBadge}>1-on-1 Sessions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        
        {RTL_ORDERED_SUBJECTS.map((item) =>
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => handleSubjectPress(item)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={item.name}>
          
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={26} color={Colors.primary} />
            </View>
            <Text style={styles.subjectName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.tutorSubtitle}>Tutors</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  sectionTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary
  },
  sectionBadge: {
    ...Typography.captionBold,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6
  },
  scrollContainer: {
    paddingRight: Spacing.xs,
    paddingVertical: 2
  },
  card: {
    width: 104,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    marginRight: Spacing.sm,
    elevation: 3,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16, // Squircle shape
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm
  },
  subjectName: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center'
  },
  tutorSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2
  }
});

export default HomeTutoringSlider;