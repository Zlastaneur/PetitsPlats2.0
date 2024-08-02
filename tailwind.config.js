/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD15B",
      },
      fontFamily: {
        'anton': ["Anton"],
        'manrope': ["Manrope"],
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
}

