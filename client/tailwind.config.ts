import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wise: {
          black: '#0e0f0c',
          green: '#9fe870',
          'dark-green': '#163300',
          mint: '#e2f6d5',
          'pastel-green': '#cdffad',
          positive: '#054d28',
          danger: '#d03238',
          warning: '#ffd11a',
          gray: '#868685',
          'warm-dark': '#454745',
          'light-surface': '#e8ebe6',
          bg: '#fafaf8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '30px',
        'card-lg': '40px',
      },
      boxShadow: {
        ring: 'rgba(14,15,12,0.12) 0px 0px 0px 1px',
        'ring-green': '#9fe870 0px 0px 0px 1px',
        'ring-inset': 'rgb(134,134,133) 0px 0px 0px 1px inset',
      },
    },
  },
  plugins: [],
} satisfies Config
