// npm run web — serves this folder AND a small course API, on one port.
// Open http://localhost:5500/web/  (no install needed)
//
// The API has the same shape as the course API used in the React labs:
//   GET /api/courses?department=&q=     → 200 [Course, …]   sorted by code
//   GET /api/courses/:id                → 200 Course | 404 ApiError
// Extra switches, for practising with a bad network:
//   &delay=800      wait 800 ms before answering
//   &delay=random   wait a random 100–1500 ms
//   &fail=1         answer 500 with an ApiError
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { courses } from "../data/courses.js";

const root = resolve(process.cwd());
const port = Number(process.env.PORT) || 5500;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

const sorted = [...courses].sort((a, b) => a.code.localeCompare(b.code));

// The server's own filtering. It doesn't use anything in src/: the API works the same
// whatever state your exercises are in. department: exact name, any case. q: part of
// the code or the title, any case.
function matches(course, params) {
  const department = (params.get("department") ?? "").toLowerCase();
  const q = (params.get("q") ?? "").trim().toLowerCase();
  if (department && course.department.toLowerCase() !== department) return false;
  return !q || [course.code, course.title].some((text) => text.toLowerCase().includes(q));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sendJSON(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}
function apiError(res, status, error, message, path) {
  sendJSON(res, status, { timestamp: new Date().toISOString(), status, error, message, path, fieldErrors: null });
}

async function handleApi(req, res, url) {
  const p = url.searchParams;
  const delay = p.get("delay") === "random" ? 100 + Math.floor(Math.random() * 1400) : Number(p.get("delay")) || 0;
  if (delay) await sleep(Math.min(delay, 10000));
  if (p.get("fail") === "1") return apiError(res, 500, "Internal Server Error", "The course service is having a bad day (fail=1)", url.pathname);
  if (req.method !== "GET") return apiError(res, 405, "Method Not Allowed", "This local API is read-only", url.pathname);

  if (url.pathname === "/api/courses") {
    return sendJSON(res, 200, sorted.filter((course) => matches(course, p)));
  }
  const one = url.pathname.match(/^\/api\/courses\/(\d+)$/);
  if (one) {
    const course = sorted.find((c) => c.id === Number(one[1]));
    return course ? sendJSON(res, 200, course) : apiError(res, 404, "Not Found", `No course with id ${one[1]}`, url.pathname);
  }
  return apiError(res, 404, "Not Found", `No such endpoint: ${url.pathname}`, url.pathname);
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
  const path = decodeURIComponent(url.pathname);
  const file = normalize(join(root, path.endsWith("/") ? path + "index.html" : path));
  if (!file.startsWith(root)) { res.writeHead(403).end("Forbidden"); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": (types[extname(file)] || "application/octet-stream") + "; charset=utf-8" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end(`Not found: ${path}`);
  }
}).listen(port, () => {
  console.log(`Serving ${root} and the course API`);
  console.log(`Open  http://localhost:${port}/web/`);
  console.log(`API   http://localhost:${port}/api/courses`);
});
