export function makeSlug(title: string) {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 200)}-${Date.now()}`;
}
