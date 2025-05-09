/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include paths to all your component files
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './App/**/*.{js,jsx,ts,tsx}',
    './*.tsx',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
        },
        bg: 'rgb(var(--bg) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--text) / <alpha-value>)',
          light: 'rgb(var(--text-light) / <alpha-value>)',
        },
      },
      borderRadius: {
        custom: 'var(--border-radius)',
      },
    },
  },
  plugins: [],
};
