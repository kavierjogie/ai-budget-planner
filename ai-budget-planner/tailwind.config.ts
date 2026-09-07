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
          50: '#f3f6f9',
          100: '#e3ecf2',
          200: '#c7d9e5',
          300: '#a2c1d1',
          400: '#567c8e',
          500: '#567c8e',
          600: '#2f4157',
          700: '#2f4157',
          800: '#2f4157',
          900: '#2f4157',
          950: '#2f4157',
        },
        indigo: {
          100: '#e3ecf2',
          200: '#c7d9e5',
          300: '#a2c1d1',
          400: '#567c8e',
          500: '#567c8e',
          600: '#2f4157',
          700: '#2f4157',
          800: '#2f4157',
          900: '#2f4157',
        },
        purple: {
          100: '#e3ecf2',
          200: '#c7d9e5',
          300: '#a2c1d1',
          400: '#567c8e',
          500: '#567c8e',
          600: '#2f4157',
          700: '#2f4157',
          800: '#2f4157',
          900: '#2f4157',
          950: '#2f4157',
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
