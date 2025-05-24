/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    fontFamily:{
        'nav-font': ['Philosopher', 'sans-serif'], 
        'hero-font': ['Cormorant+Garamond','ital'],
        'about-font':['Exo+2','ital']
      },
    plugins: [],
  };
  