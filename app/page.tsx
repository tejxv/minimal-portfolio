// import { BlogPosts } from "app/components/posts"
// import Education from "./components/education"
import Experience from "./components/experience"
import Contact from "./components/contact"
import WorkGridSection from "./components/work-grid-section"
import Heading from "./components/heading"
// import SectionRail from "./components/section-rail"
// import SelectedWorks from "./components/SelectedWorks"

export default function Page() {
  return (
    <section>
      {/* <SectionRail /> */}
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1> //might use for seo for names - tejas */}
      <Heading id="about" className="hidden scroll-mt-24">
        About me
      </Heading>
      <p className="mb-4 text-neutral-500">
        I&apos;m Tejas Upadhyay, a designer who loves to code. Currently at{" "}
        <a
          href="https://superboard.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 hover:text-neutral-600 transition-colors"
        >
          Superboard.xyz
        </a>
        , I spend my time designing and building products that feel thoughtful,
        expressive, and accessible. Lately, I&apos;ve been burning an
        unreasonable number of tokens with Claude.
      </p>
      <div id="work" className="mb-10 flex flex-wrap gap-3 scroll-mt-24">
        <a
          href="mailto:hi@tejasdesign.in"
          className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          hi@tejasdesign.in
        </a>
        
        <WorkGridSection />
      </div>
      <div id="experience" className="my-8 scroll-mt-24">
        <Experience />
      </div>
      {/* <SelectedWorks /> */}
      {/* <div className="my-8">
        <Education />
      </div> */}
      <div id="contact" className="my-8 scroll-mt-24">
        <Contact />
      </div>
      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  )
}
