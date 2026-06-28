# Decision Record — Czech_Quest

Adaptive Czech-learning PWA for Natasha (post-A2). Static single-page app, no backend, deployed via GitHub Pages.

---

### ADR-001: Standalone repo outside SANDBOX_1
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** House the project at `/Users/janorsag/Dropbox/Czech_Quest` as its own git repo / GitHub repo, not nested inside SANDBOX_1.
**Rationale:** SANDBOX_1 is already a git repo; nesting causes confusion and a messy Pages deploy. A dedicated repo maps cleanly to `orsag87/czech-quest` + Pages.
**Trade-offs:** The Claude_Preview server (rooted at SANDBOX_1) can't reach it directly — required a `SANDBOX_1/Czech_Quest` symlink for local preview only.

### ADR-002: All lessons live in `content.js` as the single QC surface
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** Separate content (`content.js`) from engine (`app.js`) and shell (`index.html`). Authors touch only `content.js`.
**Rationale:** Jan QCs/extends content; isolating it from logic makes review safe and lowers the risk of breaking the engine. Schema is self-documented at the top of the file.
**Trade-offs:** Slightly more files than a single-file app; mitigated by PWA deploy (portability is via the URL, not a file).

### ADR-003: Native-speaker review is a mandatory content gate
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** AI-generated Czech is DRAFT until Jan (native) reads it. "Ready to send to Natasha" requires his pass on new content.
**Rationale:** Structural validation can't catch naturalness/agreement errors; the audience is near-native and a single bad sentence costs trust.
**Trade-offs:** Content ships in QC'able waves, not all at once — slower but credible.

### ADR-004: Placement = self-contained vocab + clear-all-to-advance
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** The placement test uses level-graded "Co znamená X?" vocab questions (not story comprehension), and only promotes when ALL of a level's items are correct, stopping at the first miss.
**Rationale:** Placement has no story context, so comprehension Qs are invalid; and a one-correct threshold over-places guessers.
**Trade-offs:** A learner who fluffs one mid-level item is placed one level lower; acceptable because the adaptive engine bumps her up quickly. Placement currently tops out at C1 (C2 is reached via boss/auto-level).

### ADR-005: Accent-insensitive fill matching
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** Free-text fill answers match after stripping diacritics, but feedback shows the correctly-accented spelling.
**Rationale:** Don't penalize a correct answer when the keyboard lacks Czech diacritics; still teach the accented form.
**Trade-offs:** Accepts accent-free spellings as correct (slightly looser); judged worth it for a learner.

### ADR-006: Device TTS for v1 (no pre-generated audio)
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** Read-aloud uses the browser/device Czech voice (`cs-CZ`), with a setup note for installing the iOS Czech voice.
**Rationale:** Zero hosting, instant, good enough for v1. Pre-generated narrated audio is a v2 upgrade.
**Trade-offs:** Pronunciation quality depends on the device; no Czech voice → English fallback voice.

### ADR-007: PWA + network-first service worker for auto-updates
**Date:** 2026-06-28 · **Status:** Accepted
**Decision:** Ship as an installable PWA; `sw.js` is network-first with a cache fallback; bump `CACHE` on each release.
**Rationale:** Natasha "Add to Home Screen" once; Jan pushes fixes and her app updates with no reinstall; offline still works.
**Trade-offs:** Must remember to bump `CACHE` on each deploy or stale assets may serve offline. Progress is per-device (localStorage) — no cross-device sync.
