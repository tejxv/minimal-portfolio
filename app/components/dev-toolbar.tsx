"use client"

import dynamic from "next/dynamic"

// agentation: visual feedback toolbar for AI coding agents (dev only).
// Loaded lazily, client-side only, and gated to development so it is never
// shipped or rendered in the production bundle.
const Agentation = dynamic(
  () => import("agentation").then((m) => m.Agentation),
  { ssr: false }
)

export default function DevToolbar() {
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return <Agentation />
}
