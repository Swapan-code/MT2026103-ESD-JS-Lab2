#!/usr/bin/env node
// npm run carry -- ../js-lab1
//
// Brings YOUR JS Lab 1 work into this lab. The app here is built on your own useState from
// JS Lab 1 §15, so this starter ships a stub that throws "TODO" in its place. Run it once, in
// this folder, before section 07 (section 01 of the doc says so).
//
// It works from ANY folder that holds a finished JS Lab 1: your own ../js-lab1, or a
// solution your TA hands out later. It copies the files listed in COPY from there into this
// folder (keeping what it replaces in .carry-backup/), and lists the files in BY_HAND, which
// both labs change, for you to merge by hand. It never changes the folder you give it.

const PREVIOUS = { label: "JS Lab 1", name: "esd-js-lab1", folder: "../js-lab1" };

// Copied whole: [file in the previous lab, file here]. This lab doesn't change them
// (or only changes them in steps the doc gives you).
const COPY = [
  ["src/s15-state.js", "src/state.js"],
];

// Both labs change these: carry doesn't touch them. It tells you what to copy by hand.
const BY_HAND = [];

// Parts of the previous lab this lab's tests rely on. Carry warns when a file in the previous
// folder doesn't contain the text in `has`.
const NEEDS = [];

// What this lab then changes in the copied files, and when.
const THEN = [
];

const CHECK = [
  "npm run repl, then:  const [get, set] = useState(1, () => {}); set((n) => n + 1); get()",
  "                     → 2. (That's §15's smarter setState — updater functions. Section 07 needs it.)",
  "npm test             this lab's own exercises — they don't use state.js",
];

// ---------------------------------------------------------------------------------------
// You don't need to read below this line.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const force = args.includes("--force");
const given = args.find((a) => !a.startsWith("--"));
const show = (p) => p.split(sep).join("/");
const out = (line = "") => console.log(line);
const stop = (msg) => { console.error(`\n${msg}\n`); process.exit(1); };

if (!given) stop(`Usage:  npm run carry -- ${PREVIOUS.folder}\n\nGive it the folder of your ${PREVIOUS.label} — or any folder with a finished ${PREVIOUS.label} in it.`);

const from = resolve(given);
const fromShown = show(given).replace(/\/+$/, "");
if (!existsSync(from) || !statSync(from).isDirectory()) stop(`There's no folder at ${fromShown} (looked in ${show(from)}).`);
if (from === HERE) stop(`${fromShown} is this folder. Give it your ${PREVIOUS.label} folder, e.g.  npm run carry -- ${PREVIOUS.folder}`);

let name = null;
try { name = JSON.parse(readFileSync(join(from, "package.json"), "utf8")).name; } catch {}
if (name !== PREVIOUS.name) {
  const found = name ? `its package.json says "${name}"` : "it has no package.json";
  if (!force) stop(`${fromShown} doesn't look like ${PREVIOUS.label}: ${found}, expected "${PREVIOUS.name}".\nIf you're sure it's the right folder, run it again with --force at the end.`);
  out(`Warning: ${found}, expected "${PREVIOUS.name}" — going on because of --force.`);
}

out(`\nCarrying ${PREVIOUS.label} into this folder, from ${fromShown}\n`);

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupDir = join(HERE, ".carry-backup", stamp);
const copied = [], same = [], missing = [], unfinished = [];

for (const [src, dest] of COPY) {
  const a = join(from, src);
  const b = join(HERE, dest);
  if (!existsSync(a)) { missing.push(src); continue; }
  const text = readFileSync(a, "utf8");
  if (text.includes('throw new Error("TODO')) unfinished.push(src);
  if (existsSync(b) && readFileSync(b, "utf8") === text) { same.push(dest); continue; }
  if (existsSync(b)) {
    mkdirSync(dirname(join(backupDir, dest)), { recursive: true });
    copyFileSync(b, join(backupDir, dest));
  }
  mkdirSync(dirname(b), { recursive: true });
  copyFileSync(a, b);
  copied.push(src === dest ? dest : `${dest}  (from ${src})`);
}

out(`Copied ${copied.length} file${copied.length === 1 ? "" : "s"} from ${fromShown}:`);
for (const f of copied) out(`  ${f}`);
if (same.length) out(`Already the same here, left alone: ${same.join(", ")}`);
if (copied.length && existsSync(backupDir)) out(`What they replaced is saved in ${show(relative(HERE, backupDir))}/`);
if (missing.length) {
  out(`\nNot found in ${fromShown}, so not copied: ${missing.join(", ")}`);
  out(`  Is that the right folder? Ask your TA if your ${PREVIOUS.label} is missing these.`);
}
if (unfinished.length) {
  out(`\nNot finished yet — these still throw "TODO" in ${fromShown}:`);
  for (const f of unfinished) out(`  ${f}`);
  out(`  Finish them (there, then carry again — or here), or ask your TA: the solution may be handed out later,`);
  out(`  and  npm run carry -- <that folder>  works from it too.`);
}

const lacking = NEEDS.filter(({ file, has }) => existsSync(join(from, file)) && !readFileSync(join(from, file), "utf8").includes(has));
if (lacking.length) {
  out(`\nThis lab's tests also need these parts of your ${PREVIOUS.label}, and they don't seem to be`);
  out(`in ${fromShown}. Finish them there and carry again — or here:`);
  for (const n of lacking) out(`  - ${n.file}: ${n.say}`);
}

if (BY_HAND.length) {
  out(`\nBy hand — both labs change ${BY_HAND.length === 1 ? "this file" : "these files"}, so carry leaves ${BY_HAND.length === 1 ? "it" : "them"} alone:`);
  BY_HAND.forEach(({ file, steps }, i) => {
    out(`  ${i + 1}. Open ${file} here AND ${fromShown}/${file}.`);
    out(`     Copy into the TODOs marked "from ${PREVIOUS.label}", in order:`);
    for (const s of steps) out(`       - ${s}`);
  });
}
if (THEN.length) {
  out(`\nThen, as the doc's sections get to them:`);
  for (const t of THEN) out(`  - ${t}`);
}
out(`\nCheck it worked:`);
for (const c of CHECK) out(`  ${c}`);
out();
