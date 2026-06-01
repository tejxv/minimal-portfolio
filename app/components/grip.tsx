import type { CSSProperties } from "react"

// Visual ripple order — each dot's --i drives its animation-delay so the pulse
// travels corner-to-corner. Matches the framer "custom={index}" stagger, but
// dependency-free: the actual animation lives in global.css (.grip-host:hover).
const circles = [
  { cx: 19, cy: 5 },
  { cx: 12, cy: 5 },
  { cx: 19, cy: 12 },
  { cx: 5, cy: 5 },
  { cx: 12, cy: 12 },
  { cx: 19, cy: 19 },
  { cx: 5, cy: 12 },
  { cx: 12, cy: 19 },
  { cx: 5, cy: 19 },
]

export default function Grip({
  size = 16,
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
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {circles.map((c, i) => (
        <circle
          key={`${c.cx}-${c.cy}`}
          cx={c.cx}
          cy={c.cy}
          r="1.6"
          data-grip-dot
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  )
}
