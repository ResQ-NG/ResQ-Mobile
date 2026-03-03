/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './index.ts', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#0000FF',
          'blue-dark': '#3333FF', // dark mode / on dark surfaces
        },
        accent: {
          red: '#F00033',
          'red-dark': '#FF3366', // dark mode
        },
        surface: {
          light: '#F7F7F7',
          dark: '#121212', // dark mode follow-up
        },
        success: {
          green: '#17A34A',
          'green-dark': '#22C55E', // dark mode
        },
        // Typography – body & caption (with dark mode variants)
        primaryDark: '#222222', // body text, light theme
        'primaryDark-dark': '#E5E5E5', // body text, dark mode
        captionDark: '#979797', // caption/muted, light theme
        'captionDark-dark': '#A3A3A3', // caption, dark mode
      },
      fontFamily: {
        sans: ['Metropolis-Regular', 'System'],
        metropolis: ['Metropolis-Regular', 'System'],
        'metropolis-thin': ['Metropolis-Thin', 'System'],
        'metropolis-extralight': ['Metropolis-ExtraLight', 'System'],
        'metropolis-light': ['Metropolis-Light', 'System'],
        'metropolis-regular': ['Metropolis-Regular', 'System'],
        'metropolis-medium': ['Metropolis-Medium', 'System'],
        'metropolis-semibold': ['Metropolis-SemiBold', 'System'],
        'metropolis-bold': ['Metropolis-Bold', 'System'],
        'metropolis-extrabold': ['Metropolis-ExtraBold', 'System'],
        'metropolis-black': ['Metropolis-Black', 'System'],
      },
    },
  },
  plugins: [],
};
