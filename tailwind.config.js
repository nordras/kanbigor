export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx, .stories.js, .stories.tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
