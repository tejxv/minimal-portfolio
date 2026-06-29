"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CharItem {
  char: string
  key: string
}

// Explicit mapping of characters to keep common letters ("Design", "e", "r") in motion
const designEngineerChars: CharItem[] = [
  { char: "D", key: "d-1" },
  { char: "e", key: "e-1" },
  { char: "s", key: "s-1" },
  { char: "i", key: "i-1" },
  { char: "g", key: "g-1" },
  { char: "n", key: "n-1" },
  { char: " ", key: "space-1" },
  { char: "E", key: "E-1" },
  { char: "n", key: "n-2" },
  { char: "g", key: "g-2" },
  { char: "i", key: "i-2" },
  { char: "n", key: "n-3" },
  { char: "e", key: "e-2" },
  { char: "e", key: "e-3" },
  { char: "r", key: "r-1" },
]

const productDesignerChars: CharItem[] = [
  { char: "P", key: "P-1" },
  { char: "r", key: "r-2" },
  { char: "o", key: "o-1" },
  { char: "d", key: "d-2" },
  { char: "u", key: "u-1" },
  { char: "c", key: "c-1" },
  { char: "t", key: "t-1" },
  { char: " ", key: "space-2" },
  { char: "D", key: "d-1" },
  { char: "e", key: "e-1" },
  { char: "s", key: "s-1" },
  { char: "i", key: "i-1" },
  { char: "g", key: "g-1" },
  { char: "n", key: "n-1" },
  { char: "e", key: "e-3" },
  { char: "r", key: "r-1" },
]

const titlesList = [designEngineerChars, productDesignerChars]

export default function Header() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % titlesList.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const renderAnimatedTitle = () => {
    const currentChars = titlesList[index]
    return (
      <motion.h3
        layout
        className="ml-2 text-xl text-neutral-400 tracking-tight flex flex-row items-baseline select-none"
      >
        <AnimatePresence mode="sync" initial={false}>
          {currentChars.map((item) => (
            <motion.span
              key={item.key}
              layout
              initial={{ opacity: 0, filter: "blur(4px)", width: 0 }}
              animate={{ opacity: 1, filter: "blur(0px)", width: "auto" }}
              exit={{ opacity: 0, filter: "blur(4px)", width: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.7,
              }}
              className="inline-block whitespace-pre overflow-hidden"
            >
              {item.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.h3>
    )
  }

  return (
    <>
      <div
        data-reveal
        className="mt-4 sm:mt-64 flex justify-between mx-auto max-w-xl flex-row align-center items-baseline w-full"
      >
        <Link href="/">
          {/* Both font variants live in the SAME grid cell (col/row-start-1),
              so the cell always sizes to the WIDER one (wasted) — swapping
              fonts on hover can't reflow siblings. We cross-fade opacity
              instead of toggling font-family on the live text. */}
          <div className="group/name grid h-16 items-baseline">
            <div className="col-start-1 row-start-1 flex flex-row items-baseline blur-0 transition-[opacity,filter] duration-100 group-hover/name:opacity-0 group-hover/name:blur-[2px]">
              <h1 className="mb-8 text-2xl font-semibold tracking-tight">
                Tejas
              </h1>
              {renderAnimatedTitle()}
            </div>
            <div
              aria-hidden="true"
              className="col-start-1 row-start-1 flex flex-row items-baseline font-wasted opacity-0 blur-[2px] transition-[opacity,filter] duration-200 group-hover/name:opacity-100 group-hover/name:blur-0"
            >
              <h1 className="mb-8 text-2xl font-semibold tracking-tight">
                Tejas
              </h1>
              {renderAnimatedTitle()}
            </div>
          </div>
        </Link>
        <a
          href="/assets/Tejas_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="text-neutral-400 cursor-pointer group-hover:text-neutral-900">
            Resume{" "}
            <span className="border rounded-lg group-hover:bg-neutral-200 font-medium text-sm py-0.5 px-1.5">
              PDF
            </span>
          </div>
        </a>
      </div>
    </>
  )
}
