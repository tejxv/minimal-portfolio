import { BlogPosts } from "app/components/posts"
import Heading from "app/components/heading"

export const metadata = {
  title: "Blog",
  description: "Blogs by Tejas Upadhyay.",
}

export default function Page() {
  return (
    <section>
      <Heading>My Blog</Heading>
      <BlogPosts />
    </section>
  )
}
