import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';
import { useApp } from '../../context/AppContext';
import { verifyOtpApi, signupApi } from '../../services/authApi';

export const VerifyOtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { updateUser, setAuthenticated, executePendingAction } = useApp();

  // Params passed from SignupScreen or ForgotPassword
  const email = route.params?.email || 'user@example.com';
  const fullName = route.params?.fullName || '';
  const phoneNumber = route.params?.phoneNumber || '';
  const initialOtp = route.params?.otp || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = useRef([]);

  // Auto-fill OTP if provided in development/demo mode
  useEffect(() => {
    if (initialOtp && initialOtp.length === 6) {
      setOtp(initialOtp.split(''));
    }
  }, [initialOtp]);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    // Only allow numeric characters
    const cleanVal = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      // Handle paste
      const pastedDigits = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedDigits[i] || '';
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pastedDigits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);
    setErrorMessage('');

    // Advance focus to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await verifyOtpApi({ email, otp: code });

      // Update global user state in AppContext
      updateUser({
        fullName: result.user?.fullName || fullName || 'User',
        email: result.user?.email || email,
        mobileNumber: result.user?.phoneNumber || phoneNumber || '',
        role: result.user?.role || 'Buyer',
      });

      setAuthenticated(true);
      setIsLoading(false);

      Alert.alert(
        'Account Verified! 🎉',
        'Welcome to MyBigBazaar! You are now logged in.',
        [
          {
            text: 'Get Started',
            onPress: () => {
              executePendingAction();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { screen: 'Home' } }],
              });
            },
          },
        ]
      );
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Verification failed. Please check the code.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(30);
    setErrorMessage('');

    try {
      const res = await signupApi({
        fullName: fullName || 'User',
        email,
        password: 'TemporaryPassword1', // dummy or existing
        phoneNumber,
      });

      Alert.alert('Code Sent', res.message || `A new code has been sent to ${email}`);
      if (res.otp) {
        setOtp(res.otp.split(''));
      }
    } catch (err) {
      Alert.alert('Resend Failed', err.message || 'Could not resend OTP. Please try again.');
    }
  };

  return (
    <ScreenContainer noPadding>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify OTP</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Icon & Description */}
          <View style={styles.iconSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={44} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit verification code to
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  errorMessage ? styles.otpInputError : null,
                ]}
                value={digit}
                onChangeText={(val) => handleOtpChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyBtn, isLoading && styles.verifyBtnDisabled]}
            onPress={handleVerify}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.verifyBtnText}>Verify & Continue</Text>
            )}
          </TouchableOpacity>

          {/* Resend Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
            )}
          </View>

          {/* Hint for Dev/Testing */}
          <View style={styles.devHintBox}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.devHintText}>
              In development/offline mode, you can use code <Text style={{ fontWeight: 'bold' }}>123456</Text> to test verification.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginHorizontal: -Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  iconSection: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emailText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  otpInputError: {
    borderColor: Colors.error,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    fontSize: 13,
    marginLeft: 6,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  verifyBtnDisabled: {
    opacity: 0.7,
  },
  verifyBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16,
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  resendPrompt: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resendLink: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.primary,
  },
  resendTimer: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  devHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  devHintText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
});

export default VerifyOtpScreen;
