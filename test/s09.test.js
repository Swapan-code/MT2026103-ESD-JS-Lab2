import { test } from "node:test";
import assert from "node:assert/strict";
import { createLatestOnly } from "../src/s09-latest.js";
import { deferred } from "../support/helpers.js";

test("a single call is the latest", async () => {
  const track = createLatestOnly();
  assert.deepEqual(await track(Promise.resolve(5)), { stale: false, value: 5 });
});
test("an older call that finishes LATER is stale", async () => {
  const track = createLatestOnly();
  const slow = deferred(), fast = deferred();
  const first = track(slow.promise);   // e.g. "Electronics", slow network
  const second = track(fast.promise);  // e.g. "Mathematics", fast network
  fast.resolve("maths");
  slow.resolve("electronics");
  assert.deepEqual(await second, { stale: false, value: "maths" });
  assert.deepEqual(await first, { stale: true });
});
test("each tracker counts on its own", async () => {
  const a = createLatestOnly(), b = createLatestOnly();
  const fromA = a(Promise.resolve("a"));
  b(Promise.resolve("b"));
  assert.deepEqual(await fromA, { stale: false, value: "a" });
});
test("the latest call's error is rethrown", async () => {
  const track = createLatestOnly();
  await assert.rejects(track(Promise.reject(new Error("HTTP 500"))), /HTTP 500/);
});
test("an older call's error is just stale", async () => {
  const track = createLatestOnly();
  const old = deferred();
  const first = track(old.promise);
  const second = track(Promise.resolve("ok"));
  old.reject(new Error("too late"));
  assert.deepEqual(await first, { stale: true });
  assert.deepEqual(await second, { stale: false, value: "ok" });
});
