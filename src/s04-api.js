// Section 04 — fetch and the network

// Build the URL for GET /api/courses with optional filters.
//   buildCoursesUrl({})                                → "/api/courses"
//   buildCoursesUrl({ department: "Electronics" })     → "/api/courses?department=Electronics"
//   buildCoursesUrl({ department: "Data Science & AI", q: "learn" })
//       → a URL whose department is exactly "Data Science & AI" (the & must be encoded!)
// Leave out any filter that is missing or blank. Use URLSearchParams.
export function buildCoursesUrl({ department = "", q = "" } = {}) {
  throw new Error("TODO");
}

// GET a URL and return the parsed JSON body.
// - fetchFn is fetch by default; the tests pass in a fake one.
// - fetch does NOT reject on 404 or 500. Check res.ok yourself and, if it is
//   false, throw new Error(`HTTP ${res.status}`).
// - If fetch itself rejects (no network), let that error propagate.
export async function getJSON(url, fetchFn = fetch) {
  throw new Error("TODO");
}

// The courses matching some filters: build the URL, then getJSON it.
export function fetchCourses(filters, fetchFn = fetch) {
  throw new Error("TODO");
}
