// D&D Class Personality Test v3
// Branching pool: baseline (everyone) -> tie-breakers (conditional) -> subclass flavor (filtered)
// Scoring rebalanced after v2 simulation showed Artificer 5x ceiling vs Druid.

export const CLASSES = [
  "Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
  "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard",
];

function s(scores, subclassTags = {}, facets = []) {
  return { scores, subclassTags, facets };
}

// ---------------------------------------------------------------------------
// HOBBY TAGS (ranked top-3 question)
// ---------------------------------------------------------------------------
// Each hobby maps to class scores. Weights are modest (2-4 per class).
// When ranked, #1 hobby is multiplied x3, #2 x2, #3 x1. Subclass tags optional.

export const HOBBIES = [
  { id: "cook",       label: "Cooking elaborate meals from scratch",        scores: { Cleric: 2, Artificer: 1 }, subclassTags: { Cleric: { Life: 1 }, Artificer: { Alchemist: 1 } } },
  { id: "bake",       label: "Baking — precise recipes, consistent results", scores: { Artificer: 2, Cleric: 1 }, subclassTags: { Artificer: { Alchemist: 2 } } },
  { id: "garden",     label: "Gardening, growing food, keeping plants",      scores: { Druid: 4 }, subclassTags: { Druid: { Land: 2 } } },
  { id: "birdwatch",  label: "Birdwatching, foraging, wildlife photography", scores: { Druid: 3, Ranger: 1 }, subclassTags: { Druid: { Land: 1, Moon: 1 } } },
  { id: "hike",       label: "Hiking, backpacking, navigating trails",       scores: { Ranger: 4 }, subclassTags: { Ranger: { Hunter: 1, "Winter Walker": 1 } } },
  { id: "hunt",       label: "Hunting, fishing, tracking",                   scores: { Ranger: 3, Barbarian: 1 }, subclassTags: { Ranger: { Hunter: 2 } } },
  { id: "lift",       label: "Lifting weights, powerlifting, strongman",     scores: { Barbarian: 3, Fighter: 1 }, subclassTags: { Barbarian: { Berserker: 1 }, Fighter: { Champion: 1 } } },
  { id: "combat",     label: "Contact sports, boxing, MMA, rugby",           scores: { Barbarian: 2, Fighter: 2 }, subclassTags: { Fighter: { Champion: 1 }, Barbarian: { Berserker: 1 } } },
  { id: "martial",    label: "Martial arts, jiu-jitsu, taekwondo",           scores: { Monk: 4 }, subclassTags: { Monk: { "Open Hand": 2 } } },
  { id: "yoga",       label: "Yoga, breathwork, meditation",                 scores: { Monk: 3, Cleric: 1 }, subclassTags: { Monk: { Mercy: 1, "Open Hand": 1 } } },
  { id: "run",        label: "Running, cycling, endurance training",         scores: { Fighter: 2, Ranger: 1, Monk: 1 } },
  { id: "music",      label: "Playing instrument, singing, songwriting",     scores: { Bard: 3, Sorcerer: 1 }, subclassTags: { Bard: { Lore: 1, Valor: 1 } } },
  { id: "dance",      label: "Dance, theater, performance",                  scores: { Bard: 2, Sorcerer: 2 }, subclassTags: { Bard: { Dance: 2, Glamour: 1 } } },
  { id: "speak",      label: "Public speaking, teaching, podcasting",        scores: { Bard: 2, Paladin: 1, Sorcerer: 1 }, subclassTags: { Bard: { Lore: 1, Valor: 1 } } },
  { id: "host",       label: "Hosting parties, organizing friend groups",    scores: { Bard: 1, Sorcerer: 2, Paladin: 1 }, subclassTags: { Sorcerer: { "Draconic Sorcery": 1 } } },
  { id: "volunteer",  label: "Volunteering, ministry, community service",    scores: { Cleric: 3, Paladin: 1 }, subclassTags: { Cleric: { Life: 1, Light: 1 } } },
  { id: "activism",   label: "Activism, organizing, cause campaigns",        scores: { Paladin: 3, Bard: 1 }, subclassTags: { Paladin: { Devotion: 1, Glory: 1 } } },
  { id: "read",       label: "Reading deeply — fiction, history, theory",    scores: { Wizard: 3 }, subclassTags: { Wizard: { Diviner: 1, Knowledge: 1 } } },
  { id: "research",   label: "Research projects, writing, journaling",       scores: { Wizard: 3, Monk: 1 }, subclassTags: { Wizard: { Abjurer: 1, Diviner: 1 } } },
  { id: "chess",      label: "Chess, strategy games, complex puzzles",       scores: { Wizard: 2, Rogue: 2 }, subclassTags: { Wizard: { Diviner: 1 }, Rogue: { "Arcane Trickster": 1 } } },
  { id: "code",       label: "Coding, scripting, side software projects",    scores: { Artificer: 2, Wizard: 1 }, subclassTags: { Artificer: { Cartographer: 1, "Battle Smith": 1 } } },
  { id: "make",       label: "3D printing, woodworking, electronics builds", scores: { Artificer: 2 }, subclassTags: { Artificer: { Armorer: 1, Artillerist: 1, "Battle Smith": 1 } } },
  { id: "repair",     label: "Car maintenance, home repair, restoration",    scores: { Artificer: 2, Fighter: 1, Ranger: 1 }, subclassTags: { Artificer: { Armorer: 1 } } },
  { id: "craft",      label: "Knitting, sewing, embroidery, fine craft",     scores: { Monk: 2, Cleric: 1, Artificer: 1 }, subclassTags: { Monk: { Mercy: 1 } } },
  { id: "art",        label: "Drawing, painting, digital art",               scores: { Sorcerer: 2, Wizard: 1, Bard: 1 }, subclassTags: { Sorcerer: { "Aberrant Sorcery": 1 } } },
  { id: "video",      label: "Video editing, content creation, streaming",   scores: { Bard: 2, Artificer: 1 }, subclassTags: { Bard: { Glamour: 1 } } },
  { id: "network",    label: "Networking events, professional groups, clubs",scores: { Warlock: 3, Sorcerer: 1 }, subclassTags: { Warlock: { "Archfey Patron": 1 } } },
  { id: "invest",     label: "Investing, market analysis, finance",          scores: { Warlock: 2, Wizard: 2 }, subclassTags: { Warlock: { "Fiend Patron": 1 } } },
  { id: "poker",      label: "Poker, high-stakes social games, sales hustle",scores: { Sorcerer: 3, Warlock: 1, Rogue: 1 }, subclassTags: { Sorcerer: { "Draconic Sorcery": 1, "Wild Magic Sorcery": 1 } } },
  { id: "stealth",    label: "Lockpicking, urban exploration, parkour",      scores: { Rogue: 3, Monk: 1 }, subclassTags: { Rogue: { Thief: 2 } } },
  { id: "collect",    label: "Collecting — vinyl, cards, antiques, rare X",  scores: { Wizard: 1, Warlock: 1 } },
  { id: "tabletop",   label: "Tabletop RPGs, D&D, complex board games",      scores: { Wizard: 1, Rogue: 1 } },
];

