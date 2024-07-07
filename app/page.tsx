import { BlogPosts } from "app/components/posts"

export default function Page() {
  return (
    <section>
      {/* <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1> //might use for seo for names - tejas upadhyay */}
      <p className="mb-4">
        {`My name is Tejas. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consequat, nunc ac ultricies consectetur, metus est aliquet est, et bibendum nunc mi non arcu. Integer in lorem eget sapien venenatis luctus. Nulla facilisi.

Suspendisse potenti. Sed quis suscipit turpis. Cras dapibus, erat at dapibus dignissim, urna justo aliquam nisi, at laoreet libero felis vel libero. Praesent efficitur quam at ligula ullamcorper, sed interdum velit malesuada. Sed ac nulla vel felis posuere vehicula. Aliquam erat volutpat.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
