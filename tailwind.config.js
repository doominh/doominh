/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
      },
      colors: {
        "chart-color-1": "#ff4757",
        "chart-color-2": "#ff6348",
        "chart-color-3": "#eccc68",
        "chart-color-4": "#9980FA",
        "chart-color-5": "#33d9b2",
        "link-hover": "#383838",
        "primary-hover":
          "color-mix(oklab, oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%, black)",

        "gray-50": "#ababab",
        "gray-100": "#969696",
        "gray-200": "#828282",
        "gray-300": "#6f6f6f",
      },
      boxShadow: {
        sideBar: "10px 0 30px -2px #D9D9D9",
        mainMenu: "0px 4px 12.100000381469727px 0px #00000040",
        tableItem: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        headerMenu: "rgba(0, 0, 0, 0.1) 0px 2px 1px 0px",
      },
      borderRadius: {
        modal: "16px",
      },
      backgroundImage: {
        "hero-auth-pattern": "url('../assets/images/background-auth.png')",
        "hero-auth-modal-pattern":
          "url('../assets/images/background-auth-modal.png')",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FF4757",
          "primary-content": "#FF4757",
          secondary: "#9980FA",
          "secondary-content": "#9980FA",
          accent: "#00E26B",
          "accent-content": "#00E26B",
          neutral: "#414141",
          "neutral-content": "#666666",
          "base-100": "#ffffff",
          "base-200": "#f7f8fa",
          "base-300": "#fbfbfb",
          "base-400": "#f8f8f8",
          "base-content": "#414141",
          "text-base": "#FF4757",
          info: "#312e91",
          success: "#009485",
          warning: "#ff9900",
          error: "#e53e3e",
          "info-content": "#5B5B5B",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
