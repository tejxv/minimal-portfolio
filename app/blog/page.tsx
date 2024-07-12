import { BlogPosts } from "app/components/posts"

export const metadata = {
  title: "Blog",
  description: "Blogs by Tejas Upadhyay.",
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
