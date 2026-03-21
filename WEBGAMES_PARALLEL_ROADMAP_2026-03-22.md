# Webgames Parallel Roadmap

Date: 2026-03-22
Repo: `C:\Users\newgo\OneDrive\바탕 화면\코딩프로젝트\코덱스\랜덤리픽`
Scope: future parallel webgame production after `Snake` and `Number Merge`

## Goal

Prioritize the next wave of browser games that:

- fit a static HTML/CSS/JS site
- preserve the current Randomly Pick tone
- can expose deterministic QA hooks
- have reasonable traffic potential
- can be split across parallel workers without shared-file conflicts

## Ranking Criteria

Scores are directional, not mathematical:

- Static-site fit: how naturally the game works without backend infra
- QA determinism: how easy it is to make stable `render_game_to_text()` plus seeded/resettable scenarios
- Traffic potential: how likely the title/genre is to attract repeat clicks and search interest
- Parallel safety: how easily a worker can own the game in isolated files

## Recommended Queue

### Tier 1: Build next

#### 1. Brick Breaker

- Static-site fit: High
- QA determinism: High
- Traffic potential: High
- Why it fits: familiar arcade loop, quick sessions, clean keyboard/touch support, and easy editorial framing
- QA notes: deterministic ball launch angle, brick count, lives, and score can all be exposed in text
- Parallel safety: High
- Ownership suggestion:
  - `/games/brick-breaker/index.html`
  - `/en/games/brick-breaker/index.html`
  - `/assets/js/games-brick-breaker.js`
  - `/assets/css/games-brick-breaker.css`

#### 2. Memory Match

- Static-site fit: High
- QA determinism: High
- Traffic potential: Medium-High
- Why it fits: lightweight puzzle game, mobile-friendly, easy to make feel polished without heavy animation
- QA notes: seeded card layout, move count, matched pairs, and timer/status are easy to verify
- Parallel safety: High
- Ownership suggestion:
  - `/games/memory-match/index.html`
  - `/en/games/memory-match/index.html`
  - `/assets/js/games-memory-match.js`
  - `/assets/css/games-memory-match.css`

#### 3. Minesweeper Lite

- Static-site fit: High
- QA determinism: Medium-High
- Traffic potential: High
- Why it fits: recognizable classic puzzle, long replay life, and good contrast against Snake/Number Merge
- QA notes: must lock mine placement to a seed and expose open cells, flags, mine count, and phase
- Parallel safety: High
- Ownership suggestion:
  - `/games/minesweeper/index.html`
  - `/en/games/minesweeper/index.html`
  - `/assets/js/games-minesweeper.js`
  - `/assets/css/games-minesweeper.css`

### Tier 2: Strong follow-ups

#### 4. Reaction Tap

- Static-site fit: High
- QA determinism: High
- Traffic potential: Medium
- Why it fits: ultra-short loop, easy mobile play, and useful genre variety on the Games hub
- QA notes: deterministic target timing and success/fail counters keep tests simple
- Parallel safety: High

#### 5. Color Lines

- Static-site fit: High
- QA determinism: High
- Traffic potential: Medium
- Why it fits: board-based puzzle with low implementation cost and strong deterministic QA potential
- QA notes: board state, line clears, score, and next colors can be verified textually
- Parallel safety: High

#### 6. Bubble Pop

- Static-site fit: Medium-High
- QA determinism: Medium
- Traffic potential: Medium-High
- Why it fits: visually satisfying and broader casual appeal than some logic games
- QA notes: collision and cluster clear behavior add some QA complexity, but still manageable with seeded shot order
- Parallel safety: High

### Tier 3: Build after the hub is broader

#### 7. Word Swipe

- Static-site fit: Medium
- QA determinism: Medium
- Traffic potential: Medium-High
- Why it fits: adds a word/puzzle lane to the hub without needing heavy graphics
- QA notes: dictionary policy must stay intentionally small and explicit or tests become noisy
- Parallel safety: Medium-High

#### 8. Solitaire Mini

- Static-site fit: Medium
- QA determinism: Medium
- Traffic potential: High
- Why it fits: strong brand familiarity and long play sessions
- QA notes: deck order can be seeded, but move validation and win-state coverage make QA heavier
- Parallel safety: Medium-High

#### 9. Crossword Mini

- Static-site fit: Medium
- QA determinism: Medium
- Traffic potential: Medium
- Why it fits: good editorial depth, but much more content-heavy than the current hub
- QA notes: puzzle data, clue state, and validation rules need more bespoke fixtures than the arcade titles
- Parallel safety: Medium

## Best Parallel Build Waves

### Wave A

Build together:

- Brick Breaker
- Memory Match
- Minesweeper Lite

Why this wave works:

- each game can live in isolated HTML/CSS/JS files
- gameplay systems do not overlap
- deterministic QA is realistic for all three
- together they broaden the hub across arcade + puzzle + logic

### Wave B

Build together:

- Reaction Tap
- Color Lines
- Bubble Pop

Why this wave works:

- no shared runtime dependency is required
- each game can reuse the same page structure pattern without touching each other’s files
- these are good follow-ups once the first parallel QA flow is stable

## Shared-File Conflict Rules

Game workers can run in parallel safely if they only touch:

- their own localized game pages
- their own game JS
- their own game CSS

These files should be treated as shared integration surfaces and owned by a separate integration worker:

- `games/index.html`
- `en/games/index.html`
- shared sitemap or validator scripts
- shared QA runner manifests if a single worker is coordinating them
- `FIX_LOG.md`

Recommended split:

- One worker per game implementation
- One hub/integration worker for card links, sitemap, validators, and rollout notes
- One QA worker for new scenario manifests and browser verification

## Recommended Next Three

If only three more games are greenlit now, choose:

1. Brick Breaker
2. Memory Match
3. Minesweeper Lite

Reason:

- best combined score across static-site fit, deterministic QA, and traffic potential
- strong genre spread
- low shared-file pressure for parallel subagents
