"use client"

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
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full"
      />
    </div>
  )
}
