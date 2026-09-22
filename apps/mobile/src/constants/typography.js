import { TextStyle } from 'react-native';
import Colors from './colors';

export const Typography =








{
  // Brief-aligned names for new surfaces. Existing names below remain stable
  // so older screens can adopt the system incrementally.
  priceLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  priceCard: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  screenTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  sectionHeader: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  secondary: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: Colors.textSecondary
  },
  micro: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: Colors.textSecondary
  },
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: 0.36,
    color: Colors.textPrimary
  },
  heading2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.35,
    color: Colors.textPrimary
  },
  heading3: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.textPrimary
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.textPrimary
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.textPrimary
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.textSecondary
  },
  captionBold: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: -0.08,
    color: Colors.textSecondary
  },
  button: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.41,
    color: Colors.white
  }
};

export default Typography;
