/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'light-primary': '#8A2BE2',
        'light-secondary': '#4169E1',
        'light-background': '#F0F8FF',
        'light-surface': 'rgba(255, 255, 255, 0.8)',
        'light-text': '#2C3E50',
        
        // Dark mode colors - improved for readability
        'dark-primary': '#00FFFF',
        'dark-secondary': '#FF00FF',
        'dark-background': '#0A0A29',
        'dark-surface': 'rgba(30, 30, 60, 0.8)',
        'dark-text': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'dark-gradient': 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.dark-primary"), 0 0 20px theme("colors.dark-primary")',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            code: {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25em',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};