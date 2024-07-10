import { BlogPosts } from "app/components/posts"
import Education from "./components/education"
import Experience from "./components/experience"

export default function Page() {
  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1> //might use for seo for names - tejas */}
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">About me</h1>
      <p className="mb-4 text-neutral-500">
        My name is Tejas Upadhyay. A product designer who loves to code, I'm
        currently working at Blogpro, a startup that converts your Notion pages
        into a well-designed blog.
        <br></br> My passion is creating experiences at the intersection of art,
        design, and accessibility.
      </p>
      <div className="my-8">
        <Experience />
      </div>
      <div className="my-8">
        <Education />
      </div>
      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  )
}
