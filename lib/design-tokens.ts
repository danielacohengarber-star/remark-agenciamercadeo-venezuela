/**
 * REMARK design tokens as typed TypeScript constants.
 * Use these for Framer Motion variants, inline styles, and
 * any context where Tailwind classes cannot reach.
 *
 * CSS custom properties in globals.css are the single source
 * of truth for runtime values; this file mirrors them for JS use.
 */

// ── Colors ────────────────────────────────────────────────────────────────────

export const colors = {
  // Brand palette — exact HEX, no substitutions
  red:    '#D6272E',
  black:  '#1A1A1A',
  cream:  '#F5F0E8',
  white:  '#FFFFFF',
  yellow: '#FFB719',
  blue:   '#72C3D7',
  orange: '#DE5829',
  pink:   '#EBB2BB',

  // Semantic
  ink:       '#1A1A1A',
  inkSoft:   '#4A4A4A',
  inkMuted:  '#8A8A86',
  primary:   '#D6272E',
  bg:        '#F5F0E8',
  bgAlt:     '#FFFFFF',
  line:      'rgba(26,26,26,0.12)',
  lineStrong:'#1A1A1A',

  // Tints
  redTint:    '#FBE4E5',
  yellowTint: '#FFF1D4',
  blueTint:   '#E4F3F7',
  pinkTint:   '#FAEEF0',
} as const

export type RemarkColor = keyof typeof colors

// ── Typography ────────────────────────────────────────────────────────────────

export const fonts = {
  display: "'Nimora', 'Poppins', sans-serif",
  body:    "'Poppins', sans-serif",
} as const

export const fontWeights = {
  light:        300,
  regular:      400,
  medium:       500,
  semibold:     600,
  bold:         700,
  display:      400,
  displayBold:  700,
} as const

export const fontSizes = {
  hero:    'clamp(60px, 10vw, 160px)',
  display: 'clamp(40px, 6vw, 96px)',
  subhead: 'clamp(24px, 3vw, 48px)',
  title:   'clamp(22px, 2.2vw, 32px)',
  bodyLg:  'clamp(18px, 1.4vw, 22px)',
  body:    'clamp(16px, 1.2vw, 18px)',
  caption: 'clamp(12px, 1vw, 14px)',
  nav:     '16px',
} as const

export const lineHeights = {
  tight:  0.95,
  snug:   1.1,
  normal: 1.6,
} as const

export const letterSpacings = {
  tight:   '-0.01em',
  caption: '0.1em',
} as const

// ── Layout ────────────────────────────────────────────────────────────────────

export const layout = {
  containerMax: '1320px',
  containerPad: 'clamp(24px, 5vw, 80px)',
  sectionY:     'clamp(80px, 14vh, 140px)',
} as const

// ── Radii ─────────────────────────────────────────────────────────────────────

export const radii = {
  sm:   '10px',
  md:   '18px',
  lg:   '28px',
  pill: '999px',
} as const

// ── Shadows ───────────────────────────────────────────────────────────────────

export const shadows = {
  sm: '0 2px 8px rgba(26,26,26,0.06)',
  md: '0 10px 30px rgba(26,26,26,0.10)',
  lg: '0 24px 60px rgba(26,26,26,0.14)',
} as const

// ── Motion ────────────────────────────────────────────────────────────────────

export const motion = {
  ease: {
    out:  [0.22, 1, 0.36, 1] as const,
    soft: [0.4, 0, 0.2, 1]   as const,
  },
  duration: {
    fast: 0.14,
    med:  0.28,
    slow: 0.52,
  },
} as const

// ── Framer Motion preset variants ─────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motion.duration.slow, ease: motion.ease.out },
  },
} as const

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motion.duration.med, ease: motion.ease.out },
  },
} as const

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: motion.duration.slow, ease: motion.ease.out },
  },
} as const

export const staggerChildren = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
} as const

// ── Asset paths ───────────────────────────────────────────────────────────────

