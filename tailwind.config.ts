// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed', // Your Zap Purple
          foreground: '#ffffff',
        },
        zap: {
          light: '#f5f3ff',
          dark: '#4c1d95',
        }
      },
    },
  },
}