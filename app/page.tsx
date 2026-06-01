// import { BlogPosts } from "app/components/posts"
// import Education from "./components/education"
import Experience from "./components/experience"
import Contact from "./components/contact"
import WorkGridSection from "./components/work-grid-section"
// import SectionRail from "./components/section-rail"
// import SelectedWorks from "./components/SelectedWorks"

export default function Page() {
  return (
    <section>
      {/* <SectionRail /> */}
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1> //might use for seo for names - tejas */}
      <h1
        id="about"
        className="font-semibold text-2xl mb-8 tracking-tight scroll-mt-24"
      >
        About me
      </h1>
      <p className="mb-4 text-neutral-500">
        I'm Tejas Upadhyay, a design engineer who loves to code. I'm currently
        working at{" "}
        <a
          href="https://superboard.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-800 hover:text-neutral-600 transition-colors"
        >
          Superboard.xyz
        </a>
        , a web3 startup.
        <br></br> My passion is creating experiences at the intersection of art,
        design, and accessibility.
      </p>
      <div id="work" className="scroll-mt-24">
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
