"use client"

import { useSyncExternalStore } from "react"
import { gearItems } from "./items"

// Tiny external store for the dev-only gear debug panel. Seeded from items.ts so
// at runtime the defaults are identical to the baked config — in production the
// panel never mounts and nothing ever mutates this, so behavior matches items.ts
// exactly. Tweak live in dev, then copy values back into items.ts / gear-canvas.

export type GlobalParams = {
  cameraZ: number
  fov: number
  fitTarget: number // unit-box size GLB models are normalized to
  baseSpin: number
  hoverSpin: number
  ambient: number
  keyLight: number
  fillLight: number
  shadowY: number
  shadowOpacity: number
  shadowBlur: number
  shadowScale: number
}

export type DeviceParams = {
  scale: number
  y: number
  rotX: number
  rotY: number
  rotZ: number
}

const DEFAULT_GLOBAL: GlobalParams = {
  cameraZ: 5,
  fov: 61,
  fitTarget: 2.2,
  baseSpin: 0.35,
  hoverSpin: 1.1,
  ambient: 0.8,
  keyLight: 1.2,
  fillLight: 0.5,
  shadowY: -1.4,
  shadowOpacity: 0.32,
  shadowBlur: 2.6,
  shadowScale: 6,
}

function seedDevices(): Record<string, DeviceParams> {
  const out: Record<string, DeviceParams> = {}
  for (const it of gearItems) {
    const r = it.model?.rotation ?? [0, 0, 0]
    out[it.id] = {
      scale: it.model?.scale ?? 1,
      y: it.model?.y ?? 0,
      rotX: r[0],
      rotY: r[1],
      rotZ: r[2],
    }
  }
  return out
}

type State = { global: GlobalParams; devices: Record<string, DeviceParams> }

let state: State = { global: { ...DEFAULT_GLOBAL }, devices: seedDevices() }
const listeners = new Set<() => void>()

// Replace the snapshot ref on every change so useSyncExternalStore re-renders.
function commit() {
  state = { global: { ...state.global }, devices: { ...state.devices } }
  listeners.forEach((l) => l())
}

export const debugStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  setGlobal: (k: keyof GlobalParams, v: number) => {
    state.global[k] = v
    commit()
  },
  setDevice: (id: string, k: keyof DeviceParams, v: number) => {
    state.devices[id] = { ...state.devices[id], [k]: v }
    commit()
  },
  reset: () => {
    state = { global: { ...DEFAULT_GLOBAL }, devices: seedDevices() }
    listeners.forEach((l) => l())
  },
}

// Reactive read (re-renders on change). useFrame should read getState() directly
// instead to stay live without re-rendering.
export function useDebug(): State {
  return useSyncExternalStore(
    debugStore.subscribe,
    debugStore.getState,
    debugStore.getState
  )
}
