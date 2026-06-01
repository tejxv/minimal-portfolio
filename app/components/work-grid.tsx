"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import dynamic from "next/dynamic"
import Image from "next/image"
import type { Work } from "app/work/works"

// video.js player + its ~41KB skin css only load once a video lightbox opens.
const LightboxVideo = dynamic(() => import("./lightbox-video"), { ssr: false })

// Shared name handed between the clicked grid media and the overlay media so the
// browser morphs one into the other on open/close (View Transitions API). Only
// ONE element may carry this name at any snapshot — see open()/close() below.
const VT_NAME = "active-lightbox-image"

const supportsViewTransition = () =>
  typeof document !== "undefined" && "startViewTransition" in document

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Decode the full-res image before the morph runs. Without this the first open
// captures an undecoded new-snapshot and flickers; once cached, opens are
// instant. Videos skip this (resolve immediately). Resolves either way so a
// failed load never blocks the transition.
const preload = (item: Work) =>
  new Promise<void>((resolve) => {
    if (item.kind === "video") return resolve()
    const img = new window.Image()
    img.src = item.src
    img.decode().then(
      () => resolve(),
      () => resolve()
    )
  })

// Grid video tile: autoplays muted+looped, pauses when scrolled off-screen
// (perf — many videos on one page). No loader — vanilla browser loading.
function GridVideo({
  item,
  index,
  refCallback,
  faded,
}: {
  item: Work
  index: number
  refCallback: (el: HTMLElement | null) => void
  faded: boolean
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Pause off-screen, resume on-screen. autoPlay handles the first play; this
  // just stops decoding work for tiles the user can't see.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {})
          else el.pause()
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={(el) => {
        videoRef.current = el
        refCallback(el)
      }}
      src={item.src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-label={item.caption || `Work ${index + 1}`}
      className={`h-auto w-full transition-opacity duration-300 ${
        faded ? "opacity-0" : "opacity-100"
      }`}
    />
  )
}

export default function WorkGrid({ items }: { items: Work[] }) {
  const [index, setIndex] = useState(-1)
  const open = index >= 0
  const gridRefs = useRef<Array<HTMLElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  // Mirror of `index` for event handlers that close over a stale value.
  const indexRef = useRef(-1)
  indexRef.current = index

  // OPEN: the grid media carries the name for the OLD snapshot; after the state
  // flush the overlay media (named via inline style) carries it for the NEW
  // snapshot, so the browser tweens grid -> overlay. Clearing the grid name in
  // the same callback guarantees the name is unique at new-snapshot time.
  const openAt = async (i: number) => {
    const el = gridRefs.current[i]
    if (!supportsViewTransition() || prefersReducedMotion() || !el) {
      setIndex(i)
      return
    }
    await preload(items[i])
    el.style.viewTransitionName = VT_NAME
    const transition = document.startViewTransition(() => {
      flushSync(() => setIndex(i))
      el.style.viewTransitionName = ""
    })
    transition.finished.finally(() => {
      el.style.viewTransitionName = ""
    })
  }

  // CLOSE: reverse. Old snapshot = overlay media; after the flush the overlay
  // unmounts and the grid media of the item we ended on takes the name for the
  // new snapshot, morphing overlay -> grid.
  const close = useCallback(() => {
    const i = indexRef.current
    const el = gridRefs.current[i]
    if (!supportsViewTransition() || prefersReducedMotion() || !el) {
      setIndex(-1)
      return
    }
    const transition = document.startViewTransition(() => {
      flushSync(() => setIndex(-1))
      el.style.viewTransitionName = VT_NAME
    })
    transition.finished.finally(() => {
      el.style.viewTransitionName = ""
    })
  }, [])

  // PREV/NEXT: the overlay media keeps its name across the index change, so the
  // single named element morphs old -> new.
  const go = useCallback(
    async (dir: number) => {
      const next = (indexRef.current + dir + items.length) % items.length
      const mutate = () => setIndex(next)
      if (!supportsViewTransition() || prefersReducedMotion()) {
        mutate()
        return
      }
      await preload(items[next])
      document.startViewTransition(() => flushSync(mutate))
    },
    [items]
  )

  // Keyboard + scroll lock while open.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
      } else if (e.key === "ArrowRight") {
        go(1)
      } else if (e.key === "ArrowLeft") {
        go(-1)
      }
    }

    document.addEventListener("keydown", onKey)
    overlayRef.current?.focus()

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    const prevGutter = html.style.scrollbarGutter
    html.style.overflow = "hidden"
    html.style.scrollbarGutter = "stable"

    return () => {
      document.removeEventListener("keydown", onKey)
      html.style.overflow = prevOverflow
      html.style.scrollbarGutter = prevGutter
      triggerRef.current?.focus()
    }
  }, [open, close, go])

  const active = open ? items[index] : null

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget
              openAt(i)
            }}
            aria-label={
              item.caption ? `View: ${item.caption}` : `View item ${i + 1}`
            }
            className="group relative mb-3 block w-full cursor-default break-inside-avoid overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 transition-transform duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {item.kind === "video" ? (
              <GridVideo
                item={item}
                index={i}
                faded={index === i}
                refCallback={(el) => {
                  gridRefs.current[i] = el
                }}
              />
            ) : (
              <Image
                ref={(el) => {
                  gridRefs.current[i] = el
                }}
                src={item.src}
                alt={item.caption || `Work ${i + 1}`}
                width={item.width}
                height={item.height}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                className={`h-auto w-full transition-opacity duration-300 ${
                  index === i ? "opacity-0" : "opacity-100"
                }`}
              />
            )}
            {item.caption && (
              <span className="pointer-events-none absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Media viewer"}
          tabIndex={-1}
          onClick={close}
          className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-black/90 p-4 outline-none sm:p-8"
        >
          {active.kind === "video" ? (
            <LightboxVideo
              src={active.src}
              width={active.width}
              height={active.height}
              vtName={VT_NAME}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={active.src}
              alt={active.caption || `Work ${index + 1}`}
              width={active.width}
              height={active.height}
              unoptimized
              priority
              style={{ viewTransitionName: VT_NAME }}
              className="h-auto max-h-[90vh] w-auto max-w-[94vw] rounded-xl object-contain"
            />
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous item"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
                className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label="Next item"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
                className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
            className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
          >
            <CloseIcon />
          </button>

          {active.caption && (
            <p className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit max-w-[90%] rounded-full bg-black/50 px-4 py-1.5 text-center text-sm text-white backdrop-blur">
              {active.caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
