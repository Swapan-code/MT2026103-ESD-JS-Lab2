import { test } from "node:test";
import assert from "node:assert/strict";
import { cardView, summaryView, statusView, sgpaView } from "../src/s06-views.js";
import { initialState } from "../src/s05-store.js";
import { byId, deepFreeze } from "../support/helpers.js";

const pick = ({ id, code, title, credits }) => ({ id, code, title, credits });
const planner = deepFreeze([pick(byId(4)), pick(byId(10)), pick(byId(18))]); // 4 + 4 + 2 credits

test("cardView for a course not in the planner", () => {
  assert.deepEqual(cardView(byId(3), planner), {
    id: 3, heading: "CS305 · Database Systems", meta: "4 credits · Computer Science",
    seats: "12 seats left", inPlanner: false, buttonLabel: "Add", disabled: false,
  });
});
test("cardView for a planned course says Remove", () => {
  const v = cardView(byId(4), planner);
  assert.equal(v.inPlanner, true);
  assert.equal(v.buttonLabel, "Remove");
});
test("cardView: one seat, and full", () => {
  assert.equal(cardView(byId(5), planner).seats, "1 seat left");
  const full = cardView(byId(2), planner);
  assert.equal(full.seats, "Full");
  assert.equal(full.disabled, true);
});
test("summaryView", () => {
  assert.deepEqual(summaryView([]), { count: 0, credits: 0, overLimit: false, text: "Nothing planned yet" });
  assert.deepEqual(summaryView([pick(byId(4))]), { count: 1, credits: 4, overLimit: false, text: "1 course · 4 credits" });
  assert.equal(summaryView(planner).text, "3 courses · 10 credits");
});
test("statusView for each status", () => {
  const S = (o) => ({ ...initialState, ...o });
  assert.deepEqual(statusView(S({ status: "loading" })), { message: "Loading courses…", showRetry: false });
  assert.deepEqual(statusView(S({ status: "error", error: "HTTP 500" })), { message: "Couldn't load courses: HTTP 500", showRetry: true });
  assert.deepEqual(statusView(S({ status: "ready", courses: [] })), { message: "No courses match.", showRetry: false });
  assert.deepEqual(statusView(S({ status: "ready", courses: [byId(1)] })), { message: "", showRetry: false });
  assert.deepEqual(statusView(S({ status: "idle" })), { message: "", showRetry: false });
});
test("sgpaView with nothing planned / nothing graded", () => {
  assert.equal(sgpaView([], {}).text, "Add courses to the planner first");
  const v = sgpaView(planner, {});
  assert.equal(v.text, "Pick a grade to see your SGPA");
  assert.equal(v.sgpa, null);
});
test("sgpaView weights grade points by credits", () => {
  // CS402 (4 cr) A=10, MA101 (4 cr) B=8, HS101 (2 cr) C=6 → (40+32+12)/10 = 8.4
  const v = sgpaView(planner, { 4: "A", 10: "B", 18: "C" });
  assert.equal(v.sgpa, 8.4);
  assert.equal(v.text, "SGPA 8.40");
  assert.equal(v.credits, 10);
});
test("sgpaView counts only graded courses, and says how many", () => {
  const v = sgpaView(planner, { 4: "A" });
  assert.equal(v.sgpa, 10);
  assert.equal(v.text, "SGPA 10.00 · 1 of 3 courses graded");
});
test("sgpaView rounds to 2 decimals", () => {
  // (4×9 + 4×9 + 2×6)/10 = 8.4 ; (4×10 + 2×7)/6 = 9 ; use 3 courses for a repeating decimal:
  const three = deepFreeze([pick(byId(6)), pick(byId(8)), pick(byId(18))]); // 3 + 3 + 2 credits
  const v = sgpaView(three, { 6: "A", 8: "B-", 18: "D" }); // (30 + 21 + 10)/8 = 7.625
  assert.equal(v.sgpa, 7.63);
});
