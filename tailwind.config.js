module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
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
