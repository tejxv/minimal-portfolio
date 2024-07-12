import React from "react"

type WorkExperience = {
  title: string
  company: string
  location: string
  duration: string
  responsibilities: string[]
}

const workExperiences: WorkExperience[] = [
  {
    title: "Product Designer",
    company: "Ultrablue – BlogPro",
    location: "Remote",
    duration: "Feb 2024 – Present",
    responsibilities: [
      "Led the design and development of complete user flows from scratch, creating all screens and ensuring optimal user experience based on feedback.",
      "Established a comprehensive design system in Figma, streamlining the UI development process and ensuring consistency across the application",
      "Integrated Tailwind CSS into the design, optimizing the front-end codebase for efficiency and maintainability.",
      "Utilized advanced prototyping features in Figma to create interactive and realistic product demonstrations, facilitating effective design feedback and validation.",
      "Implemented designs directly in Next.js, bridging the gap between design and development to ensure seamless integration and high-quality user interfaces.",
    ],
  },
  {
    title: "Product Designer",
    company: "VegaTheta (Stealth Startup)",
    location: "Remote",
    duration: "Feb 2023 – Dec 2023",
    responsibilities: [
      "Designed and developed UI components in Figma and implemented them using ReactJS to ensure seamless and interactive user experiences",
      "Established a comprehensive design system in Figma, streamlining the UI development process and ensuring consistency across the application",
      "Incorporated Tailwind CSS into the design, optimizing the front-end codebase for efficiency and maintainability",
      "Utilized advanced prototyping features in Figma to create interactive and realistic product demonstrations, facilitating effective design feedback and validation",
      "Demonstrated keen attention to detail by identifying and resolving numerous front-end code bugs, enhancing the application’s performance and user satisfaction",
    ],
  },
  {
    title: "UI/UX Intern",
    company: "YourStory Media",
    location: "Remote",
    duration: "December 2021 – March 2022",
    responsibilities: [
      "Contributed in Mobile first design and various UI Components, including navbar, article pages, layout, and footer",
      "Created wireframes and interactive prototypes to help illustrate design concepts",
      "Developed hi-fidelity visual UI design mockups in Figma to provide a clear representation of the end product",
    ],
  },
  {
    title: "Web Developer & UI Designer",
    company: "ImmiGlobe Immigration Corp",
    location: "Freelance",
    duration: "September 2021",
    responsibilities: [
      "Developed and hosted a fully responsive website with over 20 pages using ReactJS",
      "Delivered the project within one month after actively incorporating client feedback",
      "Utilized close collaboration with the client to ensure successful completion of the project",
      "Engaged in copywriting for the website, ensuring that the content effectively communicated the intended message",
    ],
  },
]

const WorkExperienceComponent: React.FC = () => {
  return (
    <div className="border-t mt-8 pt-8">
      {workExperiences.map((experience, index) => (
        <div
          key={index}
          style={{ marginBottom: "40px" }}
          className="flex flex-col"
        >
          <div className="w-full flex items-baseline justify-between">
            <h3 className="text-neutral-600 font-semibold">
              {experience.title}{" "}
              <span className="font-normal text-neutral-500">
                - {experience.company}
              </span>
            </h3>
            <p className="text-sm rounded-full border border-slate-100 px-2 py-0.5 bg-slate-50 text-neutral-500">
              {experience.location}
            </p>
          </div>
          <div className="w-full flex justify-between">
            <p className="text-sm text-neutral-500 mt-0.5">
              {experience.duration}
            </p>
          </div>
          <div className="w-full hidden text-neutral-500 mt-2">
            <ul>
              {experience.responsibilities.map((responsibility, i) => (
                <li key={i} className="text-base mb-2">
                  · {responsibility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkExperienceComponent
