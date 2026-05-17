# D&D Class Personality Test Companion Plan

## Purpose

This document is the planning and knowledge companion for the D&D class personality test. It should store the class logic, subclass logic, question strategy, scoring rules, design direction, and implementation notes before the live form is changed.

The current form should not be edited until the plan is reviewed and approved.

## Current Direction

The current questions are working well and should not be thrown out. They ask about real life behavior instead of asking people to pick a fantasy vibe. That is the correct foundation.

The next version should preserve the spirit of the existing questions, but the questions can be expanded, split, or rewritten when needed to support Artificer, subclasses, and better class separation.

## Source Notes From Dungeon Mister 2024 Class List

Dungeon Mister lists 13 D&D 2024 classes and 61 subclasses so far. The missing class in the current form is Artificer.

The 13 classes to support:

1. Artificer
2. Barbarian
3. Bard
4. Cleric
5. Druid
6. Fighter
7. Monk
8. Paladin
9. Ranger
10. Rogue
11. Sorcerer
12. Warlock
13. Wizard

Important role notes from the source:

- Melee warrior: Barbarian, Fighter, Monk, Paladin, Ranger, Rogue
- Ranged warrior: Fighter, Ranger, Rogue
- Tank: Barbarian, Fighter, Paladin
- Healer: Cleric, Druid, Bard
- Damage dealing spellcaster: Cleric, Sorcerer, Wizard
- Support caster: Artificer, Bard, Cleric, Druid, Sorcerer, Warlock, Wizard
- Party face: Bard, Paladin, Sorcerer, Warlock
- Stealth specialist: Bard, Monk, Ranger, Rogue
- Skill specialist: Artificer, Bard, Ranger, Rogue

These are game role notes, not direct personality mappings, but they help identify overlaps that the test needs to separate.

## Core Scoring Philosophy

### Main Class First

The quiz should first determine the user's primary class. Subclasses should not compete equally against the main classes from the beginning.

Primary class is based on the highest class score.

### Multiclass Should Be Rare

Multiclass only happens when the top two classes are genuinely close.

Keep the idea:

- A dominant top class wins if it clearly beats the second class.
- The second class becomes flavor or a unique trait if it is present but not close.
- Multiclass is allowed only when the top two are close enough and both have meaningful score strength.

Recommended multiclass rule:

- Top class score must be at least a meaningful threshold.
- Second class score must also pass a meaningful threshold.
- Second score should be around 86 percent or more of the top score.
- Gap should be small relative to total possible score.

This is close to the current logic and should be preserved unless testing shows it creates too many or too few multiclass results.

### Subclass Second

After the primary class is selected, subclass scoring should be evaluated inside that class only.

Example:

- First determine Fighter.
- Then choose Battle Master, Champion, Eldritch Knight, Psi Warrior, or Banneret based on subclass tags.

This avoids messy results where a person gets a subclass from a class they did not actually score into.

### Unique Traits Third

Unique traits should remain separate from class and subclass.

Two users can both be Wizards, but one might be:

- Wizard, Diviner, Prepared, Pattern Reader, Scholar

Another might be:

- Wizard, Evoker, Direct Problem Solver, Technical Force, High Impact

This lets the test feel personalized without forcing every difference to become a different class or multiclass.

## Artificer Addition

Artificer is the highest priority addition because the current test pushes builders, engineers, coders, repair people, automation people, toolmakers, and practical technical problem solvers into Wizard or Fighter.

Real life Artificer means:

- Builder
- Engineer
- Coder
- Automation person
- Repair person
- Systems implementer
- Inventor
- Tool maker
- Prototype builder
- Practical technical problem solver
- Person who turns knowledge into usable tools

Key distinction:

- Wizard understands the theory, model, system, or documentation.
- Artificer builds the tool, automates the process, repairs the system, prototypes the solution, or makes the idea usable.

Artificer should overlap with Wizard, Fighter, Rogue, and Warlock:

- Artificer/Wizard: technical research plus tool building
- Artificer/Fighter: repeatable systems, tools, process, applied discipline
- Artificer/Rogue: clever hacks, workarounds, scripts, practical shortcuts
- Artificer/Warlock: power through platforms, vendors, tools, infrastructure, institutions, and access

## Question Expansion Strategy

The quiz should grow from 18 questions to around 26 to 32 questions.

Recommended shape:

- 20 to 24 core class questions
- 6 to 8 subclass and flavor questions

The quiz should feel practical, not academic. Avoid asking obvious fantasy questions like “Do you like magic?” or “Do you like swords?” Ask about behavior.

## Keep, Expand, Or Rewrite

Do not preserve every current question exactly. Preserve the purpose of the questions.

A current question should be kept if it already separates classes well.

A current question should be expanded if Artificer or subclass logic needs more options.

