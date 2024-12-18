import "./global.css"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Navbar } from "./components/nav"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "./components/footer"
import Header from "./components/header"
import { baseUrl } from "./sitemap"
import EmblaCarousel from "./components/slider"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Tejas Upadhyay's Portfolio",
    template: "%s | Tejas Upadhyay's Portfolio",
  },
  description: "This is my portfolio.",
  openGraph: {
    title: "My Portfolio",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "My Portfolio",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(" ")

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased max-w-full mx-4 lg:mx-auto">
        <Header />
        <EmblaCarousel />
        <main className="flex-auto mx-auto min-w-0 max-w-xl justify-center flex flex-col px-2 md:px-0">
          <div className="flex">
            <Navbar />
            {children}
          </div>
          <Footer />
          <SpeedInsights />
          <Analytics />
        </main>
      </body>
      {/* xmas decor */}
      <script
        async
        src="https://cdn.jsdelivr.net/npm/@raae/let-it-snow@latest/dist/snowfall.js"
        data-colors="#ebebeb"
      ></script>
      {/* xmas decor end */}
    </html>
  )
}
