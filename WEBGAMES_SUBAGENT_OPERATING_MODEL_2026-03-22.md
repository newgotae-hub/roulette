# Webgames Subagent Operating Model

Date: 2026-03-22

This playbook is for building and shipping future web games in the Randomly Pick repo without turning one agent into the bottleneck.

The goal is simple:

- keep the main site tone intact
- let subagents work in parallel
- keep QA deterministic
- keep release steps boring and repeatable

## Repo Map

Use these paths as the default ownership map for webgame work.

- `games/` and `en/games/` are the main Games hub surfaces.
- `games/<slug>/index.html` and `en/games/<slug>/index.html` are the playable game pages.
- `assets/js/games-<slug>.js` holds game runtime logic.
- `assets/css/games-<slug>.css` holds game-specific shell styling when the game needs it.
- `assets/qa/webgames/` holds QA fixtures, contract harnesses, and scenario JSON.
- `scripts/qa-webgames.js` is the browser QA runner.
- `scripts/generate-sitemaps.js` keeps the Games routes indexable.
- `scripts/validate-seo.js` is the deploy gate for canonical, hreflang, and content regressions.
- `scripts/adsense-readiness-check.js` is the AdSense safety gate.
- `scripts/deploy-main.sh` is the required release path.
- `FIX_LOG.md` records every completed fix or rollout.

The current repo already follows this pattern with `snake` and `number-merge` as concrete examples.

## Mobile / App-Webview Default

New webgames should be scaffolded as mobile-first surfaces by default.

Baseline requirements:

- include `viewport-fit=cover` in the route `<meta name="viewport">`
- respect safe-area insets in page shell padding
- keep interactive controls at or above a 44px tap target
- use `touch-action` intentionally on buttons, links, and the game surface
- keep the first load readable in a narrow in-app webview as well as a desktop browser
- prefer app-webview-safe defaults over hover-only affordances

The scaffold helper should emit these defaults automatically so future workers do
not have to remember them per game.

## Roles

### 1. Lead

Owns scope, file boundaries, merge order, and final release.

Responsibilities:

- decide which game gets built next
- split work by file cluster
- keep shared files owned by one person only
- merge QA, release, and documentation outputs
- stop work if a shared file starts drifting

Does not:

- rewrite gameplay systems directly unless absolutely necessary
- edit every locale copy block by hand
- run the whole project alone when subagents can do it

### 2. Explorer

Reads the repo and reports facts only.

Responsibilities:

- inspect the current hub, game pages, and baseline tool pages
- identify tone, layout, and copy mismatches
- map file ownership before implementation starts
- flag drift risks and shared file conflicts

Does not:

- edit files
- propose vague "nice to have" ideas without file references
- touch the implementation branch

### 3. Game Worker

Owns one slug end to end.

Typical ownership:

- `games/<slug>/index.html`
- `en/games/<slug>/index.html`
- `assets/js/games-<slug>.js`
- `assets/css/games-<slug>.css`
- `assets/qa/webgames/<slug>.qa.json`
- `assets/qa/webgames/<slug>-en.qa.json`

Does not:

- change other game slugs
- change hub pages unless explicitly assigned
- touch shared SEO or sitemap code

Mobile-first note:

- Game pages should work in a constrained in-app webview before they are tuned
  for desktop polish.
- If a game needs touch controls, the primary buttons should already meet the
  tap-target baseline from the scaffold.
- If a game uses a canvas, the page shell still needs safe-area-aware spacing so
  the UI does not collide with browser chrome.

### 4. Hub Worker

Owns `games/index.html` and `en/games/index.html`.

Responsibilities:

- keep the hub visually aligned with the main site
- keep the game list scannable
- make sure the first playable title is obvious
- keep trust/support links consistent with the rest of the site

### 5. QA Worker

Owns deterministic verification, not implementation.

Responsibilities:

- run `scripts/qa-webgames.js`
- prefer grouped scenario runs for a release wave instead of one-by-one reruns
- capture `render_game_to_text()` state
- inspect screenshots and console errors
- confirm restart, pause, failure, and recovery flows
- verify that the contract still works across locale variants

Helpful runner patterns:

- `--scenario <id>` for one route
- `--scenario a,b,c` for a short manual batch
- `--group new-wave --strict` for the current launch pack
- `--group board-pack --locale en` for English-only board-game checks

