/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0B4A2B',   // Deep green (main brand)
          secondary: '#E6B65C', // Gold (logo text)
          accent: '#E6C97A',    // Light gold (hover / highlight)
          dark: '#062E1A',      // Dark green-black
          light: '#F9F7F1',     // Soft cream background
          muted: '#8FAF9B',     // Muted text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern':
          'linear-gradient(135deg, #062E1A 0%, #0B4A2B 60%, #0F5C36 100%)',
      },
      boxShadow: {
        card:
          '0 4px 6px -1px rgba(0,0,0,0.15), 0 2px 4px -1px rgba(0,0,0,0.1)',
        'card-hover':
          '0 20px 25px -5px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
