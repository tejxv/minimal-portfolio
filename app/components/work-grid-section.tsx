import { getWorks } from "app/work/works"
import WorkGallery from "./work-gallery"

export default function WorkGridSection() {
  const works = getWorks()
  return <WorkGallery items={works} />
}
