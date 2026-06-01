"use client"

import { createPlayer } from "@videojs/react"
import { MinimalVideoSkin, Video, videoFeatures } from "@videojs/react/video"
import "@videojs/react/video/minimal-skin.css"

// One player factory for the lightbox. Created at module scope so it isn't
// rebuilt per render. Only mounted in the lightbox (one instance at a time) —
// the grid tiles stay plain <video> for perf.
const Player = createPlayer({ features: videoFeatures })

export default function LightboxVideo({
  src,
  width,
  height,
  vtName,
  onClick,
}: {
  src: string
  width: number
  height: number
  vtName: string
  onClick?: (e: React.MouseEvent) => void
}) {
  // The video.js skin (unlike a native <video>) has no intrinsic size — without
  // an explicit box it collapses to 0×0 and the video "disappears". Size the
  // wrapper from the real aspect ratio, capped to the viewport, so it scales
  // like the image lightbox does.
  return (
    <div
      onClick={onClick}
      style={{
        viewTransitionName: vtName,
        aspectRatio: `${width} / ${height}`,
        width: "min(94vw, calc(90vh * (" + width + " / " + height + ")))",
      }}
      className="lightbox-video max-h-[90vh] max-w-[82vw] overflow-hidden rounded-xl bg-black"
    >
      <Player.Provider>
        <MinimalVideoSkin>
          <Video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full"
          />
        </MinimalVideoSkin>
      </Player.Provider>
    </div>
  )
}
