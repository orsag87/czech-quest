# Architecture — Czech_Quest

A static, single-page PWA. No backend, no build step. State persists in `localStorage` (key `czQuestV2`, with one-time migration from v1 `czQuest`).

## Component map
```
index.html      Shell: HUD, view containers (home/reading/quiz/lesson/results/placement),
                settings sheet, Ježek mascot SVG (mood via [data-mood]), confetti <canvas>,
                all CSS, PWA <link>s, SW registration.
app.js          Engine. Sections:
                  - constants (LEVELS, LEVEL_COLOR, XP, LEITNER_DAYS, DAILY_GOAL_XP)
                  - state (DEFAULTS, load/save, v1->v2 migration)
                  - BADGES + award()
                  - VOCAB_INDEX / VOCAB_BY_LEVEL  (built once from all glosses)
                  - SRS: enrollWord / reviewWord / dueWords / vocabQuestion
                  - mascot() + confetti()
                  - HUD + home render (dynamic cards: SRS / boss / weak-spots)
                  - reading (glosses, TTS) | quiz engine (shared) | results
                  - skill lesson + practice | SRS session | boss | placement | settings
content.js      SKILLS map + STORIES array. THE content/QC surface. Schema doc at top.
manifest.json   PWA metadata. sw.js  Network-first SW (bump CACHE per release). icons/  app icons.
```

## Data model (localStorage `czQuestV2`)
`level, xp, streak, lastDate, stars{id:0-3}, recent{level:[acc...]}, miss{skill:n}, seen{skill:n}, vocab{cz:{en,box,due,reps,correct,wrong}}, bossPassed{level}, badges{id:ts}, placed, dayXp, dayKey`

## Learning systems (how leveling works)
- **Placement** (first open): self-contained vocab Qs; clear-all-to-advance; sets starting level. ADR-004.
- **Auto-level:** rolling avg of last 3 story rounds at current level; ≥0.85 → up, <0.45 → down.
- **Boss checkpoint:** unlocks after ≥3 stories cleared at a level; 8 mixed Qs; ≥80% certifies the level and unlocks the next (gives +100 XP + badge). No boss at the top level.
- **SRS:** every glossed word → Leitner box (intervals `LEITNER_DAYS`); due words surface as a "Word review" session of auto-generated MC questions. Wrong → ~6h re-queue.
- **Per-word mastery:** box≥4 = mastered (shown in the vocab strip).

## Known constraints (gate-relevant)
- Quiz items must be answerable from what's on screen (placement has no story → vocab only).
- Fill matching is accent-insensitive (`norm()` strips diacritics); answers array holds accepted forms; feedback shows `a[0]` accented.
- Content is AI-DRAFT until native review (ADR-003).
- TTS needs a device `cs-CZ` voice (ADR-006). Progress is per-device only (ADR-007).
- Deploy: bump `sw.js` CACHE, push, poll live URL with cache-bust.
- Levels: `A1 A2 B1 B2 C1 C2`. Story `diff` (1..n) orders within a level (array order irrelevant).
