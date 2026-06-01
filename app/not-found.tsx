export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        404 - Page Not Found
      </h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        Go back home
      </a>
    </section>
  )
}
