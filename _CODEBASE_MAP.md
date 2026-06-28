# Codebase Map — Czech_Quest

Navigation aid. Not a session log.

| Path | Purpose | Touch when… |
|------|---------|-------------|
| `index.html` | App shell, all CSS, view containers, mascot SVG, confetti canvas, PWA wiring | changing layout, styles, mascot, or adding a view |
| `app.js` | Learning engine (state, SRS, placement, boss, badges, render) | changing behavior/logic |
| `content.js` | `SKILLS` + `STORIES` — **the lessons** | adding/fixing content (most common edit) |
| `manifest.json` | PWA metadata (name, icons, theme) | rebranding / icon changes |
| `sw.js` | Service worker; `CACHE` constant | **every release** — bump `CACHE` |
| `icons/` | `icon-192/512/512-maskable.png` (Ježek) | new app icon |
| `README.md` | Run, deploy, and lesson-authoring guide | onboarding / deploy steps change |
| `_original_v1_reference.html` | The original single-file app, frozen for reference | never (read-only) |
| `sessions/` | Per-session logs | DOCUMENT phase |
| `.claude/launch.json` | Preview server config (python http.server) | local preview setup |

## Deploy targets
- GitHub repo: `orsag87/czech-quest` (public)
- Live URL (Pages): https://orsag87.github.io/czech-quest/
- Local preview: Claude_Preview MCP @ 8765, via `SANDBOX_1/Czech_Quest` symlink

## Content counts (2026-06-28)
33 stories — A1:3 A2:5 B1:7 B2:7 C1:6 C2:5 · 713 glosses · 129 quiz questions
Roadmap: ~10 per level (pad A1/A2; grow B1–C2).
