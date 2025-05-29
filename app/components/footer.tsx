// import { LiquidLogo } from "./LiquidLogo"

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}
function RssIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide translate-y-0.5 lucide-rss"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col text-neutral-500 md:flex-row md:space-y-0">
        <li>
          <a
            className="flex mr-2 items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="https://x.com/tejxv"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">twitter</p>
          </a>
        </li>
        <li>
          <a
            className="flex mr-2 items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="https://behance.com/tejxv"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">behance</p>
          </a>
        </li>
        <li>
          <a
            className="flex mr-2 items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/tejas-u/"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">linkedin</p>
          </a>
        </li>
        <li>
          <a
            className="flex mr-2 items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="https://read.cv/tejxv"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">read.cv</p>
          </a>
        </li>
        <li>
          <a
            className="flex mr-2 items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/tejxv"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">github</p>
          </a>
        </li>
        <li>
          <a
            className="flex mr-2 items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="https://figma.com/@tejas"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">figma</p>
          </a>
        </li>
      </ul>
      <p className="my-8 text-neutral-500">
        © {new Date().getFullYear()} Developed by Tejas <br></br>
        <span className="text-neutral-400 text-sm">
          Built with Next.js, Tailwind CSS, and Vercel.
          <a
            className="items-center transition-all w-min hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <span className="ml-2 inline-block">
              <RssIcon />
            </span>
          </a>
        </span>
      </p>
      {/* <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <LiquidLogo
          image="/icons/apple.svg" // URL or path to your logo image
          // Optional: override default shader parameters:
          patternScale={3}
          refraction={0.02}
          edge={0.5}
          patternBlur={0.007}
          liquid={0.08}
          speed={0.4}
          style={{ width: "100%", height: "auto" }}
        />
      </div> */}
    </footer>
  )
}
