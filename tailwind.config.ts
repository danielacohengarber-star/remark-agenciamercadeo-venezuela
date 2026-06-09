import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Colors ─────────────────────────────────────────────────────────────
      colors: {
        remark: {
          red:    '#D6272E',
          black:  '#1A1A1A',
          cream:  '#F5F0E8',
          white:  '#FFFFFF',
          yellow: '#FFB719',
          blue:   '#72C3D7',
          orange: '#DE5829',
          pink:   '#EBB2BB',
        },
        // Semantic aliases
        ink:        '#1A1A1A',
        'ink-soft': '#4A4A4A',
        'ink-muted':'#8A8A86',
        primary:    '#D6272E',
        bg:         '#F5F0E8',
        'bg-alt':   '#FFFFFF',
        line:       'rgba(26,26,26,0.12)',
        // Tints
        'red-tint':    '#FBE4E5',
        'yellow-tint': '#FFF1D4',
        'blue-tint':   '#E4F3F7',
        'pink-tint':   '#FAEEF0',
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        display: ['Nimora', 'Poppins', 'sans-serif'],
        body:    ['Poppins', 'sans-serif'],
        // Prevent forbidden system fonts from leaking in as fallbacks
        sans:    ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        light:    '300',
        regular:  '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },
      lineHeight: {
        tight:  '0.95',
        snug:   '1.1',
        normal: '1.6',
      },
      letterSpacing: {
        tight:   '-0.01em',
        caption: '0.1em',
      },

      // ── Fluid font sizes (CSS clamp — use as arbitrary values in JSX
      //    or via the CSS custom properties; listed here for reference) ────────
      fontSize: {
        hero:     ['clamp(60px,10vw,160px)', { lineHeight: '0.95' }],
        display:  ['clamp(40px,6vw,96px)',   { lineHeight: '1.1'  }],
        subhead:  ['clamp(24px,3vw,48px)',   { lineHeight: '1.1'  }],
        title:    ['clamp(22px,2.2vw,32px)', { lineHeight: '1.2'  }],
        'body-lg':['clamp(18px,1.4vw,22px)', { lineHeight: '1.6'  }],
        body:     ['clamp(16px,1.2vw,18px)', { lineHeight: '1.6'  }],
        caption:  ['clamp(12px,1vw,14px)',   { lineHeight: '1.4'  }],
        nav:      ['16px',                   { lineHeight: '1.5'  }],
      },

      // ── Spacing ────────────────────────────────────────────────────────────
      maxWidth: {
        container: '1320px',
      },
      padding: {
        container: 'clamp(24px,5vw,80px)',
      },

      // ── Border radius ──────────────────────────────────────────────────────
      borderRadius: {
        sm:   '10px',
        md:   '18px',
        lg:   '28px',
        pill: '999px',
      },

      // ── Shadows (soft, warm-tinted) ─────────────────────────────────────
      boxShadow: {
        sm: '0 2px 8px rgba(26,26,26,0.06)',
        md: '0 10px 30px rgba(26,26,26,0.10)',
        lg: '0 24px 60px rgba(26,26,26,0.14)',
      },

      // ── Motion ────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast: '140ms',
        med:  '280ms',
        slow: '520ms',
      },

      // ── Section rhythm (used as arbitrary values: py-[--section-y]) ───────
      spacing: {
        'section': 'clamp(80px,14vh,140px)',
      },
    },
  },
  plugins: [],
}

export default config
