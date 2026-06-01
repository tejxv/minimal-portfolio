import { getWorks } from "app/work/works"
import WorkGrid from "./work-grid"

export default function WorkGridSection() {
  const works = getWorks()

  return (
    // Full-bleed breakout from the narrow <main> column. The negative margins
    // (calc(50% - 50vw)) stretch the section to the viewport edges; the inner
    // uses w-full (NOT 100vw — which miscounts the scrollbar and overflows) plus
    // px-4 gutter, then max-w-5xl mx-auto to re-cap and center.
    <section className="my-10 mx-[calc(50%-50vw)]">
      <div className="mx-auto w-full max-w-5xl px-4">
        <WorkGrid items={works} />
      </div>
    </section>
  )
}
