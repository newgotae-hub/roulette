# Dice And Coin Motion Root Cause

Date: 2026-03-15

Status: Updated after confirming the shell-transform workaround stayed removed and the actual unstable dependency was the unversioned `model-viewer` runtime loaded from CDN.

## Summary

- Dice and coin animation code was still present, and both pages were still using the uploaded GLB assets.
- The unstable point was the unversioned `model-viewer` runtime URL, which allowed renderer behavior to change without any repository diff in the roll/flip logic.
- The user-visible result was that sound and final results still updated, but the expected 3D roll/flip motion no longer rendered reliably.

## Root Cause

- `dice/index.html` and `coinflip/index.html` drive motion by repeatedly updating the inner `model-viewer` `orientation` during `requestAnimationFrame`.
- That renderer path depends on `model-viewer`, and every root/localized dice and coin page had been loading it from `https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js` with no version pin.
- Git history showed the loader URL had not changed since the original GLB integration on `2026-03-02`, and the later team-split rollout did not touch the dice/coin motion code.
- Because the runtime URL was unversioned, renderer behavior could change even when the repository code for dice/coin stayed the same.

## Rejected Workarounds

- A shell-transform workaround made the dice and coin look like flat 2D planes instead of rotating the uploaded 3D models, so it was rejected.
- Reduced-motion-only changes were not sufficient as a root fix because they did not address the unstable external runtime dependency.

## Final Resolution

- The production baseline keeps the original `model-viewer`-driven 3D motion path instead of wrapper transforms.
- Every root and localized dice/coin page now loads `https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js` so the GLB renderer no longer floats with the latest CDN runtime.
- No GLB asset path was removed or replaced: dice still uses `/dice.glb`, and coin still uses `/stylized_pirate_coin.glb`.

## Attempt Validation

- Verified the root and localized dice/coin pages all reference the pinned `@google/model-viewer@3.5.0` loader instead of the floating unpkg latest URL.
- Verified the live code path still points at `/dice.glb` and `/stylized_pirate_coin.glb`.
- Ran `git diff --check`.

## Prevention Rules

- Do not switch dice/coin pages back to an unversioned `model-viewer` CDN URL.
- If `model-viewer` must be upgraded, update every root and localized `dice/coinflip` page in the same change and test the live 3D roll/flip visually before deployment.
- Keep the GLB asset paths unchanged unless the asset files themselves are being intentionally replaced:
  - Dice: `/dice.glb`
  - Coin: `/stylized_pirate_coin.glb`
- Do not reintroduce wrapper `transform`-based fake rotation for production fixes. It makes the uploaded 3D assets look flat.
- Deployment now includes a validator guard in [scripts/validate-seo.js](/home/user/roulette/scripts/validate-seo.js) that fails if:
  - Any dice/coin page uses the floating `model-viewer` URL
  - Any dice/coin page is missing the pinned `@google/model-viewer@3.5.0` URL
  - Any dice/coin page loses its required GLB asset reference

## Recovery Runbook

If the dice or coin stops visibly rotating again, check in this order:

1. Confirm the page still loads the pinned runtime:
   - `rg -n "model-viewer@3.5.0|model-viewer/dist/model-viewer.min.js" dice coinflip en ja zh-cn zh-tw es fr de pt-br hi ar ru id tr it vi th nl`
2. Confirm the page still points at the 3D asset:
   - Dice pages must contain `/dice.glb`
   - Coin pages must contain `/stylized_pirate_coin.glb`
3. Run the deploy validator locally:
   - `node scripts/validate-seo.js`
4. If the validator passes but live motion still regresses, test a controlled `model-viewer` version bump or rollback in one branch and verify actual browser rendering before shipping.
5. Deploy only through [scripts/deploy-main.sh](/home/user/roulette/scripts/deploy-main.sh) so the validator always runs before push.
