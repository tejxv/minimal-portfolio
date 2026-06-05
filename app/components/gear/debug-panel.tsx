"use client"

import { useState } from "react"
import { gearItems } from "./items"
import {
  debugStore,
  useDebug,
  type DeviceParams,
  type GlobalParams,
} from "./debug-store"

// Dev-only. Mounted from gear/index.tsx behind a NODE_ENV check + dynamic import
// so it never ships to production. Tweak params live, then hit "Copy" to paste
// the values back into items.ts (per device) and DEFAULT_GLOBAL (gear-canvas).

type Range = [min: number, max: number, step: number]

const DEVICE_FIELDS: { key: keyof DeviceParams; label: string; range: Range }[] =
  [
    { key: "scale", label: "scale", range: [0.1, 3, 0.01] },
    { key: "y", label: "pos Y", range: [-2, 2, 0.05] },
    { key: "rotX", label: "rot X", range: [-3.2, 3.2, 0.02] },
    { key: "rotY", label: "rot Y", range: [-3.2, 3.2, 0.02] },
    { key: "rotZ", label: "rot Z", range: [-3.2, 3.2, 0.02] },
  ]

const GLOBAL_FIELDS: { key: keyof GlobalParams; label: string; range: Range }[] =
  [
    { key: "cameraZ", label: "camera Z", range: [2, 12, 0.1] },
    { key: "fov", label: "fov", range: [15, 70, 1] },
    { key: "fitTarget", label: "fit size", range: [0.5, 5, 0.05] },
    { key: "baseSpin", label: "spin", range: [0, 3, 0.01] },
    { key: "hoverSpin", label: "spin hover", range: [0, 5, 0.01] },
    { key: "ambient", label: "ambient", range: [0, 3, 0.05] },
    { key: "keyLight", label: "key light", range: [0, 5, 0.05] },
    { key: "fillLight", label: "fill light", range: [0, 3, 0.05] },
    { key: "shadowY", label: "shadow Y", range: [-3, 1, 0.05] },
    { key: "shadowOpacity", label: "shadow α", range: [0, 1, 0.01] },
    { key: "shadowBlur", label: "shadow blur", range: [0, 6, 0.1] },
    { key: "shadowScale", label: "shadow size", range: [1, 12, 0.5] },
  ]

function Slider({
  label,
  value,
  range: [min, max, step],
  onChange,
}: {
  label: string
  value: number
  range: Range
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-neutral-300">
      <span className="w-20 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 flex-1 accent-emerald-400"
      />
      <span className="w-12 shrink-0 text-right tabular-nums text-neutral-400">
        {value.toFixed(2)}
      </span>
    </label>
  )
}

export default function DebugPanel() {
  const { global: g, devices } = useDebug()
  const [open, setOpen] = useState(true)
  const [id, setId] = useState(gearItems[0].id)
  const dp = devices[id]

  const copy = () => {
    const snippet = JSON.stringify({ global: g, devices }, null, 2)
    navigator.clipboard?.writeText(snippet)
    // eslint-disable-next-line no-console
    console.log("[gear debug] params:\n" + snippet)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[200] rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
      >
        ⚙ gear debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-[200] w-72 rounded-xl border border-neutral-700 bg-neutral-900/95 p-3 text-white shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-tight">gear debug</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={copy}
            className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-500/30"
          >
            copy
          </button>
          <button
            type="button"
            onClick={() => debugStore.reset()}
            className="rounded bg-neutral-700 px-2 py-0.5 text-[11px] text-neutral-200 hover:bg-neutral-600"
          >
            reset
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded bg-neutral-700 px-2 py-0.5 text-[11px] text-neutral-200 hover:bg-neutral-600"
          >
            ✕
          </button>
        </div>
      </div>

      <select
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="mb-2 w-full rounded bg-neutral-800 px-2 py-1 text-xs text-white"
      >
        {gearItems.map((it) => (
          <option key={it.id} value={it.id}>
            {it.name} {it.model ? "(glb)" : "(primitive)"}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-1.5 border-b border-neutral-700 pb-2">
        {DEVICE_FIELDS.map((f) => (
          <Slider
            key={f.key}
            label={f.label}
            value={dp[f.key]}
            range={f.range}
            onChange={(v) => debugStore.setDevice(id, f.key, v)}
          />
        ))}
      </div>

      <div className="mt-2 mb-1 text-[10px] uppercase tracking-wide text-neutral-500">
        global (all cards)
      </div>
      <div className="flex flex-col gap-1.5">
        {GLOBAL_FIELDS.map((f) => (
          <Slider
            key={f.key}
            label={f.label}
            value={g[f.key]}
            range={f.range}
            onChange={(v) => debugStore.setGlobal(f.key, v)}
          />
        ))}
      </div>
    </div>
  )
}
