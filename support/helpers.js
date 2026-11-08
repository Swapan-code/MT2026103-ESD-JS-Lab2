// Test helpers. deepFreeze makes an object (and everything inside it)
// read-only, so any code that tries to change it THROWS instead of
// quietly passing. That is how these tests catch mutation.
import { courses as raw } from "../data/courses.js";

export function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) deepFreeze(value[key]);
  }
  return value;
}

// A fresh, frozen copy of the catalogue for every test file.
export const courses = deepFreeze(structuredClone(raw));
export const byId = (id) => courses.find((c) => c.id === id);

// A fake fetch for the network tests. `respond(url)` returns
// { status, body } (or throws, to simulate "no network").
// The returned function records every URL it was called with in .calls.
export function fakeFetch(respond) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const { status = 200, body = null } = await respond(url);
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
  fn.calls = calls;
  return fn;
}

// A promise you resolve or reject yourself, later — for ordering tests.
export function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}
