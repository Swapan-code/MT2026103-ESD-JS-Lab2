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
  const inPlanner = planner.some((c) => c.id === course.id);
  const seats =
    course.seatsLeft === 0
      ? "Full"
      : course.seatsLeft === 1
        ? "1 seat left"
        : `${course.seatsLeft} seats left`;
  return {
    id: course.id,
    heading: `${course.code} · ${course.title}`,
    meta: `${course.credits} credits · ${course.department}`,
    seats,
    inPlanner,
    buttonLabel: inPlanner ? "Remove" : "Add",
    disabled: course.seatsLeft === 0 && !inPlanner,
  };
}

// The planner summary.
//   { count, credits, overLimit, text }
//   text: "Nothing planned yet" | "1 course · 4 credits" | "3 courses · 10 credits"
//   overLimit: credits > 24
export function summaryView(planner) {
  const count = planner.length;
  const credits = planner.reduce((sum, c) => sum + c.credits, 0);
  const text =
    count === 0
      ? "Nothing planned yet"
      : `${count} ${count === 1 ? "course" : "courses"} · ${credits} credits`;
  return { count, credits, overLimit: credits > 24, text };
}

// The status line above the list.
//   { message, showRetry }
//   loading → "Loading courses…"
//   error   → `Couldn't load courses: ${state.error}`, with showRetry true
//   ready with no courses → "No courses match."
//   anything else → ""  (showRetry false except for errors)
export function statusView(state) {
  if (state.status === "loading") return { message: "Loading courses…", showRetry: false };
  if (state.status === "error") {
    return { message: `Couldn't load courses: ${state.error}`, showRetry: true };
  }
  if (state.status === "ready" && state.courses.length === 0) {
    return { message: "No courses match.", showRetry: false };
  }
  return { message: "", showRetry: false };
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
  const total = planner.length;
  const graded = planner.filter((c) => grades[c.id]);
  const credits = graded.reduce((sum, c) => sum + c.credits, 0);
  const points = graded.reduce((sum, c) => sum + c.credits * GRADE_POINTS[grades[c.id]], 0);
  const sgpa = graded.length === 0 ? null : Math.round((points / credits) * 100) / 100;

  let text;
  if (total === 0) text = "Add courses to the planner first";
  else if (graded.length === 0) text = "Pick a grade to see your SGPA";
  else if (graded.length === total) text = `SGPA ${sgpa.toFixed(2)}`;
  else text = `SGPA ${sgpa.toFixed(2)} · ${graded.length} of ${total} courses graded`;

  return { graded: graded.length, total, credits, sgpa, text };
}
