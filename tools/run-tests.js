// npm test             → core tests (mandatory)
// npm run test:stretch → stretch tests (extra)
// npm run test:all     → both
// Works the same on Windows, macOS and Linux, on Node 20+.
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";

const which = process.argv[2] ?? "core";
const list = (dir) =>
  readdirSync(dir).filter((f) => f.endsWith(".test.js")).sort().map((f) => `${dir}/${f}`);

const files = {
  core: list("test"),
  stretch: list("test/stretch"),
  all: [...list("test"), ...list("test/stretch")],
}[which];

if (!files) {
  console.error(`Unknown set "${which}". Use core, stretch or all.`);
  process.exit(1);
}
const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
