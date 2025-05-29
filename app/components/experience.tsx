import LinkWithImage from "./helpers/LinkWithImage"
import WorkExperienceComponent from "./helpers/Exp"

export default function Experience() {
  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          My Portfolio
        </h1> //might use for seo for names - tejas */}
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">Experience</h1>
      <p className="mb-4 text-neutral-500">
        Working as a Lead Product Designer for{" "}
        <LinkWithImage
          href="https://superboard.xyz/"
          src="/icons/superboard.png"
          alt="Superboard logo"
        >
          Superboard.xyz
        </LinkWithImage>{" "}
        since January 2025. <br />
        <br />
        In the past, I've collaborated with{" "}
        <LinkWithImage
          href="https://blogpro.so/"
          src="/icons/blogpro.png"
          alt="BlogPro logo"
        >
          BlogPro
        </LinkWithImage>{" "}
        as a Product Designer + UI Engineer (Feb 2024 - Dec 2024),{" "}
        <LinkWithImage
          href="https://twitter.com/FinFloww/"
          src="/icons/finfloww.jpg"
          alt="FinFloww logo"
        >
          FinFloww
        </LinkWithImage>
        , and{" "}
        <LinkWithImage
          href="https://www.google.com/search?q=rentit4me.com"
          src="/icons/rentit4me.jpeg"
          alt="rentit4me logo"
        >
          Rentit4me
        </LinkWithImage>{" "}
        (a shark tank featured startup) to revamp their designs. I also take on
        freelance projects in product design,{" "}
        <a
          href="mailto:tejas@superboard.xyz"
          className="border-b hover:border-b-2"
        >
          Let's connect,
        </a>{" "}
        if you're up for a collab!
      </p>
      <WorkExperienceComponent />
    </section>
  )
}
