import React from "react"
import Heading from "./heading"

export default function Contact() {
  return (
    <section>
      <Heading>Contact me</Heading>
      <p className="mb-4 text-neutral-500">
        {`Excited to collaborate? Drop me a message, and let's chat!`}
      </p>
      <div className="group w-full flex flex-row gap-3">
        <a
          href="mailto:hi@tejasdesign.in"
          className="px-3 py-2 w-fit inline-block text-sm font-medium text-white bg-neutral-900 rounded-full hover:bg-neutral-700"
        >
          Send email
        </a>

        <div className="">
          <a
            href="https://calendar.amie.so/s/tejxv"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 inline-block text-sm font-medium text-neutral-600 bg-neutral-100 rounded-full hover:bg-neutral-300"
          >
            Schedule a meet
          </a>
        </div>
      </div>
    </section>
  )
}
