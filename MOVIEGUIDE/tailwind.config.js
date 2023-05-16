/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#a0a0a0',
      },
      fontSize: {
        'customSize': '0.95rem',
      }
    },
  },
  plugins: [],
}