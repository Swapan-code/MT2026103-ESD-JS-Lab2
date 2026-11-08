import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, transition } from "../src/s05-store.js";
import { courses, byId, deepFreeze } from "../support/helpers.js";

const S = (over = {}) => deepFreeze({ ...structuredClone(initialState), ...over });
const pick = ({ id, code, title, credits }) => ({ id, code, title, credits });

test("LOAD_START → loading, clears the error, keeps the courses", () => {
  const s = transition(S({ status: "error", error: "x", courses: [byId(1)] }), { type: "LOAD_START" });
  assert.equal(s.status, "loading");
  assert.equal(s.error, null);
  assert.deepEqual(s.courses, [byId(1)]);
});
test("LOAD_OK → ready with the courses, and departments from the first load", () => {
  const s = transition(S({ status: "loading" }), { type: "LOAD_OK", courses });
  assert.equal(s.status, "ready");
  assert.equal(s.courses, courses);
  assert.deepEqual(s.departments, ["Computer Science", "Data Science & AI", "Electronics", "Humanities", "Mathematics"]);
});
test("LOAD_OK keeps the departments it already has", () => {
  const s = transition(S({ departments: ["Electronics"] }), { type: "LOAD_OK", courses: [byId(1)] });
  assert.deepEqual(s.departments, ["Electronics"]);
});
test("LOAD_FAIL → error with the message, keeps the old courses", () => {
  const s = transition(S({ status: "loading", courses: [byId(1)] }), { type: "LOAD_FAIL", message: "HTTP 500" });
  assert.equal(s.status, "error");
  assert.equal(s.error, "HTTP 500");
  assert.equal(s.courses.length, 1);
});
test("SET_DEPARTMENT and SET_QUERY", () => {
  assert.equal(transition(S(), { type: "SET_DEPARTMENT", department: "Electronics" }).department, "Electronics");
  assert.equal(transition(S(), { type: "SET_QUERY", query: "learn" }).query, "learn");
});
test("an unchanged filter returns the SAME state", () => {
  const s = S({ department: "Electronics", query: "x" });
  assert.equal(transition(s, { type: "SET_DEPARTMENT", department: "Electronics" }), s);
  assert.equal(transition(s, { type: "SET_QUERY", query: "x" }), s);
});
test("ADD puts { id, code, title, credits } in the planner", () => {
  const s = transition(S(), { type: "ADD", course: byId(4) });
  assert.deepEqual(s.planner, [pick(byId(4))]);
});
test("ADD of a course already planned returns the SAME state", () => {
  const s = S({ planner: [pick(byId(4))] });
  assert.equal(transition(s, { type: "ADD", course: byId(4) }), s);
});
test("REMOVE takes it out, and drops its grade", () => {
  const s = transition(S({ planner: [pick(byId(4)), pick(byId(10))], grades: { 4: "A", 10: "B" } }), { type: "REMOVE", id: 4 });
  assert.deepEqual(s.planner.map((c) => c.id), [10]);
  assert.deepEqual(s.grades, { 10: "B" });
});
test("REMOVE of a course not planned returns the SAME state", () => {
  const s = S();
  assert.equal(transition(s, { type: "REMOVE", id: 4 }), s);
});
test("SET_GRADE sets one course's grade with a computed key", () => {
  const s = transition(S({ grades: { 10: "B" } }), { type: "SET_GRADE", id: 4, grade: "A-" });
  assert.deepEqual(s.grades, { 10: "B", 4: "A-" });
});
test("SET_GRADE to \"\" removes the entry; the same grade returns the SAME state", () => {
  const s = S({ grades: { 4: "A" } });
  assert.deepEqual(transition(s, { type: "SET_GRADE", id: 4, grade: "" }).grades, {});
  assert.equal(transition(s, { type: "SET_GRADE", id: 4, grade: "A" }), s);
});
test("an unknown event returns the SAME state", () => {
  const s = S();
  assert.equal(transition(s, { type: "NOPE" }), s);
});
test("transition never changes the state it is given (frozen input)", () => {
  const s = S({ planner: [pick(byId(1))], grades: { 1: "A" } });
  for (const e of [{ type: "LOAD_START" }, { type: "LOAD_OK", courses }, { type: "ADD", course: byId(3) }, { type: "REMOVE", id: 1 }, { type: "SET_GRADE", id: 1, grade: "B" }]) {
    assert.doesNotThrow(() => transition(s, e), `${e.type} tried to change the state in place`);
  }
});
