export const Colors = {
  primary: '#0A84FF', // Premium iOS Blue
  primaryLight: '#E5F1FF', // Pale blue for backgrounds and cards
  primaryDark: '#0062D6', // Darker blue for pressed states / headers
  white: '#FFFFFF',
  background: '#FFFFFF', // Pure white background
  surface: '#FFFFFF',
  textPrimary: '#1C1C1E', // Core brand text
  textSecondary: '#8E8E93', // iOS system gray
  border: '#C6C6C8', // iOS separator color
  success: '#34C759', // iOS green
  error: '#FF3B30', // iOS red
  warning: '#FF9500', // iOS orange
  cardBackground: '#FFFFFF',
  disabled: '#E5E5EA',
} as const;

export type ColorName = keyof typeof Colors;
export default Colors;
