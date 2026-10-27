/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./*.js",
    "./**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0F4C81', light: '#1A6BB5', dark: '#0A3660' },
        secondary: { DEFAULT: '#00B4D8', light: '#48CAE4', dark: '#0096B7' },
        accent: { DEFAULT: '#FF6B35', light: '#FF8C5A', dark: '#E05520' },
        dark: { DEFAULT: '#0A1628', lighter: '#111D35' },
      },
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
