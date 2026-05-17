# D&D Isekai Personality Test

A web-based personality quiz that maps real-life behavior to a Dungeons & Dragons 2024 class and subclass. Built with React + Vite + Tailwind CSS, with animated transitions via Framer Motion.

## What It Does

- Asks behavior-based questions (not "pick your fantasy vibe").
- Scores you across all 13 D&D 2024 classes: Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard.
- Picks a primary class, optionally a flavor or multiclass result when scores are close.
- Selects a subclass within the winning class.

Scoring philosophy and class/subclass logic are documented in [`Docs/dnd_class_test_companion_plan.md`](Docs/dnd_class_test_companion_plan.md). Research background lives in [`Docs/Research foundations for a D&D class personality test.md`](Docs/Research%20foundations%20for%20a%20D%26D%20class%20personality%20test.md).

## Tech Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **Framer Motion** for transitions
- **lucide-react** for icons

## Project Structure

```
.
├── dnd_class_personality_test_v_2.jsx   # Main quiz component (classes, questions, scoring)
├── index.html                            # Vite entry
├── src/
│   ├── main.jsx                          # React root mount
│   ├── styles.css                        # Tailwind + custom styles
│   └── components/ui/                    # Button, Card, Progress, Badge primitives
├── Docs/                                 # Design plan, research notes, skill/hobby reference
├── Fantasy_Design_Skill/SKILL.md         # Design language guidance
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

## Status

Active development. The v2 quiz file is the current working version. Plan documents in `Docs/` should be reviewed before changing class logic, question wording, or scoring thresholds.

## License

ISC (see `package.json`).
