"use client"
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import LoadingSkeleton from "./LoadingSkeleton"

const images = [
  "/slider-images/P1.png",
  "/slider-images/P2.png",
  "/slider-images/P3.png",
  "/slider-images/P4.png",
  "/slider-images/P5.png",
  "/slider-images/P6.png",
  "/slider-images/P7.png",
  "/slider-images/P8.png",
  "/slider-images/P9.png",
  "/slider-images/P10.png",
  "/slider-images/P11.png",
  "/slider-images/P12.png",
  "/slider-images/P13.png",
  "/slider-images/P14.png",
  "/slider-images/P15.png",
  "/slider-images/P16.png",
  "/slider-images/P17.png",
  "/slider-images/P18.png",
  "/slider-images/P19.png",
  "/slider-images/P20.png",
  "/slider-images/P21.png",
]

const EmblaCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true }, [
    AutoScroll({ speed: 0.8, stopOnInteraction: false, startDelay: 0 }),
    WheelGesturesPlugin(),
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Start fade-in after loading is complete
      setTimeout(() => setOpacity(1), 50)
    }, 1000) // Simulate loading time

    return () => clearTimeout(timer)
  }, [])

  const getRandomRotation = () => {
    const min = 0
    const max = 0
    return Math.random() * (max - min) + min
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div
      className="embla mx-auto mb-10 max-w-full rounded-lg h-[200px] md:h-[440px] transition-opacity duration-1000 ease-in-out"
      ref={emblaRef}
      style={{ opacity }}
    >
      <div className="embla__container h-full">
        {images.map((src, index) => (
          <div
            key={index}
            className="embla__slide flex justify-center items-center h-full"
            style={{ transform: `rotate(${getRandomRotation()}deg)` }}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              loading="lazy"
              className="rounded-xl h-full w-full shadow-none hover:shadow-sm cursor-ew-resize active:cursor-grabbing border border-gray-200 max-h-full"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(EmblaCarousel), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
})
