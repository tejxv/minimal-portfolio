import Link from "next/link"

export default function Header() {
  return (
    <>
      <div className="mt-6 flex justify-between flex-row align-center items-baseline w-full">
        <Link href="/">
          <div className="flex flex-row align-center items-baseline">
            <h1 className="mb-8 text-2xl font-semibold tracking-tight">
              Tejas
            </h1>
            <h3 className="ml-2 text-xl text-neutral-400">Product Designer</h3>
          </div>
        </Link>
        <div className="text-neutral-400 cursor-pointer hover:text-neutral-900">
          Resume{" "}
          <span className="border rounded-lg font-medium text-sm py-0.5 px-1.5">
            PDF
          </span>
        </div>
      </div>
    </>
  )
}
