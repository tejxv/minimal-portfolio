import fs from "fs"
import path from "path"
import { cache } from "react"
import { imageSize } from "image-size"

export type WorkKind = "image" | "video"

export type Work = {
  src: string
  caption: string
  width: number
  height: number
  kind: WorkKind
}

// Source of truth for the work grid: every image/video in public/slider-images
// is shown automatically. To add an item, drop a file in that folder. Captions
// are optional (add a line to captions.json keyed by filename) — videos
// generally don't need one.
const MEDIA_DIR = path.join(process.cwd(), "public", "slider-images")
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"])
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v"])

function getCaptions(): Record<string, string> {
  try {
    const raw = fs.readFileSync(path.join(MEDIA_DIR, "captions.json"), "utf-8")
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

// Read intrinsic video dimensions from the MP4/MOV container without ffmpeg or
// any native dependency (so it works on Vercel's build too). Both formats are
// ISO-BMFF: each video track has a `tkhd` atom whose final 8 bytes hold display
// width and height as 16.16 fixed-point. Audio tracks also have a tkhd but with
// zero width — so we scan every tkhd and keep the largest. Falls back to 16:9
// if the atom can't be found.
function getVideoDimensions(buffer: Buffer): { width: number; height: number } {
  let best = { width: 0, height: 0 }
  let pos = buffer.indexOf("tkhd", 0, "latin1")

  while (pos !== -1) {
    const atomStart = pos - 4 // 4-byte size field precedes the type
    if (atomStart >= 0) {
      const size = buffer.readUInt32BE(atomStart)
      const atomEnd = atomStart + size
      // width/height are the last 8 bytes of the atom (16.16 fixed-point).
      if (size > 16 && atomEnd <= buffer.length) {
        const width = buffer.readUInt32BE(atomEnd - 8) / 65536
        const height = buffer.readUInt32BE(atomEnd - 4) / 65536
        if (width > best.width) best = { width: Math.round(width), height: Math.round(height) }
      }
    }
    pos = buffer.indexOf("tkhd", pos + 4, "latin1")
  }

  if (best.width > 0 && best.height > 0) return best
  return { width: 1920, height: 1080 }
}

// Real pixel dimensions are read at build/render time so the masonry layout
// renders at the correct aspect ratio with no layout shift. cache() dedupes
// the filesystem work when both layout and page request the list in one render.
export const getWorks = cache((): Work[] => {
  const captions = getCaptions()

  return fs
    .readdirSync(MEDIA_DIR)
    .map((file) => ({ file, ext: path.extname(file).toLowerCase() }))
    .filter(({ ext }) => IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext))
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))
    .map(({ file, ext }) => {
      const kind: WorkKind = VIDEO_EXTENSIONS.has(ext) ? "video" : "image"
      const buffer = fs.readFileSync(path.join(MEDIA_DIR, file))
      const { width, height } =
        kind === "video" ? getVideoDimensions(buffer) : imageSize(buffer)
      return {
        src: `/slider-images/${file}`,
        caption: captions[file] ?? "",
        width,
        height,
        kind,
      }
    })
})
