import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration:
// - Can be overridden via EXPO_PUBLIC_API_URL
// - On Android Emulator, 'localhost' refers to the device itself, so 10.0.2.2 points to host machine
// - On iOS simulator / web / desktop, localhost:3000 is used
const getLocalApiBase = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getLocalApiBase();

export const TOKEN_STORAGE_KEY = '@bigbazaar_auth_token';
export const USER_STORAGE_KEY = '@bigbazaar_user_profile';

/**
 * Save auth token to AsyncStorage
 */
export const saveAuthToken = async (token) => {
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('[AUTH] Failed to save auth token:', e);
  }
};

/**
 * Get stored auth token
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    return null;
  }
};

/**
 * Signup API Call
 * POST /auth/signup
 * Body: { fullName, email, password, phoneNumber, role, userTypes, status }
 */
export const signupApi = async ({
  fullName,
  email,
  password,
  phoneNumber,
  role = 'user',
  userTypes = ['buyer'],
  status = 'active',
}) => {
  const payload = {
    fullName: fullName?.trim(),
    email: email?.trim().toLowerCase(),
    password,
    phoneNumber: phoneNumber?.trim(),
    role,
    userTypes: Array.isArray(userTypes) ? userTypes : [userTypes],
    status,
  };

  try {
    console.log(`[AUTH] Calling POST ${API_BASE_URL}/auth/signup with:`, {
      ...payload,
      password: '***',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Signup request failed with status ' + response.status);
    }

    return {
      success: true,
      message: data.message || 'OTP sent successfully',
      email: payload.email,
      otp: data.otp,
      data,
    };
  } catch (error) {
    console.warn('[AUTH] Live API error on signup:', error.message);

    // If server is unreachable / offline, provide fallback for local simulation
    if (
      error.name === 'AbortError' ||
      error.message?.includes('Network request failed') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('timeout')
    ) {
      console.log('[AUTH] Falling back to local OTP verification simulation.');
      return {
        success: true,
        isSimulated: true,
        message: 'OTP sent to your email (Demo Code: 123456)',
        email: payload.email,
        otp: '123456',
      };
    }

    throw error;
  }
};

/**
 * Verify OTP API Call
 * POST /auth/verify-otp
 * Body: { email, otp }
 */
export const verifyOtpApi = async ({ email, otp }) => {
  const payload = {
    email: email?.trim().toLowerCase(),
    otp: String(otp).trim(),
  };

  try {
    console.log(`[AUTH] Calling POST ${API_BASE_URL}/auth/verify-otp with:`, payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }

    if (data.token) {
      await saveAuthToken(data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      message: data.message || 'OTP verified successfully',
    };
  } catch (error) {
    console.warn('[AUTH] Live API error on verify-otp:', error.message);

    // Simulated verification if backend is offline and user entered test code '123456'
    if (
      (error.name === 'AbortError' ||
        error.message?.includes('Network request failed') ||
        error.message?.includes('Failed to fetch')) &&
      payload.otp === '123456'
    ) {
      const mockToken = 'mock_jwt_token_' + Date.now();
      await saveAuthToken(mockToken);
      return {
        success: true,
        isSimulated: true,
        token: mockToken,
        user: {
          email: payload.email,
          role: 'user',
          userTypes: ['buyer'],
          status: 'active',
        },
        message: 'OTP verified successfully (Demo Mode)',
      };
    }

    throw error;
  }
};

/**
 * Login API Call
 * POST /auth/login
 */
export const loginApi = async ({ email, password }) => {
  const payload = {
    email: email?.trim().toLowerCase(),
    password,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      await saveAuthToken(data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.warn('[AUTH] Login error:', error.message);
    throw error;
  }
};