A current question should be rewritten if it accidentally forces a modern behavior into the wrong class.

Example:

Current idea:

“How do you usually become good at something difficult?”

Expanded version could include:

- Study deeply, take notes, compare sources, and prepare: Wizard
- Practice fundamentals until skill becomes reliable: Fighter or Monk
- Build a tool, script, device, workflow, or prototype: Artificer
- Improvise, test shortcuts, and learn under real conditions: Rogue or Sorcerer
- Find a mentor, sponsor, platform, or institution that opens the path: Warlock

## Differentiator Questions Needed

The next version should include questions that intentionally separate similar classes.

### Barbarian vs Fighter vs Monk

Barbarian:

- Intensity
- Raw pressure
- Grit
- Emotional or physical force
- Protective rage
- Endurance under stress

Fighter:

- Training
- Technique
- Reliable skill
- Competition
- Tactical execution
- Practical combat competence

Monk:

- Discipline
- Body control
- Breath
- restraint
- focus
- martial arts
- yoga or movement practice
- inner regulation

Physical examples:

- Powerlifting, hard contact sports, explosive conditioning: Barbarian or Fighter
- Structured strength progression, tactical sport, disciplined drills: Fighter
- Martial arts, boxing technique, grappling control, yoga, breath work: Monk or Fighter
- Calm technical movement and self control: Monk

### Wizard vs Artificer

Wizard:

- Research
- Documentation
- Theory
- Formal education
- Analysis
- Mental model building

Artificer:

- Building
- Repair
- Tools
- Automation
- Coding
- Engineering
- Prototyping
- Applied technical implementation

Example differentiator:

“When something keeps breaking, what do you do?”

- Research the root cause and understand the theory: Wizard
- Build a tool, script, device, workflow, or fix: Artificer
- Create a repeatable process and train people on it: Fighter
- Find a workaround that gets past the blocker: Rogue

### Bard vs Sorcerer

Bard:

- Learned expression
- Performance
- Communication craft
- Teaching
- Humor
- Music
- Storytelling
- Social skill developed through practice

Sorcerer:

- Natural charisma
- Personal magnetism
- Instinctive talent
- Raw gift
- People feel the person has “it”

Example differentiator:

“How do you usually influence a room?”

- I perform, explain, entertain, or frame the moment: Bard
- People naturally respond to my energy or presence: Sorcerer
- I set the standard and rally people around it: Paladin
- I use timing, leverage, and information: Rogue or Warlock

### Cleric vs Paladin

Cleric:

- Service
- Healing
- Support
- Care
- Devotion
- Community
- Spiritual or moral care

Paladin:

- Oath
- Cause
- Justice
- Standards
- Protection
- Action through commitment
- Moral confrontation

Example differentiator:

“What do you do when people are hurting?”

- Care for them, support them, help them heal: Cleric
- Confront the source of harm and protect others: Paladin
- Organize the response and assign roles: Fighter
- Use public influence to rally support: Bard

### Ranger vs Druid

Ranger:

- Fieldcraft
- Tracking
- Navigation
- Hunting
- Scouting
- Survival
- Practical independence
- Reading terrain

Druid:

- Ecology
- Animals
- Plants
- Gardening
- Conservation
- Living systems
- Balance
- Stewardship

Example differentiator:

“What does nature mean to you?”

- A living system I care for and protect: Druid
- A terrain I can read, move through, and survive in: Ranger
- A place to train, reset, and discipline myself: Monk
- A backdrop for adventure or story: Bard

### Rogue vs Warlock

Rogue:

- Workarounds
- Cunning
- Alternate routes
- Precision
- Stealth
- Information edge
- Skepticism of rules

Warlock:

- Patrons
- Institutions
- Sponsors
- Employers
- Contracts
- Special access
- Platforms
- Networks
- Leverage through powerful systems

Example differentiator:

“How do you get through a locked door?”

- Find the weakness, side door, loophole, or exploit: Rogue
- Call the person, platform, institution, or sponsor with access: Warlock
- Study the lock and understand its design: Wizard
- Build a tool that opens it: Artificer

### Fighter vs Paladin

Fighter:

- Skill first
- Competence
- Discipline
- Tactical leadership
- Reliable execution

Paladin:

- Cause first
- Oath
- Moral mission
- Justice
- Protection

Example differentiator:

“Why do you train?”

- To become competent, reliable, and hard to beat: Fighter
- To protect people or uphold a cause: Paladin
- To master myself: Monk
- To survive pressure: Barbarian

### Wizard vs Warlock

Wizard:

- Knowledge earned through study
- System understanding
- Independent research
- Preparation

Warlock:

- Knowledge or power gained through access
- Mentor
- Patron
- Institution
- Contract
- Platform

Example differentiator:

