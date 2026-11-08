// Run with:  npm run inlab
import { test } from "node:test";
import assert from "node:assert/strict";
import { retry } from "./retry.js";

const flaky = (failures, value = "ok") => {
  let calls = 0;
  const task = async () => { calls += 1; if (calls <= failures) throw new Error(`fail ${calls}`); return value; };
  task.calls = () => calls;
  return task;
};

test("succeeds first time: one call", async () => {
  const t = flaky(0);
  assert.equal(await retry(t, 3, 10), "ok");
  assert.equal(t.calls(), 1);
});
test("fails twice then succeeds: three calls", async () => {
  const t = flaky(2);
  assert.equal(await retry(t, 3, 10), "ok");
  assert.equal(t.calls(), 3);
});
test("fails every time: rejects with the LAST error", async () => {
  const t = flaky(5);
  await assert.rejects(retry(t, 3, 10), /fail 3/);
  assert.equal(t.calls(), 3);
});
test("waits between attempts, but not after the last one", async () => {
  const t = flaky(5);
  const start = Date.now();
  await retry(t, 3, 40).catch(() => {});
  const took = Date.now() - start;
  assert.ok(took >= 70 && took < 115, `took ${took} ms — expected two waits of 40 ms`);
});
test("stretch: backoff doubles the delay", async () => {
  const t = flaky(5);
  const start = Date.now();
  await retry(t, 3, 30, { backoff: true }).catch(() => {});
  const took = Date.now() - start;
  assert.ok(took >= 80, `took ${took} ms — expected waits of 30 then 60 ms`);
});
