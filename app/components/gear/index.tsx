import dynamic from "next/dynamic"
import Heading from "../heading"
import GearCard from "./gear-card"
import { gearItems, gearIntro } from "./items"

// Dev-only live tuning panel — compiles to a no-op in production so it never
// ships. Load the real panel lazily (client-only) outside prod.
const DebugPanel =
  process.env.NODE_ENV === "production"
    ? () => null
    : dynamic(() => import("./debug-panel"), { ssr: false })

// "Gear" / "stuff i use" — data-driven grid of 3D product cards. Server
// component: it only emits markup + the item list; each GearCard is the client
// island that owns its lazy R3F canvas.
export default function Gear() {
  return (
    <section>
      <Heading>Gear</Heading>
      <p className="mb-0 text-neutral-500">{gearIntro}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
        {gearItems.map((item) => (
          <GearCard key={item.id} item={item} />
        ))}
      </div>
      <DebugPanel />
    </section>
  )
}
