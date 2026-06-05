"use client"

import GearCard from "./gear-card"
import type { GearItem } from "./items"

// Loaded lazily by gear-lazy.tsx (so three.js stays out of First Load and only
// downloads when the section nears the viewport). Each card owns its own canvas
// and only renders while on-screen (frameloop freeze), so off-screen cards cost
// ~nothing and never unmount → no scroll pop.
export default function GearGrid({ items }: { items: GearItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
      {items.map((item) => (
        <GearCard key={item.id} item={item} />
      ))}
    </div>
  )
}
