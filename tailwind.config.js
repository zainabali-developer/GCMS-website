/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep institutional green, drawn from the GCMS crest ribbon
        emerald: {
          50: '#eef6f1',
          100: '#d3e9dd',
          200: '#a7d3bb',
          300: '#75b896',
          400: '#469b73',
          500: '#2a7d59',
          600: '#1c6448',
          700: '#17503a',
          800: '#123e2d',
          900: '#0d2f22',
          950: '#081f17',
        },
        // Crest blue accent
        sky: {
          50: '#eef6fb',
          100: '#d6ebf5',
          200: '#aed6ea',
          300: '#7ebedb',
          400: '#4a9fc4',
          500: '#2f80a8',
          600: '#256689',
          700: '#20536f',
          800: '#1c445b',
          900: '#18384c',
        },
        // Subtle academic gold
        gold: {
          50: '#faf6ea',
          100: '#f2e9c9',
          200: '#e6d190',
          300: '#d8b75c',
          400: '#c9a038',
          500: '#b08627',
          600: '#8f6a1f',
          700: '#71531b',
          800: '#5a4319',
          900: '#4a3818',
        },
        ink: {
          50: '#f6f7f6',
          100: '#e7e9e7',
          200: '#c9cec9',
          300: '#a3aba3',
          400: '#79837a',
          500: '#5e685f',
          600: '#4a534b',
          700: '#3c443d',
          800: '#293029',
          900: '#1b201c',
          950: '#12160f',
        },
        paper: '#FAF9F5',
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        prose: '72ch',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 22, 15, 0.06), 0 1px 3px rgba(18, 22, 15, 0.08)',
        panel: '0 4px 24px rgba(18, 22, 15, 0.08)',
      },
    },
  },
  plugins: [],
};
