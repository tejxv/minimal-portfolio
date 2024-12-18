"use client"
import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
import LoadingSkeleton from "./LoadingSkeleton"
import Image from "next/image"

const images = [
  { src: "/slider-images/P0.png", width: 1920, height: 1080, subtitle: "Blog design and layout for BlogPro" },
  { src: "/slider-images/P24.png", width: 1860, height: 1860, subtitle: "iOS Music Sharing App" },
  { src: "/slider-images/P1.png", width: 1246, height: 1000, subtitle: "Revenue dashboard design" },
  { src: "/slider-images/P22.png", width: 1920, height: 1000, subtitle: "Blinkit's navigation exploration" },
  { src: "/slider-images/P23.png", width: 1080, height: 1080, subtitle: "Blinkit's navigation exploration" },
  { src: "/slider-images/P2.png", width: 1600, height: 1000, subtitle: "Hero redesign for pureplate" },
  { src: "/slider-images/P3.png", width: 1600, height: 1000, subtitle: "If Spotlight was a third party tool" },
  { src: "/slider-images/P4.png", width: 1600, height: 1000, subtitle: "If Terminal was a third party tool" },
  { src: "/slider-images/P5.png", width: 1000, height: 1000, subtitle: "Emotion tracking widget" },
  { src: "/slider-images/P6.png", width: 1213, height: 1000, subtitle: "Font selection for BlogPro" },
  { src: "/slider-images/P7.png", width: 1614, height: 1000, subtitle: "Boeing website concept" },
  { src: "/slider-images/P8.png", width: 1000, height: 1000, subtitle: "Revenue dashboard design" },
  { src: "/slider-images/P9.png", width: 1600, height: 1000, subtitle: "Landing page for Hilton International" },
  { src: "/slider-images/P10.png", width: 1600, height: 1000, subtitle: "Boeing's website redesign concept" },
  { src: "/slider-images/P11.png", width: 1500, height: 1000, subtitle: "Pricing Modal for BlogPro" },
  { src: "/slider-images/P12.png", width: 1400, height: 1000, subtitle: "Pricing Modal for BlogPro" },
  { src: "/slider-images/P13.png", width: 1550, height: 1000, subtitle: "App Design for Indian art discovery" },
  { src: "/slider-images/P14.png", width: 1000, height: 1000, subtitle: "Activity Monitor Widget, figma style." },
  { src: "/slider-images/P15.png", width: 1270, height: 1000, subtitle: "Pricing Modal for BlogPro" },
  { src: "/slider-images/P16.png", width: 1800, height: 1000, subtitle: "Breadcrumb navigation for BlogPro" },
  { src: "/slider-images/P17.png", width: 1200, height: 1000, subtitle: "Social links for BlogPro" },
  { src: "/slider-images/P18.png", width: 1200, height: 1000, subtitle: "Font Selection for BlogPro" },
  { src: "/slider-images/P19.png", width: 1700, height: 1000, subtitle: "Feature pills" },
  { src: "/slider-images/P20.png", width: 1200, height: 1000, subtitle: "Widget concept for Zomato" },
  { src: "/slider-images/P21.png", width: 1300, height: 1000, subtitle: "Onboarding for BlogPro" },
]

const EmblaCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ 
    loop: true, 
    dragFree: true,
    align: 'center',
  }, [
    AutoScroll({ 
      speed: 0.5, 
      stopOnInteraction: true, 
      startDelay: 0 
    }),
    WheelGesturesPlugin(),
  ])

  const [isLoading, setIsLoading] = useState(true)
  const [opacity, setOpacity] = useState(0)
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Start fade-in after loading is complete
      setTimeout(() => setOpacity(1), 50)
    }, 1) // Simulate loading time

    return () => clearTimeout(timer)
  }, [])

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }))
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div
      className={`embla mx-auto mb-10 max-w-full rounded-lg h-[440px] transition-opacity duration-1000 ease-in-out`}
      ref={emblaRef}
      style={{ opacity }}
    >
      <div className="embla__container h-full flex items-center">
        {images.map(({ src, width, height, subtitle }, index) => (
          <div
            key={index}
            className="embla__slide flex-shrink-0 h-full flex justify-center items-center px-2"
            style={{ 
              width: 'auto',  // Allow width to adjust to content
              maxWidth: '100%' // Ensure it doesn't exceed container width
            }}
          >
            <div 
              className="relative w-full h-full cursor-grab flex items-center justify-center"
              style={{ 
                maxHeight: '440px', // Match container height
                aspectRatio: `${width}/${height}`
              }}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
                className={`absolute inset-0 object-cover rounded-xl cursor- active:cursor-grabbing border border-gray-200 
                  ${loadedImages[index] ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  transition: 'opacity 0.3s ease-in-out',
                  filter: loadedImages[index] ? 'none' : 'blur(10px)'
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                // quality={100}
                unoptimized
              />
              {subtitle && (
                <div className="absolute bottom-2 left-2 bg-black/30 backdrop-blur text-white px-2 py-1 rounded-md text-xs md:text-sm z-10">
                  {subtitle}
                </div>
              )}
            </div>
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