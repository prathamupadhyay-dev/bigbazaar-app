import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import Radii from '../../constants/radii';

const TOTAL_STEPS = 7;
const CATEGORIES = ['Electronics', 'Fashion', 'Furniture', 'Sports'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

export default function PostAdScreen() {
  const navigation = useNavigation();
  const { addAd, isAuthenticated } = useApp();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('Electronics');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Mumbai, MH');

  const saveDraft = () => {
    Alert.alert('Draft saved', 'You can finish this listing later from My Ads.');
  };

  const submit = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign in to post', 'Create an account to submit your listing.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log In', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    if (!title.trim() || !price.trim()) {
      Alert.alert('Add listing details', 'A title and price are required before submitting.');
      return;
    }
    addAd({
      title: title.trim(),
      description: description.trim(),
      price: Number(price.replace(/,/g, '')) || 0,
      category,
      condition,
      location,
      status: 'Pending',
      imageUrl: 'https://picsum.photos/seed/newlisting/400/400'
    });
    Alert.alert('Submitted for review', 'Your listing is now pending review.', [
      { text: 'View My Ads', onPress: () => navigation.navigate('MyAds') }
    ]);
  };

  const goNext = () => {
    if (step === 1 && !title.trim()) {
      Alert.alert('Add a title', 'Tell buyers what you are selling.');
      return;
    }
    if (step === 5 && !price.trim()) {
      Alert.alert('Add a price', 'Enter the amount you want buyers to see.');
      return;
    }
    if (step < TOTAL_STEPS) setStep((current) => current + 1);
    else submit();
  };

  return (
    <ScreenContainer noPadding style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => (step > 1 ? setStep((current) => current - 1) : navigation.goBack())} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell an item</Text>
        <TouchableOpacity onPress={saveDraft} accessibilityLabel="Save listing draft">
          <Text style={styles.draftText}>Save draft</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressRow} accessibilityLabel={`Step ${step} of ${TOTAL_STEPS}`}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View key={index} style={[styles.progressSegment, index < step && styles.progressSegmentActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {step === 1 && <>
          <Text style={styles.kicker}>Step 1 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>What are you selling?</Text>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}><Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text></TouchableOpacity>)}
          </View>
          <Text style={styles.label}>Listing title</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="e.g. iPhone 14, 128 GB" placeholderTextColor={Colors.disabled} style={styles.input} />
        </>}

        {step === 2 && <>
          <Text style={styles.kicker}>Step 2 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>Add photos</Text>
          <Text style={styles.helper}>Listings with clear photos get more responses.</Text>
          <TouchableOpacity style={styles.photoBox} onPress={() => Alert.alert('Add photos', 'Photo selection is ready for native media-picker wiring in this prototype.')}>
            <Ionicons name="camera-outline" size={36} color={Colors.primary} />
            <Text style={styles.photoText}>Add photos</Text>
            <Text style={styles.helper}>Up to 8 photos</Text>
          </TouchableOpacity>
        </>}

        {step === 3 && <>
          <Text style={styles.kicker}>Step 3 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>Describe the item</Text>
          <Text style={styles.label}>Description</Text>
          <TextInput value={description} onChangeText={setDescription} placeholder="Mention the condition, age, and anything a buyer should know" placeholderTextColor={Colors.disabled} multiline style={[styles.input, styles.multilineInput]} />
        </>}

        {step === 4 && <>
          <Text style={styles.kicker}>Step 4 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>What is its condition?</Text>
          <View style={styles.chips}>
            {CONDITIONS.map((item) => <TouchableOpacity key={item} onPress={() => setCondition(item)} style={[styles.chip, condition === item && styles.chipActive]}><Text style={[styles.chipText, condition === item && styles.chipTextActive]}>{item}</Text></TouchableOpacity>)}
          </View>
        </>}

        {step === 5 && <>
          <Text style={styles.kicker}>Step 5 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>Set your price</Text>
          <Text style={styles.label}>Price in ₹</Text>
          <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.disabled} style={styles.priceInput} />
          <Text style={styles.helper}>Use a fair local-market price to attract serious buyers.</Text>
        </>}

        {step === 6 && <>
          <Text style={styles.kicker}>Step 6 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>Where is it located?</Text>
          <Text style={styles.label}>City and locality</Text>
          <TextInput value={location} onChangeText={setLocation} placeholder="Mumbai, MH" placeholderTextColor={Colors.disabled} style={styles.input} />
          <View style={styles.privacyNote}><Ionicons name="shield-checkmark-outline" size={18} color={Colors.success} /><Text style={styles.helper}>Your exact address is never shown publicly.</Text></View>
        </>}

        {step === 7 && <>
          <Text style={styles.kicker}>Step 7 of {TOTAL_STEPS}</Text>
          <Text style={styles.title}>Preview your listing</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewImage}><Ionicons name="image-outline" size={30} color={Colors.disabled} /></View>
            <Text style={styles.previewTitle}>{title || 'Your listing title'}</Text>
            <Text style={styles.previewPrice}>₹{price || '0'}</Text>
            <Text style={styles.previewMeta}>{condition} · {category} · {location || 'Location not added'}</Text>
            {description ? <Text style={styles.previewDescription}>{description}</Text> : <Text style={styles.helper}>No description added yet.</Text>}
          </View>
          <Text style={styles.reviewNote}>Submit for review when everything looks right. You can edit the listing later from My Ads.</Text>
        </>}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextButtonText}>{step === TOTAL_STEPS ? 'Submit for review' : 'Next'}</Text>
          {step < TOTAL_STEPS && <Ionicons name="arrow-forward" size={18} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Colors.surfaceRaised, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  headerButton: { minWidth: 48, minHeight: 48, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { ...Typography.screenTitle },
  draftText: { ...Typography.secondary, color: Colors.primary, fontWeight: '600' },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surfaceRaised },
  progressSegment: { height: 4, flex: 1, borderRadius: 2, backgroundColor: Colors.border },
  progressSegmentActive: { backgroundColor: Colors.brandOrange },
  content: { padding: Spacing.md, paddingBottom: 120 },
  kicker: { ...Typography.micro, color: Colors.brandOrange, marginBottom: Spacing.sm },
  title: { ...Typography.screenTitle, fontSize: 24, marginBottom: Spacing.lg },
  label: { ...Typography.bodyBold, fontSize: 14, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  helper: { ...Typography.secondary, lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.pill, backgroundColor: '#F1F2F4', borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { ...Typography.secondary, color: Colors.textPrimary },
  chipTextActive: { color: Colors.primary, fontWeight: '600' },
  input: { minHeight: 52, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.control, paddingHorizontal: Spacing.md, ...Typography.body, color: Colors.textPrimary, backgroundColor: Colors.surfaceRaised },
  multilineInput: { minHeight: 160, paddingTop: Spacing.md, textAlignVertical: 'top' },
  priceInput: { minHeight: 64, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: Spacing.md, ...Typography.priceLarge, color: Colors.textPrimary, backgroundColor: Colors.surfaceRaised },
  photoBox: { minHeight: 220, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryLight, gap: Spacing.xs },
  photoText: { ...Typography.bodyBold, color: Colors.primary },
  privacyNote: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg, padding: Spacing.md, borderRadius: 12, backgroundColor: '#ECFDF5' },
  previewCard: { backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: Spacing.md },
  previewImage: { height: 180, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F2F4', marginBottom: Spacing.md },
  previewTitle: { ...Typography.sectionHeader, marginBottom: Spacing.xs },
  previewPrice: { ...Typography.priceLarge, color: Colors.primary, marginBottom: Spacing.xs },
  previewMeta: { ...Typography.secondary, marginBottom: Spacing.sm },
  previewDescription: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },
  reviewNote: { ...Typography.secondary, marginTop: Spacing.md, lineHeight: 19 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: Colors.surfaceRaised, borderTopWidth: 1, borderTopColor: Colors.border },
  nextButton: { minHeight: 52, borderRadius: 12, backgroundColor: Colors.brandOrange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  nextButtonText: { ...Typography.button, color: Colors.white }
});
