export default function Header() {
  return (
    <>
      <div className="mt-6 flex justify-between flex-row align-center items-baseline w-full">
        <div className="flex flex-row align-center items-baseline">
          <h1 className="mb-8 text-2xl font-semibold tracking-tight">Tejas</h1>
          <h3 className="ml-2 text-xl text-neutral-400">Product Designer</h3>
        </div>
        <div className="text-neutral-400 hover:text-neutral-900">
          Resume{" "}
          <span className="border rounded-3xl font-medium py-0.5 px-2">
            PDF
          </span>
        </div>
      </div>
    </>
  )
}
