/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Core surfaces ───────────────────────────────────────────────
        paper:  '#f5ede0',   // warm parchment
        panel:  '#faf5ee',   // slightly lighter parchment
        canvas: '#fdf9f4',   // almost white warm
        ink:    '#1a110a',   // near-black warm
        // ── Brand ──────────────────────────────────────────────────────
        espresso: '#6b3f2a', // rich coffee brown
        roast:    '#4a2a18', // dark roast
        crema:    '#c9956a', // golden crema
        // ── Accents ─────────────────────────────────────────────────────
        sage: {
          50:  '#f1f6ef',
          100: '#ddecd8',
          200: '#b8d8ae',
          300: '#89be7c',
          400: '#5fa054',
          500: '#3f7e36',
          600: '#2e612a',
          700: '#264f22',
          800: '#20401d',
          900: '#1a3418',
        },
        amber: {
          50:  '#fefaee',
          100: '#fcf1cc',
          200: '#f8e08a',
          300: '#f4ca47',
          400: '#f0b520',
          500: '#e09a0c',
          600: '#bb7a09',
          700: '#8f5b0b',
          800: '#75480f',
          900: '#623b13',
        },
        coral: {
          50:  '#fff4f0',
          100: '#ffe6de',
          200: '#fcc9b6',
          300: '#f99f80',
          400: '#f47250',
          500: '#eb4f2b',
          600: '#d53519',
          700: '#b22a15',
          800: '#922616',
          900: '#782419',
        },
        // ── UI chrome ──────────────────────────────────────────────────
        line:  '#e8dace',   // warm border
        muted: '#8c7b6e',   // muted text
      },
      fontFamily: {
        sans:    ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(26,17,10,0.08), 0 1px 2px rgba(26,17,10,0.04)',
        'warm':    '0 4px 12px rgba(26,17,10,0.09), 0 2px 4px rgba(26,17,10,0.04)',
        'warm-lg': '0 12px 32px rgba(26,17,10,0.12), 0 4px 8px rgba(26,17,10,0.06)',
        'warm-xl': '0 24px 48px rgba(26,17,10,0.14), 0 8px 16px rgba(26,17,10,0.08)',
      },
    },
  },
  plugins: [],
}
