/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors: {
        'primary': '#0d98db',
        'secondary': '#0B0A34',
        'third': '#00468C',
        'gradientStart': '#041031',
      },
    },
  },
  plugins: [],
}

