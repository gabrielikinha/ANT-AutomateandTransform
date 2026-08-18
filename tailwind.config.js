/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b0764',
        },
        ant: {
          purple: '#6B21A8',
          'purple-light': '#9333EA',
          'purple-soft': '#EDE9FE',
          green: '#059669',
          'green-light': '#10B981',
          'green-soft': '#D1FAE5',
        },
        neutral: {
          50:  '#F8F8FC',
          100: '#F1F0F7',
          200: '#E5E4EF',
          300: '#D0CFDF',
          400: '#9998B0',
          500: '#6B6A85',
          600: '#4F4E68',
          700: '#3A3952',
          800: '#27263C',
          900: '#18172A',
        },
        success: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px 0 rgba(107,33,168,0.10), 0 0 0 1px rgba(107,33,168,0.08)',
        sidebar: '2px 0 12px 0 rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