“How do you gain power fastest?”

- Study until I understand the system: Wizard
- Join the right institution or learn from the right patron: Warlock
- Build the tool myself: Artificer
- Practice the skill until it is reliable: Fighter

### Artificer vs Rogue

Artificer:

- Builds tools
- Automates
- Repairs
- Designs systems
- Creates repeatable solutions

Rogue:

- Finds loopholes
- Improvises
- Exploits weak points
- Uses precision and timing
- Gets results with minimal resources

Example differentiator:

“You need to solve a recurring problem. What is your instinct?”

- Build a tool or workflow so it stays solved: Artificer
- Find a fast workaround that works right now: Rogue
- Research the root system until it makes sense: Wizard
- Create a standard process and train people: Fighter

## Subclass List To Support

### Artificer

- Alchemist: buffs, support, mixtures, care through tools, chemistry, experiments
- Armorer: protection, gear, defensive systems, wearable tech, resilience or stealth through equipment
- Artillerist: ranged technical force, cannons, direct output, controlled destructive tools
- Battle Smith: technical martial, robotics, companion builder, applied engineering in conflict
- Cartographer: mapping, navigation, exploration systems, teleportation, spatial thinking

### Barbarian

- Berserker: pure intensity, rage, direct action, overwhelming force
- Wild Heart: animalistic nature connection, instinct, physical nature identity
- World Tree: protector, boundary keeper, interplanar or big picture guardian
- Zealot: divine rage, holy fury, mission through intensity

### Bard

- Dance: physical expression, movement, social performance through the body
- Glamour: charm, style, fascination, social magnetism, popstar energy
- Lore: history, knowledge, storytelling, broad learning, collector of secrets
- Moon: healing and harm through mystical emotional rhythm, lunar symbolism
- Valor: heroic inspiration, battlefield storyteller, performer with martial courage

### Cleric

- Knowledge: information, study, divine insight, truth seeking
- Life: healing, preservation, care, nurture
- Light: hope, radiance, fighting darkness, optimism with force
- Trickery: deception, misdirection, social cleverness, subversion
- War: militant devotion, conflict, protection through battle, sacred combat

### Druid

- Land: biomes, place based identity, rootedness, environment, nature knowledge
- Moon: shapeshifting, embodiment, animal transformation, physical nature power
- Sea: storms, oceans, movement, emotional force, waves and pressure
- Stars: cosmic pattern, guidance, astrology, navigation, celestial perspective

### Fighter

- Banneret: ally support, team captain, leadership through morale and coordination
- Battle Master: tactics, maneuvers, planning, controlled skill
- Champion: athletic excellence, clean performance, physical dominance
- Eldritch Knight: trained fighter plus formal knowledge or technical magic
- Psi Warrior: mental discipline, force of will, perception, psychic control

### Monk

- Mercy: healing hands, restraint, ending suffering, compassionate discipline
- Shadow: stealth, quiet movement, unseen action, ninja archetype
- Elements: elemental expression, adaptable energy, physical discipline plus nature force
- Open Hand: pure martial skill, body control, direct unarmed mastery

### Paladin

- Devotion: law, justice, standards, purity, classic oath keeper
- Glory: achievement, victory, ambition, legend building
- Ancients: light, life, nature aligned protection, joy against darkness
- Noble Genies: elemental oath, grandeur, patron like nobility, elemental themes
- Vengeance: punishment, pursuit, justice against wrongdoers, refusal to let harm go unanswered

### Ranger

- Beast Master: animal partnership, training, companionship with animals
- Fey Wanderer: charm, social wilderness, strange beauty, fey influence
- Gloom Stalker: darkness, ambush, hunting threats in shadows
- Hunter: practical predator, traps, tactics, classic hunting focus
- Winter Walker: cold endurance, harsh environments, frigid lands, survival through discomfort

### Rogue

- Arcane Trickster: cleverness plus magic, technical misdirection, illusion tricks
- Assassin: stealth, precision, decisive strike, planned elimination
- Scion of the Three: violent devotion, dark divine influence, brutality with belief
- Soulknife: psychic precision, mental blades, silent inner weapon
- Thief: tools, burglary, acquisition, practical stealth and object handling

### Sorcerer

- Aberrant Sorcery: strange mind, alien perception, psionic weirdness
- Clockwork Sorcery: order, mechanism, balance, correction, innate structure
- Draconic Sorcery: inherited power, pride, resilience, forceful presence
- Spellfire Sorcery: protective magic, defensive spark, raw weave energy
- Wild Magic Sorcery: chaos, unpredictability, explosive instinct

### Warlock

- Archfey Patron: charm, glamour, trickery, strange social power
- Celestial Patron: healing, light, benevolent patronage, service through granted power
- Fiend Patron: ambition, dangerous bargain, power at a cost
- Great Old One Patron: forbidden knowledge, alien thought, unknowable patron, eldritch insight

