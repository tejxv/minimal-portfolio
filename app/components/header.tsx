import Link from "next/link"

export default function Header() {
  return (
    <>
      <div className="mt-6 flex justify-between mx-auto max-w-xl flex-row align-center items-baseline w-full">
        <Link href="/">
          {/* Both font variants live in the SAME grid cell (col/row-start-1),
              so the cell always sizes to the WIDER one (wasted) — swapping
              fonts on hover can't reflow siblings. We cross-fade opacity
              instead of toggling font-family on the live text. */}
          <div className="group/name grid h-16 items-baseline">
            <div className="col-start-1 row-start-1 flex flex-row items-baseline blur-0 transition-[opacity,filter] duration-100 group-hover/name:opacity-0 group-hover/name:blur-[2px]">
              <h1 className="mb-8 text-2xl font-semibold tracking-tight">
                Tejas
              </h1>
              <h3 className="ml-2 text-xl text-neutral-400 tracking-tight">
                Design Engineer
              </h3>
            </div>
            <div
              aria-hidden="true"
              className="col-start-1 row-start-1 flex flex-row items-baseline font-wasted opacity-0 blur-[2px] transition-[opacity,filter] duration-200 group-hover/name:opacity-100 group-hover/name:blur-0"
            >
              <h1 className="mb-8 text-2xl font-semibold tracking-tight">
                Tejas
              </h1>
              <h3 className="ml-2 text-xl text-neutral-400 tracking-tight">
                Design Engineer
              </h3>
            </div>
          </div>
        </Link>
        <a
          href="/assets/Tejas_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="text-neutral-400 cursor-pointer group-hover:text-neutral-900">
            Resume{" "}
            <span className="border rounded-lg group-hover:bg-neutral-200 font-medium text-sm py-0.5 px-1.5">
              PDF
            </span>
          </div>
        </a>
      </div>
    </>
  )
}
