/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f3eee6',
        panel: '#fbf8f3',
        ink: '#1f1612',
        espresso: '#5c3d2e',
        line: '#e4d9cc',
        coffee: {
          50:  '#f7f1e8',
          100: '#efe4d4',
          200: '#e0c9a8',
          300: '#c9a078',
          400: '#a9784e',
          500: '#8a5a35',
          600: '#5c3d2e',
          700: '#4a3126',
          800: '#3a261e',
          900: '#2a1c16',
          950: '#1f1612',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
