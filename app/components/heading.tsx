import type { HTMLAttributes } from "react"

// Shared section heading. Locks in the site's H1 visual treatment in one place
// so future tweaks (size, weight, tracking, spacing) ripple everywhere. Extra
// utilities (scroll-mt-*, hidden, etc.) can be merged via `className`.
export default function Heading({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={`font-semibold text-2xl mb-1 tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h1>
  )
}
