# 🦔 Natasha's Czech Quest

A cozy, adaptive Czech-learning game built for Natasha — picking up where Duolingo's A2 ceiling leaves off and taking her through B1, B2, C1, and C2.

Single static web app. No backend, no build step, no accounts. Her progress is saved on her own device.

---

## What it does

- **Stories → glossary → quiz.** Each lesson is a short Czech story. Tap any underlined word for the English meaning, hear it read aloud (Czech text-to-speech), then take a short quiz.
- **Knows her level.** A quick **placement test** on first open starts her at the right level. The engine nudges her **up** after strong rounds and gently **down** if a level is too hard.
- **Boss checkpoints.** After clearing a level's stories, a harder mixed challenge (80% to pass) *certifies* the level and unlocks the next — so leveling up feels earned.
- **Spaced repetition.** Every word she meets becomes a flashcard that resurfaces over days until it sticks (Leitner system).
- **Per-word mastery.** Tracks every vocabulary word as new → learning → mastered.
- **Weak-spot coaching.** Questions are tagged by skill (past tense, cases, idioms…). Miss one twice and the app surfaces a mini-lesson + targeted drill.
- **Game feel.** XP, daily streak 🔥, a daily-goal ring, 1–3 stars per story, badges, confetti, and **Ježek the hedgehog** who reacts and cheers her on.

---

## Run it locally

It's just static files. Easiest:

```bash
cd Czech_Quest
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly via `file://` mostly works too, but the service worker / "install to home screen" only activates over http/https.)

---

## Deploy to GitHub Pages (so Natasha gets a link + auto-updates)

One-time:

```bash
cd Czech_Quest
git add -A && git commit -m "Czech Quest"
gh repo create czech-quest --public --source=. --push   # creates orsag87/czech-quest
gh api -X POST repos/orsag87/czech-quest/pages -f source.branch=main -f source.path=/   # enable Pages
```

Her link will be: **https://orsag87.github.io/czech-quest/**

She opens it once, taps **Share ▸ Add to Home Screen** on her iPhone, and it behaves like a real app.

**Pushing an update** (new lessons, bug fix):

```bash
git add -A && git commit -m "new B2 stories" && git push
```

…and bump `CACHE` in `sw.js` (e.g. `czech-quest-v3`) so her phone fetches the new version. Pages redeploys automatically in ~1 minute.

---

## Adding or fixing lessons (this is the part Jan QCs)

**All content lives in `content.js`.** Nothing else needs touching. Each story:

```js
{ id:"b2-kafe", level:"B2", diff:3, titleCz:"Title", titleEn:"Title",
  text:"Story with [tappable|tappable] words wrapped like that.",
  quiz:[
    { q:"Question?", opts:["a","b","c"], a:1, skill:"comprehension" },
    { q:"Doplň: ___ [...] ___", opts:[], a:["answer"], type:"fill", skill:"cases", explain:"why" }
  ]
}
```

- Wrap any word you want tappable as `[czech|english]`. Those words automatically become spaced-repetition flashcards — no extra work.
- `a` for multiple choice = the index (0-based) of the correct option.
- `a` for fill-in = an array of accepted answers (accent/case-insensitive).
- `skill` must match a key in the `SKILLS` map at the top of `content.js`.
- Add `trick:true` for a "pozor!" careful-reading question.
- `diff` (1–5) orders stories within a level.

Levels: `A1 A2 B1 B2 C1 C2`. Roadmap is ~10 stories per level.

---

## iPhone: turn on the Czech voice (for read-aloud)

Settings ▸ Accessibility ▸ Spoken Content ▸ Voices ▸ **Czech** ▸ download. Then read-aloud uses a real Czech voice.

---

## Files

| File | What |
|------|------|
| `index.html` | App shell, styles, mascot, PWA wiring |
| `app.js` | All the learning logic (engine, SRS, placement, boss, badges) |
| `content.js` | **The lessons** — edit this to add/fix content |
| `manifest.json`, `sw.js`, `icons/` | PWA (home-screen install + offline + updates) |
| `_original_v1_reference.html` | The original single-file version, kept for reference |
