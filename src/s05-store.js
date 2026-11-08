// Section 05 — State as a state machine
//
// The whole app's state is ONE object. It only ever changes through
// transition(state, event), which returns a NEW state (or the SAME state
// when the event changes nothing). Never change `state` itself.

export const initialState = Object.freeze({
  status: "idle",       // "idle" | "loading" | "ready" | "error"
  courses: [],          // the courses from the last successful load
  error: null,          // the error message when status is "error"
  departments: [],      // every department name, sorted — filled by the first successful load
  department: "",       // the selected department filter ("" = all)
  query: "",            // the search box text
  planner: [],          // planned courses: { id, code, title, credits }
  grades: {},           // the SGPA calculator form: { [courseId]: "A" | "A-" | … }
});

const CREDIT_LIMIT = 24;

export function transition(state, event) {
  switch (event.type) {
    case "LOAD_START":
      return { ...state, status: "loading", error: null };
    case "LOAD_OK":
      return {
        ...state,
        status: "ready",
        error: null,
        courses: event.courses,
        departments:
          state.departments.length > 0
            ? state.departments
            : [...new Set(event.courses.map((c) => c.department))].sort(),
      };
    case "LOAD_FAIL":
      return { ...state, status: "error", error: event.message };
    case "SET_DEPARTMENT":
      return event.department === state.department
        ? state
        : { ...state, department: event.department };
    case "SET_QUERY":
      return event.query === state.query ? state : { ...state, query: event.query };
    case "ADD": {
      const { id, code, title, credits } = event.course;
      if (state.planner.some((c) => c.id === id)) return state;
      // stretch: refuse a full course, or one that would go over the credit limit
      if (event.course.seatsLeft === 0) return state;
      const planned = state.planner.reduce((sum, c) => sum + c.credits, 0);
      if (planned + credits > CREDIT_LIMIT) return state;
      return { ...state, planner: [...state.planner, { id, code, title, credits }] };
    }
    case "REMOVE": {
      if (!state.planner.some((c) => c.id === event.id)) return state;
      const { [event.id]: _dropped, ...grades } = state.grades;
      return {
        ...state,
        planner: state.planner.filter((c) => c.id !== event.id),
        grades,
      };
    }
    case "SET_GRADE": {
      if (event.grade === "") {
        if (!(event.id in state.grades)) return state;
        const { [event.id]: _dropped, ...grades } = state.grades;
        return { ...state, grades };
      }
      if (state.grades[event.id] === event.grade) return state;
      return { ...state, grades: { ...state.grades, [event.id]: event.grade } };
    }
    default:
      return state; // an event we don't know changes nothing
  }
}
