/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD15B",
        grey: "#7A7A7A",
      },
      fontFamily: {
        'anton': ["Anton"],
        'manrope': ["Manrope"],
      },
      transitionProperty: {
        'max-height': 'max-height',
      },
      keyframes: {
        expand: {
          '0%': { maxHeight: '0' },
          '100%': { maxHeight: '300px' },
        },
        collapse: {
          '0%': { maxHeight: '300px' },
          '100%': { maxHeight: '0' },
        },
      },
      animation: {
        expand: 'expand 0.5s ease-out forwards',
        collapse: 'collapse 0.5s ease-in forwards',
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
}

