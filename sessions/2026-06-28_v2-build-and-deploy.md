# Session 2026-06-28 — Czech Quest v2 build, content wave 1, QC audit, deploy

SESSION_ID: c4e12bd4 (not ale3ia-tracked from BRIEF — generated at DOCUMENT)

## Scope
Rebuild Natasha's existing single-file Czech learning app (`~/Downloads/index.html`, "Natasha's Czech Quest") into a deployable, upgraded PWA; add an adaptive learning engine; write a first wave of native-grade content; run a QC audit; publish to GitHub Pages on the `orsag87` account so Jan can send Natasha a link and push updates.

## What changed
- **New repo** at `/Users/janorsag/Dropbox/Czech_Quest` (standalone git, own GitHub repo). Migrated all 16 original stories; kept the original as `_original_v1_reference.html`.
- **Split architecture:** `index.html` (shell + styles + mascot SVG) · `app.js` (engine) · `content.js` (lessons — the single QC surface) · `manifest.json` + `sw.js` + `icons/` (PWA).
- **Engine upgrades (all 4 requested):** placement test, spaced repetition (Leitner over glossed words), boss checkpoints (80% to certify a level), per-word mastery tracking. Kept the original rolling-average auto-level.
- **Design:** editorial base + "Ježek" hedgehog mascot (mood-reactive SVG), confetti, daily-goal ring, badges, animations.
- **Content wave 1:** +18 native-grade stories (B1 +4, B2 +5, C1 +4, C2 +5 — seeded the empty C2 tier). Totals: A1:3 A2:5 B1:7 B2:7 C1:6 C2:5 = 33 stories, 713 glosses, 129 quiz questions.
- **QC audit + fixes** (see Decisions + Mistakes): placement leniency, accent-insensitive fills, c1-media agreement, gloss wording, dead-code cleanup.
- **Deployed:** public repo `orsag87/czech-quest`, GitHub Pages live at https://orsag87.github.io/czech-quest/ (verified 200 + content propagation).

## Decisions made
ADR-001 standalone repo · ADR-002 content.js as QC surface · ADR-003 native QC gate mandatory · ADR-004 placement = self-contained vocab + clear-all-to-advance · ADR-005 accent-insensitive fills · ADR-006 device TTS for v1 · ADR-007 PWA + network-first SW for auto-updates. (See `_DECISION_RECORD.md`.)

## Mistakes / lessons captured
M1 placement reused comprehension Qs that referenced unread stories (unanswerable) · M2 placement over-placed lucky guessers · M3 fill answers were accent-sensitive · M4 AI Czech agreement slip (c1-media `jejich…pracuje`). (See `_MISTAKES_MADE.md`.)

## Files changed
- Created: `index.html`, `app.js`, `content.js`, `manifest.json`, `sw.js`, `icons/icon-{192,512,512-maskable}.png`, `README.md`, `.gitignore`, `.claude/launch.json`, `_original_v1_reference.html`
- Commits: `ef58fa8` (v2 build) → `993ee61` (content wave 1, SW v3) → `83bbd1d` (QC fixes, SW v4)

## Open items
- **Wave-1 native read** by Jan is the gate before sending to Natasha (C2/C1 stories first).
- `b2-cteni` naturalness ("krájí pozornost") — Jan's call.
- See `_PIPELINE_FIXES.md` for deferred items (streak scope, cross-device sync, content waves 2+).

## Context for next session
- Edit lessons ONLY in `content.js`; schema documented at the top of that file. Glosses auto-feed the SRS — gloss generously.
- After any content/code change: bump `CACHE` in `sw.js` (currently `czech-quest-v4`), commit, `git push`, then poll the live URL with a cache-bust to confirm the Pages build landed.
- Preview server (Claude_Preview MCP) serves from SANDBOX_1 root and needs the `SANDBOX_1/Czech_Quest` symlink; port 8765.
- `gh` is authed as `orsag87` (scopes incl. repo). Pages enable needs nested-JSON `--input -`.

---

## Continuation — features added after initial build (same session)

Shipped after the QC audit, each tested live + deployed (SW cache bumped each time):

- **Word Match module (v5)** — tap-to-match vocab recap (6 Czech ↔ 6 English), always-available from home `practiceBox`, up to 3 boards of most-recently-learned words. A clean match credits the SRS. New view id `match`; timestamps words with `added` on enroll.
- **Streak upgrade (v6)** — `markActivity()` now fires on ANY completed activity (story/review/match/boss/practice), once/day. Banked **freezes** (start 2, earn 1 per 7-day streak, cap 3) auto-cover a missed day instead of resetting. Home shows a "keep your streak" nudge + freeze count; results shows a "streak saved" banner. Unit-tested 8 scenarios. → ADR-008.
- **Daily reminders (v7) — built then removed.** Web push (enable flow + SW push handlers) + a free GitHub Actions cron sender (`send-reminder.js`, VAPID keys, repo secrets). Verified the cron ran (`ok=0 fail=0 total=0`). User then said "forget the reminders" → **removed in v8** (deleted workflow + sender + SW handlers + client UI; deleted the 4 VAPID/PUSH secrets). See ADR-009 + mistake #5.
- **Backup / Restore (v8)** — replaced the reminder settings slot. Export progress → UTF-8-safe base64 code (survives Czech diacritics in vocab keys); Restore ← paste code → reload. Insurance + device migration, no backend. Tested round-trip + bad-code path. → ADR-009.

New ADRs: ADR-008, ADR-009. New mistake: #5. Docs updated: _ARCHITECTURE, _CODEBASE_MAP, _PIPELINE_FIXES.
Commits after the docs commit: `7179233` (match) → `2ae10da` (streak) → `dc5fa1a` (reminders) → `0ef41de` (drop reminders + backup). Live at SW `czech-quest-v8`.

Open item unchanged and still the one true gate before sending to Natasha: **Jan's native read of the wave-1 stories**.
