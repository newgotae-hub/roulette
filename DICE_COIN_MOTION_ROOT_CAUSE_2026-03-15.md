# Dice And Coin Motion Root Cause

Date: 2026-03-15

Status: Superseded by rollback to the last known-good 2026-03-12 dice and coin implementation.

## Summary

- Dice and coin animation code was still present, but the visible rotation path was not rendering reliably.
- Both tools were also short-circuiting to their final result when `prefers-reduced-motion: reduce` was active.
- The combined result was that users could hear the sound and see the final result change, but not see an obvious roll or flip motion.

## Root Cause

- `dice/index.html` and `coinflip/index.html` were driving visible motion by repeatedly updating the inner `model-viewer` `orientation` during `requestAnimationFrame`.
- In the live browser/runtime combination, that inner-orientation path was not producing a reliable visible spin even though the final result state still updated.
- On top of that, `prefers-reduced-motion: reduce` had an early return that skipped the animation loop entirely.
- The same embedded logic existed in every localized dice and coin page, so the behavior was global across locales.

## Attempted Fix

- Removed the instant-result reduced-motion shortcut from dice and coin pages.
- Kept reduced-motion support, but changed it to a shorter and less intense animation instead of zero motion.
- Moved the visible roll/flip animation to the outer dice/coin shell `transform`, which is independent of whether inner `model-viewer` orientation updates animate smoothly in that browser.
- Kept the final face/result mapping on the underlying model so the end pose still matches the recorded outcome.
- Updated the Korean reduced-motion note so it now explains that animation becomes shorter and simpler instead of being replaced by a static result.

## Final Resolution

- The shell-transform workaround was rejected because it made the dice and coin look like flat 2D planes instead of rotating 3D models.
- The production fix was to restore the dice and coin pages to the last known-good implementation from `2026-03-12` (`eca7bfe`) exactly as requested.

## Attempt Validation

- Verified all localized dice and coin pages now use reduced-motion timing variables instead of the old early-return shortcut.
- Verified the visible animation path now updates the outer shell transform for both tools across locales.
- Ran `git diff --check`.
