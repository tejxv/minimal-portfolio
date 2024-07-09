import Image from "next/image"

const LinkWithImage = ({ href, src, alt, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-neutral-800 font-medium"
    >
      <Image
        src={src}
        height={24}
        width={24}
        className="inline-block p-1 -translate-y-0.5 border border-gray-200 mr-1 rounded-lg shadow-sm"
        alt={alt}
      />
      {children}
    </a>
  )
}

export default LinkWithImage
