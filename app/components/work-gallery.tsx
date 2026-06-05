"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import WorkGrid from "./work-grid"
import Grip from "./grip"
import type { Work } from "app/work/works"
import { galleryOpen, galleryClose } from "app/lib/sounds"

const ANIM_MS = 400

export default function WorkGallery({ items }: { items: Work[] }) {
  const [open, setOpen] = useState(false)
  // `mounted`: DOM present (true while open OR exiting). `visible`: class flag
  // driving the blur/opacity transition. Two-step so we can rAF the class swap
  // on enter and delay unmount on exit, giving CSS time to interpolate.
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Double rAF: first frame paints DOM with `visible=false` (blur-none /
      // opacity-0), second flips `visible=true` so the browser interpolates
      // between the two paints. A single rAF batches with the initial render
      // and the transition skips straight to the final state.
      let raf2 = 0
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true))
      })
      return () => {
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
      }
    }
    setVisible(false)
    if (!mounted) return
    const t = setTimeout(() => setMounted(false), ANIM_MS)
    return () => clearTimeout(t)
  }, [open, mounted])

  // Toggle body attribute driving the page-content blur (see global.css).
  // Tied to `visible` so blur enters/exits with the same timing as the overlay.
  useEffect(() => {
    if (visible) document.body.dataset.galleryOpen = "true"
    else delete document.body.dataset.galleryOpen
  }, [visible])

  // Deep-link: if the page loads at /gallery, open the overlay automatically.
  // Runs once after hydration so SSR + client first-render agree (open=false),
  // then we flip on the next tick.
  useEffect(() => {
    if (window.location.pathname === "/gallery") setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return

    // History sync. If user arrived via a link to /gallery, leave history alone
    // — we'll just rewrite to "/" on close so the URL clears without piling up
    // entries. Otherwise push /gallery so back-button closes the overlay.
    const startedAtGallery = window.location.pathname === "/gallery"
    const prev = startedAtGallery
      ? "/"
      : window.location.pathname + window.location.search
    const prevRef = { value: prev }
    try {
      if (!startedAtGallery) window.history.pushState({}, "", "/gallery")
    } catch (e) {
      // ignore
    }

    const onPop = () => setOpen(false)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // If an inner gallery item is open, do not close the gallery here —
        // the item overlay handles Escape first and clears this flag when it
        // closes. Check the body dataset to determine if an item is open.
        if (document.body.dataset.galleryItemOpen === "true") return
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKey)
    window.addEventListener("popstate", onPop)
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    const prevGutter = html.style.scrollbarGutter
    html.style.overflow = "hidden"
    // Override the site-wide `scrollbar-gutter: stable` while locked. With the
    // html scrollbar hidden, a stable gutter reserves an empty strip on the
    // right — the overlay's own scrollbar then sits inset from the edge (the
    // visible gap). `auto` drops the reserve so the gallery is flush right.
    html.style.scrollbarGutter = "auto"
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("popstate", onPop)
      // restore previous url without adding a history entry
      try {
        window.history.replaceState({}, "", prevRef.value)
      } catch (e) {
        // ignore
      }
      html.style.overflow = prevOverflow
      html.style.scrollbarGutter = prevGutter
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); galleryOpen() }}
        className="grip-host inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
      >
        <Grip size={16} />
        Gallery
      </button>
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-gallery-overlay
            style={{
              transitionDuration: `${ANIM_MS}ms`,
              transitionProperty: "background-color, opacity",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className={`gallery-scroll fixed inset-0 z-50 overflow-y-auto p-4 ${
              visible
                ? "bg-neutral-100 opacity-100 sm:bg-neutral-100/10"
                : "pointer-events-none bg-neutral-100/0 opacity-0"
            }`}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => { setOpen(false); galleryClose() }}
              className="fixed bottom-6 left-1/2 z-10 grid size-14 md:size-10 -translate-x-1/2 cursor-pointer place-items-center rounded-full bg-neutral-200/80 text-neutral-500 backdrop-blur transition-colors hover:bg-neutral-300 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:translate-x-0"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="mx-auto max-w-5xl px-4 py-16">
              <WorkGrid items={items} />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
