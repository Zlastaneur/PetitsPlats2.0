/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
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
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
}

