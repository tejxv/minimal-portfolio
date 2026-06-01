import localFont from "next/font/local"

// Open Runde — self-hosted via `next/font/local` so Next can subset, preload,
// and emit a single CSS variable. woff2 only (covers every modern browser; the
// woff fallback would just bloat the bundle). `display: swap` avoids invisible
// text while the font loads. The `--font-open-runde` variable is wired into
// Tailwind's `fontFamily.sans` in tailwind.config.js, so every default
// `font-sans` class (including the body default) picks it up automatically.
// WastedYear — display/accent face. Single weight. Exposed as
// `--font-wasted-year`; use in Tailwind via the arbitrary `font-[...]` syntax,
// e.g. className="font-[family-name:var(--font-wasted-year)]". Not added to
// the default sans stack so it never becomes the body font by accident.
export const wastedYear = localFont({
  src: [
    {
      path: "./fonts/WastedYear.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-wasted-year",
  display: "swap",
})

export const openRunde = localFont({
  src: [
    {
      path: "./fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
})
