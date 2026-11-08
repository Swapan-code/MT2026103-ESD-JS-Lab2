// npm run repl — a Node console with the course data and every function from
// src/ already loaded, so you can try the doc's snippets directly.
import repl from "node:repl";
import { readdir } from "node:fs/promises";
import { courses } from "../data/courses.js";

const loaded = { courses };
for (const file of (await readdir(new URL("../src/", import.meta.url))).sort()) {
  Object.assign(loaded, await import(new URL(`../src/${file}`, import.meta.url)));
}

console.log("Loaded: " + Object.keys(loaded).join(", "));
console.log("Try:    await wait(500)   buildCoursesUrl({ q: 'learn' })   .exit to quit\n");
const session = repl.start({ prompt: "lab2> " });
Object.assign(session.context, loaded);
