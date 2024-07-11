"use client"
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import LoadingSkeleton from "./LoadingSkeleton"
import Image from "next/image"

const images = [
  { src: "/slider-images/P1.png", width: 300, height: 1000 },
  { src: "/slider-images/P2.png", width: 400, height: 1000 },
  { src: "/slider-images/P3.png", width: 1000, height: 1000 },
  { src: "/slider-images/P4.png", width: 600, height: 1000 },
  { src: "/slider-images/P5.png", width: 700, height: 1000 },
  { src: "/slider-images/P6.png", width: 800, height: 1000 },
  { src: "/slider-images/P7.png", width: 900, height: 1000 },
  { src: "/slider-images/P8.png", width: 1000, height: 1000 },
  { src: "/slider-images/P9.png", width: 1100, height: 1000 },
  { src: "/slider-images/P10.png", width: 1200, height: 1000 },
  { src: "/slider-images/P11.png", width: 1300, height: 1000 },
  { src: "/slider-images/P12.png", width: 1400, height: 1000 },
  { src: "/slider-images/P13.png", width: 11000, height: 1000 },
  { src: "/slider-images/P14.png", width: 1600, height: 1000 },
  { src: "/slider-images/P15.png", width: 1700, height: 1000 },
  { src: "/slider-images/P16.png", width: 1800, height: 1000 },
  { src: "/slider-images/P17.png", width: 1900, height: 1000 },
  { src: "/slider-images/P18.png", width: 2000, height: 1000 },
  { src: "/slider-images/P19.png", width: 2100, height: 1000 },
  { src: "/slider-images/P20.png", width: 2200, height: 1000 },
  { src: "/slider-images/P21.png", width: 2300, height: 1000 },
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
        {images.map(({ src, width, height }, index) => (
          <div
            key={index}
            className="embla__slide flex justify-center items-center h-full"
            style={{ transform: `rotate(${getRandomRotation()}deg)` }}
          >
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              loading="lazy"
              className="rounded-xl h-full w-auto shadow-none hover:shadow-sm cursor-ew-resize active:cursor-grabbing border border-gray-200 max-h-full"
              style={{ objectFit: "cover" }}
              width={width}
              height={height}
              sizes="100vw"
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
