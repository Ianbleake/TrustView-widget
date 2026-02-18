module.exports = {
  content: [
    "./test.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],  
  theme: {
    extend: {
      colors: {
        primary: "var(--tv-primary)",
      },
      borderRadius: {
        widget: "var(--tv-radius)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
}
