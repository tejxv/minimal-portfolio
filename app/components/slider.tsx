"use client"

import React from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import Image from "next/image"

const images = [
  "/slider-images/blogpro-onboarding.png",
  "/slider-images/blogpro-onboarding.png",
  "/slider-images/blogpro-onboarding.png",
  "/slider-images/blogpro-onboarding.png",
  "/slider-images/blogpro-onboarding.png",
  "/slider-images/blogpro-onboarding.png",
  "/slider-images/blogpro-onboarding.png",
]

export default function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true },
    [AutoScroll({ speed: 0.8, stopOnInteraction: false })],
    [WheelGesturesPlugin()]
  )

  const getRandomRotation = () => {
    const min = -1
    const max = 1
    return Math.random() * (max - min) + min
  }

  return (
    <div
      className="embla mx-auto mb-10 max-w-full rounded-lg border-neutral-200 h-[200px] md:h-[440px]"
      ref={emblaRef}
    >
      <div className="embla__container h-full">
        {images.map((src, index) => (
          <div
            key={index}
            className="embla__slide flex justify-center items-center h-full"
            style={{ transform: `rotate(${getRandomRotation()}deg)` }}
          >
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              width={400}
              height={400}
              className="rounded-xl aspect-square shadow-sm border border-gray-200"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
