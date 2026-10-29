import type { Criticality } from '../models/resource.ts'

interface Tone {
  fg: string
  bg: string
  ring: string
}

const palette = {
  coral50: '#fdedef',
  coral100: '#fce8eb',
  coral500: '#e74456',
  coral600: '#bc152a',
  coral700: '#8e1020',
  plum800: '#5c0a14',
  plum900: '#2b0518',
  pink50: '#ffbcd7',
  neutral50: '#f7f7fa',
  neutral100: '#efeff7',
  neutral200: '#e5e5ed',
  neutral300: '#cfd0dd',
  neutral400: '#9c9da8',
  neutral500: '#6e6f7c',
  neutral600: '#494a58',
  neutral800: '#1f1f24',
  blue50: '#eff1fb',
  blueFocus: '#2d62ff',
  warningFg: '#5e5515',
  warningBg: '#fcf8d8',
}

export const theme = {
  colors: {
    background: palette.neutral50,
    surface: '#ffffff',
    border: palette.neutral200,
    borderStrong: palette.neutral300,
    borderHover: palette.neutral400,
    text: palette.neutral800,
    textSecondary: palette.neutral600,
    textMuted: palette.neutral500,
    surfaceMuted: palette.neutral100,
    primary: palette.plum900,
    primaryHover: palette.plum800,
    onPrimary: '#ffffff',
    onPrimaryMuted: palette.pink50,
    accent: palette.coral500,
    accentSubtle: palette.coral50,
    rowHover: palette.neutral50,
    selectedRow: palette.blue50,
    focus: palette.blueFocus,
    link: palette.blueFocus,
    danger: palette.coral600,
    dangerHover: palette.coral700,
    overlay: 'rgba(29, 4, 22, 0.45)',
  },
  criticality: {
    low: {
      fg: palette.neutral600,
      bg: palette.neutral100,
      ring: palette.neutral600,
    },
    medium: {
      fg: palette.warningFg,
      bg: palette.warningBg,
      ring: palette.warningFg,
    },
    high: {
      fg: palette.coral600,
      bg: palette.coral100,
      ring: palette.coral600,
    },
    critical: { fg: '#ffffff', bg: palette.coral600, ring: palette.coral600 },
  } satisfies Record<Criticality, Tone>,
  fonts: {
    body: "'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  media: {
    narrow: '(max-width: 760px)',
  },
  sizes: {
    content: '300rem',
    header: '14rem',
    control: '9rem',
  },
  space: {
    xs: '1rem',
    sm: '2rem',
    md: '3rem',
    lg: '4rem',
    xl: '6rem',
    xxl: '8rem',
  },
  radii: {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
    pill: '999rem',
  },
  fontSizes: {
    xs: '3rem',
    sm: '3.25rem',
    md: '3.5rem',
    lg: '4rem',
    xl: '5rem',
  },
  shadows: {
    md: '0 4px 12px rgba(23, 23, 24, 0.08)',
    lg: '0 12px 32px rgba(23, 23, 24, 0.16)',
  },
}

export type Theme = typeof theme
