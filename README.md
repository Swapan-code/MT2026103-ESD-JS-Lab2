# ESD — JS Lab 2: A JavaScript app, without React

Pre-lab exercises for JS Lab 2. The full walkthrough is the lab doc:
**https://esd-ta-sessions.vercel.app/js-app.html** — read it alongside this folder.

No AI for this lab. Type the code yourself.

## Setup (once)

```bash
cd esd-labs
git pull         # js-lab2 appears next to js-lab1
cd js-lab2
npm run carry -- ../js-lab1   # step 0: bring YOUR useState from JS Lab 1 (below)
npm test         # at first almost everything fails with "TODO"
```

Node.js 20 or newer. Nothing to `npm install`.

## Step 0 — bring your JS Lab 1 answer

The app here is built on **your** `useState` from JS Lab 1 §15, so this starter doesn't
contain it: `src/state.js` is a stub that throws "TODO". `npm run carry -- ../js-lab1`
copies your `js-lab1/src/s15-state.js` over it (the stub is kept in `.carry-backup/`).
Nothing to merge by hand. Lab 2 needs all of §15, including "A smarter setState" (updater
functions, and the `Object.is` skip): in `js-lab1`, `npm test` should pass `s15-smarter.test.js`.
It worked when `npm run repl` → `const [get, set] = useState(1, () => {}); set((n) => n + 1); get()`
gives `2`. You need it from section 07 on; this lab's `npm test` doesn't use it.

**If your Lab 1 isn't finished, ask your TA** — the solution may be handed out later, and
`npm run carry -- <that folder>` works from it too.

## Core and stretch

**Core** is mandatory: it's what we go through in the lab, and `npm test` checks it.
**Stretch** is extra: `npm run test:stretch` checks it. Ask about either, any time.

```bash
npm test               # core tests — get these to "fail 0"
npm run test:stretch   # stretch tests
npm run web            # the app + a local course API → http://localhost:5500/web/
npm run repl           # a console with everything in src/ loaded (top-level await works)
```

## Work section by section (all core unless marked)

| Doc section | File you edit | Run just its tests |
| --- | --- | --- |
| 03 Promises and await | `src/s03-async.js` | `node --test test/s03.test.js` |
| 03 — stretch: predict, then run | `predict/async.js` | `node predict/async.js` |
| 04 fetch, URLs and failures | `src/s04-api.js` | `node --test test/s04.test.js` |
| 05 State and transitions | `src/s05-store.js` | `node --test test/s05.test.js` |
| 05 — stretch: rules in `ADD` | `src/s05-store.js` | `node --test test/stretch/s05.stretch.test.js` |
| 06 Views and the SGPA calculator | `src/s06-views.js` | `node --test test/s06.test.js` |
| 07–08 The app | `web/app.js` | `npm run web` → http://localhost:5500/web/ |
| 09 Out-of-order responses | `src/s09-latest.js`, then `web/app.js` | `node --test test/s09.test.js` |
| 09 — stretch: `debounce` | `src/s09-latest.js` | `node --test test/stretch/s09.stretch.test.js` |

Yours, from JS Lab 1 (step 0): `src/state.js`. Given, don't edit: `web/index.html`,
`web/styles.css`, `tools/` (`tools/serve.js` is the local API — it filters the courses
itself, and doesn't use anything in `src/`).

## The local API

`npm run web` also serves:

```
GET /api/courses?department=&q=     every matching course, sorted by code
GET /api/courses/:id                one course, or 404
   &delay=1500 | &delay=random      answer slowly
   &fail=1                          answer 500
```

The app's **Network** switch adds those last options for you.

## Rules

- **Don't change the tests.** Fix your code until they pass.
- The tests **freeze** their inputs. `Cannot assign to read only property` or
  `Cannot add property` means your function changed its input.
- `inlab/` is for the lab session itself. Leave it until then.

## Done means

`npm test` ends with `fail 0`, the app does everything on the checklist in
section 07 of the doc, focus stays on a grade dropdown after picking (section
08), and the Random network can't make the list disagree with the department
(section 09). Stretch is a bonus.
