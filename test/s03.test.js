import { test } from "node:test";
import assert from "node:assert/strict";
import { wait, inOrder, allAtOnce } from "../src/s03-async.js";

test("wait returns a promise", () => {
  const p = wait(1);
  assert.ok(p instanceof Promise);
  return p;
});
test("wait resolves after roughly the given time", async () => {
  const start = Date.now();
  await wait(60);
  assert.ok(Date.now() - start >= 50, "resolved too early");
});
const task = (value, ms, log) => async () => { log.push(`start ${value}`); await wait(ms); log.push(`end ${value}`); return value; };

test("inOrder resolves with results in order", async () => {
  assert.deepEqual(await inOrder([task("a", 20, []), task("b", 5, []), task("c", 10, [])]), ["a", "b", "c"]);
});
test("inOrder starts each task only after the previous one ends", async () => {
  const log = [];
  await inOrder([task("a", 20, log), task("b", 5, log)]);
  assert.deepEqual(log, ["start a", "end a", "start b", "end b"]);
});
test("allAtOnce resolves with results in the ORIGINAL order", async () => {
  assert.deepEqual(await allAtOnce([task("a", 30, []), task("b", 5, []), task("c", 15, [])]), ["a", "b", "c"]);
});
test("allAtOnce starts every task before any finishes", async () => {
  const log = [];
  await allAtOnce([task("a", 20, log), task("b", 20, log)]);
  assert.deepEqual(log.slice(0, 2), ["start a", "start b"]);
});
test("three 60 ms tasks: in order takes ~180 ms, all at once ~60 ms", async () => {
  const tasks = () => [task(1, 60, []), task(2, 60, []), task(3, 60, [])];
  let t = Date.now(); await inOrder(tasks()); const serial = Date.now() - t;
  t = Date.now(); await allAtOnce(tasks()); const parallel = Date.now() - t;
  assert.ok(serial >= 170, `inOrder took ${serial} ms — are the tasks really one after another?`);
  assert.ok(parallel < 150, `allAtOnce took ${parallel} ms — are the tasks really started together?`);
});
test("allAtOnce rejects if any task rejects", async () => {
  await assert.rejects(allAtOnce([async () => 1, async () => { throw new Error("boom"); }]), /boom/);
});
