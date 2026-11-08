// Section 15 — Build your own useState

// A tiny version of React's useState.
//   const [getCount, setCount] = useState(0, render);
// - getState() returns the current value.
// - setState(next) accepts a value OR an updater function (prev) => next,
//   stores the result, and then calls onChange() — the "hidden code" that
//   redraws the screen.
// - If the new value is the same (Object.is), it does nothing: no onChange.
export function useState(initial, onChange) {
  let state = initial;
  const getState = () => state;
  const setState = (next) => {
    const value = typeof next === "function" ? next(state) : next;
    if (Object.is(value, state)) return;
    state = value;
    onChange();
  };
  return [getState, setState];
}
