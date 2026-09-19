import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const NOTIFICATIONS = [
{
  id: '1',
  title: 'You have new matches to your saved searches.',
  subtitle: 'Tap to see more.',
  date: 'Sep 7 06:09 PM',
  unread: true
},
{
  id: '2',
  title: 'Congratulations! You were the high bidder!',
  subtitle: "'SEGO Unisex Vintage Baseball Cap with Hair Extensions for Women Synthetic Hair Attached Hairpiece Olive Green Baseball Cap Wig Adjustable Hat Wigs for Women 6 Inch 10P22T Medium Brown Mix Dark Blonde'",
  date: 'Sep 7 04:46 PM',
  imageUrl: 'https://images.unsplash.com/photo-1512403754473-27835f7b9984?auto=format&fit=crop&w=100&q=80',
  unread: true
},
{
  id: '3',
  title: 'An item on your watchlist is about to end!',
  subtitle: "'SEGO Unisex Vintage Baseball Cap with Hair Extensions for Women Synthetic Hair Attached Hairpiece Olive Green Baseball Cap Wig Adjustable Hat Wigs for Women 6 Inch 10P22T Medium Brown Mix Dark Blonde'",
  date: 'Sep 7 04:44 PM',
  imageUrl: 'https://images.unsplash.com/photo-1512403754473-27835f7b9984?auto=format&fit=crop&w=100&q=80',
  unread: true
},
{
  id: '4',
  title: 'Congratulations! You were the high bidder!',
  subtitle: "'SEVENCOLORS Short Pixie Wigs for White Women Natural Looking Layered Brown Blonde Highlights Wig Synthetic Hair Wavy Womens Wigs'",
  date: 'Sep 7 02:41 PM',
  imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=100&q=80',
  unread: true
},
{
  id: '5',
  title: 'An item on your watchlist is about to end!',
  subtitle: "'SEVENCOLORS Short Pixie Wigs for White Women Natural Looking Layered Brown Blonde Highlights Wig Synthetic Hair Wavy Womens Wigs'",
  date: 'Sep 7 02:39 PM',
  imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=100&q=80',
  unread: true
}];


export default function NotificationsScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) =>
  <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.unreadIndicatorWrapper}>
        {item.unread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitleText} numberOfLines={4}>{item.subtitle}</Text>
          {item.imageUrl &&
        <Image source={{ uri: item.imageUrl }} style={styles.notificationImage} />
        }
        </View>
      </View>
    </TouchableOpacity>;


  return (
    <ScreenContainer noPadding>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.headerRightText}>Read all</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent} />
      
    </ScreenContainer>);

}

const styles = StyleSheet.create({
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
  iconBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary,
    fontSize: 18
  },
  headerRightText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '500'
  },
  listContent: {
    paddingBottom: Spacing.xl
  },
  notificationItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white
  },
  unreadIndicatorWrapper: {
    width: 20,
    alignItems: 'center',
    marginTop: 6
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary
  },
  contentWrapper: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  titleText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 15,
    flex: 1,
    marginRight: Spacing.sm
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12
  },
  subtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subtitleText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginRight: Spacing.md
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: Colors.background
  }
});