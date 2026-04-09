/**
 * Replace "internship(s)" with "job(s)" for seniors.
 */
export function adaptText(text: string, classYear?: string): string {
  if (classYear !== "senior") return text;
  return text
    .replace(/\binternships\b/gi, (m) => (m[0] === "I" ? "Jobs" : "jobs"))
    .replace(/\binternship\b/gi, (m) => (m[0] === "I" ? "Job" : "job"));
}
