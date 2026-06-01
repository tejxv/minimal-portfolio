import Link from "next/link"

export default function Header() {
  return (
    <>
      <div className="mt-6 flex justify-between mx-auto max-w-xl flex-row align-center items-baseline w-full">
        <Link href="/">
          <div className="flex flex-row align-center items-baseline">
            <h1 className="mb-8 text-2xl font-semibold tracking-tight">
              Tejas
            </h1>
            <h3 className="ml-2 text-xl text-neutral-400 tracking-tight">
              Design Engineer
            </h3>
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
