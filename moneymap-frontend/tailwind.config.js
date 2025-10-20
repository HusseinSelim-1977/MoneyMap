/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e6efff',
          200: '#c4d9ff',
          300: '#9fc1ff',
          400: '#6f9fff',
          500: '#3c79ff',
          600: '#1f5cf5',
          700: '#1a49cc',
          800: '#173ea8',
          900: '#132f7d',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
}