// ---------------------------------------------------------------------------
// BASELINE QUESTIONS (12 — every user sees these)
// ---------------------------------------------------------------------------

export const baselineQuestions = [
  // Q1 — Sunday hobby ranking (special type)
  {
    id: "sunday",
    type: "rank3",
    section: "Life Pattern",
    text: "Pick your top 3 most-honest answers — what you'd actually do with a free Sunday. Rank them.",
    instruction: "Tap 3 in order: most likely first.",
    options: HOBBIES, // user picks 3, scored x3 / x2 / x1
  },

  // Q2 — Power source via helping a friend (replaces v2 Q13/Q14)
  {
    id: "help_friend",
    type: "single",
    section: "Power Source",
    text: "A friend says: 'I have a job interview Friday and I'm freaking out.' Your most likely move:",
    options: [
      { label: "Drill them through 20 mock questions until smooth", ...s({ Fighter: 4, Monk: 1 }, { Fighter: { "Battle Master": 1, Champion: 1 } }, ["Disciplined"]) },
      { label: "Pull up the company's history, comp model, and recent news so they walk in informed", ...s({ Wizard: 3 }, { Wizard: { Diviner: 1, Knowledge: 1 } }, ["Scholar"]) },
      { label: "Text three contacts who might know the hiring manager or team", ...s({ Warlock: 4, Bard: 1 }, { Warlock: { "Archfey Patron": 1, "Fiend Patron": 1 } }, ["Connected"]) },
      { label: "Tell them they've already got it and walk them into confidence", ...s({ Sorcerer: 4, Bard: 1 }, { Sorcerer: { "Draconic Sorcery": 1, "Spellfire Sorcery": 1 } }, ["Natural Presence"]) },
      { label: "Build them a one-page prep sheet and a question template they can reuse forever", ...s({ Artificer: 3, Wizard: 1 }, { Artificer: { Cartographer: 1, Alchemist: 1 } }, ["Maker"]) },
      { label: "Listen, ask what's actually scaring them, sit with it before fixing", ...s({ Cleric: 3, Monk: 1, Druid: 1 }, { Cleric: { Life: 1, Light: 1 } }, ["Healer"]) },
    ],
  },

  // Q3 — Learning a new hard skill (replaces v2 Q5)
  {
    id: "learn_welding",
    type: "single",
    section: "Learning Mode",
    text: "You decide to learn welding (or any new physical craft). Your first 2 weeks look like:",
    options: [
      { label: "Three books, a YouTube playlist, and notes before I strike an arc", ...s({ Wizard: 3 }, { Wizard: { Knowledge: 1, Abjurer: 1 } }, ["Documented"]) },
      { label: "Sign up for a class with a certified instructor and run the drills", ...s({ Fighter: 3, Paladin: 1, Monk: 1 }, { Fighter: { "Battle Master": 1, Champion: 1 } }, ["Practice Based"]) },
      { label: "Buy a cheap kit, watch one video, start ruining metal Saturday", ...s({ Sorcerer: 3, Rogue: 2 }, { Sorcerer: { "Wild Magic Sorcery": 2 }, Rogue: { Thief: 1 } }, ["Improviser"]) },
      { label: "Find a welder I respect and ask to apprentice or shadow them", ...s({ Warlock: 4, Cleric: 1 }, { Warlock: { "Celestial Patron": 1, "Fiend Patron": 1 } }, ["Mentor Linked"]) },
      { label: "Build a jig and a personal checklist after the first burn so it stays fixed", ...s({ Artificer: 3, Fighter: 1 }, { Artificer: { Armorer: 1, "Battle Smith": 1 } }, ["Builder"]) },
      { label: "Practice the same single bead daily until my hand stops shaking", ...s({ Monk: 4, Druid: 1 }, { Monk: { "Open Hand": 2 } }, ["Disciplined"]) },
    ],
  },

  // Q4 — Physical mode (merged v2 Q3+Q4)
  {
    id: "physical",
    type: "single",
    section: "Physical Mode",
    text: "Pick the physical practice closest to your actual life in the last 6 months:",
    options: [
      { label: "Martial arts, grappling, or focused movement (yoga, breath, control)", ...s({ Monk: 5 }, { Monk: { "Open Hand": 2, Mercy: 1 } }, ["Body Mind"]) },
      { label: "Heavy lifting, contact sports, or hard physical labor", ...s({ Barbarian: 3, Fighter: 2 }, { Barbarian: { Berserker: 2 }, Fighter: { Champion: 1 } }, ["Power Trained"]) },
      { label: "Hiking, trail running, climbing, outdoor cardio", ...s({ Ranger: 4, Druid: 2 }, { Ranger: { Hunter: 1, "Winter Walker": 1 }, Druid: { Land: 1 } }, ["Fieldcraft"]) },
      { label: "Gardening, animal care, manual land work outdoors", ...s({ Druid: 4, Ranger: 1 }, { Druid: { Land: 2, Moon: 1 } }, ["Steward"]) },
      { label: "Structured gym progression, technique sport (climbing, swim, golf)", ...s({ Fighter: 4, Monk: 1 }, { Fighter: { "Battle Master": 1, Champion: 1 } }, ["Measured Growth"]) },
      { label: "Dance, performance movement, rhythm-based practice", ...s({ Bard: 4, Monk: 1 }, { Bard: { Dance: 2, Glamour: 1 } }, ["Expressive Movement"]) },
      { label: "Long walks, casual movement, podcast walks — fitness is steady not focused", ...s({ Wizard: 2, Bard: 1, Druid: 1 }, {}, ["Reflective Mover"]) },
    ],
  },

  // Q5 — Group role (merged v2 Q7+Q8)
  {
    id: "group_role",
    type: "single",
    section: "Social Mode",
    text: "You join a group project with 5 people you don't know well. Two weeks in, what role have you slid into?",
    options: [
      { label: "The one explaining the work, hyping the room, keeping morale up", ...s({ Bard: 3, Sorcerer: 1, Paladin: 1 }, { Bard: { Valor: 1, Glamour: 1 } }, ["Influencer"]) },
      { label: "The one calling out when standards slip and pulling people back to the mission", ...s({ Paladin: 5 }, { Paladin: { Devotion: 2, Glory: 1 } }, ["Principled"]) },
      { label: "The one checking in privately on whoever seems off", ...s({ Cleric: 4, Druid: 1 }, { Cleric: { Life: 1, Light: 1 } }, ["Healer"]) },
      { label: "The one quietly watching, noticing what others miss, speaking only when it matters", ...s({ Rogue: 3, Ranger: 2, Druid: 1, Monk: 1 }, { Rogue: { Soulknife: 1, Assassin: 1 }, Ranger: { "Gloom Stalker": 1 } }, ["Observer"]) },
      { label: "The one setting up the shared doc, template, or tool everyone now relies on", ...s({ Artificer: 3, Fighter: 1 }, { Artificer: { Cartographer: 2, Armorer: 1 } }, ["System Support"]) },
      { label: "The one people end up listening to even though nobody made me the lead", ...s({ Sorcerer: 4, Bard: 1 }, { Sorcerer: { "Draconic Sorcery": 2 }, Bard: { Glamour: 1 } }, ["Natural Presence"]) },
      { label: "The one running the schedule, assignments, and execution plan", ...s({ Fighter: 4, Paladin: 1 }, { Fighter: { Banneret: 2, "Battle Master": 1 } }, ["Coordinator"]) },
    ],
  },

  // Q6 — Half-acre lot (replaces v2 Q9+Q10)
  {
    id: "half_acre",
    type: "single",
    section: "Nature and Fieldcraft",
    text: "A relative dies and leaves you a half-acre lot 30 minutes out of town. Honest first instinct:",
    options: [
      { label: "Native plants, compost, watch what already wants to grow there", ...s({ Druid: 5 }, { Druid: { Land: 2, Stars: 1 } }, ["Steward"]) },
      { label: "Map the trails, learn the local wildlife, set up game cameras", ...s({ Ranger: 5 }, { Ranger: { Hunter: 1, "Gloom Stalker": 1 } }, ["Scout"]) },
      { label: "Build sheds, run irrigation, automate watering and security", ...s({ Artificer: 3, Fighter: 1 }, { Artificer: { Armorer: 1, Cartographer: 1, "Battle Smith": 1 } }, ["Maker"]) },
      { label: "Quiet morning spot to journal, meditate, run a long loop alone", ...s({ Monk: 2, Druid: 2, Wizard: 1 }, { Monk: { "Open Hand": 1, Mercy: 1 }, Druid: { Stars: 1 } }, ["Reflective"]) },
      { label: "Host events out there — bonfires, retreats, friend weekends", ...s({ Bard: 2, Sorcerer: 2, Paladin: 1 }, { Bard: { Glamour: 1 }, Sorcerer: { "Draconic Sorcery": 1 } }, ["Connector"]) },
      { label: "Research zoning, value, comps — figure out the optimal play", ...s({ Wizard: 3, Warlock: 2 }, { Wizard: { Diviner: 1 }, Warlock: { "Fiend Patron": 1 } }, ["Strategist"]) },
      { label: "Hand it to a community group who'll do more good with it than I will", ...s({ Cleric: 2, Paladin: 2, Druid: 2 }, { Cleric: { Life: 1 }, Paladin: { Devotion: 1 }, Druid: { Land: 1 } }, ["Service First"]) },
    ],
  },

  // Q7 — What bothers most (v2 Q12 reframed)
  {
    id: "bothers",
    type: "single",
    section: "Cause and Calling",
    text: "Scrolling the news. What story makes you actually close the app angry?",
    options: [
      { label: "Someone in power harming people while bystanders do nothing", ...s({ Paladin: 5, Barbarian: 1 }, { Paladin: { Vengeance: 2, Devotion: 1 }, Barbarian: { Zealot: 1 } }, ["Protector"]) },
      { label: "Vulnerable people suffering without care, support, or community", ...s({ Cleric: 5 }, { Cleric: { Life: 2, Light: 1 } }, ["Compassionate"]) },
      { label: "Ecosystems collapsing, species lost, habitats destroyed", ...s({ Druid: 5 }, { Druid: { Land: 1, Moon: 1, Stars: 1 } }, ["Living Systems Mind"]) },
      { label: "Misinformation spreading, decisions made on bad data, science ignored", ...s({ Wizard: 3, Cleric: 1 }, { Wizard: { Knowledge: 1, Diviner: 1 } }, ["Truth Seeker"]) },
      { label: "Avoidable problems repeating because nobody fixed the underlying system", ...s({ Artificer: 3, Wizard: 1, Fighter: 1 }, { Artificer: { Cartographer: 1, Alchemist: 1 } }, ["Automation Mind"]) },
      { label: "People stuck by rigid rules when a smarter workaround clearly exists", ...s({ Rogue: 4, Bard: 1 }, { Rogue: { Thief: 1, "Arcane Trickster": 1 } }, ["Rule Bender"]) },
      { label: "Institutions and gatekeepers blocking access for people who deserve a chance", ...s({ Warlock: 3, Paladin: 1, Bard: 1 }, { Warlock: { "Celestial Patron": 1, "Archfey Patron": 1 } }, ["Access Aware"]) },
    ],
  },

  // Q8 — Plan fails public (v2 Q15)
  {
    id: "plan_fails",
    type: "single",
    section: "Pressure Scenario",
    text: "Project demo, day-of, something breaks live in front of leadership. You:",
    options: [
      { label: "Take the room, give clear next-step instructions, redistribute the load", ...s({ Fighter: 4, Paladin: 1 }, { Fighter: { Banneret: 2, "Battle Master": 1 } }, ["Commander"]) },
      { label: "Crack a joke, narrate over the mess, keep energy from collapsing", ...s({ Bard: 3, Sorcerer: 1 }, { Bard: { Glamour: 1, Valor: 1 } }, ["Morale Keeper"]) },
      { label: "Spot the side-route — different demo path, mock data, anything that gets us through", ...s({ Rogue: 4, Sorcerer: 1 }, { Rogue: { Thief: 1, "Arcane Trickster": 1 } }, ["Improviser"]) },
      { label: "Open a terminal, patch live, ship a hotfix before the meeting ends", ...s({ Artificer: 3, Wizard: 1 }, { Artificer: { "Battle Smith": 1, Cartographer: 1 } }, ["Patch Builder"]) },
      { label: "Trust gut, make a bold call — pivot the whole conversation", ...s({ Sorcerer: 3, Barbarian: 3 }, { Sorcerer: { "Wild Magic Sorcery": 1 }, Barbarian: { Berserker: 1 } }, ["Instinctive"]) },
      { label: "Stay calm, breathe, lower the temperature so everyone else can think again", ...s({ Monk: 3, Cleric: 1, Druid: 1 }, { Monk: { Mercy: 1, "Open Hand": 1 }, Druid: { Stars: 1 } }, ["Calm Under Strain"]) },
    ],
  },

  // Q9 — Limited resources mission (v2 Q16)
  {
    id: "limited_mission",
    type: "single",
    section: "Pressure Scenario",
    text: "Hard project, half the resources you needed, real deadline. Your edge over someone else doing it is:",
    options: [
      { label: "I outlast everyone — I'll take the hits and keep moving when others quit", ...s({ Barbarian: 5 }, { Barbarian: { Berserker: 1, Zealot: 1 } }, ["Grit"]) },
      { label: "I prepared. By week two I know more about this problem than anyone else", ...s({ Wizard: 3, Fighter: 1 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Prepared"]) },
      { label: "I read the terrain, find the path nobody else considered, move alone if needed", ...s({ Ranger: 4, Rogue: 1 }, { Ranger: { Hunter: 1, "Gloom Stalker": 1 } }, ["Scout"]) },
      { label: "I know the right people. Calls get made, doors open", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Archfey Patron": 1 } }, ["Leverage"]) },
      { label: "I build the tool, template, or pipeline that lets the team punch above weight", ...s({ Artificer: 3, Fighter: 1 }, { Artificer: { Armorer: 1, Cartographer: 1, Artillerist: 1 } }, ["Force Multiplier"]) },
      { label: "I read what matters to people and get them to commit to the mission", ...s({ Paladin: 4, Sorcerer: 1, Bard: 1 }, { Paladin: { Devotion: 1, Glory: 1 }, Bard: { Valor: 1 } }, ["Cause Led"]) },
      { label: "I keep the team okay — energy, food, conflict, morale — so they can do the work", ...s({ Cleric: 4, Bard: 1 }, { Cleric: { Life: 1, Light: 1 } }, ["Sustainer"]) },
    ],
  },

  // Q10 — Locked door (v2 Q21)
  {
    id: "locked_door",
    type: "single",
    section: "Class Differentiator",
    text: "Locked door. You need through. Most natural approach:",
    options: [
      { label: "Find the weak spot, side door, or loophole nobody checked", ...s({ Rogue: 5 }, { Rogue: { Thief: 2, Assassin: 1 } }, ["Exploit Finder"]) },
      { label: "Call someone with the key, badge, or authority", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Archfey Patron": 1 } }, ["Access Broker"]) },
      { label: "Study how the lock actually works", ...s({ Wizard: 3, Rogue: 1 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Design Analyst"]) },
      { label: "Build or modify the tool that opens it", ...s({ Artificer: 3, Rogue: 1 }, { Artificer: { Armorer: 1, "Battle Smith": 1 } }, ["Tool Maker"]) },
      { label: "Break it if it's urgent enough", ...s({ Barbarian: 5 }, { Barbarian: { Berserker: 2 } }, ["Direct Force"]) },
      { label: "Charm whoever's nearby into opening it for me", ...s({ Bard: 3, Sorcerer: 2 }, { Bard: { Glamour: 2 }, Sorcerer: { "Draconic Sorcery": 1 } }, ["Charm Path"]) },
    ],
  },

  // Q11 — Recurring breakage (merged v2 Q19+Q20)
  {
    id: "recurring_break",
    type: "single",
    section: "Systems and Tools",
    text: "Same annoying thing keeps breaking — at work, home, in your group. After the third time, you:",
    options: [
      { label: "Dig into root cause, document it, understand why it actually fails", ...s({ Wizard: 3 }, { Wizard: { Diviner: 1, Abjurer: 1, Knowledge: 1 } }, ["Root Cause"]) },
      { label: "Build a fix — script, jig, checklist, automation — so it stops repeating", ...s({ Artificer: 3 }, { Artificer: { Armorer: 1, "Battle Smith": 1, Alchemist: 1 } }, ["Fix Builder"]) },
      { label: "Create a process people can follow and train them on it", ...s({ Fighter: 3, Paladin: 2 }, { Fighter: { Banneret: 1, "Battle Master": 1 }, Paladin: { Devotion: 1 } }, ["Process Trainer"]) },
      { label: "Find the workaround that gets past it right now and ship", ...s({ Rogue: 4 }, { Rogue: { Thief: 1, "Arcane Trickster": 1 } }, ["Workaround Mind"]) },
      { label: "Escalate to whoever owns it — vendor, manager, platform", ...s({ Warlock: 4, Paladin: 1 }, { Warlock: { "Fiend Patron": 1, "Great Old One Patron": 1 } }, ["Access Solver"]) },
      { label: "Notice the natural rhythm of when it breaks and adapt around it", ...s({ Druid: 4, Ranger: 1 }, { Druid: { Stars: 2, Land: 1 }, Ranger: { Hunter: 1 } }, ["Pattern Reader"]) },
      { label: "Just absorb it. Some things you push through and stop complaining", ...s({ Barbarian: 4, Monk: 1 }, { Barbarian: { "World Tree": 1, Berserker: 1 }, Monk: { "Open Hand": 1 } }, ["Endurer"]) },
    ],
  },

  // Q12 — Evidence (v2 Q17 reframed)
  {
    id: "evidence",
    type: "single",
    section: "Evidence",
    text: "Pick the line that fits your actual real-world track record best:",
    options: [
      { label: "Belts, certifications, trade licenses, military, emergency response, or technical training", ...s({ Fighter: 4, Monk: 2, Paladin: 1 }, { Fighter: { Champion: 1, "Battle Master": 1 }, Monk: { "Open Hand": 1 } }, ["Credentialed"]) },
      { label: "Performances, talks, teaching, music, content, events with audiences", ...s({ Bard: 5 }, { Bard: { Lore: 1, Glamour: 1, Dance: 1, Valor: 1 } }, ["Public Voice"]) },
      { label: "Degrees, research, publications, formal study, analytic work", ...s({ Wizard: 4 }, { Wizard: { Diviner: 1, Abjurer: 1, Knowledge: 1 } }, ["Documented"]) },
      { label: "Shipped products, code, repairs, builds, labs, devices, working systems", ...s({ Artificer: 3, Wizard: 1 }, { Artificer: { "Battle Smith": 1, Cartographer: 1, Armorer: 1, Artillerist: 1 } }, ["Maker Evidence"]) },
      { label: "Ministry, volunteering, care work, activism, community leadership", ...s({ Cleric: 3, Paladin: 3 }, { Cleric: { Life: 1, Light: 1 }, Paladin: { Devotion: 1 } }, ["Service Led"]) },
      { label: "Field work — conservation, wilderness, scouts, search-and-rescue, ranger work, expedition", ...s({ Ranger: 4, Druid: 2 }, { Ranger: { Hunter: 1, "Winter Walker": 1, "Gloom Stalker": 1 }, Druid: { Land: 1 } }, ["Field Credentialed"]) },
      { label: "Career built mostly through people, mentors, sponsors, or institutions backing me", ...s({ Warlock: 4, Sorcerer: 1 }, { Warlock: { "Fiend Patron": 1, "Celestial Patron": 1, "Archfey Patron": 1 } }, ["Patronage"]) },
      { label: "Path mostly self-taught, scrappy, opportunistic — I figured it out without much support", ...s({ Sorcerer: 3, Rogue: 3 }, { Rogue: { Thief: 1, Assassin: 1 }, Sorcerer: { "Wild Magic Sorcery": 1, "Draconic Sorcery": 1 } }, ["Self Reliant"]) },
    ],
  },
];

// ---------------------------------------------------------------------------
// TIE-BREAKER POOL (conditional — fire when top 2 classes close after baseline)
// Each Q tagged with `pair` = the two classes it differentiates.
// ---------------------------------------------------------------------------

export const tieBreakerPool = [
  {
    id: "tb_wiz_art",
    pair: ["Wizard", "Artificer"],
    section: "Bonus Round",
    text: "Coworker keeps shipping bugs. You're the one who actually does something about it. Which?",
    options: [
      { label: "Write a doc explaining the failure mode so everyone learns it", ...s({ Wizard: 5 }, { Wizard: { Knowledge: 1, Diviner: 1 } }, ["Documented"]) },
      { label: "Build a linter / pre-commit hook so the bug can't ship again", ...s({ Artificer: 5 }, { Artificer: { Armorer: 1, "Battle Smith": 1 } }, ["Maker"]) },
    ],
  },
  {
    id: "tb_fight_monk",
    pair: ["Fighter", "Monk"],
    section: "Bonus Round",
    text: "Six months into a new combat discipline. What hooked you most?",
    options: [
      { label: "Watching myself climb the ranks and measure improvement", ...s({ Fighter: 5 }, { Fighter: { Champion: 2 } }, ["Measured Growth"]) },
      { label: "The internal control — breath, calm, becoming harder to rattle", ...s({ Monk: 5 }, { Monk: { "Open Hand": 2, Mercy: 1 } }, ["Self Mastery"]) },
    ],
  },
  {
    id: "tb_fight_barb",
    pair: ["Fighter", "Barbarian"],
    section: "Bonus Round",
    text: "Night before a big competition or high-stakes event. You:",
    options: [
      { label: "Run the playbook one more time, sleep on schedule, visualize the reps", ...s({ Fighter: 5 }, { Fighter: { "Battle Master": 2 } }, ["Tactical"]) },
      { label: "Get hyped, eat, sleep when sleep comes — tomorrow I'll be ready when I'm ready", ...s({ Barbarian: 5 }, { Barbarian: { Berserker: 2 } }, ["Pressure Brave"]) },
    ],
  },
  {
    id: "tb_cler_pal",
    pair: ["Cleric", "Paladin"],
    section: "Bonus Round",
    text: "A friend confides their partner cheated. They're devastated. Your true first move:",
    options: [
      { label: "Sit with them. Cancel my plans. Just be present until they can think", ...s({ Cleric: 5 }, { Cleric: { Life: 2, Light: 1 } }, ["Healer"]) },
      { label: "Help them decide if this is a line, and back whatever stand they take", ...s({ Paladin: 5 }, { Paladin: { Devotion: 1, Vengeance: 2 } }, ["Moral Backbone"]) },
    ],
  },
  {
    id: "tb_rang_dru",
    pair: ["Ranger", "Druid"],
    section: "Bonus Round",
    text: "Local creek polluted from upstream runoff. Most natural response:",
    options: [
      { label: "Walk the watershed, find the source, document where it's coming from", ...s({ Ranger: 5 }, { Ranger: { Hunter: 2, "Gloom Stalker": 1 } }, ["Tracker"]) },
      { label: "Join or start the restoration group — native plants, water testing, long fix", ...s({ Druid: 5 }, { Druid: { Land: 2, Sea: 1 } }, ["Steward"]) },
    ],
  },
  {
    id: "tb_rog_war",
    pair: ["Rogue", "Warlock"],
    section: "Bonus Round",
    text: "Critical approval blocked by bureaucracy. Deadline is real. You:",
    options: [
      { label: "Find the workaround inside the rules — different form, technicality, side door", ...s({ Rogue: 5 }, { Rogue: { Thief: 2, "Arcane Trickster": 1 } }, ["Workaround"]) },
      { label: "Find the exec, vendor, or relationship that can fast-track the whole thing", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 2, "Archfey Patron": 1 } }, ["Leverage"]) },
    ],
  },
  {
    id: "tb_sor_bard",
    pair: ["Sorcerer", "Bard"],
    section: "Bonus Round",
    text: "After a presentation, the compliment that lands most is:",
    options: [
      { label: "\"You just have it. People can't look away when you talk.\"", ...s({ Sorcerer: 5 }, { Sorcerer: { "Draconic Sorcery": 2, "Spellfire Sorcery": 1 } }, ["Natural Presence"]) },
      { label: "\"You're so prepared — your stories, examples, pacing, everything landed.\"", ...s({ Bard: 5 }, { Bard: { Lore: 2, Valor: 1, Glamour: 1 } }, ["Crafted Influence"]) },
    ],
  },
  {
    id: "tb_wiz_war",
    pair: ["Wizard", "Warlock"],
    section: "Bonus Round",
    text: "You mastered the most useful skill in your career through:",
    options: [
      { label: "Books, deep dives, deliberate study, mostly alone", ...s({ Wizard: 5 }, { Wizard: { Knowledge: 2, Diviner: 1 } }, ["Self Studied"]) },
      { label: "A mentor, sponsor, or institution that opened doors and taught me", ...s({ Warlock: 5 }, { Warlock: { "Celestial Patron": 2, "Fiend Patron": 1 } }, ["Patron Linked"]) },
    ],
  },
  {
    id: "tb_barb_pal",
    pair: ["Barbarian", "Paladin"],
    section: "Bonus Round",
    text: "Stranger gets cornered and harassed in front of you. First instinct, honest:",
    options: [
      { label: "Step in physically between them, regardless of consequences", ...s({ Barbarian: 5, Paladin: 1 }, { Barbarian: { Berserker: 1, "World Tree": 1 } }, ["Pressure Brave"]) },
      { label: "Step in loudly, name what's happening, call the standard publicly", ...s({ Paladin: 5 }, { Paladin: { Vengeance: 2, Devotion: 1 } }, ["Standard Bearer"]) },
    ],
  },
  {
    id: "tb_cler_dru",
    pair: ["Cleric", "Druid"],
    section: "Bonus Round",
    text: "You're given a small budget to start something local that helps. You start:",
    options: [
      { label: "A care program for people — food, mentorship, recovery, support group", ...s({ Cleric: 5 }, { Cleric: { Life: 2, Light: 1 } }, ["Community Healer"]) },
      { label: "A land project — community garden, urban farm, wildlife corridor, river cleanup", ...s({ Druid: 5 }, { Druid: { Land: 2 } }, ["Land Steward"]) },
    ],
  },
  {
    id: "tb_art_rog",
    pair: ["Artificer", "Rogue"],
    section: "Bonus Round",
    text: "Recurring problem at work. You can:",
    options: [
      { label: "Build a real fix — system, automation, repeatable solution — even though it takes 2 weeks", ...s({ Artificer: 5 }, { Artificer: { Cartographer: 1, "Battle Smith": 1 } }, ["Permanent Fix"]) },
      { label: "Ship a clever workaround today that buys 6 months, move on", ...s({ Rogue: 5 }, { Rogue: { Thief: 2, "Arcane Trickster": 1 } }, ["Smart Hack"]) },
    ],
  },
];

// ---------------------------------------------------------------------------
// SUBCLASS FLAVOR POOL (filtered to top class — fire 1-2 max)
// ---------------------------------------------------------------------------

export const subclassFlavorPool = {
  Artificer: {
    section: "Subclass Forge",
    text: "Which kind of building feels most you?",
    options: [
      { label: "Mixing, experimenting, chemistry, applied fixes", ...s({ Artificer: 2 }, { Artificer: { Alchemist: 3 } }, ["Experimenter"]) },
      { label: "Protective gear, wearables, defensive systems", ...s({ Artificer: 2 }, { Artificer: { Armorer: 3 } }, ["Protector Build"]) },
      { label: "High-output systems, force, range, scale", ...s({ Artificer: 2 }, { Artificer: { Artillerist: 3 } }, ["Output Build"]) },
      { label: "Robots, companions, automation that does the work", ...s({ Artificer: 2 }, { Artificer: { "Battle Smith": 3 } }, ["Companion Build"]) },
      { label: "Maps, navigation, mapping unknown spaces or systems", ...s({ Artificer: 2 }, { Artificer: { Cartographer: 3 } }, ["Mapper"]) },
    ],
  },
  Barbarian: {
    section: "Subclass Forge",
    text: "Your intensity is really about:",
    options: [
      { label: "Raw direct force, getting through walls others freeze at", ...s({ Barbarian: 2 }, { Barbarian: { Berserker: 3 } }, ["Pure Force"]) },
      { label: "Animal instinct, body-first, wilderness energy", ...s({ Barbarian: 2 }, { Barbarian: { "Wild Heart": 3 } }, ["Instinct Body"]) },
      { label: "Protecting people, holding the boundary, keeping the group safe", ...s({ Barbarian: 2 }, { Barbarian: { "World Tree": 3 } }, ["Boundary Keep"]) },
      { label: "Mission, loyalty, belief — fury behind a cause", ...s({ Barbarian: 2 }, { Barbarian: { Zealot: 3 } }, ["Cause Fury"]) },
    ],
  },
  Bard: {
    section: "Subclass Forge",
    text: "Your influence comes through:",
    options: [
      { label: "Movement, rhythm, presence, physical expression", ...s({ Bard: 2 }, { Bard: { Dance: 3 } }, ["Rhythm"]) },
      { label: "Style, charm, magnetism, social fascination", ...s({ Bard: 2 }, { Bard: { Glamour: 3 } }, ["Magnetic"]) },
      { label: "Stories, history, references, teaching", ...s({ Bard: 2 }, { Bard: { Lore: 3 } }, ["Lore Keeper"]) },
      { label: "Emotion, mood shifts, healing and harm through rhythm", ...s({ Bard: 2 }, { Bard: { Moon: 3 } }, ["Emotional Tide"]) },
      { label: "Courage, heroic example, performance under pressure", ...s({ Bard: 2 }, { Bard: { Valor: 3 } }, ["Heroic Voice"]) },
    ],
  },
  Cleric: {
    section: "Subclass Forge",
    text: "Your service mostly looks like:",
    options: [
      { label: "Teaching, truth, helping people understand", ...s({ Cleric: 2 }, { Cleric: { Knowledge: 3 } }, ["Truth Seeker"]) },
      { label: "Healing, nurture, restoring people", ...s({ Cleric: 2 }, { Cleric: { Life: 3 } }, ["Restorer"]) },
      { label: "Hope, optimism, fighting despair", ...s({ Cleric: 2 }, { Cleric: { Light: 3 } }, ["Light Bearer"]) },
      { label: "Cleverness, subversion, changing how people see it", ...s({ Cleric: 2 }, { Cleric: { Trickery: 3 } }, ["Subverter"]) },
      { label: "Sacred defense — willing to fight for what's right", ...s({ Cleric: 2 }, { Cleric: { War: 3 } }, ["Sacred Warrior"]) },
    ],
  },
  Druid: {
    section: "Subclass Forge",
    text: "Your nature connection feels like:",
    options: [
      { label: "Place — local land, biome, seasons, regional roots", ...s({ Druid: 2 }, { Druid: { Land: 3 } }, ["Place Rooted"]) },
      { label: "Animals, instinct, embodiment, transformation", ...s({ Druid: 2 }, { Druid: { Moon: 3 } }, ["Animal Embodied"]) },
      { label: "Water, storms, waves, movement, emotional flow", ...s({ Druid: 2 }, { Druid: { Sea: 3 } }, ["Storm Heart"]) },
      { label: "Sky, patterns, cycles, navigation, cosmic view", ...s({ Druid: 2 }, { Druid: { Stars: 3 } }, ["Pattern Navigator"]) },
    ],
  },
  Fighter: {
    section: "Subclass Forge",
    text: "Your training style is really:",
    options: [
      { label: "Team captain, coordinating, lifting the group's performance", ...s({ Fighter: 2 }, { Fighter: { Banneret: 3 } }, ["Team Captain"]) },
      { label: "Tactics, planning, controlled precise skill", ...s({ Fighter: 2 }, { Fighter: { "Battle Master": 3 } }, ["Tactician"]) },
      { label: "Athletic excellence, clean execution, physical dominance", ...s({ Fighter: 2 }, { Fighter: { Champion: 3 } }, ["Competitor"]) },
      { label: "Trained skill plus deep technical knowledge layered on top", ...s({ Fighter: 2 }, { Fighter: { "Eldritch Knight": 3 } }, ["Trained Scholar"]) },
      { label: "Mental discipline, focus, willpower as weapon", ...s({ Fighter: 2 }, { Fighter: { "Psi Warrior": 3 } }, ["Mental Force"]) },
    ],
  },
  Monk: {
    section: "Subclass Forge",
    text: "Your discipline most naturally bends toward:",
    options: [
      { label: "Healing, ending suffering, compassionate restraint", ...s({ Monk: 2 }, { Monk: { Mercy: 3 } }, ["Compassionate Discipline"]) },
      { label: "Stealth, patience, unseen movement, control from margins", ...s({ Monk: 2 }, { Monk: { Shadow: 3 } }, ["Unseen Operator"]) },
      { label: "Adaptable energy, elemental motion, controlled intensity", ...s({ Monk: 2 }, { Monk: { Elements: 3 } }, ["Elemental Flow"]) },
      { label: "Direct martial mastery, body control, clean technique", ...s({ Monk: 2 }, { Monk: { "Open Hand": 3 } }, ["Pure Technique"]) },
    ],
  },
  Paladin: {
    section: "Subclass Forge",
    text: "Your oath energy is closest to:",
    options: [
      { label: "Law, justice, classic standard-keeping, oath as core identity", ...s({ Paladin: 2 }, { Paladin: { Devotion: 3 } }, ["Devotion"]) },
      { label: "Achievement, victory, ambition, becoming legend", ...s({ Paladin: 2 }, { Paladin: { Glory: 3 } }, ["Glory"]) },
      { label: "Protecting life, joy, hope, light against decay", ...s({ Paladin: 2 }, { Paladin: { Ancients: 3 } }, ["Light Protector"]) },
      { label: "Grand code, elemental style, larger-than-life conviction", ...s({ Paladin: 2 }, { Paladin: { "Noble Genies": 3 } }, ["Grand Oath"]) },
      { label: "Justice against wrongdoing — refusing to let harm go unanswered", ...s({ Paladin: 2 }, { Paladin: { Vengeance: 3 } }, ["Vengeance"]) },
    ],
  },
  Ranger: {
    section: "Subclass Forge",
    text: "Your ranger style is closest to:",
    options: [
      { label: "Animal partnership, training, trust with living companions", ...s({ Ranger: 2 }, { Ranger: { "Beast Master": 3 } }, ["Animal Partner"]) },
      { label: "Charm, social wilderness, strange beauty, unusual presence", ...s({ Ranger: 2 }, { Ranger: { "Fey Wanderer": 3 } }, ["Fey Presence"]) },
      { label: "Darkness, ambush, patience, hunting before being seen", ...s({ Ranger: 2 }, { Ranger: { "Gloom Stalker": 3 } }, ["Dark Hunter"]) },
      { label: "Classic predator — traps, tactics, tracking, hunting focus", ...s({ Ranger: 2 }, { Ranger: { Hunter: 3 } }, ["Hunter"]) },
      { label: "Cold endurance, harsh environments, isolation tolerated", ...s({ Ranger: 2 }, { Ranger: { "Winter Walker": 3 } }, ["Cold Endurance"]) },
    ],
  },
  Rogue: {
    section: "Subclass Forge",
    text: "Your edge is mostly:",
    options: [
      { label: "Clever misdirection, illusion, technical tricks", ...s({ Rogue: 2 }, { Rogue: { "Arcane Trickster": 3 } }, ["Misdirection"]) },
      { label: "Precision, stealth, patience, decisive action", ...s({ Rogue: 2 }, { Rogue: { Assassin: 3 } }, ["Precision"]) },
      { label: "Intensity, belief-charged, willing to go darker than others", ...s({ Rogue: 2 }, { Rogue: { "Scion of the Three": 3 } }, ["Dark Edge"]) },
      { label: "Internal precision — mental, quiet, hard to see coming", ...s({ Rogue: 2 }, { Rogue: { Soulknife: 3 } }, ["Mental Edge"]) },
      { label: "Hands-on access — tools, movement, getting the thing", ...s({ Rogue: 2 }, { Rogue: { Thief: 3 } }, ["Hands On"]) },
    ],
  },
  Sorcerer: {
    section: "Subclass Forge",
    text: "Your natural gift feels like:",
    options: [
      { label: "Strange thoughts, alien perception, seeing what others can't", ...s({ Sorcerer: 2 }, { Sorcerer: { "Aberrant Sorcery": 3 } }, ["Alien Insight"]) },
      { label: "Order, structure, balance, mechanism, correction", ...s({ Sorcerer: 2 }, { Sorcerer: { "Clockwork Sorcery": 3 } }, ["Orderly Force"]) },
      { label: "Inherited, proud, resilient, naturally commanding", ...s({ Sorcerer: 2 }, { Sorcerer: { "Draconic Sorcery": 3 } }, ["Commanding"]) },
      { label: "Protective spark, raw energy that flares when needed", ...s({ Sorcerer: 2 }, { Sorcerer: { "Spellfire Sorcery": 3 } }, ["Protective Spark"]) },
      { label: "Chaos, surprise, unpredictability, explosive turns", ...s({ Sorcerer: 2 }, { Sorcerer: { "Wild Magic Sorcery": 3 } }, ["Wild Card"]) },
    ],
  },
  Warlock: {
    section: "Subclass Forge",
    text: "Your access pattern is closest to:",
    options: [
      { label: "Charm, glamour, strange social power, fascination", ...s({ Warlock: 2 }, { Warlock: { "Archfey Patron": 3 } }, ["Fascinating Access"]) },
      { label: "Benevolent support, light, healing, responsibility granted", ...s({ Warlock: 2 }, { Warlock: { "Celestial Patron": 3 } }, ["Granted Light"]) },
      { label: "Ambition, high-stakes bargains, power at cost", ...s({ Warlock: 2 }, { Warlock: { "Fiend Patron": 3 } }, ["Costly Ambition"]) },
      { label: "Forbidden knowledge, alien systems, uncomfortable insight", ...s({ Warlock: 2 }, { Warlock: { "Great Old One Patron": 3 } }, ["Forbidden Insight"]) },
    ],
  },
  Wizard: {
    section: "Subclass Forge",
    text: "Your scholarly style is closest to:",
    options: [
      { label: "Prevention, defense, risk reduction, protective systems", ...s({ Wizard: 2 }, { Wizard: { Abjurer: 3 } }, ["Prevention"]) },
      { label: "Elegant precision in motion — scholarship plus action", ...s({ Wizard: 2 }, { Wizard: { Bladesinger: 3 } }, ["Elegant Precision"]) },
      { label: "Prediction, pattern reading, forecasting, insight", ...s({ Wizard: 2 }, { Wizard: { Diviner: 3 } }, ["Pattern Reader"]) },
      { label: "Direct high-impact output, focused force", ...s({ Wizard: 2 }, { Wizard: { Evoker: 3 } }, ["High Impact"]) },
      { label: "Perception, framing, illusion, how people construct reality", ...s({ Wizard: 2 }, { Wizard: { Illusionist: 3 } }, ["Reality Framer"]) },
    ],
  },
};
