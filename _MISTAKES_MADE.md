# Mistakes Made — Czech_Quest

Lessons learned the hard way. Read before touching this code.

---

### 1. Placement test reused comprehension questions about unread stories
**Symptom:** First live test of the placement flow showed "V kolik hodin vstává?" ("At what time does she get up?") with no story present — unanswerable except by guessing.
**Root cause:** `buildPlacement` pulled random quiz questions from stories. Story quizzes assume the reader just read the story; in placement there is no story, so comprehension questions have no basis.
**Fix:** Placement now generates self-contained, level-graded vocabulary questions ("Co znamená X?") from the vocab index, with distractors from other glosses.
**Lesson:** Never use context-dependent (comprehension) questions in any quiz where the source text is not shown. A test item must be answerable from what the learner can actually see at that moment.

### 2. Placement test over-placed lucky guessers
**Symptom:** QC audit found that getting even ONE question right at a level placed the learner at that level. With 3-option questions and 2 items per B1/B2/C1, a pure guesser reached C1 ~55% of the time.
**Root cause:** `finishPlacement` set `best = highest level with score > 0`, ignoring how many questions that level had and whether lower levels were cleared.
**Fix:** Walk levels upward; a level only counts as cleared if ALL its questions are correct; stop at the first un-cleared level and place there. Verified across 5 scenarios (lucky-only-C1 → A1; all-correct → C1).
**Lesson:** Never derive a placement/level decision from "≥1 correct"; require clearing a level's full question set before promoting, so guessing cannot vault a learner upward.

### 3. Fill-in answers were accent-sensitive
**Symptom:** A correct answer typed without Czech diacritics (e.g. "vysetril" for "vyšetřil") was marked wrong. 18 of the fill answers contain diacritics.
**Root cause:** `norm()` lowercased and stripped punctuation but kept diacritics, so accent-free input never matched.
**Fix:** `norm()` now NFD-normalizes and strips combining marks (accent-insensitive). Feedback still DISPLAYS the correctly-accented answer so spelling is still taught. Guard-tested that distinct words don't collapse.
**Lesson:** For a learner-facing free-text checker on a diacritic-heavy language, match accent-insensitively but always show the correctly-accented form — never penalize a right answer for a missing accent the keyboard may not have.

### 4. AI-generated Czech had a number-agreement slip
**Symptom:** In `c1-media`, "Dezinformace se šíří … než **jejich** opravy, protože **pracuje** s emocemi" mixed plural (`jejich`) and singular (`pracuje`).
**Root cause:** AI-written B1–C2 Czech can carry subtle subject–verb / pronoun agreement errors that pass every structural/automated check.
**Fix:** Made it plural throughout (`pracují`). Flagged the whole wave for native review.
**Lesson:** Never treat AI-generated Czech as verified — structural validation (ids, answer indices, gloss brackets) cannot catch agreement/naturalness errors. Native-speaker review is a required gate before content ships.
