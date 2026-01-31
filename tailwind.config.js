/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zalando: ['"Zalando Sans Expanded"', "sans-serif"],
        bangers: ["Bangers", "cursive"],
        display: ['"Red Hat Text"', "sans-serif"],
        body: ['"Red Hat Text"', "sans-serif"],
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'loading-progress': 'loading 2s linear infinite',
      }
    },
  },
  plugins: [],
};
