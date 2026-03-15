# AdSense Trust Surface Hardening - 2026-03-15

## Why this follow-up was needed

- Footer contact links had been intercepted by Userback before the direct contact page opened.
- Many tool pages linked the visible operator credit to Instagram instead of an internal operator/about page.
- The public trust pages were too thin for ad-review purposes and did not clearly state:
  - who operates the site
  - how browser-local processing works
  - which third-party services may run
  - how consent-sensitive regions such as the EEA, UK, and Switzerland are handled

## What changed

### 1. Footer contact behavior

- File: [assets/js/third-party-loader.js](/home/user/roulette/assets/js/third-party-loader.js)
- `bindUserbackTriggers()` now binds only `[data-userback-trigger]`.
- `#footer-contact` is no longer intercepted.
- Result: footer `문의` / `Contact` always behaves like a direct legal/support link.

### 2. Operator link target

- Scope: deployed tool HTML pages that still linked the footer operator credit to Instagram.
- Change: the footer operator credit now points to `/about/`.
- Result: users and reviewers stay on-site for operator identity and supporting policy links.

### 3. Legal-page source expanded

- File: [scripts/generate-legal-pages.js](/home/user/roulette/scripts/generate-legal-pages.js)
- Contact pages now include:
  - operator name
  - direct email
  - quick links to About / Privacy / Terms
- Privacy pages now explicitly mention:
  - browser-local processing
  - possible use of `localStorage`
  - third-party services including AdSense / Analytics / GTM / Clarity / Userback
  - consent-sensitive regions: EEA, UK, Switzerland

### 4. About page expanded

- File: [about/index.html](/home/user/roulette/about/index.html)
- Added:
  - `Operator and Publisher` section
  - browser-local processing explanation
  - advertising, cookies, and consent section
  - direct links to Contact / Privacy / Terms

### 5. Regression guards

- File: [scripts/validate-seo.js](/home/user/roulette/scripts/validate-seo.js)
- New deployment checks fail if:
  - any deployed HTML page still links the operator credit to Instagram
  - the old footer-contact interception selector returns
  - `/about/` loses operator or consent-region disclosure
  - `/contact/` or `/en/contact/` loses operator/policy links
  - `/privacy/` or `/en/privacy/` loses `localStorage` or consent-region wording

## Validation performed

- Regenerated legal pages:
  - `node scripts/generate-legal-pages.js`
- Full validator:
  - `node scripts/validate-seo.js`
- Patch hygiene:
  - `git diff --check`
- Residual scan:
  - deployed HTML Instagram operator links: `0`
  - deployed HTML footer-contact interception selector: `0`

## Recovery checklist if this regresses again

1. Check [assets/js/third-party-loader.js](/home/user/roulette/assets/js/third-party-loader.js) for `#footer-contact` inside `bindUserbackTriggers()`.
2. Scan for `https://www.instagram.com/juntaeko_tr` in deployed HTML.
3. Regenerate legal pages from [scripts/generate-legal-pages.js](/home/user/roulette/scripts/generate-legal-pages.js).
4. Run `node scripts/validate-seo.js`.
5. Deploy only after the validator returns clean.
