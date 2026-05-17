export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        glowny: {
          50: "#ecf8ed",
          100: "#c7f2c0",
          200: "#9aeba0",
          300: "#72e582",
          400: "#41dd5f",
          500: "#2fd352",
          600: "#28b24a",
          700: "#1e8d38",
          800: "#156b2b",
          900: "#0f471d",
        },
        tlo: "#f4faff",
        akcent: {
          50: "#eff7ec",
          100: "#d2ebd1",
          200: "#afd9aa",
          300: "#84c17b",
          400: "#52a64c",
          500: "#0f6116",
          600: "#0e5913",
          700: "#0c4e11",
          800: "#093b0d",
          900: "#072d0a",
        },
      },
    },
  },
  plugins: [],
};
