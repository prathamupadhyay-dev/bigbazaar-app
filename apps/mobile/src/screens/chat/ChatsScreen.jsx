import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const MOCK_CHATS = [
  { id: 'chat-1', sellerName: 'Rahul Mehta', listingTitle: 'iPhone 14, 128 GB', preview: 'Yes, it is still available.', time: '10:42 AM', unread: 2 },
  { id: 'chat-2', sellerName: 'Priya Furnishings', listingTitle: 'Solid Wood Study Table', preview: 'I can share more photos.', time: 'Yesterday', unread: 0 },
  { id: 'chat-3', sellerName: 'Alex Smith', listingTitle: 'Tap Repair & Washbasin Fix', preview: 'Your service slot is confirmed.', time: 'Mon', unread: 0 }
];

export default function ChatsScreen() {
  const navigation = useNavigation();

  return (
    <ScreenContainer noPadding style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chats</Text>
          <Text style={styles.subtitle}>Your marketplace conversations</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="chatbubbles-outline" size={22} color={Colors.primary} />
        </View>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Chat', { sellerName: item.sellerName, listingTitle: item.listingTitle })}
            accessibilityLabel={`Open chat with ${item.sellerName}`}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.sellerName.charAt(0)}</Text>
            </View>
            <View style={styles.rowCopy}>
              <View style={styles.rowTop}>
                <Text style={styles.seller} numberOfLines={1}>{item.sellerName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.listing} numberOfLines={1}>{item.listingTitle}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.preview}</Text>
            </View>
            {item.unread > 0 && <View style={styles.unread}><Text style={styles.unreadText}>{item.unread}</Text></View>}
            <Ionicons name="chevron-forward" size={18} color={Colors.disabled} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="chatbubble-ellipses-outline" size={54} color={Colors.disabled} /><Text style={styles.emptyTitle}>No chats yet</Text><Text style={styles.emptyText}>Start a conversation from any listing.</Text></View>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.border },
  title: { ...Typography.heading1, fontSize: 24, color: Colors.textPrimary },
  subtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 3 },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryLight },
  list: { padding: Spacing.md, paddingBottom: 130 },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm, marginBottom: Spacing.sm },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5F1FF', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  avatarText: { ...Typography.heading2, color: Colors.primary },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seller: { ...Typography.bodyBold, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  time: { ...Typography.caption, color: Colors.textSecondary },
  listing: { ...Typography.captionBold, color: Colors.primary, marginTop: 2 },
  preview: { ...Typography.caption, color: Colors.textSecondary, marginTop: 3 },
  unread: { minWidth: 20, height: 20, paddingHorizontal: 5, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
  unreadText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  empty: { alignItems: 'center', padding: Spacing.xl, marginTop: 60 },
  emptyTitle: { ...Typography.heading2, color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.textSecondary, marginTop: 5 }
});
