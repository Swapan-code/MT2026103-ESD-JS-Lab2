// Section 09 — Out-of-order responses

// Returns a function `track(promise)`. Every call to track gets a number;
// only the MOST RECENT call's result counts.
//   const track = createLatestOnly();
//   const result = await track(fetchCourses(...));
//   result → { stale: false, value }  if this was the latest call when it finished
//          → { stale: true }          if a newer call started meanwhile
// If the promise rejects: rethrow the error if it's the latest call,
// otherwise resolve { stale: true } (nobody cares about an old failure).
export function createLatestOnly() {
  throw new Error("TODO");
}

// STRETCH — debounce(fn, ms): returns a function that waits until it has NOT
// been called for `ms` milliseconds, then calls fn once, with the LAST arguments.
// Typing "learn" fast should search once, for "learn" — not five times.
export function debounce(fn, ms) {
  throw new Error("TODO");
}
