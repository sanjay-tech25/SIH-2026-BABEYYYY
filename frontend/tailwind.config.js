export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontSize: {
        display: ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        h1: ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h3: ['1rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        body: ['0.875rem', { lineHeight: '1.65' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
    },
  },
}
