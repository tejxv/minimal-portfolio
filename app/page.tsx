// import { BlogPosts } from "app/components/posts"
// import Education from "./components/education"
import Experience from "./components/experience"
import Contact from "./components/contact"
// import SelectedWorks from "./components/SelectedWorks"

export default function Page() {
  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1> //might use for seo for names - tejas */}
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">About me</h1>
      <p className="mb-4 text-neutral-500">
        I'm Tejas Upadhyay, a product designer who loves to code. I'm currently
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
      <div className="my-8">
        <Experience />
      </div>
      {/* <SelectedWorks /> */}
      {/* <div className="my-8">
        <Education />
      </div> */}
      <div className="my-8">
        <Contact />
      </div>
      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  )
}
