// Design Tokens - Centralized styling constants

export const colors = {
  // Primary Brand
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
  },
  // Secondary Brand
  secondary: {
    50: '#faf5ff',
    500: '#a855f7',
    600: '#9333ea',
  },
  // Accent
  accent: {
    50: '#fdf2f8',
    500: '#ec4899',
  },
  // Success
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  // Warning
  warning: {
    50: '#fffbeb',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
  },
  // Error
  error: {
    50: '#fef2f2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    800: '#7f1d1d',
  },
  // Neutral
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
};

export const borderRadius = {
  sm: '0.375rem',   // 6px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  full: '9999px',
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

export const gradients = {
  brandPrimary: 'linear-gradient(to right, #4f46e5, #a855f7)',
  brandSecondary: 'linear-gradient(to bottom right, #eef2ff, #faf5ff, #fdf2f8)',
  brandAccent: 'linear-gradient(135deg, #4f46e5, #a855f7, #ec4899)',
  success: 'linear-gradient(to right, #22c55e, #16a34a)',
  warning: 'linear-gradient(to right, #facc15, #eab308)',
  error: 'linear-gradient(to right, #ef4444, #dc2626)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const sizes = {
  // Form inputs
  input: {
    sm: { height: '2.25rem', padding: '0.5rem 0.75rem', fontSize: typography.fontSize.sm },
    base: { height: '2.75rem', padding: '0.75rem 1rem', fontSize: typography.fontSize.base },
    lg: { height: '3.25rem', padding: '1rem 1rem', fontSize: typography.fontSize.lg },
  },
  // Buttons
  button: {
    sm: { padding: '0.5rem 1rem', fontSize: typography.fontSize.sm },
    base: { padding: '0.75rem 1.5rem', fontSize: typography.fontSize.base },
    lg: { padding: '1rem 2rem', fontSize: typography.fontSize.lg },
  },
  // Icons
  icon: {
    xs: '1rem',    // 16px
    sm: '1.25rem', // 20px
    base: '1.5rem', // 24px
    lg: '2rem',    // 32px
    xl: '2.5rem',  // 40px
  },
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
};
