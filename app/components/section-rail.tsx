"use client"

import { useEffect, useState } from "react"

type Section = { id: string; label: string }

const SECTIONS: Section[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Gallery" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
]

export default function SectionRail() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)

  // Active section via a passive scroll listener. Active = the last section
  // whose top has crossed a line ~35% down the viewport. The work is 4 cheap
  // getBoundingClientRect reads done directly in a passive handler (time-gated
  // to ~once per 100ms so fast scroll bursts don't over-read); idle cost is
  // zero. Plain geometry — no IntersectionObserver rootMargin edge cases.
  useEffect(() => {
    let last = 0

    const pickActive = () => {
      const line = window.innerHeight * 0.35
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top - 1 <= line) current = s.id
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      const now = Date.now()
      if (now - last < 100) return
      last = now
      pickActive()
    }

    pickActive() // initial state
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <nav
      aria-label="Page sections"
      className="group fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1.5 pr-3 transition-[gap] duration-300 ease-out group-hover:gap-3 lg:flex"
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            aria-label={section.label}
            aria-current={isActive ? "true" : undefined}
            className="relative flex h-3 items-center justify-end outline-none transition-[height] duration-300 ease-out group-hover:h-5"
          >
            {/* Label — absolutely positioned so it never affects layout; hidden
                until the rail is hovered, then slides in (transform+opacity). */}
            <span
              className={`pointer-events-none absolute right-8 whitespace-nowrap rounded-md border border-neutral-200 bg-white/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur transition-all duration-300 ease-out [transition-property:transform,opacity] translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                isActive ? "text-neutral-900" : "text-neutral-500"
              }`}
            >
              {section.label}
            </span>
            {/* Tick — active one is longer + darker. Animates width/colour via
                transform-friendly props only. */}
            <span
              className={`h-0.5 rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? "w-6 bg-neutral-900"
                  : "w-3.5 bg-neutral-300 group-hover:w-5 group-hover:bg-neutral-400"
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}
