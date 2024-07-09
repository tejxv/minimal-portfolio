"use client"

import React from "react"
import useEmblaCarousel from "embla-carousel-react"

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel()

  return (
    <div
      className="embla mx-auto mb-10 max-w-full border rounded-lg border-neutral-200 h-56"
      ref={emblaRef}
    >
      <div className="embla__container h-full">
        <div className="embla__slide flex justify-center items-center h-full">
          Slide 1
        </div>
        <div className="embla__slide flex justify-center items-center h-full">
          Slide 2
        </div>
        <div className="embla__slide flex justify-center items-center h-full">
          Slide 3
        </div>
      </div>
    </div>
  )
}