The shared runner now keeps going after one scenario fails and reports the full
failed set at the end, which is better for parallel repair work.

### 6. Release Worker

Owns the boring final loop.

Responsibilities:

- run sitemap generation
- run SEO validation
- run AdSense readiness checks
- run diff cleanliness checks
- deploy through `scripts/deploy-main.sh`

### 7. Doc Owner

Usually the Lead or Release Worker.

Responsibilities:

- update `FIX_LOG.md`
- add one short rollout note when the change needs more context
- keep the implementation history easy to scan

## Ownership Matrix

Keep this rule set simple:

| Area | Primary owner | Notes |
| --- | --- | --- |
| `games/index.html`, `en/games/index.html` | Hub Worker | Hub tone, cards, trust/footer placement |
| `games/<slug>/index.html`, `en/games/<slug>/index.html` | Game Worker | One slug per worker |
| `assets/js/games-<slug>.js` | Game Worker | Gameplay logic and QA hooks |
| `assets/css/games-<slug>.css` | Game Worker or UI Worker | Only for that slug |
| `assets/qa/webgames/*.qa.json` | QA Worker | Scenario and contract data |
| `scripts/qa-webgames.js` | QA / Release Worker | Shared runner only, not per-game feature work |
| `scripts/generate-sitemaps.js` | Release Worker | Shared publishing logic |
| `scripts/validate-seo.js` | Release Worker | Shared gatekeeper |
| `scripts/deploy-main.sh` | Release Worker | Never replace with raw push |
| `FIX_LOG.md` | Doc Owner | One short entry per completed fix |

If two agents need the same shared file, stop and assign a single integrator.

## Parallel Workflow

### Phase 0: Scope Lock

Before coding starts, assign:

- the slug
- the locale scope
- the shared files that may change
- the QA scenario name
- the release owner

Example:

- `Hub Worker` owns `games/index.html`
- `Game Worker A` owns `games/snake/`
- `Game Worker B` owns `games/number-merge/`
- `QA Worker` owns `assets/qa/webgames/*.qa.json` and `scripts/qa-webgames.js`

### Phase 1: Hub First, Then Game Shell

Start with the hub and the shell, not the full game logic.

Do:

- wire the new card into the hub
- create the slug page shell
- keep the hub copy short and site-like
- keep trust/footer links in the site's existing pattern

Do not:

- let the game worker rewrite the hub tone
- let the hub worker sneak game logic into shared files

### Phase 2: Game Logic in Isolation

Let the game worker own the runtime and UI for one slug.

Good boundaries:

- one runtime file
- one CSS file
- one page pair per locale
- one QA scenario pair

Bad boundaries:

- one worker touching several slugs
- one worker editing shared nav and game logic at the same time
- multiple workers editing the same locale page bundle

### Phase 3: QA as a Separate Lane

Do not ask the implementation worker to self-certify.

Instead:

- QA Worker runs the scenario
- QA Worker records text state and screenshots
- QA Worker reports exact failures only
- Game Worker fixes the listed failures
- QA Worker reruns until stable
- When several titles are in flight, use one grouped QA run first so the team
  gets the complete fail list before splitting fixes back out to game workers

### Phase 4: Release Gate

When the game and hub are stable:

1. generate sitemaps
2. run SEO validation
3. run AdSense readiness checks
4. run diff check
5. deploy with `scripts/deploy-main.sh`

If any step fails, stop and report the first blocker.

### Phase 5: Document the Rollout

Add:

- a short `FIX_LOG.md` entry
- a rollout note if the change needs deeper explanation

Keep the writeup short enough that the next agent can find the history fast.

## Parallel Lane Rules

Use these rules to keep one worker from becoming the bottleneck.

### Shared-file freeze

- If a worker owns a shared file cluster, no other worker edits those files until the owner publishes a handoff.
- Shared files are `games/index.html`, `en/games/index.html`, `scripts/qa-webgames.js`, `scripts/generate-sitemaps.js`, `scripts/validate-seo.js`, `scripts/adsense-readiness-check.js`, and any locale sync script that touches multiple pages.
- Slug-local files stay open only to the assigned Game Worker unless the Lead explicitly reassigns them.

### Handoff gates

