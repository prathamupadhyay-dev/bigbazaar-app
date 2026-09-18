import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

interface Props {
  scrollY: Animated.Value;
}

export const FilterChipsBar: React.FC<Props> = ({ scrollY }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>Gender</Text>
          <Ionicons name="chevron-down" size={14} color="#1E293B" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>Sort</Text>
          <Ionicons name="swap-vertical" size={14} color="#1E293B" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip}>
          <Text style={styles.chipText}>Categories</Text>
          <Ionicons name="chevron-down" size={14} color="#1E293B" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip}>
          <Ionicons name="pricetag-outline" size={14} color="#1E293B" style={styles.leftIcon} />
          <Text style={styles.chipText}>Top Brands</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip}>
          <Ionicons name="star-outline" size={14} color="#1E293B" style={styles.leftIcon} />
          <Text style={styles.chipText}>Top Rated</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip}>
          <Ionicons name="trending-up-outline" size={14} color="#1E293B" style={styles.leftIcon} />
          <Text style={styles.chipText}>Rising Star</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    zIndex: 9, // Below header
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  chipText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: '#1E293B',
  },
  icon: {
    marginLeft: 6,
  },
  leftIcon: {
    marginRight: 6,
  }
});

export default FilterChipsBar;
