# Games Hub Launcher Replay Pass - 2026-03-22

## Scope

This pass keeps the Games surface lighter and makes replay easier to reach on the most restart-sensitive pages.

## What Changed

- Simplified both Games hubs into launcher-style pages:
  - `games/index.html`
  - `en/games/index.html`
- Removed the extra cross-product tabs from the Games hub nav so the hub now keeps only:
  - `Home`
  - `Games`
- Removed the longer hero, lineup, badge, category, and note-heavy sections so the hub opens almost immediately into the live game grid.
- Promoted restart/replay entry points near the top action area for:
  - `Bubble Pop`
  - `Memory Match`
  - `Reaction Tap`

## User-Facing Intent

- Make the Games tab behave more like a direct launcher and less like a content landing page.
- Make replay easier to find on mobile without forcing users to hunt for reset controls deeper inside each page.

## Validation Intent

This pass should be validated with:

- focused QA for the changed game pages when practical
- `node scripts/validate-seo.js`
- `node scripts/adsense-readiness-check.js`
- `git diff --check`
- deploy through `scripts/deploy-main.sh`
