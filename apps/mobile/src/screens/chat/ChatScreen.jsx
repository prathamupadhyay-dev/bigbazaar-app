import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';


export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const seller = route.params?.sellerName || 'Seller';
  const listing = route.params?.listingTitle || 'This listing';
  const [messages, setMessages] = useState([
    { id: '1', text: `Hi! Is ${listing} still available?`, mine: true },
    { id: '2', text: 'Yes, it is available. How can I help?', mine: false }
  ]);
  const [text, setText] = useState('');
  const [showSafetyTip, setShowSafetyTip] = useState(true);
  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), text: text.trim(), mine: true }]);
    setText('');
  };

  return (
    <ScreenContainer noPadding style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.seller}>{seller}</Text>
          <Text style={styles.context} numberOfLines={1}>{listing}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Chat options', 'Choose an action', [{ text: 'Report conversation', onPress: () => Alert.alert('Reported', 'Our team will review this conversation.') }, { text: 'Block seller', style: 'destructive', onPress: () => navigation.goBack() }, { text: 'Cancel', style: 'cancel' }])} accessibilityLabel="Chat options">
          <Ionicons name="ellipsis-vertical" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      {showSafetyTip && <View style={styles.safetyBanner}>
        <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
        <Text style={styles.safetyText}>Stay safe: meet publicly and never share OTPs or payment passwords.</Text>
        <TouchableOpacity onPress={() => setShowSafetyTip(false)} accessibilityLabel="Dismiss safety tip">
          <Ionicons name="close" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>}
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messages}
        renderItem={({ item }) => <View style={[styles.bubble, item.mine ? styles.mine : styles.theirs]}><Text style={[styles.message, item.mine && styles.mineText]}>{item.text}</Text></View>}
      />
      <View style={styles.inputBar}>
        <TextInput value={text} onChangeText={setText} placeholder="Write a message" style={styles.input} onSubmitEditing={send} />
        <TouchableOpacity onPress={send} style={styles.send} accessibilityLabel="Send message">
          <Ionicons name="send" size={19} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#F8FAFC' }, header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.white, borderBottomWidth: 1, borderColor: Colors.border }, headerText: { flex: 1, marginLeft: Spacing.md }, seller: { ...Typography.bodyBold, color: Colors.textPrimary }, context: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 }, safetyBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: '#EFF6FF', borderBottomWidth: 1, borderColor: '#BFDBFE', gap: 8 }, safetyText: { ...Typography.caption, color: Colors.primary, flex: 1, lineHeight: 17 }, messages: { padding: Spacing.md, gap: 8 }, bubble: { maxWidth: '80%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14 }, mine: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 3 }, theirs: { alignSelf: 'flex-start', backgroundColor: Colors.white, borderBottomLeftRadius: 3 }, message: { ...Typography.body, color: Colors.textPrimary }, mineText: { color: Colors.white }, inputBar: { flexDirection: 'row', padding: Spacing.md, backgroundColor: Colors.white, borderTopWidth: 1, borderColor: Colors.border }, input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 22, paddingHorizontal: 15, ...Typography.body, color: Colors.textPrimary }, send: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 8 } });
