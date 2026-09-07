import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          50: '#edf3f5',
          100: '#e8f0f2',
          200: '#c7dbe0',
          300: '#9bbdc6',
          400: '#285a6b',
          500: '#285a6b',
          600: '#17324d',
          700: '#17324d',
          800: '#17324d',
          900: '#17324d',
          950: '#17324d',
        },
        indigo: {
          100: '#e8f0f2',
          200: '#c7dbe0',
          300: '#9bbdc6',
          400: '#285a6b',
          500: '#285a6b',
          600: '#17324d',
          700: '#17324d',
          800: '#17324d',
          900: '#17324d',
        },
        purple: {
          100: '#e8f0f2',
          200: '#c7dbe0',
          300: '#9bbdc6',
          400: '#285a6b',
          500: '#285a6b',
          600: '#17324d',
          700: '#17324d',
          800: '#17324d',
          900: '#17324d',
          950: '#17324d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
