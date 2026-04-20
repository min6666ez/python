/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d',
          light: '#2c5282',
        },
        secondary: {
          DEFAULT: '#4fd1c5',
          light: '#81e6dd',
        },
        accent: {
          DEFAULT: '#ed8936',
          light: '#f6ad55',
        },
        success: '#38a169',
        error: '#e53e3e',
        warning: '#dd6b20',
        dark: {
          DEFAULT: '#1a202c',
          light: '#2d3748',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'slide-in': 'slideIn 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