- A worker hands off only after it reports the changed files, the exact QA state, and any known follow-up risk.
- The Lead accepts a handoff only when the worker has finished its own scope, the diff is clean, and the next worker can start without reopening the same shared files.
- If a handoff depends on shared-file changes, the Lead merges that cluster first before assigning the next lane.

### Lead interrupt rule

- The Lead may interrupt a worker only for a shared-file conflict, a failed QA gate, a broken deploy gate, or a scope mismatch that would create rework.
- The Lead should not interrupt a worker just to polish one more copy line while another lane is still producing useful work.
- When interrupted, the worker stops at the nearest clean boundary and reports the last safe state instead of improvising a cross-lane fix.

## QA Loop

Use the webgame QA runner and the page contract together.

### Required contract

Keep the game page compatible with the current runner contract in `scripts/qa-webgames.js` and the QA fixtures under `assets/qa/webgames/`.

At minimum, the page should expose:

- `window.render_game_to_text()`
- `window.advanceTime(ms)`
- `window.reset()` or a stable alias such as `window.resetGame()`
- `window.QA_READY === true` or a compatible readiness flag

If a page already uses another stable hook name, add an alias instead of forcing the runner to special-case every game.

### What QA must see

The QA worker should verify that the game can show:

- initial ready state
- active play state
- pause or restart state if the game supports it
- win or failure state if the game has one
- deterministic reset behavior
- locale-safe text output in `render_game_to_text()`

### Evidence to collect

For each run:

- the exact scenario name
- the page URL that passed
- the current text snapshot
- the screenshot path
- the console error status

### Scenario files

Use one scenario pair per slug when possible:

- `assets/qa/webgames/<slug>.qa.json`
- `assets/qa/webgames/<slug>-en.qa.json`

The fallback harness is only for development or pre-page states.

## Release Loop

Use the repo's existing release commands instead of inventing a new path.

Recommended sequence:

1. run `node scripts/qa-webgames.js --scenario <slug>`
2. run `node scripts/generate-sitemaps.js`
3. run `node scripts/validate-seo.js`
4. run `node scripts/adsense-readiness-check.js`
5. run `git diff --check`
6. deploy with `scripts/deploy-main.sh`

If the change touches locale sync, run the relevant generator before the release gate.

If the change touches `games/index.html` or `en/games/index.html`, re-check that the hub still points to the right first playable title.

## Recommended Prompt Patterns

These prompt shapes work well when you are delegating to subagents.

### Explorer prompt

> You are the Games Hub Explorer. Read-only. Compare the current hub/game pages against the main Randomly Pick tone and report only concrete mismatches with file references. Do not edit files.

### Hub Worker prompt

> You own `games/index.html` and `en/games/index.html` only. Keep the hub aligned with the main site tone, keep the first playable game obvious, and do not touch gameplay logic.

### Game Worker prompt

> You own `games/<slug>/index.html`, `en/games/<slug>/index.html`, `assets/js/games-<slug>.js`, and `assets/css/games-<slug>.css`. Build a polished static web game using the existing QA contract. Do not edit other slugs or shared files unless explicitly assigned.

### QA Worker prompt

> You own the browser verification only. Run `scripts/qa-webgames.js` for the target slug, capture `render_game_to_text()`, screenshots, and console errors, and report exact failures only.

### Release Worker prompt

> You own the final gate. Run QA, sitemap generation, SEO validation, AdSense readiness, and diff checks, then deploy only if everything passes. Report the first blocker exactly.

### Conflict-avoidance prompt

> If another agent is already touching the same shared file, stop and hand the file back to the Lead. Prefer one integrator per shared file cluster.

## Avoiding Merge Conflicts

The easiest way to avoid conflicts is to keep the file graph boring.

Rules:

- one slug, one Game Worker
- one hub, one Hub Worker
- one QA runner, one QA Worker
- one deploy path, one Release Worker
- shared files only touched by the Lead or Release Worker

Extra safeguards:

- use separate scenario files per game
- keep slug-specific copy in the slug's own runtime or page pair
- do not let multiple agents edit the same top-level HTML file at once
- when a shared script must change, freeze game work until the shared script is merged
- if a change affects both `games/` and `en/games/`, let the Lead merge the locale pair

## Good Defaults

When in doubt:

- keep the hub light and readable
- keep the game playable in under a minute
- keep QA deterministic
- keep the release path unchanged
- keep documentation short and linked

That is how the webgame section stays shippable without becoming a tangle.

