import { TextStyle } from 'react-native';

export const sizeStyles: Record<
  string,
  { fontSize: number; lineHeight: number }
> = {
  f24: {
    fontSize: 24,
    lineHeight: 32,
  },
  f23: {
    fontSize: 23,
    lineHeight: 30.27,
  },
  f20: {
    fontSize: 20,
    lineHeight: 32,
  },
  f19: {
    fontSize: 19,
    lineHeight: 22,
  },
  f18: {
    fontSize: 18,
    lineHeight: 28,
  },
  f17: {
    fontSize: 17,
    lineHeight: 25,
  },
  f16: {
    fontSize: 16,
    lineHeight: 23.17,
  },
  f15: {
    fontSize: 15,
    lineHeight: 25,
  },
  f14: {
    fontSize: 14,
    lineHeight: 22,
  },
  f13: {
    fontSize: 13,
    lineHeight: 20,
  },
  f12: {
    fontSize: 12,
    lineHeight: 17.38,
  },
  f11: {
    fontSize: 11,
    lineHeight: 11,
  },
};

export const weightStyles: Record<
  string,
  { fontWeight: TextStyle['fontWeight'] }
> = {
  exBold: {
    fontWeight: '800',
  },
  bold: {
    fontWeight: '700',
  },
  semiBold: {
    fontWeight: '600',
  },
  medium: {
    fontWeight: '500',
  },
  regular: {
    fontWeight: '400',
  },
  light: {
    fontWeight: '300',
  },
};
