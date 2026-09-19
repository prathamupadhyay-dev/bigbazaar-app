import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert } from
'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp, TicketIssueCategory, SupportTicket } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';

const ISSUE_CATEGORIES = [
'Service Delay',
'Tutor Conduct',
'Payment Failure',
'App Issue'];


export const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const { supportTickets, bookings, submitSupportTicket, addTicketMessage } = useApp();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [activeChatTicket, setActiveChatTicket] = useState(null);
  const [chatInput, setChatInput] = useState('');

  // Form State
  const [issueCategory, setIssueCategory] = useState('Service Delay');
  const [selectedBookingId, setSelectedBookingId] = useState(
    bookings.length > 0 ? bookings[0].bookingId : 'BB-98421'
  );
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);

  const handleCreateTicket = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a Subject and Complaint Description.');
      return;
    }

    submitSupportTicket({
      issueCategory,
      bookingId: selectedBookingId,
      subject,
      description,
      hasAttachment
    });

    Alert.alert('Ticket Submitted', 'Our customer support dispute team will respond within 15 minutes.');
    setCreateModalVisible(false);
    setSubject('');
    setDescription('');
    setHasAttachment(false);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !activeChatTicket) return;
    addTicketMessage(activeChatTicket.id, chatInput);
    setChatInput('');
  };

  return (
    <ScreenContainer noPadding style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back">
          
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Dispute Support</Text>
        <TouchableOpacity
          style={styles.newTicketBtn}
          onPress={() => setCreateModalVisible(true)}>
          
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Support Hotline Banner */}
        <View style={styles.hotlineBanner}>
          <View style={styles.hotlineIconBox}>
            <Ionicons name="headset" size={24} color="#0284C7" />
          </View>
          <View style={styles.hotlineTextContainer}>
            <Text style={styles.hotlineTitle}>Big Bazaar 24x7 Customer Helpdesk</Text>
            <Text style={styles.hotlineSubtitle}>Toll-Free: 1800-200-1234 • Priority Dispute Resolution</Text>
          </View>
        </View>

        {/* Quick Dispute Raise Card */}
        <TouchableOpacity
          style={styles.raiseDisputeCard}
          onPress={() => setCreateModalVisible(true)}>
          
          <View style={styles.raiseLeft}>
            <Ionicons name="alert-circle-outline" size={24} color="#0A84FF" />
            <View style={{ marginLeft: Spacing.sm }}>
              <Text style={styles.raiseTitle}>Have a complaint with a service?</Text>
              <Text style={styles.raiseSub}>Raise a support ticket for refunds, delays, or conduct</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        {/* Tickets List */}
        <Text style={styles.sectionHeader}>Your Dispute Tickets</Text>

        {supportTickets.length === 0 ?
        <View style={styles.emptyBox}>
            <Ionicons name="chatbubbles-outline" size={44} color={Colors.disabled} />
            <Text style={styles.emptyTitle}>No Active Dispute Tickets</Text>
            <Text style={styles.emptySubtitle}>You currently have no open complaints or support queries.</Text>
          </View> :

        supportTickets.map((t) =>
        <View key={t.id} style={styles.ticketCard}>
              <View style={styles.ticketTop}>
                <View style={styles.ticketIdBox}>
                  <Text style={styles.ticketIdText}>Ticket #{t.ticketId}</Text>
                  <Text style={styles.ticketCategoryText}>
                    {t.issueCategory} • Booking #{t.bookingId}
                  </Text>
                </View>

                <View
              style={[
              styles.statusBadge,
              t.status === 'Open' && styles.openBadge,
              t.status === 'Under Review' && styles.reviewBadge,
              t.status === 'Resolved' && styles.resolvedBadge]
              }>
              
                  <Text
                style={[
                styles.statusBadgeText,
                t.status === 'Open' && { color: '#0284C7' },
                t.status === 'Under Review' && { color: '#D97706' },
                t.status === 'Resolved' && { color: '#059669' }]
                }>
                
                    {t.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.ticketSubject}>{t.subject}</Text>
              <Text style={styles.ticketDesc}>{t.description}</Text>

              {t.hasAttachment &&
          <View style={styles.attachmentTag}>
                  <Ionicons name="document-attach-outline" size={12} color={Colors.primary} />
                  <Text style={styles.attachmentTagText}>Attachment Uploaded</Text>
                </View>
          }

              <View style={styles.ticketFooter}>
                <Text style={styles.ticketTime}>{t.createdAt}</Text>
                <TouchableOpacity
              style={styles.chatActionBtn}
              onPress={() => setActiveChatTicket(t)}>
              
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={Colors.primary} />
                  <Text style={styles.chatActionText}>
                    Chat with Support ({t.messages.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
        )
        }
      </ScrollView>

      {/* New Ticket Modal */}
      <Modal visible={createModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Support Ticket</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              {/* Category Dropdown / Selectors */}
              <Text style={styles.fieldLabel}>Issue Category *</Text>
              <View style={styles.categoryGrid}>
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = issueCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.catChip, isSelected && styles.selectedCatChip]}
                      onPress={() => setIssueCategory(cat)}>
                      
                      <Text style={[styles.catChipText, isSelected && styles.selectedCatChipText]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>);

                })}
              </View>

              {/* Booking ID Selector */}
              <Text style={styles.fieldLabel}>Related Booking ID</Text>
              <View style={styles.bookingSelectRow}>
                {bookings.slice(0, 3).map((b) =>
                <TouchableOpacity
                  key={b.id}
                  style={[styles.bookingChip, selectedBookingId === b.bookingId && styles.selectedBookingChip]}
                  onPress={() => setSelectedBookingId(b.bookingId)}>
                  
                    <Text
                    style={[
                    styles.bookingChipText,
                    selectedBookingId === b.bookingId && styles.selectedBookingChipText]
                    }>
                    
                      #{b.bookingId} ({b.serviceName})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Subject */}
              <Text style={styles.fieldLabel}>Ticket Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="Brief summary of your complaint"
                placeholderTextColor={Colors.textSecondary}
                value={subject}
                onChangeText={setSubject} />
              

              {/* Complaint Description */}
              <Text style={styles.fieldLabel}>Complaint Description *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Explain what happened in detail so we can resolve it quickly..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription} />
              

              {/* Screenshot / Attachment */}
              <TouchableOpacity
                style={styles.attachmentUploadBtn}
                onPress={() => setHasAttachment(!hasAttachment)}>
                
                <Ionicons
                  name={hasAttachment ? 'checkmark-circle' : 'attach-outline'}
                  size={20}
                  color={hasAttachment ? '#10B981' : Colors.primary} />
                
                <Text style={[styles.attachmentUploadText, hasAttachment && { color: '#10B981' }]}>
                  {hasAttachment ? 'Bill / Photo Attached (tap to remove)' : 'Attach Screenshot / Bill (Optional)'}
                </Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTicket}>
                <Text style={styles.submitBtnText}>Submit Ticket</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Live Support Chat Simulator Modal */}
      {activeChatTicket &&
      <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.chatModalContainer}>
              <View style={styles.chatModalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Support Chat #{activeChatTicket.ticketId}</Text>
                  <Text style={styles.chatSubtitle}>Executive: Ananya (Dispute Specialist)</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveChatTicket(null)}>
                  <Ionicons name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Message History */}
              <ScrollView style={styles.chatMessagesArea}>
                {activeChatTicket.messages.map((msg, i) =>
              <View
                key={i}
                style={[
                styles.chatBubble,
                msg.sender === 'user' ? styles.userBubble : styles.supportBubble]
                }>
                
                    <Text
                  style={[
                  styles.chatText,
                  msg.sender === 'user' ? styles.userChatText : styles.supportChatText]
                  }>
                  
                      {msg.text}
                    </Text>
                    <Text style={styles.chatTime}>{msg.time}</Text>
                  </View>
              )}
              </ScrollView>

              {/* Input Bar */}
              <View style={styles.chatInputRow}>
                <TextInput
                style={styles.chatInput}
                placeholder="Type message to dispute executive..."
                placeholderTextColor={Colors.textSecondary}
                value={chatInput}
                onChangeText={setChatInput} />
              
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendChatMessage}>
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      }
    </ScreenContainer>);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    elevation: 0
  },
  backBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    color: Colors.textPrimary
  },
  newTicketBtn: {
    padding: Spacing.xs
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl
  },
  hotlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F1FF',
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: Spacing.md
  },
  hotlineIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm
  },
  hotlineTextContainer: {
    flex: 1
  },
  hotlineTitle: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: '#0369A1'
  },
  hotlineSubtitle: {
    fontSize: 11,
    color: '#0284C7',
    marginTop: 2
  },
  raiseDisputeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0A84FF',
    marginBottom: Spacing.md
  },
  raiseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  raiseTitle: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textPrimary
  },
  raiseSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2
  },
  sectionHeader: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs
  },
  ticketIdBox: {
    flex: 1
  },
  ticketIdText: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
    fontSize: 14
  },
  ticketCategoryText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  openBadge: { backgroundColor: '#E5F1FF' },
  reviewBadge: { backgroundColor: '#FEF3C7' },
  resolvedBadge: { backgroundColor: '#D1FAE5' },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  ticketSubject: {
    ...Typography.bodyBold,
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: Spacing.xs
  },
  ticketDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  },
  attachmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs
  },
  attachmentTagText: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: 3,
    fontWeight: '600'
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  ticketTime: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary
  },
  chatActionBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chatActionText: {
    ...Typography.captionBold,
    color: Colors.primary,
    marginLeft: 4
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl
  },
  emptyTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary,
    marginTop: Spacing.sm
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.md,
    maxHeight: '85%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  modalTitle: {
    ...Typography.heading3,
    color: Colors.textPrimary
  },
  modalScroll: {
    marginBottom: Spacing.md
  },
  fieldLabel: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: 4
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  catChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border
  },
  selectedCatChip: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary
  },
  catChipText: {
    ...Typography.caption,
    color: Colors.textSecondary
  },
  selectedCatChipText: {
    color: Colors.primary,
    fontWeight: '700'
  },
  bookingSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  bookingChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border
  },
  selectedBookingChip: {
    backgroundColor: '#E5F1FF',
    borderColor: '#0A84FF'
  },
  bookingChipText: {
    fontSize: 11,
    color: Colors.textSecondary
  },
  selectedBookingChipText: {
    color: '#0A84FF',
    fontWeight: '700'
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    height: 44,
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    ...Typography.body,
    fontSize: 13,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 80
  },
  attachmentUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    marginTop: Spacing.sm
  },
  attachmentUploadText: {
    ...Typography.captionBold,
    color: Colors.primary,
    marginLeft: Spacing.xs
  },
  submitBtn: {
    backgroundColor: '#0A84FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl
  },
  submitBtnText: {
    ...Typography.bodyBold,
    color: '#FFFFFF'
  },
  chatModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: Spacing.md
  },
  chatModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  chatSubtitle: {
    ...Typography.caption,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2
  },
  chatMessagesArea: {
    flex: 1,
    paddingVertical: Spacing.sm
  },
  chatBubble: {
    maxWidth: '80%',
    padding: Spacing.sm,
    borderRadius: 14,
    marginBottom: Spacing.sm
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0A84FF',
    borderBottomRightRadius: 2
  },
  supportBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 2
  },
  chatText: {
    ...Typography.body,
    fontSize: 13
  },
  userChatText: {
    color: '#FFFFFF'
  },
  supportChatText: {
    color: Colors.textPrimary
  },
  chatTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
    opacity: 0.7,
    color: 'inherit'
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 42,
    fontSize: 13
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs
  }
});

export default HelpSupportScreen;