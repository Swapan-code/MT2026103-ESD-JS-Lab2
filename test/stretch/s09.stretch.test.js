// Section 09 — stretch: debounce
import { test } from "node:test";
import assert from "node:assert/strict";
import { debounce } from "../../src/s09-latest.js";
import { wait } from "../../src/s03-async.js";

test("debounce calls once, after the calls stop, with the last arguments", async () => {
  const seen = [];
  const search = debounce((q) => seen.push(q), 40);
  for (const q of ["l", "le", "lea", "lear", "learn"]) { search(q); await wait(5); }
  assert.deepEqual(seen, []);
  await wait(80);
  assert.deepEqual(seen, ["learn"]);
});
test("calls far enough apart each go through", async () => {
  const seen = [];
  const f = debounce((x) => seen.push(x), 20);
  f(1); await wait(50); f(2); await wait(50);
  assert.deepEqual(seen, [1, 2]);
});