### Wizard

- Abjurer: defense, prevention, risk reduction, protection systems
- Bladesinger: elegant martial plus scholarship, technical movement, precision
- Diviner: prediction, pattern reading, forecasting, insight
- Evoker: direct high impact output, elemental force, focused blast
- Illusionist: perception, framing, misdirection, reality through presentation

## Question Tagging Model

Each answer should eventually support three layers of scoring:

1. class scores
2. subclass tags
3. unique trait tags

Example option object in future code:

```js
{
  label: "Build a tool, script, device, workflow, or prototype",
  scores: { Artificer: 5, Wizard: 1 },
  subclassTags: {
    Artificer: { Armorer: 1, BattleSmith: 1, Cartographer: 1 }
  },
  facets: ["Builder", "Automation Mind", "Applied Technical"]
}
```

Subclass tags should only matter if the class is selected as primary or secondary multiclass.

## Result Page Plan

The result page should eventually show:

1. Main class
2. Subclass
3. Multiclass only if the top two classes are genuinely close
4. Subclass for each class if multiclass happens
5. Three unique traits
6. Short explanation of why the result happened
7. Top 5 class score breakdown
8. 8-bit SVG class icon
9. Optional subclass label badge

Example single class result:

Wizard Subclass: Diviner Traits: Prepared, Pattern Reader, Scholar

Example multiclass result:

Artificer / Rogue Subclasses: Battle Smith / Thief Traits: Tool Builder, Side Door Thinker, Self Reliant

## Dark Mode Plan

The form should be changed to dark mode later, but not yet in this planning step unless separately approved.

Dark mode style direction:

- Background: deep charcoal, dark navy, or near black fantasy UI
- Cards: dark stone, slate, or midnight blue
- Text: warm white or pale parchment
- Secondary text: muted gray, muted violet, or soft amber
- Selected answers: amber, violet, or class color accent
- Borders: subtle stone, violet, or gold
- Result card: more like a character reveal screen
- Progress bar: higher contrast
- Class icons: keep 8-bit SVG icons but make them glow or sit inside class colored panels

Suggested Tailwind direction:

- Page background: bg-slate-950 or bg-[#0f1020]
- Main text: text-stone-100
- Cards: bg-slate-900/90 border-slate-700
- Muted text: text-slate-300 or text-stone-400
- Selected answer: bg-amber-500/15 border-amber-300 text-amber-50
- Unselected answer: bg-slate-900 border-slate-700 hover\:bg-slate-800
- Primary button: bg-amber-500 text-slate-950 hover\:bg-amber-400

## Implementation Phases

### Phase 1: Planning Only

- Store this companion plan.
- Do not edit the form.
- Review subclass mappings and question strategy.

### Phase 2: Add Artificer And Dark Mode

- Add Artificer to class list.
- Add Artificer class data.
- Add Artificer 8-bit SVG icon.
- Add Artificer scoring to relevant existing questions.
- Add 3 to 5 Artificer differentiator questions.
- Convert UI to dark mode.
- Preserve current self-tests and add Artificer tests.

### Phase 3: Add Subclass Scoring

- Add subclass map.
- Add subclassTags to answers.
- Add calculateSubclassResult function.
- Only evaluate subclasses after main class is selected.
- Add tests for subclass selection.

### Phase 4: Expand Result Page

- Show subclass.
- Show multiclass subclass if applicable.
- Show explanation snippets.
- Improve class reveal styling.
- Keep score breakdown.

### Phase 5: Tuning

- Run sample answer sets for each class.
- Make sure each class can win.
- Make sure Artificer does not steal every Wizard result.
- Make sure Fighter, Monk, and Barbarian remain distinct.
- Make sure multiclass is rare.
- Make sure every subclass is reachable.

## Testing Plan

Current self-tests should stay.

Add tests for:

1. Object shaped answers still work.
2. Array shaped answers still work.
3. Invalid answers are ignored.
4. Empty answers do not crash.
5. Artificer can be top class.
6. Wizard still wins for research and theory answers.
7. Artificer beats Wizard for builder and automation answers.
8. Multiclass triggers only when close.
9. Multiclass does not trigger when top class is dominant.
10. Each class has at least one answer path that can produce a top score.
11. Each subclass can be selected through tags.
12. Result page works for single class and multiclass.

## Key Product Decision

Do not simply bolt subclasses onto the current quiz.

The stronger version is:

- Keep the current behavioral question style.
- Add Artificer as a full class.
- Expand and rewrite questions only where needed.
- Use main class scoring first.
- Use subclass scoring second.
- Use traits third.
- Keep multiclass rare.
- Convert UI to dark mode after plan approval.

