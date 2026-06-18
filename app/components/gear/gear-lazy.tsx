"use client"

import { useEffect, useState, type ComponentType } from "react"
import { useReducedMotion } from "framer-motion"
import type { GearItem } from "./items"

// Static skeleton: card chrome (name / desc / category + accent hint) with no
// three.js. Shown while the (heavy) grid chunk downloads, so layout + text are
// present immediately and nothing 3D appears half-painted.
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

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Disclosure that gates the entire WebGL grid behind a user click. Until the
// user opens it, the three.js chunk is never fetched and no canvas mounts — so
// the page never pays for (or repaints from) the 3D grid unless asked.
//
// Open/close uses the CSS grid-rows 0fr↔1fr trick (the sizing wrapper stays
// mounted so the row can transition both ways) — no JS height measuring, so
// none of the height:auto jitter. The heavy content only mounts while open and
// unmounts after the collapse finishes, freeing the canvases' GPU contexts.
export default function GearLazy({ items }: { items: GearItem[] }) {
  const [open, setOpen] = useState(false)
  // Keeps the content in the DOM through the collapse animation, then drops it.
  const [render, setRender] = useState(false)
  // Manual lazy import so we can show the text Skeleton while the (heavy) chunk
  // downloads, then swap in the real grid where each card runs its own loader.
  const [Grid, setGrid] =
    useState<ComponentType<{ items: GearItem[] }> | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (open) {
      setRender(true)
      return
    }
    const t = setTimeout(() => setRender(false), 350)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open || Grid) return
    let alive = true
    import("./gear-grid").then((m) => {
      if (alive) setGrid(() => m.default)
    })
    return () => {
      alive = false
    }
  }, [open, Grid])

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="gear-grid"
        className="group flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <span>{open ? "Hide gear" : "Show gear"}</span>
        <span className="text-neutral-400 transition-colors group-hover:text-neutral-500">
          ({items.length})
        </span>
        <Chevron open={open} />
      </button>

      <div
        id="gear-grid"
        aria-hidden={!open}
        className={`grid ${
          reduce ? "" : "transition-[grid-template-rows,opacity] duration-300 ease-out"
        } ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          {render && (
            <div className="pt-3">
              {Grid ? <Grid items={items} /> : <Skeleton items={items} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
