# Dice And Coin Motion Root Cause

Date: 2026-03-15

## Summary

- Dice and coin animations were still present in the codebase.
- Both tools were short-circuiting to their final result when `prefers-reduced-motion: reduce` was active.
- That made the motion look broken because the face/result changed instantly with no visible roll or flip.

## Root Cause

- `dice/index.html` and `coinflip/index.html` each had an early reduced-motion return inside the main roll/flip handler.
- That branch skipped the normal `requestAnimationFrame` animation loop and applied the final orientation immediately.
- The same embedded logic existed in every localized dice and coin page, so the behavior was global across locales.

## Fix

- Removed the instant-result reduced-motion shortcut from dice and coin pages.
- Kept reduced-motion support, but changed it to a shorter and less intense animation instead of zero motion.
- Reduced spin turns, tilt range, stagger, and total duration for reduced-motion users.
- Updated the Korean reduced-motion note so it now explains that animation becomes shorter and simpler instead of being replaced by a static result.

## Validation

- Verified all localized dice and coin pages now use reduced-motion timing variables instead of the old early-return shortcut.
- Verified the shortened timeout paths are present for both tools across locales.
- Ran `git diff --check`.
