import { defineSound } from "@web-kits/audio"

// Gallery overlay open — short rising sweep
export const galleryOpen = defineSound({
  source: { type: "sine", frequency: { start: 250, end: 500 } },
  envelope: { attack: 0.02, decay: 0.12 },
  gain: 0.12,
})

// Gallery overlay close — soft descending pop
export const galleryClose = defineSound({
  source: { type: "sine", frequency: { start: 450, end: 120 } },
  envelope: { decay: 0.1 },
  gain: 0.12,
})

// read.cv rip — abrasive low scratch to mark the site's death
export const readCvRip = defineSound({
  source: { type: "sawtooth", frequency: { start: 200, end: 45 } },
  envelope: { attack: 0, decay: 0.4 },
  gain: 0.16,
})
