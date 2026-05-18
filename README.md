# D&D Isekai Personality Test

A web-based personality quiz that maps real-life behavior to a Dungeons & Dragons 2024 class and subclass. Built with React + Vite + Tailwind CSS, with animated transitions via Framer Motion.

## What It Does

- Asks behavior-based questions (not "pick your fantasy vibe").
- Scores you across all 13 D&D 2024 classes: Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard.
- Picks a primary class, optionally a flavor or multiclass result when scores are close.
- Selects a subclass within the winning class.

Scoring philosophy, class/subclass logic, and research background are tracked in internal design notes (not published).

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Framer Motion** for transitions
- **lucide-react** for icons

## Project Structure

```
.
├── dnd_class_personality_test_v_3.jsx   # Main quiz component (branching state machine)
├── index.html                            # Vite entry
├── src/
│   ├── main.jsx                          # React root mount
│   ├── questions_v3.mjs                  # Question pools (baseline, tie-breakers, subclass flavor)
│   ├── engine_v3.mjs                     # Scoring + branching engine
│   ├── classMetadata_v3.mjs              # Class/subclass descriptions, colors, icons
│   ├── selftest_v3.mjs                   # 49 self-tests
│   ├── styles.css                        # Tailwind + custom styles
│   └── components/ui/                    # Button, Card, Progress, Badge primitives
├── archive/
│   └── dnd_class_personality_test_v_2.jsx # Previous flat-pool version (kept for reference)
├── vite.config.js
└── package.json
```

## Getting Started

Requires Node.js (LTS recommended).

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Deployment

Hosted on GitHub Pages at `https://buggybutlearning.github.io/D-D-Isekai-Personality-Test/`.

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`): every push to `main` triggers a Vite build and publishes the `dist/` folder to Pages. The Vite `base` is set to the repo path in [`vite.config.js`](vite.config.js) so asset URLs resolve correctly under the subdirectory.

To enable on a fresh clone: Repo Settings → Pages → Source = **GitHub Actions**.

## Status

Active development. The v2 quiz file is the current working version.

## License

ISC (see `package.json`).
