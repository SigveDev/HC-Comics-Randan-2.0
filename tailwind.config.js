/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '668px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      height: {
        header: '3.5rem',
        fullpage: 'calc(100dvh - 3.5rem)',
      },
      maxHeight: {
        fullpage: 'calc(100dvh - 3.5rem)',
      },
      minHeight: {
        fullpage: 'calc(100dvh - 3.5rem)',
      },
    },
  },
  plugins: [],
}

