import React from "react"

export default function Contact() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">Contact me</h1>
      <p className="mb-4 text-neutral-500">
        {`Excited to collaborate? Let's dive into user flows, research, and visuals together. Drop me a message, and let's chat!`}{" "}
        <span className="group inline-block">
          <a
            href="mailto:tejas@emoo.design"
            className="px-3 py-2 inline-block mt-4 font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
          >
            tejas@emoo.design
          </a>{" "}
          <span className="hidden text-sm group-hover:inline">
            {" "}
            – opens in your email client!
          </span>
        </span>
      </p>
    </section>
  )
}
