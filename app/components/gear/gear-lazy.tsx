"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { GearItem } from "./items"

// Static skeleton: card chrome (name / desc / category + accent hint) with no
// three.js. Shown server-side and until the grid nears the viewport, so layout
// + text are present immediately and nothing 3D downloads up front.
function Skeleton({ items }: { items: GearItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="relative flex flex-col">
          <div className="relative h-72 w-full">
            <div
              className="h-full w-full rounded-xl opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 45%, ${item.accent}, transparent 70%)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 z-20 rounded-b-lg bg-gradient-to-t from-neutral-50 via-neutral-50/80 to-transparent p-4 pt-10">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
                  {item.name}
                </h3>
                <span className="shrink-0 rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                  {item.category}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-neutral-500">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// The whole WebGL grid (three.js + drei + scenes) lives behind this dynamic
// import, so it forms its own async chunk and stays OUT of the page's First
// Load JS. We only fetch + mount it once the section nears the viewport.
const GearGrid = dynamic(() => import("./gear-grid"), {
  ssr: false,
})

export default function GearLazy({ items }: { items: GearItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: "600px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {near ? <GearGrid items={items} /> : <Skeleton items={items} />}
    </div>
  )
}
