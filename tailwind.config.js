/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './index.ts', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
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
