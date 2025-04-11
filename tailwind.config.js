/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'whatsapp': {
          'green': '#25D366',
          'dark': '#075E54',
          'light': '#128C7E',
          'background': '#E5DDD5',
        },
      },
    },
  },
  plugins: [],
} 