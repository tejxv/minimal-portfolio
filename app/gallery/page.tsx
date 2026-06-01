// `/gallery` renders the same home page; WorkGallery checks the URL on mount
// and opens itself when pathname === "/gallery". Re-exporting keeps a single
// source of truth — no duplicate JSX to drift.
export { default } from "../page"
