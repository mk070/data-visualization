module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue color for primary actions
        secondary: '#10B981', // Green color for secondary actions
        accent: '#6366F1', // Purple for hover states
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },

  plugins: [],
};
