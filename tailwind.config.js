/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary-bg': '#0A0E1A',
        'secondary-bg': '#141922',
        'card-bg': '#1F242F',
        
        // Brand & Accent Colors
        'brand-orange': '#FF6B47',
        'accent-orange': '#FF5722',
        'brand-red': '#F44336',
        
        // Interactive Elements
        'hover-state': '#FF8A65',
        
        // Text Colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0BEC5',
        'text-muted': '#78909C',
        
        // Status Colors
        'success-green': '#4CAF50',
        'warning-yellow': '#FFA726',
        'error-red': '#F44336',
        
        // UI Elements
        'border-color': '#37474F',
        'input-bg': '#263238',
        'sidebar': '#1A1F2B',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 107, 71, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 107, 71, 0.4)',
      },
    },
  },
  plugins: [],
};