import React from "react"

export default function Contact() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tight">Contact me</h1>
      <p className="mb-4 text-neutral-500">
        {`Excited to collaborate? Drop me a message, and let's chat!`}
      </p>
      <span className="group inline-block">
        <a
          href="https://calendar.amie.so/s/tejxv"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 inline-block font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600"
        >
          Let's talk
        </a>{" "}
        <span className="hidden text-sm group-hover:inline">
          {" "}
          – book a time that works for you!
        </span>
      </span>
    </section>
  )
}
