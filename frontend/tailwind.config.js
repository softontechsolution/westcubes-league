/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#10b981', // A striking emerald green for the football theme
        dark: '#111827',  // Deep dark background
        card: '#1f2937',  // Slightly lighter dark for cards/tables
      }
    },
  },
  plugins: [],
}