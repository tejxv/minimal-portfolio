import Heading from "./heading"

export default function Education() {
  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1> //might use for seo for names - tejas */}
      <Heading>Education</Heading>
      <p className="mb-4 text-neutral-500">
        {`I'm about to graduate with a degree in Computer Science Engineering from Gautam Buddha University.`}{" "}
      </p>
    </section>
  )
}
