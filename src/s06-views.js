// Section 06 — From state to screen: views
// Pure functions: state in, plain data describing the screen out. No DOM here.
// Nothing they return is ever stored in state — it's worked out fresh on every render.

// What one course card shows.
//   { id, heading, meta, seats, inPlanner, buttonLabel, disabled }
//   heading      "CS402 · Enterprise Software Development"
//   meta         "4 credits · Computer Science"
//   seats        "Full" | "1 seat left" | "12 seats left"
//   inPlanner    is this course already in the planner?
//   buttonLabel  "Remove" if in the planner, otherwise "Add"
//   disabled     true only for a FULL course that is NOT in the planner
export function cardView(course, planner) {
  throw new Error("TODO");
}

// The planner summary.
//   { count, credits, overLimit, text }
//   text: "Nothing planned yet" | "1 course · 4 credits" | "3 courses · 10 credits"
//   overLimit: credits > 24
export function summaryView(planner) {
  throw new Error("TODO");
}

// The status line above the list.
//   { message, showRetry }
//   loading → "Loading courses…"
//   error   → `Couldn't load courses: ${state.error}`, with showRetry true
//   ready with no courses → "No courses match."
//   anything else → ""  (showRetry false except for errors)
export function statusView(state) {
  throw new Error("TODO");
}

// The SGPA calculator.
// Grade points on a 10-point scale:
export const GRADE_POINTS = Object.freeze({ A: 10, "A-": 9, B: 8, "B-": 7, C: 6, D: 5, F: 0 });

// SGPA = sum(credits × points) / sum(credits), over the planned courses that HAVE a grade.
//   { graded, total, credits, sgpa, text }
//   graded   how many planned courses have a grade
//   total    how many courses are planned
//   credits  the credits of the graded courses
//   sgpa     a number rounded to 2 decimals, or null when nothing is graded
//   text     "Add courses to the planner first"           (nothing planned)
//            "Pick a grade to see your SGPA"              (planned, none graded)
//            "SGPA 8.40 · 3 of 4 courses graded"           (some graded)
//            "SGPA 8.40"                                   (all graded)
//   (sgpa in text always shows 2 decimals: 9 → "9.00")
export function sgpaView(planner, grades) {
  throw new Error("TODO");
}
