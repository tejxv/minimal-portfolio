/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // `--font-open-runde` is emitted by next/font/local in app/fonts.ts and
        // attached to <html>. Putting it at the head of the default sans stack
        // means every `font-sans` utility (and the body fallback) picks it up
        // automatically — no per-element class needed.
        sans: [
          "var(--font-open-runde)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // Display/accent face. `--font-wasted-year` is emitted in app/fonts.ts
        // and attached to <html> in layout.tsx. Use via `font-wasted` utility.
        wasted: ["var(--font-wasted-year)", "serif"],
      },
    },
  },
  plugins: [],
}