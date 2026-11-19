/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F0E8',
        sidebar: '#EAE5DA',
        burgundy: {
          DEFAULT: '#8B3A3A',
          deep: '#672B32',
        },
        accent: {
          secondary: '#B56A65',
          champagne: '#C5A477',
        },
        card: '#FFFFFF',
        text: {
          main: '#292522',
          muted: '#77706B',
        },
        border: '#E5DED4',
        success: '#477A60',
        warning: '#B7833C',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(41, 37, 34, 0.08), 0 1px 2px rgba(41, 37, 34, 0.04)',
        'card-hover': '0 4px 12px rgba(41, 37, 34, 0.12), 0 2px 4px rgba(41, 37, 34, 0.06)',
      },
    },
  },
  plugins: [],
}