export const assets = {
  logo: {
    wordmarkBlack:        '/assets/logo/remark-wordmark-black.png',
    wordmarkInk:          '/assets/logo/remark-wordmark-ink.png',
    wordmarkWhite:        '/assets/logo/remark-wordmark-white.png',
    wordmarkWhiteOnRed:   '/assets/logo/remark-wordmark-white-on-red.png',
    wordmarkWhiteOnBlue:  '/assets/logo/remark-wordmark-white-on-blue.png',
    wordmarkWhiteOnYellow:'/assets/logo/remark-wordmark-white-on-yellow.png',
    wordmarkWhiteOnCharcoal:'/assets/logo/remark-wordmark-white-on-charcoal.png',
    wordmarkBrushRed:     '/assets/logo/remark-wordmark-brush-red.png',
    wordmarkBrushYellow:  '/assets/logo/remark-wordmark-brush-yellow.png',
    wordmarkBrushBlue:    '/assets/logo/remark-wordmark-brush-blue.png',
    wordmarkBrushPink:    '/assets/logo/remark-wordmark-brush-pink.png',
    isotipoInk:           '/assets/logo/remark-isotipo-ink.png',
    isotipoWhite:         '/assets/logo/remark-isotipo-white.png',
    isotipoCharcoal:      '/assets/logo/remark-isotipo-charcoal.png',
    isotipoWhiteOnRed:    '/assets/logo/remark-isotipo-white-on-red.png',
    isotipoWhiteOnYellow: '/assets/logo/remark-isotipo-white-on-yellow.png',
    isotipoWhiteOnCharcoal:'/assets/logo/remark-isotipo-white-on-charcoal.png',
  },
  brushstrokes: {
    ballBlue:      '/assets/brushstrokes/brush-ball-blue.png',
    coilBlue:      '/assets/brushstrokes/brush-coil-blue.png',
    denseYellow:   '/assets/brushstrokes/brush-dense-yellow.png',
    dotPink:       '/assets/brushstrokes/brush-dot-pink.png',
    fillYellow:    '/assets/brushstrokes/brush-fill-yellow.png',
    hatchRed:      '/assets/brushstrokes/brush-hatch-red.png',
    hatchYellow:   '/assets/brushstrokes/brush-hatch-yellow.png',
    heartTeal:     '/assets/brushstrokes/brush-heart-teal.png',
    knotOrange:    '/assets/brushstrokes/brush-knot-orange.png',
    loopsBlue:     '/assets/brushstrokes/brush-loops-blue.png',
    scribbleRed:   '/assets/brushstrokes/brush-scribble-red.png',
    scribbleTeal:  '/assets/brushstrokes/brush-scribble-teal.png',
    swooshPink:    '/assets/brushstrokes/brush-swoosh-pink.png',
    tanglePink:    '/assets/brushstrokes/brush-tangle-pink.png',
    tangleRed:     '/assets/brushstrokes/brush-tangle-red.png',
    zigzagRed:     '/assets/brushstrokes/brush-zigzag-red.png',
    markOrange:    '/assets/brushstrokes/mark-orange.png',
    markRed:       '/assets/brushstrokes/mark-red.png',
    markYellow:    '/assets/brushstrokes/mark-yellow.png',
  },
  mascots: {
    cheerBlue:    '/assets/mascots/mascot-cheer-blue.png',
    cheerRed:     '/assets/mascots/mascot-cheer-red.png',
    cheerYellow:  '/assets/mascots/mascot-cheer-yellow.png',
    flexBlue:     '/assets/mascots/mascot-flex-blue.png',
    flexRed:      '/assets/mascots/mascot-flex-red.png',
    flexYellow:   '/assets/mascots/mascot-flex-yellow.png',
    meditateBlue: '/assets/mascots/mascot-meditate-blue.png',
    meditateRed:  '/assets/mascots/mascot-meditate-red.png',
    meditateYellow:'/assets/mascots/mascot-meditate-yellow.png',
    runBlue:      '/assets/mascots/mascot-run-blue.png',
    runRed:       '/assets/mascots/mascot-run-red.png',
    runYellow:    '/assets/mascots/mascot-run-yellow.png',
    sparkBlue:    '/assets/mascots/mascot-spark-blue.png',
    sparkRed:     '/assets/mascots/mascot-spark-red.png',
    sparkYellow:  '/assets/mascots/mascot-spark-yellow.png',
  },
} as const
