import LinkWithImage from "./helpers/LinkWithImage"

export default function Experience() {
  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          My Portfolio
        </h1> //might use for seo for names - tejas */}
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">Experience</h1>
      <p className="mb-4 text-neutral-600">
        Working as a Product Designer + UI Engineer for{" "}
        <LinkWithImage
          href="https://blogpro.so/"
          src="/icons/blogpro.png"
          alt="BlogPro logo"
        >
          BlogPro
        </LinkWithImage>{" "}
        since Feb 2024 till now. <br />
        <br />
        In the past, I've collaborated with{" "}
        <LinkWithImage
          href="https://twitter.com/FinFloww/"
          src="/icons/finfloww.jpg"
          alt="FinFloww logo"
        >
          FinFloww
        </LinkWithImage>
        ,{" "}
        <LinkWithImage
          href="https://www.google.com/search?q=rentit4me.com"
          src="/icons/rentit4me.jpeg"
          alt="Rentit4me logo"
        >
          Rentit4me
        </LinkWithImage>{" "}
        to revamp their designs.
      </p>
    </section>
  )
}
