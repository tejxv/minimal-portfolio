import React from "react"

const LoadingSkeleton = () => {
  return (
    <div className="mx-auto mb-10 max-w-full rounded-lg h-[200px] md:h-[440px] bg-gray-200 animate-pulse">
      <div className="h-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        ></svg>
      </div>
    </div>
  )
}

export default LoadingSkeleton
