import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/colors';
import Typography from '../../constants/typography';
import Spacing from '../../constants/spacing';



export const LoginScreen = () => {
  const navigation = useNavigation();
  const { updateUser, setAuthenticated, executePendingAction } = useApp();

  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return '';
  };

  const validatePhone = (value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value) return 'Phone number is required';
    if (!phoneRegex.test(value.replace(/[^0-9]/g, ''))) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;
    } else {
      const phoneError = validatePhone(phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful login
    updateUser({
      fullName: loginMethod === 'email' ? email.split('@')[0] : `User ${phone.slice(-4)}`,
      email: loginMethod === 'email' ? email : 'user@example.com',
      mobileNumber: loginMethod === 'phone' ? `+91 ${phone}` : '+91 9876543210'
    });
    setAuthenticated(true);
    setIsLoading(false);

    executePendingAction();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }]
      });
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      `Enter your ${loginMethod === 'email' ? 'email address' : 'phone number'} and we'll send you a reset link.`,
      [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => Alert.alert('Sent!', 'Check your inbox for the reset link.') }]

    );
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
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
            <Text style={styles.headerTitle}>Login</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="bag-handle" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue shopping</Text>
          </View>

          {/* Login Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodBtn, loginMethod === 'email' && styles.methodBtnActive]}
              onPress={() => setLoginMethod('email')}>
              
              <Ionicons
                name="mail-outline"
                size={18}
                color={loginMethod === 'email' ? Colors.white : Colors.textSecondary} />
              
              <Text style={[styles.methodText, loginMethod === 'email' && styles.methodTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodBtn, loginMethod === 'phone' && styles.methodBtnActive]}
              onPress={() => setLoginMethod('phone')}>
              
              <Ionicons
                name="call-outline"
                size={18}
                color={loginMethod === 'phone' ? Colors.white : Colors.textSecondary} />
              
              <Text style={[styles.methodText, loginMethod === 'phone' && styles.methodTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {loginMethod === 'email' ?
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                  <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false} />
                
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View> :

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                  <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
                  <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.textSecondary}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  keyboardType="phone-pad"
                  maxLength={10} />
                
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>
            }

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none" />
                
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textSecondary} />
                  
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}>
              
              {isLoading ?
              <Text style={styles.loginBtnText}>Signing in...</Text> :

              <Text style={styles.loginBtnText}>Sign In</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={20} color={Colors.textPrimary} />
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={20} color={Colors.textPrimary} />
              <Text style={styles.socialBtnText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>);

};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.white
  },
  scrollContent: {
    flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  backBtn: {
    padding: Spacing.xs
  },
  headerTitle: {
    ...Typography.heading2,
    fontSize: 18,
    color: Colors.textPrimary
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md
  },
  welcomeText: {
    ...Typography.heading1,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs
  },
  subtitleText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  methodToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg
  },
  methodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4
  },
  methodBtnActive: {
    backgroundColor: Colors.primary
  },
  methodText: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6
  },
  methodTextActive: {
    color: Colors.white
  },
  formContainer: {
    paddingHorizontal: Spacing.xl
  },
  inputGroup: {
    marginBottom: Spacing.lg
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs
  },
  inputLabel: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs
  },
  forgotLink: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.primary
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  inputError: {
    borderColor: Colors.error
  },
  input: {
    flex: 1,
    ...Typography.body,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 14,
    marginLeft: Spacing.sm
  },
  errorText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.error,
    marginTop: 4
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.sm
  },
  loginBtnDisabled: {
    backgroundColor: Colors.disabled
  },
  loginBtnText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 16
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border
  },
  dividerText: {
    ...Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md
  },
  socialBtnText: {
    ...Typography.bodyBold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl
  },
  signupText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary
  },
  signupLink: {
    ...Typography.bodyBold,
    fontSize: 14,
    color: Colors.primary
  }
});

export default LoginScreen;