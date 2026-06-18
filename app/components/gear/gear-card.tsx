"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import GearCanvas from "./gear-canvas"
import type { GearItem } from "./items"

export default function GearCard({ item }: { item: GearItem }) {
  const ref = useRef<HTMLDivElement>(null)
  // inView drives the render loop (active). Wide margin starts rendering just
  // before the card scrolls in so it's never caught mid-pop.
  const inView = useInView(ref, { margin: "300px 0px" })
  // Mount the canvas the first time the card nears the viewport, then KEEP it
  // mounted. Off-screen we don't unmount (which caused the pop + reload) — we
  // just stop its frameloop via `active`.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (inView) setMounted(true)
  }, [inView])
  // Flips once this card's model (GLB or primitive) finishes resolving inside
  // the canvas — drives the per-card loader → fade-in.
  const [ready, setReady] = useState(false)
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-4 h-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: item.accent }}
      />

      <div className="relative h-72 w-full">
        {/* Accent glow backdrop — always present, so the card has color the
            instant it opens (before/while the canvas mounts). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-xl opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 45%, ${item.accent}, transparent 70%)`,
          }}
        />

        {mounted && (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <GearCanvas
              item={item}
              hovered={hovered}
              active={inView}
              onReady={() => setReady(true)}
            />
          </div>
        )}

        {/* Loader: spins over the glow until the model resolves. */}
        {mounted && !ready && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 rounded-b-lg bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent p-4 pt-10">
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
