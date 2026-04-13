export const theme = {
  colors: {
    primary: '#FFC000',
    primaryHover: '#E6AC00',
    primaryLight: '#FFF3CC',
    navy: '#1E3A5F',
    navyHover: '#2A4F7F',
    navyLight: '#EBF0F7',
    white: '#FFFFFF',
    error: '#D32F2F',
    success: '#2E7D32',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      400: '#BDBDBD',
      600: '#757575',
      800: '#424242',
    },
  },
  typography: {
    fontFamily: "'Arial', Helvetica, sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(30, 58, 95, 0.10)',
    md: '0 4px 12px rgba(30, 58, 95, 0.15)',
    lg: '0 8px 24px rgba(30, 58, 95, 0.20)',
    nav: '0 -2px 8px rgba(30, 58, 95, 0.10)',
  },
  breakpoints: {
    mobile: '768px',
  },
  layout: {
    sidebarWidth: '220px',
    headerHeight: '60px',
    bottomNavHeight: '68px',
  },
} as const

export type Theme = typeof theme
