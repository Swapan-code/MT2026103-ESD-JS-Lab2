import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCoursesUrl, getJSON, fetchCourses } from "../src/s04-api.js";
import { fakeFetch } from "../support/helpers.js";

const parse = (u) => new URL(u, "http://localhost");

test("buildCoursesUrl with no filters", () => {
  assert.equal(buildCoursesUrl({}), "/api/courses");
  assert.equal(buildCoursesUrl(), "/api/courses");
});
test("buildCoursesUrl with a department", () => {
  const u = parse(buildCoursesUrl({ department: "Electronics" }));
  assert.equal(u.pathname, "/api/courses");
  assert.equal(u.searchParams.get("department"), "Electronics");
});
test("buildCoursesUrl encodes & and spaces so the value survives", () => {
  const raw = buildCoursesUrl({ department: "Data Science & AI", q: "deep learning" });
  const u = parse(raw);
  assert.equal(u.searchParams.get("department"), "Data Science & AI");
  assert.equal(u.searchParams.get("q"), "deep learning");
  assert.ok(!raw.includes(" & "), "the & was not encoded — the server would see a broken query");
});
test("buildCoursesUrl leaves out blank filters", () => {
  const u = parse(buildCoursesUrl({ department: "", q: "   " }));
  assert.equal(u.search, "");
});
test("getJSON returns the parsed body", async () => {
  const fetchFn = fakeFetch(() => ({ status: 200, body: [{ id: 1 }] }));
  assert.deepEqual(await getJSON("/api/courses", fetchFn), [{ id: 1 }]);
  assert.deepEqual(fetchFn.calls, ["/api/courses"]);
});
test("getJSON rejects on a 404 — fetch itself does not", async () => {
  const fetchFn = fakeFetch(() => ({ status: 404, body: { message: "nope" } }));
  await assert.rejects(getJSON("/api/x", fetchFn), /HTTP 404/);
});
test("getJSON rejects on a 500", async () => {
  await assert.rejects(getJSON("/api/x", fakeFetch(() => ({ status: 500 }))), /HTTP 500/);
});
test("getJSON passes a network failure through", async () => {
  const fetchFn = fakeFetch(() => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(getJSON("/api/x", fetchFn), /Failed to fetch/);
});
test("fetchCourses asks for the right URL and returns the courses", async () => {
  const fetchFn = fakeFetch(() => ({ status: 200, body: [{ id: 7 }] }));
  const result = await fetchCourses({ department: "Humanities", q: "" }, fetchFn);
  assert.deepEqual(result, [{ id: 7 }]);
  assert.equal(parse(fetchFn.calls[0]).searchParams.get("department"), "Humanities");
});
