import dynamic from "next/dynamic"
import Heading from "../heading"
import GearLazy from "./gear-lazy"
import { gearItems, gearIntro } from "./items"

// Dev-only live tuning panel — compiles to a no-op in production so it never
// ships. Load the real panel lazily (client-only) outside prod.
const DebugPanel =
  process.env.NODE_ENV === "production"
    ? () => null
    : dynamic(() => import("./debug-panel"), { ssr: false })

// "Gear" / "stuff i use" — data-driven grid of 3D product cards. Server
// component: emits the heading/intro; GearGrid is the client island that owns
// the single shared WebGL canvas all cards draw into.
export default function Gear() {
  return (
    <section>
      <Heading>Gear</Heading>
      <p className="mb-0 text-neutral-500">{gearIntro}</p>
      <GearLazy items={gearItems} />
      <DebugPanel />
    </section>
  )
}
