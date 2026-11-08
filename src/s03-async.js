// Section 03 — Asynchronous JavaScript and promises

// A promise that resolves (with no value) after `ms` milliseconds.
// Hint: new Promise((resolve) => setTimeout(resolve, ms))
export function wait(ms) {
  throw new Error("TODO");
}

// `tasks` is an array of functions, each returning a promise.
// Run them ONE AFTER ANOTHER — start the next only when the previous has finished —
// and resolve with their results, in order. Use await in a loop.
export async function inOrder(tasks) {
  throw new Error("TODO");
}

// The same, but start them ALL AT ONCE and wait for all of them.
// Resolve with their results in the original order. Use Promise.all.
export function allAtOnce(tasks) {
  throw new Error("TODO");
}
