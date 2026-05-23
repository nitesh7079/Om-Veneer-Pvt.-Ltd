/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#281e18",
        "navy-light": "#3a2c22",
        "navy-lighter": "#4c3a2d",
        orange: "#B68D53",
        "orange-light": "#C9A268",
        "text-main": "#334155",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px rgba(10, 25, 47, 0.15)",
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
      }
    },
  },
  plugins: [],
};
plugins: [],
};
