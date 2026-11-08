// Section 05 — stretch: ADD refuses full courses and the 24-credit limit
import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, transition } from "../../src/s05-store.js";
import { byId, deepFreeze } from "../../support/helpers.js";

const pick = ({ id, code, title, credits }) => ({ id, code, title, credits });

test("ADD refuses a full course", () => {
  const s = deepFreeze({ ...structuredClone(initialState) });
  assert.equal(transition(s, { type: "ADD", course: byId(2) }), s);
});
test("ADD refuses a course that would go over 24 credits", () => {
  const s = deepFreeze({ ...structuredClone(initialState), planner: [1, 3, 4, 5, 10, 17].map((id) => pick(byId(id))) }); // 24 credits
  assert.equal(transition(s, { type: "ADD", course: byId(18) }), s);
});
