/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'google-blue': '#1a73e8',
        'google-blue-dark': '#1557b0',
        'google-border': '#dadce0',
        'google-text-gray': '#70757a',
        'google-gray-light': '#f1f3f4',
        'google-red': '#d93025',
      }
    },
  },
  plugins: [],
}
