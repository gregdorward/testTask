/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Waracle brand palette
        obsidian: '#0B1215', // primary text + dark sections
        ink: '#0B1215', // alias kept for existing class usage
        clay: {
          DEFAULT: '#E9DFD9', // warm neutral surface
          dark: '#ddd0c8',
        },
        accent: {
          DEFAULT: '#F93B02', // Blaze orange — CTA buttons only
          hover: '#dd3402',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'toast-in': 'toast-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
