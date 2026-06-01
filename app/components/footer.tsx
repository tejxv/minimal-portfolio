"use client"

import { useState } from "react"

// import { LiquidLogo } from "./LiquidLogo"
import SpotifyNowPlaying from "./SpotifyNowPlaying"

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}
const socialLinks = [
  { name: "twitter", url: "https://x.com/tejxv" },
  { name: "linkedin", url: "https://www.linkedin.com/in/tejas-u/" },
  { name: "read.cv", url: "https://read.cv/tejxv" },
  { name: "github", url: "https://github.com/tejxv" },
  { name: "figma", url: "https://figma.com/@tejas" },
  { name: "behance", url: "https://behance.com/tejxv" },
]

export default function Footer() {
  // read.cv shut down — clicking memorializes it in place instead of navigating
  // to the dead domain.
  const [ripped, setRipped] = useState(false)

  const handleReadCvClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setRipped(true)
  }

  return (
    <footer className="mb-16">
      <SpotifyNowPlaying />
      <ul className="font-sm mt-8 flex flex-col text-neutral-500 md:flex-row md:space-y-0">
        {socialLinks.map((link) => (
          <li key={link.name}>
            {link.name === "read.cv" ? (
              <a
                className="flex px-2 py-1 items-center rounded-full group transition-all hover:shadow-sm hover:text-white hover:bg-blue-500"
                rel="noopener noreferrer"
                target="_blank"
                href={link.url}
                onClick={handleReadCvClick}
                aria-label={ripped ? "rip read.cv" : "read.cv"}
              >
                <ArrowIcon />
                {/* Width-morph via the grid 0fr↔1fr trick: the old label
                    collapses to zero width while the new one expands, so the
                    pill smoothly grows from "read.cv" to "rip…" with no reserved
                    dead space at rest. min-w-0 + overflow-hidden let the inner
                    text be clipped as the track shrinks. Opacity + blur ride
                    along for a soft crossfade. */}
                <span className="ml-2 flex items-center">
                  <span
                    aria-hidden={ripped}
                    className={`grid transition-[grid-template-columns,opacity,filter] duration-500 ease-out ${
                      ripped
                        ? "grid-cols-[0fr] opacity-0 blur-[3px]"
                        : "grid-cols-[1fr] opacity-100 blur-0"
                    }`}
                  >
                    <span className="min-w-0 overflow-hidden whitespace-nowrap">
                      read.cv
                    </span>
                  </span>
                  <span
                    aria-hidden={!ripped}
                    className={`grid transition-[grid-template-columns,opacity,filter] duration-500 ease-out ${
                      ripped
                        ? "grid-cols-[1fr] opacity-100 blur-0"
                        : "grid-cols-[0fr] opacity-0 blur-[3px]"
                    }`}
                  >
                    <span className="min-w-0 overflow-hidden whitespace-nowrap">
                      rip read.cv 🥀💔
                    </span>
                  </span>
                </span>
              </a>
            ) : (
              <a
                className="flex px-2 py-1 items-center rounded-full group transition-all hover:shadow-sm hover:text-white hover:bg-blue-500"
                rel="noopener noreferrer"
                target="_blank"
                href={link.url}
              >
                <ArrowIcon />
                <p className="ml-2 transition-transform">{link.name}</p>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p className="my-8 text-neutral-500">
        © {new Date().getFullYear()} Designed and Developed by Tejas <br></br>
        <span className="text-neutral-400 text-sm">
          Built with Next.js and hosted on Vercel
        </span>
      </p>
      {/* <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <LiquidLogo
          image="/icons/apple.svg" // URL or path to your logo image
          // Optional: override default shader parameters:
          patternScale={3}
          refraction={0.02}
          edge={0.5}
          patternBlur={0.007}
          liquid={0.08}
          speed={0.4}
          style={{ width: "100%", height: "auto" }}
        />
      </div> */}
    </footer>
  )
}
