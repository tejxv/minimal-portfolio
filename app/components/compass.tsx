// Compass icon. The needle spins 360° when an ancestor with `.compass-host` is
// hovered — animation lives in global.css (transform + spring-ish bezier), so
// this stays a plain dependency-free SVG (no framer-motion, no client hook).
export default function Compass({
  size = 18,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon
        data-compass-needle
        points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
      />
    </svg>
  )
}
