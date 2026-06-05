"use client"

import { useEffect, useState } from "react"
import Compass from "./compass"

type Weather = {
  temp: number
  desc: string
  icon: string
}

// IST clock, formatted "h:mm AM". Bengaluru uses Asia/Kolkata. Hour12 keeps it
// human; no seconds — they'd churn for no reason and force a 1s interval.
function formatIST() {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date())
}

export default function NowInBengaluru() {
  // Start null on both SSR and first client paint to avoid a hydration mismatch
  // (server tick != client tick by the time hydration finishes). Fill in via
  // useEffect once mounted.
  const [weather, setWeather] = useState<Weather | null>(null)
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=76b08d0791b1b13c3dae6866bef3e185&units=metric"
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (cancelled) return
        setWeather({
          temp: Math.round(d.main.temp),
          desc: d.weather[0]?.description ?? "",
          icon: d.weather[0]?.icon ?? "",
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setTime(formatIST())
    // Tick every 30s — minute boundary lands within half a minute regardless of
    // when the component mounted. Cheaper than a true setTimeout-to-next-minute
    // dance and indistinguishable to the eye.
    const id = setInterval(() => setTime(formatIST()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="compass-host mt-10 mb-16 flex items-start gap-2 text-sm font-medium tracking-tight lowercase text-neutral-500">
      <Compass size={18} className="mt-0.5 shrink-0 text-neutral-600" />
      <p>
        Currently in{" "}
        <span className="font-semibold text-neutral-600">Bengaluru</span>
        {time ? (
          <>
            {" "}— it&apos;s{" "}
            <span className="font-semibold text-neutral-600">{time}</span>
          </>
        ) : null}
        {weather ? (
          <>
            {" "}and{" "}
            <span className="font-semibold text-neutral-600">
              {weather.desc} at {weather.temp}°C
            </span>
          </>
        ) : null}
        .
      </p>
    </div>
  )
}
