/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f3d9a8',
          300: '#e9bc6e',
          400: '#de9d3e',
          500: '#d4821f',
          600: '#b86516',
          700: '#964d15',
          800: '#7a3e18',
          900: '#643516',
          950: '#391a09',
        },
        cream: {
          50:  '#fffef7',
          100: '#fffbeb',
          200: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
