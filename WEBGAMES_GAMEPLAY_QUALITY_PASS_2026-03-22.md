# Webgames Gameplay Quality Pass - 2026-03-22

## Scope

This note records the current quality pass for the live Games wave. The product changes were already landed locally in the existing game files; this document captures the release intent and the shared checks used to verify the wave.

## What Improved

- `memory-match`
  - Added a clearer daily mode flow.
  - Improved the first-play path so players get into a real match faster and with less friction.
- `bubble-pop`
  - Smoothed the tap/commit interaction on mobile.
  - Strengthened combo and chain payoff.
  - Added clearer dead-board recovery cues.
- `color-lines`
  - Cleaned up the Korean presentation.
  - Tuned the daily/replay loop so the board feels better on repeat sessions.
- `word-swipe`
  - Deepened the puzzle structure.
  - Tightened feedback clarity so solved/invalid states read more cleanly.
- Shared QA
  - The webgame QA runner now carries perf and visual probes so gameplay can be judged for both correctness and feel.

## Release Checks

The release lane should continue to use the existing shared webgame checks:

- focused scenario QA for the affected games
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`
- `scripts/deploy-main.sh`

## Notes

- This wave is meant to make the live catalog feel more complete and replayable without turning any page into a separate microsite.
- QA artifacts remain transient and should stay out of the commit set.
