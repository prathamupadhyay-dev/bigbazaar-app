import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Animated, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import HomeHeader from '../../components/home/HomeHeader';
import AdBanner from '../../components/home/AdBanner';
import ServiceGridList from '../../components/home/ServiceGridList';
import FilterModal from '../search/FilterModal';
import SortModal from '../search/SortModal';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

export default function HomeScreen() {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // Modals state
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  
  const [typeFilter, setTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <ScreenContainer noPadding style={styles.container}>
      <HomeHeader 
        scrollY={scrollY} 
        onFilterPress={() => setFilterVisible(true)} 
        onTypePress={() => setTypeModalVisible(true)}
        typeFilter={typeFilter}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // we'll use it for height animation which requires false, or transform which can be true. Let's stick to true for transforms and opacity
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.body}>
          <AdBanner />
          <ServiceGridList typeFilter={typeFilter} />
        </View>
      </Animated.ScrollView>

      {/* Filter Coachmark Tooltip */}
      {showTooltip && (
        <View style={styles.tooltipContainer} pointerEvents="box-none">
          {/* The little up-arrow triangle */}
          <View style={styles.tooltipArrow} />
          {/* Tooltip Body */}
          <View style={styles.tooltipBox}>
            <Text style={styles.tooltipText}>
              Filter to only see the items sold at your preferred location
            </Text>
            <TouchableOpacity onPress={() => setShowTooltip(false)}>
              <Text style={styles.tooltipBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modals */}
      <FilterModal 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        onOpenSort={() => {
          setFilterVisible(false);
          // Slight delay to let Filter modal close
          setTimeout(() => setSortVisible(true), 150);
        }}
      />
      
      <SortModal 
        visible={sortVisible} 
        onClose={() => setSortVisible(false)} 
      />

      {/* Type Filter Modal (Drop up) */}
      <Modal
        visible={typeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTypeModalVisible(false)}
      >
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTypeModalVisible(false)} />
          <View style={styles.typeSheet}>
            <View style={styles.typeSheetHandle} />
            <Text style={styles.typeSheetTitle}>Filter by Type</Text>
            
            <TouchableOpacity style={styles.typeOption} onPress={() => { setTypeFilter('all'); setTypeModalVisible(false); }}>
              <Text style={[styles.typeOptionText, typeFilter === 'all' && styles.typeOptionActive]}>All Items</Text>
              {typeFilter === 'all' && <Ionicons name="checkmark" size={20} color="#0F172A" />}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.typeOption} onPress={() => { setTypeFilter('product'); setTypeModalVisible(false); }}>
              <Text style={[styles.typeOptionText, typeFilter === 'product' && { color: '#0A84FF' }]}>Products Only</Text>
              {typeFilter === 'product' && <Ionicons name="checkmark" size={20} color="#0A84FF" />}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.typeOption} onPress={() => { setTypeFilter('service'); setTypeModalVisible(false); }}>
              <Text style={[styles.typeOptionText, typeFilter === 'service' && { color: '#EAB308' }]}>Services Only</Text>
              {typeFilter === 'service' && <Ionicons name="checkmark" size={20} color="#EAB308" />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for the floating tab bar
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 55, 
    right: 35, 
    alignItems: 'flex-end',
    zIndex: 999,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2C3E50',
    marginRight: 20, 
  },
  tooltipBox: {
    backgroundColor: '#2C3E50', 
    borderRadius: 8,
    padding: Spacing.md,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tooltipText: {
    ...Typography.body,
    color: Colors.white,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  tooltipBtnText: {
    ...Typography.bodyBold,
    color: Colors.white,
    textAlign: 'right',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    elevation: 10,
  },
  typeSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  typeSheetTitle: {
    ...Typography.heading2,
    color: '#0F172A',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  typeOptionText: {
    ...Typography.body,
    fontSize: 16,
    color: '#64748B',
  },
  typeOptionActive: {
    color: '#0F172A',
    fontWeight: '700',
  }
});
