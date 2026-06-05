// Data-driven gear cards. Items with a `model` render a real GLB via R3F; the
// rest render a lightweight procedural primitive keyed by `shape` so every card
// stays 3D and consistent (no flat/3D mix). Drop a compressed .glb in
// public/models and point `model.src` at it to promote any card to a real model.

export type GearCategory =
  | "Computer"
  | "Phone"
  | "Camera"
  | "Audio"
  | "Peripherals"
  | "Display"
  | "Console"

export type GearShape = "display" | "keyboard" | "mouse" | "camera" | "headphones"

export type GearItem = {
  id: string
  name: string
  description: string
  category: GearCategory
  accent: string // hex, drives the soft glow + primitive tint
  model?: {
    src: string
    /** uniform scale applied after auto-centering */
    scale: number
    /** vertical nudge so the model sits centered in frame */
    y?: number
    /** resting rotation (radians) for a flattering 3/4 angle */
    rotation?: [number, number, number]
    /** per-card light multiplier — lift a model that reads too dark (default 1) */
    light?: number
  }
  shape?: GearShape
  /** "showcase" spin: linger when the resting/front face points at the camera,
   *  speed up through the back. Otherwise rotation is a constant slow spin. */
  showcase?: boolean
}

export const gearItems: GearItem[] = [
  {
    id: "macbook",
    name: "MacBook Pro 14″",
    description: "M3 Pro — the everything machine.",
    category: "Computer",
    accent: "#9ca3af",
    model: {
      src: "/models/macbook.glb",
      scale: 1,
      y: -0.1,
      rotation: [0.05, -0.5, 0],
    },
  },
  {
    id: "iphone",
    name: "iPhone 16 Pro",
    description: "Pocket camera that also rings.",
    category: "Phone",
    accent: "#c4b5a3",
    model: {
      src: "/models/iphone.glb",
      scale: 1,
      y: 0,
      rotation: [0.1, -0.6, 0],
    },
  },
  {
    id: "studio-display",
    name: "MSI MD271UL 4K",
    description: "Because Studio Display expensive.",
    category: "Display",
    accent: "#8b9bb4",
    shape: "display",
    model: { src: "/models/studio-display.glb", scale: 1 },
  },
  {
    id: "keychron",
    name: "Keychron Q1",
    description: "Thocky keys, zero regrets.",
    category: "Peripherals",
    accent: "#6b7280",
    shape: "keyboard",
    model: { src: "/models/keychron.glb", scale: 1 },
    showcase: true,
  },
  {
    id: "mx-master",
    name: "MX Master 3S",
    description: "Mouse that just works.",
    category: "Peripherals",
    accent: "#5b6470",
    shape: "mouse",
    model: { src: "/models/mx-master.glb", scale: 1, light: 1.8 },
  },
  {
    id: "ps5",
    name: "PlayStation 5",
    description: "Where deadlines go to die.",
    category: "Console",
    accent: "#6b7280",
    model: { src: "/models/ps5.glb", scale: 1 },
  },
]

// Intro line options — swap freely.
export const gearIntro =
  "The stuff I use to make stuff."

export const gearIntroAlternatives = [
  "the hardware i reach for when ideas need to become real.",
  "a small pile of well-loved machines i'd be lost without.",
  "objects on my desk that earn their keep every day.",
]
