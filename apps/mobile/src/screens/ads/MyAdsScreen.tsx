import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp, AdStatus } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const tabs: Array<'All' | AdStatus> = ['All', 'Draft', 'Active', 'Pending', 'Sold', 'Expired'];

export default function MyAdsScreen() {
  const navigation = useNavigation<any>();
  const { ads, updateAdStatus } = useApp();
  const [tab, setTab] = useState<'All' | AdStatus>('All');
  const visibleAds = tab === 'All' ? ads : ads.filter((ad) => ad.status === tab);

  return <ScreenContainer noPadding style={styles.screen}>
    <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity><Text style={styles.title}>My Ads</Text><TouchableOpacity onPress={() => navigation.navigate('PostAd')}><Ionicons name="add-circle-outline" size={26} color={Colors.primary} /></TouchableOpacity></View>
    <FlatList horizontal showsHorizontalScrollIndicator={false} data={tabs} keyExtractor={(item) => item} contentContainerStyle={styles.tabs} renderItem={({ item }) => <TouchableOpacity onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></TouchableOpacity>} />
    <FlatList data={visibleAds} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} ListEmptyComponent={<View style={styles.empty}><Ionicons name="pricetag-outline" size={56} color={Colors.disabled}/><Text style={styles.emptyTitle}>No {tab.toLowerCase()} ads</Text><TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('PostAd')}><Text style={styles.primaryText}>Post an Ad</Text></TouchableOpacity></View>} renderItem={({ item }) => <View style={styles.card}>
      {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : <View style={styles.image}><Ionicons name="image-outline" size={28} color={Colors.disabled}/></View>}
      <View style={styles.info}><Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text><Text style={styles.meta}>{item.category} · ${item.price}</Text><Text style={styles.status}>{item.status}</Text></View>
      <View><TouchableOpacity style={styles.action} onPress={() => updateAdStatus(item.id, item.status === 'Sold' ? 'Active' : 'Sold')}><Text style={styles.actionText}>{item.status === 'Sold' ? 'Relist' : 'Mark Sold'}</Text></TouchableOpacity><TouchableOpacity style={styles.link} onPress={() => updateAdStatus(item.id, item.status === 'Active' ? 'Draft' : 'Active')}><Text style={styles.linkText}>{item.status === 'Active' ? 'Pause' : 'Publish'}</Text></TouchableOpacity></View>
    </View>} />
    <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PostAd')}><Ionicons name="add" size={24} color={Colors.white}/><Text style={styles.fabText}>Post Ad</Text></TouchableOpacity>
  </ScreenContainer>;
}
const styles = StyleSheet.create({ screen:{flex:1,backgroundColor:'#F8FAFC'},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:Spacing.md,backgroundColor:Colors.white},title:{...Typography.heading2,color:Colors.textPrimary},tabs:{padding:Spacing.md,gap:8,backgroundColor:Colors.white},tab:{paddingHorizontal:14,paddingVertical:8,borderRadius:18,backgroundColor:'#F1F5F9'},tabActive:{backgroundColor:Colors.primary},tabText:{...Typography.captionBold,color:Colors.textSecondary},tabTextActive:{color:Colors.white},list:{padding:Spacing.md,paddingBottom:110},card:{flexDirection:'row',alignItems:'center',padding:Spacing.sm,backgroundColor:Colors.white,borderRadius:12,marginBottom:Spacing.sm,borderWidth:1,borderColor:Colors.border},image:{width:62,height:62,borderRadius:9,backgroundColor:'#F1F5F9',alignItems:'center',justifyContent:'center',marginRight:Spacing.sm},info:{flex:1},itemTitle:{...Typography.bodyBold,color:Colors.textPrimary},meta:{...Typography.caption,color:Colors.textSecondary,marginTop:3},status:{...Typography.captionBold,color:Colors.primary,marginTop:5},action:{padding:7,borderRadius:7,backgroundColor:Colors.primaryLight},actionText:{...Typography.captionBold,color:Colors.primary},link:{alignItems:'center',paddingTop:7},linkText:{...Typography.captionBold,color:Colors.textSecondary},empty:{alignItems:'center',marginTop:90},emptyTitle:{...Typography.heading2,color:Colors.textSecondary,marginVertical:Spacing.md},primary:{backgroundColor:Colors.primary,paddingHorizontal:20,paddingVertical:12,borderRadius:10},primaryText:{...Typography.button,color:Colors.white},fab:{position:'absolute',right:20,bottom:28,flexDirection:'row',alignItems:'center',backgroundColor:Colors.primary,paddingHorizontal:16,paddingVertical:13,borderRadius:24,elevation:4},fabText:{...Typography.button,color:Colors.white,marginLeft:6} });
