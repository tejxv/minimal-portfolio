"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useInView, useReducedMotion } from "framer-motion"
import type { GearItem } from "./items"

// R3F is client + WebGL only — keep it out of the server bundle and load the
// three.js chunk on demand (first time any card needs it).
const GearCanvas = dynamic(() => import("./gear-canvas"), {
  ssr: false,
  loading: () => null,
})

export default function GearCard({ item }: { item: GearItem }) {
  const ref = useRef<HTMLDivElement>(null)
  // Mount the Canvas only while near the viewport; unmounting off-screen frees
  // the WebGL context so six cards never hold six live contexts at once.
  const inView = useInView(ref, { margin: "200px 0px" })
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={reduce ? undefined : { y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col rounded-none transition-shadow duration-300"
    >
      {/* soft accent glow behind the model, fades in on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-4 h-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: item.accent }}
      />

      {/* Tall canvas so the model + its contact shadow have headroom and don't
          clip at the bottom edge. */}
      <div className="relative h-72 w-full">
        {inView ? (
          <GearCanvas item={item} hovered={hovered} />
        ) : (
          // Lightweight placeholder holds layout + hints the accent before the
          // 3D chunk loads / while off-screen.
          <div
            className="h-full w-full rounded-xl opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 45%, ${item.accent}, transparent 70%)`,
            }}
          />
        )}

        {/* Label overlaid on the canvas, bottom-aligned. pointer-events-none so
            a drag started anywhere over it still reaches the 3D scene. A soft
            scrim seats the text over the model. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-lg bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent p-4 pt-10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
              {item.name}
            </h3>
            <span className="shrink-0 rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
              {item.category}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-neutral-500">{item.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
