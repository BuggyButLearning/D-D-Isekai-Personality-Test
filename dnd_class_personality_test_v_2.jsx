import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";

const CLASSES = [
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

const classData = {
  Artificer: {
    color: "bg-amber-400/15 text-amber-100 border-amber-300/60",
    accent: "text-amber-300",
    motto: "Power through tools, invention, repair, and applied systems.",
    summary: "You turn ideas into working things. You build, automate, repair, prototype, script, engineer, and make abstract knowledge usable in the real world.",
    traits: ["Tool Builder", "Applied Technical", "Prototype Mind"],
  },
  Barbarian: {
    color: "bg-red-500/15 text-red-100 border-red-300/60",
    accent: "text-red-300",
    motto: "Power through pressure, instinct, and raw courage.",
    summary: "You are at your strongest when the situation gets intense. You move toward pressure instead of away from it, and your strength is protective, emotional, and immediate.",
    traits: ["Pressure Brave", "Protective Force", "Explosive Energy"],
  },
  Bard: {
    color: "bg-pink-500/15 text-pink-100 border-pink-300/60",
    accent: "text-pink-300",
    motto: "Power through expression, influence, and shared emotion.",
    summary: "You change the room. Through humor, music, teaching, storytelling, performance, or social skill, your gift is turning attention into momentum.",
    traits: ["Story Shaper", "Social Spark", "Creative Influence"],
  },
  Cleric: {
    color: "bg-yellow-400/15 text-yellow-100 border-yellow-300/60",
    accent: "text-yellow-300",
    motto: "Power through devotion, service, and sacred responsibility.",
    summary: "You are driven by care, calling, and service. Your strength comes from helping people heal, endure, and reconnect with something larger than themselves.",
    traits: ["Community Healer", "Devoted Guide", "Steady Light"],
  },
  Druid: {
    color: "bg-green-500/15 text-green-100 border-green-300/60",
    accent: "text-green-300",
    motto: "Power through nature, balance, and living systems.",
    summary: "You feel oriented by nature and living systems. Your instincts lean toward stewardship, ecology, animals, plants, cycles, and balance.",
    traits: ["Nature Bound", "Balance Keeper", "Living Systems Mind"],
  },
  Fighter: {
    color: "bg-slate-400/15 text-slate-100 border-slate-300/60",
    accent: "text-slate-300",
    motto: "Power through training, discipline, and repeatable skill.",
    summary: "You respect craft. You build competence through drills, systems, tools, and practice until your skill works under pressure.",
    traits: ["Trained Operator", "Tactical Builder", "Reliable Specialist"],
  },
  Monk: {
    color: "bg-orange-500/15 text-orange-100 border-orange-300/60",
    accent: "text-orange-300",
    motto: "Power through discipline, body control, and inner focus.",
    summary: "You are strongest when body and mind work together. Your path is discipline, self regulation, martial practice, breath, restraint, and focused repetition.",
    traits: ["Body Mind Discipline", "Calm Under Strain", "Focused Practice"],
  },
  Paladin: {
    color: "bg-blue-500/15 text-blue-100 border-blue-300/60",
    accent: "text-blue-300",
    motto: "Power through oath, duty, and moral action.",
    summary: "You are not just motivated. You are committed. Your identity sharpens around causes, promises, standards, and action when something important is on the line.",
    traits: ["Oath Driven", "Moral Protector", "Mission Leader"],
  },
  Ranger: {
    color: "bg-emerald-500/15 text-emerald-100 border-emerald-300/60",
    accent: "text-emerald-300",
    motto: "Power through fieldcraft, tracking, and practical independence.",
    summary: "You are observant, practical, and comfortable operating away from the crowd. You notice terrain, patterns, movement, risks, and resources before others do.",
    traits: ["Field Ready", "Quiet Watcher", "Practical Survivor"],
  },
  Rogue: {
    color: "bg-zinc-400/15 text-zinc-100 border-zinc-300/60",
    accent: "text-zinc-300",
    motto: "Power through cunning, precision, and alternate routes.",
    summary: "You solve problems by seeing the side door. You are precise, adaptive, skeptical of obvious paths, and good at turning limited information into advantage.",
    traits: ["Side Door Thinker", "Precision Mover", "Information Edge"],
  },
  Sorcerer: {
    color: "bg-purple-500/15 text-purple-100 border-purple-300/60",
    accent: "text-purple-300",
    motto: "Power through innate gift, charisma, and natural force.",
    summary: "Some of what you do well seems to come naturally. You often rely on instinct, presence, raw aptitude, or personal magnetism before formal systems catch up.",
    traits: ["Natural Talent", "Raw Spark", "Instinctive Power"],
  },
  Warlock: {
    color: "bg-indigo-500/15 text-indigo-100 border-indigo-300/60",
    accent: "text-indigo-300",
    motto: "Power through patronage, leverage, and rare access.",
    summary: "You understand that power often comes through networks, institutions, sponsors, mentors, contracts, platforms, and access. You are good at using leverage others overlook.",
    traits: ["Patron Linked", "Access Broker", "Leverage Mind"],
  },
  Wizard: {
    color: "bg-cyan-500/15 text-cyan-100 border-cyan-300/60",
    accent: "text-cyan-300",
    motto: "Power through study, systems, and documented mastery.",
    summary: "You turn knowledge into capability. You research, document, compare, prepare, and build mental models until a confusing problem becomes a usable system.",
    traits: ["Scholar Builder", "Systems Thinker", "Prepared Mind"],
  },
};

const scoreBarColors = {
  Artificer: "bg-amber-300",
  Barbarian: "bg-red-400",
  Bard: "bg-pink-300",
  Cleric: "bg-yellow-200",
  Druid: "bg-green-400",
  Fighter: "bg-slate-300",
  Monk: "bg-orange-300",
  Paladin: "bg-blue-300",
  Ranger: "bg-emerald-300",
  Rogue: "bg-zinc-300",
  Sorcerer: "bg-purple-300",
  Warlock: "bg-indigo-300",
  Wizard: "bg-cyan-300",
};

const subclassData = {
  Artificer: {
    Alchemist: "You transform problems through experiments, mixtures, chemistry, support, and clever applied fixes.",
    Armorer: "You focus on protection, gear, defensive systems, wearable tech, and equipment that changes how people operate.",
    Artillerist: "You build controlled force. Your tools create impact, range, output, and pressure from a strategic position.",
    "Battle Smith": "You combine technical skill with practical conflict solving, companions, robotics, repair, and field ready engineering.",
    Cartographer: "You map systems, spaces, routes, networks, and unknown territory so people can move with confidence.",
  },
  Barbarian: {
    Berserker: "Your power is direct intensity, overwhelming action, and the ability to push through the wall when others freeze.",
    "Wild Heart": "Your intensity is tied to instinct, animal energy, wilderness, and a body first relationship with nature.",
    "World Tree": "You are a boundary keeper and protector who thinks in roots, networks, and people held together.",
    Zealot: "Your fury is attached to belief, mission, loyalty, or sacred purpose.",
  },
  Bard: {
    Dance: "You influence through movement, timing, rhythm, presence, and physical expression.",
    Glamour: "You use style, charm, fascination, and social magnetism to shape the room.",
    Lore: "You collect stories, facts, histories, references, and secrets, then use them to teach and influence.",
    Moon: "You blend healing, harm, emotion, rhythm, mystery, and changing phases of people and groups.",
    Valor: "You inspire through courage, heroic example, and performance under pressure.",
  },
  Cleric: {
    Knowledge: "You serve through truth, insight, teaching, wisdom, study, and helping people understand.",
    Life: "You are a direct healer, nurturer, restorer, and protector of wellbeing.",
    Light: "You bring hope, clarity, optimism, and force against darkness or despair.",
    Trickery: "You help through misdirection, cleverness, subversion, and changing how people see the problem.",
    War: "Your devotion becomes defense, conflict readiness, sacred action, and protection in hard moments.",
  },
  Druid: {
    Land: "You are place rooted, practical, environment aware, and connected to regions, seasons, and natural rhythms.",
    Moon: "You embody nature physically through animals, transformation, instinct, and changing forms.",
    Sea: "You are drawn to waves, storms, movement, pressure, emotion, and powerful natural flow.",
    Stars: "You seek guidance through patterns, cycles, navigation, long views, and cosmic perspective.",
  },
  Fighter: {
    Banneret: "You are a team captain who turns discipline into morale, coordination, and group performance.",
    "Battle Master": "You win through tactics, maneuvers, planning, precision, and controlled skill.",
    Champion: "You lean into athletic excellence, competition, clean execution, and physical dominance.",
    "Eldritch Knight": "You combine trained competence with study, technical systems, and specialized knowledge.",
    "Psi Warrior": "You apply willpower, perception, focus, and mental pressure to disciplined action.",
  },
  Monk: {
    Mercy: "Your discipline bends toward healing, restraint, ending suffering, and compassionate control.",
    Shadow: "You value stealth, silence, patience, unseen movement, and control from the margins.",
    Elements: "You express discipline through adaptable energy, nature force, motion, and controlled intensity.",
    "Open Hand": "You are direct martial discipline: clean technique, body control, and unarmed mastery.",
  },
  Paladin: {
    Devotion: "You embody law, justice, standards, purity, and classic oath keeping.",
    Glory: "You are driven by achievement, victory, ambition, and legend building.",
    Ancients: "You protect life, joy, nature, hope, and light against decay or despair.",
    "Noble Genies": "Your oath has grandeur, elemental style, patron like nobility, and a larger than life code.",
    Vengeance: "You pursue justice against wrongdoing and refuse to let serious harm go unanswered.",
  },
  Ranger: {
    "Beast Master": "You are defined by animal partnership, training, trust, and companionship with living allies.",
    "Fey Wanderer": "You blend charm, social wilderness, strange beauty, and an unusual presence.",
    "Gloom Stalker": "You hunt threats in darkness through patience, ambush, and quiet readiness.",
    Hunter: "You are the practical predator: traps, tactics, tracking, and classic hunting focus.",
    "Winter Walker": "You endure harsh environments, cold pressure, isolation, and discomfort without breaking.",
  },
  Rogue: {
    "Arcane Trickster": "You mix cleverness with technical misdirection, illusion, and strange problem solving.",
    Assassin: "You favor stealth, precision, patience, preparation, and decisive action.",
    "Scion of the Three": "Your edge is darker, intense, belief charged, and willing to become dangerous.",
    Soulknife: "Your precision is internal, mental, quiet, sharp, and hard for others to see coming.",
    Thief: "You are practical with tools, access, acquisition, movement, and hands on problem solving.",
  },
  Sorcerer: {
    "Aberrant Sorcery": "Your gift is strange perception, alien thought, mental weirdness, and unusual instincts.",
    "Clockwork Sorcery": "Your gift pushes toward order, balance, correction, structure, and mechanisms.",
    "Draconic Sorcery": "Your power feels inherited, proud, resilient, forceful, and naturally commanding.",
    "Spellfire Sorcery": "Your spark protects, flares, and channels raw energy in intense moments.",
    "Wild Magic Sorcery": "Your power is chaos, unpredictability, explosive instinct, and surprising turns.",
  },
  Warlock: {
    "Archfey Patron": "Your access comes through charm, glamour, trickery, strange social power, and fascination.",
    "Celestial Patron": "Your patronage bends toward healing, light, benevolent support, and service through granted power.",
    "Fiend Patron": "Your path is ambition, dangerous bargains, intensity, and power that comes with cost.",
    "Great Old One Patron": "Your access is forbidden knowledge, alien thought, hidden systems, and uncomfortable insight.",
  },
  Wizard: {
    Abjurer: "You specialize in prevention, defense, risk reduction, protection systems, and safe design.",
    Bladesinger: "You combine scholarship with elegant motion, precision, technical movement, and trained style.",
    Diviner: "You read patterns, forecast outcomes, compare signals, and prepare through insight.",
    Evoker: "You solve directly with focused output, high impact, and controlled force.",
    Illusionist: "You understand perception, framing, misdirection, presentation, and how people construct reality.",
  },
};

function s(classScores, subclassTags = {}, facets = []) {
  return { scores: classScores, subclassTags, facets };
}

const questions = [
  {
    section: "Life Pattern",
    text: "When a serious problem appears, what role do you naturally move toward?",
    options: [
      { label: "Step in physically or emotionally and absorb the pressure", ...s({ Barbarian: 4, Paladin: 1 }, { Barbarian: { Berserker: 2, "World Tree": 1 }, Paladin: { Vengeance: 1 } }, ["Protector"]) },
      { label: "Organize the people, plan, and next steps", ...s({ Fighter: 3, Paladin: 2 }, { Fighter: { Banneret: 2, "Battle Master": 1 }, Paladin: { Devotion: 1 } }, ["Coordinator"]) },
      { label: "Find information, research causes, and build a clear model", ...s({ Wizard: 4, Rogue: 1 }, { Wizard: { Diviner: 2, Abjurer: 1 }, Rogue: { "Arcane Trickster": 1 } }, ["Scholar"]) },
      { label: "Build a tool, script, workflow, or prototype that fixes the problem", ...s({ Artificer: 5, Wizard: 1 }, { Artificer: { "Battle Smith": 1, Armorer: 1, Cartographer: 1 } }, ["Builder", "Applied Technical"]) },
      { label: "Talk people through it and keep morale from collapsing", ...s({ Bard: 4, Cleric: 1 }, { Bard: { Valor: 2, Glamour: 1 }, Cleric: { Light: 1 } }, ["Morale Keeper"]) },
    ],
  },
  {
    section: "Life Pattern",
    text: "Which statement best describes where your confidence comes from?",
    options: [
      { label: "Training and repeated practice", ...s({ Fighter: 4, Monk: 2 }, { Fighter: { Champion: 1, "Battle Master": 1 }, Monk: { "Open Hand": 1 } }, ["Disciplined"]) },
      { label: "Natural instinct or talent", ...s({ Sorcerer: 4, Bard: 1 }, { Sorcerer: { "Draconic Sorcery": 1, "Wild Magic Sorcery": 1 }, Bard: { Glamour: 1 } }, ["Gifted"]) },
      { label: "Faith, service, or calling", ...s({ Cleric: 4, Paladin: 1 }, { Cleric: { Life: 1, Light: 1 }, Paladin: { Devotion: 1 } }, ["Devoted"]) },
      { label: "Access to the right people, systems, or institutions", ...s({ Warlock: 4, Rogue: 1 }, { Warlock: { "Fiend Patron": 1, "Great Old One Patron": 1 }, Rogue: { Thief: 1 } }, ["Connected"]) },
      { label: "Being able to make, repair, automate, or engineer the answer", ...s({ Artificer: 5 }, { Artificer: { Armorer: 1, "Battle Smith": 1, Artillerist: 1 } }, ["Maker Confidence"]) },
    ],
  },
  {
    section: "Physical Mode",
    text: "Which physical practice sounds most like you?",
    options: [
      { label: "Martial arts, boxing, grappling, yoga, breath work, or body control", ...s({ Monk: 5, Fighter: 1 }, { Monk: { "Open Hand": 2, Mercy: 1 }, Fighter: { Champion: 1 } }, ["Body Mind"]) },
      { label: "Strength training, powerlifting, hard contact sports, or explosive conditioning", ...s({ Barbarian: 3, Fighter: 3 }, { Barbarian: { Berserker: 2 }, Fighter: { Champion: 2 } }, ["Power Trained"]) },
      { label: "Hiking, hunting, camping, navigation, endurance outdoors, or survival skills", ...s({ Ranger: 5, Druid: 1 }, { Ranger: { Hunter: 2, "Winter Walker": 1 }, Druid: { Land: 1 } }, ["Fieldcraft"]) },
      { label: "Dance, movement performance, stage movement, or rhythm based practice", ...s({ Bard: 4, Monk: 2 }, { Bard: { Dance: 3 }, Monk: { Elements: 1 } }, ["Expressive Movement"]) },
      { label: "I am not very physically focused", ...s({ Wizard: 1, Bard: 1, Warlock: 1 }, { Wizard: { Diviner: 1 }, Warlock: { "Great Old One Patron": 1 } }, ["Nonphysical"]) },
    ],
  },
  {
    section: "Physical Mode",
    text: "What kind of exercise feels most rewarding?",
    options: [
      { label: "Structured progression where I can measure improvement", ...s({ Fighter: 4, Wizard: 1, Artificer: 1 }, { Fighter: { Champion: 1, "Battle Master": 1 }, Artificer: { Armorer: 1 } }, ["Measured Growth"]) },
      { label: "Intense bursts that let me empty the tank", ...s({ Barbarian: 4, Sorcerer: 1 }, { Barbarian: { Berserker: 2 }, Sorcerer: { "Wild Magic Sorcery": 1 } }, ["Intensity"]) },
      { label: "Calm, technical movement that improves control", ...s({ Monk: 4, Ranger: 1 }, { Monk: { "Open Hand": 2, Mercy: 1 }, Ranger: { Hunter: 1 } }, ["Control"]) },
      { label: "Movement outdoors where the environment matters", ...s({ Ranger: 3, Druid: 3 }, { Ranger: { "Winter Walker": 1, Hunter: 1 }, Druid: { Land: 1, Sea: 1 } }, ["Outdoor Driven"]) },
    ],
  },
  {
    section: "Learning Mode",
    text: "How do you usually become good at something difficult?",
    options: [
      { label: "I study deeply, take notes, compare sources, and prepare", ...s({ Wizard: 5 }, { Wizard: { Diviner: 1, Abjurer: 1, Knowledge: 0 } }, ["Documented"]) },
      { label: "I practice the fundamentals until the skill becomes reliable", ...s({ Fighter: 4, Monk: 1 }, { Fighter: { "Battle Master": 1, Champion: 1 }, Monk: { "Open Hand": 1 } }, ["Practice Based"]) },
      { label: "I build a tool, script, device, workflow, or prototype", ...s({ Artificer: 5, Wizard: 1 }, { Artificer: { "Battle Smith": 1, Armorer: 1, Cartographer: 1 } }, ["Builder", "Automation Mind"]) },
      { label: "I improvise, test shortcuts, and learn what works under real conditions", ...s({ Rogue: 4, Sorcerer: 1 }, { Rogue: { Thief: 1, Assassin: 1 }, Sorcerer: { "Wild Magic Sorcery": 1 } }, ["Improviser"]) },
      { label: "I find a mentor, group, sponsor, or institution that can open the path", ...s({ Warlock: 4, Cleric: 1 }, { Warlock: { "Fiend Patron": 1, "Celestial Patron": 1 }, Cleric: { Knowledge: 1 } }, ["Mentor Linked"]) },
    ],
  },
  {
    section: "Learning Mode",
    text: "Which achievement would feel most personally meaningful?",
    options: [
      { label: "Publishing research, mastering theory, or documenting a complex field", ...s({ Wizard: 5, Fighter: 1 }, { Wizard: { Diviner: 1, Abjurer: 1 }, Fighter: { "Eldritch Knight": 1 } }, ["Scholar"]) },
      { label: "Building a working system, product, automation, repair, lab, map, or device", ...s({ Artificer: 5, Wizard: 1 }, { Artificer: { "Battle Smith": 1, Cartographer: 1, Artillerist: 1 } }, ["Maker", "Applied Technical"]) },
      { label: "Winning a tournament, earning a belt, or proving skill through competition", ...s({ Fighter: 3, Monk: 3 }, { Fighter: { Champion: 2 }, Monk: { "Open Hand": 1 } }, ["Proven Skill"]) },
      { label: "Leading a cause, campaign, ministry, or service effort", ...s({ Paladin: 4, Cleric: 2 }, { Paladin: { Devotion: 1, Glory: 1 }, Cleric: { Life: 1 } }, ["Cause Led"]) },
      { label: "Creating a performance, story, channel, song, lesson, or event people remember", ...s({ Bard: 5 }, { Bard: { Lore: 1, Glamour: 1, Valor: 1 } }, ["Performer"]) },
    ],
  },
  {
    section: "Social Mode",
    text: "In a group, what kind of value do you usually add?",
    options: [
      { label: "I entertain, explain, energize, or persuade", ...s({ Bard: 5 }, { Bard: { Glamour: 1, Lore: 1, Valor: 1 } }, ["Influencer"]) },
      { label: "I protect standards, commitments, and what is right", ...s({ Paladin: 5 }, { Paladin: { Devotion: 2, Vengeance: 1 } }, ["Principled"]) },
      { label: "I care for people, listen, heal, and support", ...s({ Cleric: 5 }, { Cleric: { Life: 2, Light: 1 } }, ["Healer"]) },
      { label: "I quietly notice what others miss", ...s({ Rogue: 3, Ranger: 3 }, { Rogue: { Assassin: 1, Soulknife: 1 }, Ranger: { "Gloom Stalker": 2 } }, ["Observer"]) },
      { label: "I set up the tool, process, or system that helps everyone work", ...s({ Artificer: 4, Fighter: 1 }, { Artificer: { Armorer: 1, Cartographer: 1 }, Fighter: { Banneret: 1 } }, ["System Support"]) },
    ],
  },
  {
    section: "Social Mode",
    text: "Which kind of influence feels most natural?",
    options: [
      { label: "Winning people over through practiced performance or communication", ...s({ Bard: 5 }, { Bard: { Glamour: 2, Lore: 1 } }, ["Charismatic Craft"]) },
      { label: "People naturally respond to my energy or presence", ...s({ Sorcerer: 5, Bard: 1 }, { Sorcerer: { "Draconic Sorcery": 1, "Wild Magic Sorcery": 1 }, Bard: { Glamour: 1 } }, ["Natural Presence"]) },
      { label: "Setting a standard and asking people to rise to it", ...s({ Paladin: 4, Fighter: 1 }, { Paladin: { Devotion: 1, Glory: 1 }, Fighter: { Banneret: 1 } }, ["Standard Bearer"]) },
      { label: "Serving consistently until trust is earned", ...s({ Cleric: 4, Druid: 1 }, { Cleric: { Life: 1, Light: 1 }, Druid: { Land: 1 } }, ["Service First"]) },
      { label: "Using strategy, timing, leverage, and information", ...s({ Rogue: 3, Warlock: 3 }, { Rogue: { Assassin: 1, Thief: 1 }, Warlock: { "Fiend Patron": 1, "Archfey Patron": 1 } }, ["Strategic"]) },
    ],
  },
  {
    section: "Nature and Fieldcraft",
    text: "What does nature mean to you?",
    options: [
      { label: "A living system I care for and protect", ...s({ Druid: 5, Cleric: 1 }, { Druid: { Land: 2, Stars: 1 }, Cleric: { Life: 1 } }, ["Steward"]) },
      { label: "A terrain I can read, move through, and survive in", ...s({ Ranger: 5 }, { Ranger: { Hunter: 1, "Winter Walker": 1, "Gloom Stalker": 1 } }, ["Scout"]) },
      { label: "A place to train, reset, and discipline myself", ...s({ Monk: 3, Barbarian: 1, Ranger: 1 }, { Monk: { Elements: 1 }, Ranger: { Hunter: 1 } }, ["Reset Seeker"]) },
      { label: "A world of animals, plants, conservation, gardening, or ecology", ...s({ Druid: 5 }, { Druid: { Land: 2, Moon: 1 } }, ["Living Systems Mind"]) },
      { label: "Nature is not a major part of my identity", ...s({ Wizard: 1, Warlock: 1, Bard: 1 }, { Wizard: { Diviner: 1 } }, ["Urban"]) },
    ],
  },
  {
    section: "Nature and Fieldcraft",
    text: "You find a hurt animal or damaged natural area. What is your first instinct?",
    options: [
      { label: "Stabilize, protect, and care for the living thing", ...s({ Druid: 4, Cleric: 2 }, { Druid: { Moon: 1, Land: 1 }, Cleric: { Life: 2 } }, ["Caretaker"]) },
      { label: "Track what caused it and prevent it from happening again", ...s({ Ranger: 4, Paladin: 1 }, { Ranger: { Hunter: 2, "Gloom Stalker": 1 }, Paladin: { Vengeance: 1 } }, ["Tracker"]) },
      { label: "Document the problem and research the best fix", ...s({ Wizard: 3, Druid: 2 }, { Wizard: { Diviner: 1 }, Druid: { Stars: 1 } }, ["Research Steward"]) },
      { label: "Build or install something that prevents the damage from repeating", ...s({ Artificer: 4, Druid: 1 }, { Artificer: { Armorer: 1, Cartographer: 1 }, Druid: { Land: 1 } }, ["Practical Steward"]) },
      { label: "Bring in the right organization or authority", ...s({ Warlock: 3, Paladin: 2 }, { Warlock: { "Celestial Patron": 1 }, Paladin: { Devotion: 1 } }, ["Institutional"]) },
    ],
  },
  {
    section: "Cause and Calling",
    text: "Which commitment would you keep even when it costs you?",
    options: [
      { label: "A moral cause or oath I believe is right", ...s({ Paladin: 5 }, { Paladin: { Devotion: 1, Vengeance: 1 } }, ["Oath Bound"]) },
      { label: "A community, faith, care, or service responsibility", ...s({ Cleric: 5 }, { Cleric: { Life: 1, Light: 1 } }, ["Devoted"]) },
      { label: "A personal discipline or code of self mastery", ...s({ Monk: 4, Fighter: 1 }, { Monk: { "Open Hand": 1, Mercy: 1 }, Fighter: { Champion: 1 } }, ["Self Mastery"]) },
      { label: "A strategic alliance, contract, patron, or opportunity that changes my future", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Great Old One Patron": 1 } }, ["Pact Minded"]) },
      { label: "A build, invention, product, or system I believe should exist", ...s({ Artificer: 5 }, { Artificer: { Artillerist: 1, "Battle Smith": 1, Cartographer: 1 } }, ["Inventive Commitment"]) },
    ],
  },
  {
    section: "Cause and Calling",
    text: "What bothers you most?",
    options: [
      { label: "People being harmed while others do nothing", ...s({ Paladin: 4, Barbarian: 2 }, { Paladin: { Vengeance: 2 }, Barbarian: { Zealot: 1 } }, ["Protector"]) },
      { label: "People suffering without care or support", ...s({ Cleric: 5 }, { Cleric: { Life: 2, Light: 1 } }, ["Compassionate"]) },
      { label: "Systems being inefficient, irrational, or poorly understood", ...s({ Wizard: 4, Fighter: 1 }, { Wizard: { Abjurer: 1, Diviner: 1 }, Fighter: { "Battle Master": 1 } }, ["Systems Mind"]) },
      { label: "Problems that keep repeating because nobody built a better tool", ...s({ Artificer: 5 }, { Artificer: { Armorer: 1, Cartographer: 1, Alchemist: 1 } }, ["Automation Mind"]) },
      { label: "Being trapped by obvious rules when a better workaround exists", ...s({ Rogue: 5 }, { Rogue: { Thief: 1, "Arcane Trickster": 1 } }, ["Rule Bender"]) },
    ],
  },
  {
    section: "Power Source",
    text: "Which source of power feels most like your life?",
    options: [
      { label: "I earned it through training and discipline", ...s({ Fighter: 3, Monk: 3 }, { Fighter: { Champion: 1 }, Monk: { "Open Hand": 1 } }, ["Earned"]) },
      { label: "I was born with a gift, personality, or advantage I learned to use", ...s({ Sorcerer: 5 }, { Sorcerer: { "Draconic Sorcery": 1, "Wild Magic Sorcery": 1 } }, ["Innate"]) },
      { label: "I gained access through mentors, institutions, clients, sponsors, or networks", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Celestial Patron": 1, "Great Old One Patron": 1 } }, ["Access Based"]) },
      { label: "I built it through study, documentation, and preparation", ...s({ Wizard: 5 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Studied"]) },
      { label: "I built it through tools, prototypes, automation, or engineering", ...s({ Artificer: 5 }, { Artificer: { "Battle Smith": 1, Armorer: 1, Artillerist: 1 } }, ["Applied Technical"]) },
    ],
  },
  {
    section: "Power Source",
    text: "Which sentence would people who know you most likely say?",
    options: [
      { label: "They are naturally talented at that", ...s({ Sorcerer: 5 }, { Sorcerer: { "Draconic Sorcery": 1, "Spellfire Sorcery": 1 } }, ["Gifted"]) },
      { label: "They know someone or know how to get access", ...s({ Warlock: 5 }, { Warlock: { "Archfey Patron": 1, "Fiend Patron": 1 } }, ["Connected"]) },
      { label: "They trained for it longer than everyone else", ...s({ Fighter: 3, Monk: 3 }, { Fighter: { Champion: 1 }, Monk: { "Open Hand": 1 } }, ["Disciplined"]) },
      { label: "They researched it until they understood the whole system", ...s({ Wizard: 5 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Scholar"]) },
      { label: "They made the thing that made everyone else better", ...s({ Artificer: 5, Bard: 1 }, { Artificer: { Armorer: 1, Alchemist: 1 }, Bard: { Valor: 1 } }, ["Enable Others"]) },
    ],
  },
  {
    section: "Pressure Scenario",
    text: "A plan fails in public. What do you do first?",
    options: [
      { label: "Take control and give people clear instructions", ...s({ Fighter: 3, Paladin: 2 }, { Fighter: { Banneret: 1, "Battle Master": 1 }, Paladin: { Devotion: 1 } }, ["Commander"]) },
      { label: "Use humor, confidence, or storytelling to keep people from panicking", ...s({ Bard: 5 }, { Bard: { Glamour: 1, Valor: 1 } }, ["Morale Keeper"]) },
      { label: "Find the hidden constraint or loophole and pivot fast", ...s({ Rogue: 5 }, { Rogue: { Thief: 1, Assassin: 1 } }, ["Improviser"]) },
      { label: "Build a quick fix, patch, script, checklist, or temporary system", ...s({ Artificer: 5, Rogue: 1 }, { Artificer: { "Battle Smith": 1, Cartographer: 1 }, Rogue: { Thief: 1 } }, ["Patch Builder"]) },
      { label: "Trust my gut and make a bold move", ...s({ Sorcerer: 3, Barbarian: 2 }, { Sorcerer: { "Wild Magic Sorcery": 1 }, Barbarian: { Berserker: 1 } }, ["Instinctive"]) },
    ],
  },
  {
    section: "Pressure Scenario",
    text: "You are given a difficult mission with limited resources. What is your advantage?",
    options: [
      { label: "Endurance, grit, and willingness to take the hit", ...s({ Barbarian: 5 }, { Barbarian: { Berserker: 1, Zealot: 1 } }, ["Grit"]) },
      { label: "Preparation, research, and a strong plan", ...s({ Wizard: 4, Fighter: 1 }, { Wizard: { Diviner: 1, Abjurer: 1 }, Fighter: { "Battle Master": 1 } }, ["Prepared"]) },
      { label: "Terrain awareness, patience, and independence", ...s({ Ranger: 5 }, { Ranger: { Hunter: 1, "Gloom Stalker": 1, "Winter Walker": 1 } }, ["Scout"]) },
      { label: "Contacts, sponsorship, special access, or leverage", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Great Old One Patron": 1 } }, ["Leverage"]) },
      { label: "Making the gear, map, automation, or tool that multiplies the team", ...s({ Artificer: 5, Fighter: 1 }, { Artificer: { Armorer: 1, Cartographer: 1, Artillerist: 1 } }, ["Force Multiplier"]) },
    ],
  },
  {
    section: "Evidence",
    text: "Which real life evidence best supports your answer?",
    options: [
      { label: "Belts, competitions, certifications, military, emergency, trade, or technical training", ...s({ Fighter: 3, Monk: 2, Paladin: 1 }, { Fighter: { Champion: 1 }, Monk: { "Open Hand": 1 }, Paladin: { Devotion: 1 } }, ["Credentialed"]) },
      { label: "Performances, public speaking, teaching, music, art, writing, content, or events", ...s({ Bard: 5 }, { Bard: { Lore: 1, Glamour: 1, Dance: 1 } }, ["Public Voice"]) },
      { label: "Degrees, research, writing, analysis, documentation, or formal study", ...s({ Wizard: 5 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Documented"]) },
      { label: "Code, automation, engineering, repair, labs, tools, devices, maps, or technical builds", ...s({ Artificer: 5, Wizard: 1 }, { Artificer: { "Battle Smith": 1, Cartographer: 1, Armorer: 1 } }, ["Maker Evidence"]) },
      { label: "Service roles, ministry, volunteering, care work, activism, or community leadership", ...s({ Cleric: 3, Paladin: 3 }, { Cleric: { Life: 1 }, Paladin: { Devotion: 1 } }, ["Service Led"]) },
    ],
  },
  {
    section: "Evidence",
    text: "Pick the achievement pattern that sounds most like your real life.",
    options: [
      { label: "I have built skill through years of practice more than one lucky break", ...s({ Fighter: 3, Monk: 2, Wizard: 1 }, { Fighter: { Champion: 1 }, Monk: { "Open Hand": 1 } }, ["Long Practice"]) },
      { label: "I have an unusual gift, family advantage, or natural ability that shaped my path", ...s({ Sorcerer: 5 }, { Sorcerer: { "Draconic Sorcery": 1, "Wild Magic Sorcery": 1 } }, ["Innate"]) },
      { label: "I have been shaped by institutions, sponsors, mentors, employers, or powerful networks", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Celestial Patron": 1 } }, ["Patronage"]) },
      { label: "I have learned to survive, adapt, and find my own way without much support", ...s({ Rogue: 3, Ranger: 2, Barbarian: 1 }, { Rogue: { Thief: 1 }, Ranger: { Hunter: 1 }, Barbarian: { Berserker: 1 } }, ["Self Reliant"]) },
      { label: "I have repeatedly built practical solutions others could use", ...s({ Artificer: 5, Fighter: 1 }, { Artificer: { Alchemist: 1, Armorer: 1, "Battle Smith": 1 } }, ["Practical Builder"]) },
    ],
  },
  {
    section: "Systems and Tools",
    text: "Something important keeps breaking. What do you do?",
    options: [
      { label: "Research the root cause and understand the theory", ...s({ Wizard: 5 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Root Cause Researcher"]) },
      { label: "Build a tool, script, device, workflow, or fix", ...s({ Artificer: 5 }, { Artificer: { Armorer: 1, "Battle Smith": 1, Alchemist: 1 } }, ["Fix Builder"]) },
      { label: "Create a repeatable process and train people on it", ...s({ Fighter: 4, Paladin: 1 }, { Fighter: { Banneret: 1, "Battle Master": 1 } }, ["Process Trainer"]) },
      { label: "Find a workaround that gets past the blocker right now", ...s({ Rogue: 5 }, { Rogue: { Thief: 1, "Arcane Trickster": 1 } }, ["Workaround Mind"]) },
      { label: "Get the vendor, platform, mentor, or authority with access involved", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Great Old One Patron": 1 } }, ["Access Solver"]) },
    ],
  },
  {
    section: "Systems and Tools",
    text: "Which technical task sounds most satisfying?",
    options: [
      { label: "Automating a repetitive task so nobody has to think about it again", ...s({ Artificer: 5, Wizard: 1 }, { Artificer: { Cartographer: 1, Alchemist: 1 } }, ["Automation Mind"]) },
      { label: "Designing protective gear, guardrails, monitoring, or safety systems", ...s({ Artificer: 4, Wizard: 2, Paladin: 1 }, { Artificer: { Armorer: 2 }, Wizard: { Abjurer: 1 } }, ["Defensive Design"]) },
      { label: "Making something hit harder, scale better, or produce more output", ...s({ Artificer: 4, Barbarian: 1 }, { Artificer: { Artillerist: 2 }, Barbarian: { Berserker: 1 } }, ["Output Builder"]) },
      { label: "Mapping a messy system, route, network, or unknown space", ...s({ Artificer: 3, Ranger: 2, Wizard: 1 }, { Artificer: { Cartographer: 3 }, Ranger: { Hunter: 1 }, Wizard: { Diviner: 1 } }, ["Mapper"]) },
      { label: "Building a helper, companion system, bot, robot, or assistant", ...s({ Artificer: 5 }, { Artificer: { "Battle Smith": 3 } }, ["Companion Builder"]) },
    ],
  },
  {
    section: "Class Differentiator",
    text: "How do you get through a locked door?",
    options: [
      { label: "Find the weakness, side door, loophole, or exploit", ...s({ Rogue: 5 }, { Rogue: { Thief: 2, Assassin: 1 } }, ["Exploit Finder"]) },
      { label: "Call the person, platform, institution, or sponsor with access", ...s({ Warlock: 5 }, { Warlock: { "Fiend Patron": 1, "Archfey Patron": 1 } }, ["Access Broker"]) },
      { label: "Study the lock and understand its design", ...s({ Wizard: 5 }, { Wizard: { Diviner: 1, Abjurer: 1 } }, ["Design Analyst"]) },
      { label: "Build or modify the tool that opens it", ...s({ Artificer: 5, Rogue: 1 }, { Artificer: { Armorer: 1, "Battle Smith": 1 }, Rogue: { Thief: 1 } }, ["Tool Maker"]) },
      { label: "Break it if the situation is urgent enough", ...s({ Barbarian: 5 }, { Barbarian: { Berserker: 2 } }, ["Direct Force"]) },
    ],
  },
  {
    section: "Class Differentiator",
    text: "When people are hurting, what is your first useful move?",
    options: [
      { label: "Care for them, support them, and help them heal", ...s({ Cleric: 5 }, { Cleric: { Life: 2, Light: 1 } }, ["Healer"]) },
      { label: "Confront the source of harm and protect others", ...s({ Paladin: 5, Barbarian: 1 }, { Paladin: { Vengeance: 2 }, Barbarian: { Zealot: 1 } }, ["Moral Protector"]) },
      { label: "Organize the response and assign roles", ...s({ Fighter: 4, Cleric: 1 }, { Fighter: { Banneret: 2 }, Cleric: { War: 1 } }, ["Response Organizer"]) },
      { label: "Use public influence to rally support", ...s({ Bard: 4, Paladin: 1 }, { Bard: { Valor: 1, Glamour: 1 }, Paladin: { Glory: 1 } }, ["Rally Voice"]) },
      { label: "Create the system, form, resource, or tool that gets help to people", ...s({ Artificer: 4, Cleric: 1 }, { Artificer: { Alchemist: 1, Cartographer: 1 }, Cleric: { Life: 1 } }, ["Care Infrastructure"]) },
    ],
  },
  {
    section: "Class Differentiator",
    text: "Why do you train?",
    options: [
      { label: "To become competent, reliable, and hard to beat", ...s({ Fighter: 5 }, { Fighter: { Champion: 1, "Battle Master": 1 } }, ["Competence Driven"]) },
      { label: "To protect people or uphold a cause", ...s({ Paladin: 5 }, { Paladin: { Devotion: 1, Vengeance: 1 } }, ["Cause Trained"]) },
      { label: "To master myself", ...s({ Monk: 5 }, { Monk: { "Open Hand": 1, Mercy: 1 } }, ["Self Mastery"]) },
      { label: "To survive pressure", ...s({ Barbarian: 5 }, { Barbarian: { Berserker: 1, "World Tree": 1 } }, ["Pressure Hardened"]) },
      { label: "To operate better with specific tools, gear, systems, or instruments", ...s({ Artificer: 4, Fighter: 1 }, { Artificer: { Armorer: 1, Artillerist: 1 }, Fighter: { "Eldritch Knight": 1 } }, ["Tool Trained"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which leadership style feels most like you?",
    options: [
      { label: "Team captain who coordinates and lifts the group", ...s({ Fighter: 2, Bard: 1 }, { Fighter: { Banneret: 3 }, Bard: { Valor: 1 } }, ["Team Captain"]) },
      { label: "Tactician who controls the board through planned moves", ...s({ Fighter: 2, Wizard: 1 }, { Fighter: { "Battle Master": 3 }, Wizard: { Diviner: 1 } }, ["Tactician"]) },
      { label: "Champion who wins by clean performance and excellence", ...s({ Fighter: 2, Barbarian: 1 }, { Fighter: { Champion: 3 }, Barbarian: { Berserker: 1 } }, ["Competitor"]) },
      { label: "Standard bearer who turns mission into momentum", ...s({ Paladin: 2, Bard: 1 }, { Paladin: { Glory: 2, Devotion: 1 }, Bard: { Valor: 1 } }, ["Standard Bearer"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which kind of hidden strength fits you best?",
    options: [
      { label: "Quiet stealth, patience, and operating unseen", ...s({ Rogue: 2, Monk: 2, Ranger: 1 }, { Rogue: { Assassin: 2 }, Monk: { Shadow: 2 }, Ranger: { "Gloom Stalker": 1 } }, ["Unseen Operator"]) },
      { label: "Mental precision, inner weapons, and silent focus", ...s({ Rogue: 2, Sorcerer: 1 }, { Rogue: { Soulknife: 3 }, Sorcerer: { "Aberrant Sorcery": 1 } }, ["Mental Edge"]) },
      { label: "Clever tricks, illusions, and technical misdirection", ...s({ Rogue: 2, Wizard: 1 }, { Rogue: { "Arcane Trickster": 3 }, Wizard: { Illusionist: 1 } }, ["Misdirection"]) },
      { label: "Hands on access, tools, movement, and getting the thing", ...s({ Rogue: 2, Artificer: 1 }, { Rogue: { Thief: 3 }, Artificer: { Armorer: 1 } }, ["Hands On Access"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which kind of unusual power sounds most like your personality?",
    options: [
      { label: "Strange thoughts, alien perspective, and seeing what others cannot", ...s({ Sorcerer: 2, Warlock: 2, Wizard: 1 }, { Sorcerer: { "Aberrant Sorcery": 2 }, Warlock: { "Great Old One Patron": 2 }, Wizard: { Diviner: 1 } }, ["Alien Insight"]) },
      { label: "Order, correction, structure, balance, and mechanisms", ...s({ Sorcerer: 2, Artificer: 1, Wizard: 1 }, { Sorcerer: { "Clockwork Sorcery": 3 }, Artificer: { Cartographer: 1 }, Wizard: { Abjurer: 1 } }, ["Orderly Force"]) },
      { label: "Inherited force, pride, presence, resilience, and command", ...s({ Sorcerer: 2, Paladin: 1 }, { Sorcerer: { "Draconic Sorcery": 3 }, Paladin: { Glory: 1 } }, ["Commanding Presence"]) },
      { label: "Protective spark, raw energy, and flaring up when needed", ...s({ Sorcerer: 2, Cleric: 1 }, { Sorcerer: { "Spellfire Sorcery": 3 }, Cleric: { Light: 1 } }, ["Protective Spark"]) },
      { label: "Chaos, luck, surprise, and unpredictable turns", ...s({ Sorcerer: 2, Rogue: 1 }, { Sorcerer: { "Wild Magic Sorcery": 3 }, Rogue: { Thief: 1 } }, ["Wild Card"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which pattern of care or belief fits you best?",
    options: [
      { label: "Healing, restoration, nurture, and preservation", ...s({ Cleric: 2, Druid: 1 }, { Cleric: { Life: 3 }, Druid: { Land: 1 } }, ["Restorer"]) },
      { label: "Truth, insight, wisdom, and helping people understand", ...s({ Cleric: 2, Wizard: 2 }, { Cleric: { Knowledge: 3 }, Wizard: { Diviner: 1 } }, ["Truth Seeker"]) },
      { label: "Hope, clarity, optimism, and fighting despair", ...s({ Cleric: 2, Bard: 1 }, { Cleric: { Light: 3 }, Bard: { Valor: 1 } }, ["Light Bearer"]) },
      { label: "Subversion, misdirection, and changing the angle", ...s({ Cleric: 2, Rogue: 2 }, { Cleric: { Trickery: 3 }, Rogue: { "Arcane Trickster": 1 } }, ["Subverter"]) },
      { label: "Sacred readiness, defense, and conflict when needed", ...s({ Cleric: 2, Fighter: 1 }, { Cleric: { War: 3 }, Fighter: { "Battle Master": 1 } }, ["Sacred Warrior"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which natural or cosmic image feels most like your inner world?",
    options: [
      { label: "Rooted land, place, seasons, and local environment", ...s({ Druid: 2, Ranger: 1 }, { Druid: { Land: 3 }, Ranger: { Hunter: 1 } }, ["Place Rooted"]) },
      { label: "Animal form, instinct, embodiment, and transformation", ...s({ Druid: 2, Barbarian: 1 }, { Druid: { Moon: 3 }, Barbarian: { "Wild Heart": 1 } }, ["Shapeshifter Mind"]) },
      { label: "Ocean, storms, waves, pressure, and flow", ...s({ Druid: 2, Sorcerer: 1 }, { Druid: { Sea: 3 }, Sorcerer: { "Wild Magic Sorcery": 1 } }, ["Storm Heart"]) },
      { label: "Stars, patterns, navigation, cycles, and long views", ...s({ Druid: 2, Wizard: 1, Ranger: 1 }, { Druid: { Stars: 3 }, Wizard: { Diviner: 1 }, Ranger: { Cartographer: 0 } }, ["Pattern Navigator"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which patron or access pattern sounds most familiar?",
    options: [
      { label: "Charm, glamour, strange social power, and fascination", ...s({ Warlock: 2, Bard: 1 }, { Warlock: { "Archfey Patron": 3 }, Bard: { Glamour: 1 } }, ["Fascinating Access"]) },
      { label: "Benevolent support, healing, light, and granted responsibility", ...s({ Warlock: 2, Cleric: 1 }, { Warlock: { "Celestial Patron": 3 }, Cleric: { Light: 1 } }, ["Granted Light"]) },
      { label: "Ambition, dangerous bargains, and power with a cost", ...s({ Warlock: 2, Sorcerer: 1 }, { Warlock: { "Fiend Patron": 3 }, Sorcerer: { "Draconic Sorcery": 1 } }, ["Costly Ambition"]) },
      { label: "Forbidden knowledge, alien systems, and uncomfortable insight", ...s({ Warlock: 2, Wizard: 1 }, { Warlock: { "Great Old One Patron": 3 }, Wizard: { Diviner: 1 } }, ["Forbidden Insight"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which performance or communication mode is most natural?",
    options: [
      { label: "Movement, rhythm, dance, and body language", ...s({ Bard: 2, Monk: 1 }, { Bard: { Dance: 3 }, Monk: { Elements: 1 } }, ["Rhythmic Presence"]) },
      { label: "Style, charm, aura, and making people want to follow", ...s({ Bard: 2, Sorcerer: 1 }, { Bard: { Glamour: 3 }, Sorcerer: { "Draconic Sorcery": 1 } }, ["Magnetic Style"]) },
      { label: "Stories, history, facts, teaching, and references", ...s({ Bard: 2, Wizard: 1 }, { Bard: { Lore: 3 }, Wizard: { Diviner: 1 } }, ["Lore Keeper"]) },
      { label: "Courage, heroic example, and inspiring people under pressure", ...s({ Bard: 2, Fighter: 1, Paladin: 1 }, { Bard: { Valor: 3 }, Fighter: { Banneret: 1 } }, ["Heroic Voice"]) },
      { label: "Emotion, phases, healing, harm, and changing moods", ...s({ Bard: 2, Cleric: 1 }, { Bard: { Moon: 3 }, Cleric: { Life: 1 } }, ["Lunar Mood"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which ranger path sounds most like you?",
    options: [
      { label: "Animal partnership, training, and trust with living companions", ...s({ Ranger: 2, Druid: 1 }, { Ranger: { "Beast Master": 3 }, Druid: { Moon: 1 } }, ["Animal Partner"]) },
      { label: "Charm, strange beauty, social wilderness, and unusual presence", ...s({ Ranger: 2, Bard: 1 }, { Ranger: { "Fey Wanderer": 3 }, Bard: { Glamour: 1 } }, ["Fey Presence"]) },
      { label: "Darkness, ambush, patience, and hunting threats before they see you", ...s({ Ranger: 2, Rogue: 1 }, { Ranger: { "Gloom Stalker": 3 }, Rogue: { Assassin: 1 } }, ["Dark Hunter"]) },
      { label: "Classic hunting, traps, tactics, tracking, and practical predator skill", ...s({ Ranger: 2, Fighter: 1 }, { Ranger: { Hunter: 3 }, Fighter: { "Battle Master": 1 } }, ["Hunter Mind"]) },
      { label: "Cold endurance, harsh environments, isolation, and discomfort", ...s({ Ranger: 2, Barbarian: 1 }, { Ranger: { "Winter Walker": 3 }, Barbarian: { "Wild Heart": 1 } }, ["Cold Endurance"]) },
    ],
  },
  {
    section: "Subclass Flavor",
    text: "Which wizard solution feels most satisfying?",
    options: [
      { label: "Prevent the failure before it happens", ...s({ Wizard: 2, Artificer: 1 }, { Wizard: { Abjurer: 3 }, Artificer: { Armorer: 1 } }, ["Prevention Mind"]) },
      { label: "Move with elegant technical precision while acting", ...s({ Wizard: 2, Fighter: 1, Monk: 1 }, { Wizard: { Bladesinger: 3 }, Fighter: { "Eldritch Knight": 1 } }, ["Elegant Precision"]) },
      { label: "Predict the likely outcome from patterns and signals", ...s({ Wizard: 2, Druid: 1 }, { Wizard: { Diviner: 3 }, Druid: { Stars: 1 } }, ["Pattern Reader"]) },
      { label: "Solve the problem with direct high impact output", ...s({ Wizard: 2, Artificer: 1 }, { Wizard: { Evoker: 3 }, Artificer: { Artillerist: 1 } }, ["High Impact"]) },
      { label: "Change perception, framing, presentation, or what people believe is real", ...s({ Wizard: 2, Bard: 1, Rogue: 1 }, { Wizard: { Illusionist: 3 }, Bard: { Glamour: 1 } }, ["Reality Framer"]) },
    ],
  },
];

function PixelIcon({ name, size = 120 }) {
  const icons = {
    Artificer: { symbol: "Gear", pixels: [[4,1],[2,2],[4,2],[6,2],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[2,6],[4,6],[6,6],[4,7],[3,3],[5,3],[3,5],[5,5]] },
    Barbarian: { symbol: "Axe", pixels: [[3,1],[4,1],[2,2],[3,2],[4,2],[5,2],[3,3],[4,3],[4,4],[4,5],[4,6],[4,7],[3,8],[5,8]] },
    Bard: { symbol: "Lyre", pixels: [[2,2],[3,1],[4,1],[5,2],[2,3],[5,3],[2,4],[3,5],[4,5],[5,4],[3,3],[4,3],[3,4],[4,4]] },
    Cleric: { symbol: "Sun", pixels: [[4,1],[4,2],[2,3],[3,3],[4,3],[5,3],[6,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[2,5],[3,5],[4,5],[5,5],[6,5],[4,6],[4,7]] },
    Druid: { symbol: "Leaf", pixels: [[5,1],[4,2],[5,2],[3,3],[4,3],[5,3],[2,4],[3,4],[4,4],[5,4],[3,5],[4,5],[2,6],[3,6],[1,7],[2,7]] },
    Fighter: { symbol: "Sword", pixels: [[4,1],[4,2],[4,3],[4,4],[4,5],[3,6],[4,6],[5,6],[2,7],[4,7],[6,7],[4,8]] },
    Monk: { symbol: "Fist", pixels: [[2,2],[3,2],[4,2],[5,2],[2,3],[3,3],[4,3],[5,3],[1,4],[2,4],[3,4],[4,4],[5,4],[2,5],[3,5],[4,5],[3,6],[4,6]] },
    Paladin: { symbol: "Shield", pixels: [[2,1],[3,1],[4,1],[5,1],[6,1],[2,2],[3,2],[4,2],[5,2],[6,2],[2,3],[3,3],[4,3],[5,3],[6,3],[3,4],[4,4],[5,4],[3,5],[4,5],[5,5],[4,6],[4,7]] },
    Ranger: { symbol: "Bow", pixels: [[5,1],[4,2],[3,3],[2,4],[3,5],[4,6],[5,7],[5,2],[5,3],[5,4],[5,5],[5,6],[2,2],[3,3],[4,4]] },
    Rogue: { symbol: "Dagger", pixels: [[5,1],[4,2],[4,3],[3,4],[3,5],[2,6],[1,7],[3,7],[4,8]] },
    Sorcerer: { symbol: "Spark", pixels: [[4,1],[3,2],[4,2],[5,2],[2,3],[3,3],[4,3],[5,3],[6,3],[3,4],[4,4],[5,4],[4,5],[4,6],[3,7],[5,7]] },
    Warlock: { symbol: "Eye", pixels: [[3,2],[4,2],[5,2],[2,3],[3,3],[4,3],[5,3],[6,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[2,5],[3,5],[4,5],[5,5],[6,5],[3,6],[4,6],[5,6]] },
    Wizard: { symbol: "Book", pixels: [[1,2],[2,2],[3,2],[5,2],[6,2],[7,2],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[1,5],[2,5],[3,5],[5,5],[6,5],[7,5],[4,2],[4,5]] },
  };
  const data = icons[name] || icons.Fighter;

  return (
    <svg width={size} height={size} viewBox="0 0 9 9" className="drop-shadow-[0_0_18px_currentColor]" role="img" aria-label={`${name} ${data.symbol} icon`}>
      <rect x="0" y="0" width="9" height="9" rx="1" fill="currentColor" opacity="0.08" />
      {data.pixels.map(([x, y], i) => (
        <rect key={`${x}-${y}-${i}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  );
}

function buildInitialScores() {
  return Object.fromEntries(CLASSES.map((className) => [className, 0]));
}

function buildInitialSubclassScores(className) {
  return Object.fromEntries(Object.keys(subclassData[className] || {}).map((subclassName) => [subclassName, 0]));
}

function normalizeAnswers(answers) {
  if (Array.isArray(answers)) return answers;
  const normalized = [];
  Object.entries(answers || {}).forEach(([questionIndex, choiceIndex]) => {
    const index = Number(questionIndex);
    if (Number.isInteger(index)) normalized[index] = choiceIndex;
  });
  return normalized;
}

function scoreSubclassForClass(answers, className) {
  const subclassScores = buildInitialSubclassScores(className);

  answers.forEach((choiceIndex, questionIndex) => {
    if (choiceIndex === undefined || choiceIndex === null) return;
    const option = questions[questionIndex]?.options?.[choiceIndex];
    const tags = option?.subclassTags?.[className];
    if (!tags) return;

    Object.entries(tags).forEach(([subclassName, value]) => {
      if (subclassScores[subclassName] !== undefined) subclassScores[subclassName] += value;
    });
  });

  const ranked = Object.entries(subclassScores).sort((a, b) => b[1] - a[1]);
  return ranked[0]?.[0] || Object.keys(subclassData[className] || {})[0] || "Subclass Unknown";
}

function calculateResult(answersInput) {
  const answers = normalizeAnswers(answersInput);
  const scores = buildInitialScores();
  const facets = {};

  answers.forEach((choiceIndex, questionIndex) => {
    if (choiceIndex === undefined || choiceIndex === null) return;
    const option = questions[questionIndex]?.options?.[choiceIndex];
    if (!option) return;

    Object.entries(option.scores || {}).forEach(([className, value]) => {
      if (scores[className] !== undefined) scores[className] += value;
    });

    (option.facets || []).forEach((facet) => {
      facets[facet] = (facets[facet] || 0) + 1;
    });
  });

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topClass, topScore] = ranked[0];
  const [secondClass, secondScore] = ranked[1];
  const totalAnswered = answers.filter((answer) => answer !== undefined && answer !== null).length;
  const maxReasonable = totalAnswered * 5;
  const gap = topScore - secondScore;
  const gapPct = maxReasonable ? gap / maxReasonable : 0;
  const secondPctOfTop = topScore ? secondScore / topScore : 0;
  const isMulticlass = topScore >= 20 && secondScore >= 20 && secondPctOfTop >= 0.86 && gapPct <= 0.08;

  const traitBadges = Object.entries(facets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([facet]) => facet);

  const topSubclass = scoreSubclassForClass(answers, topClass);
  const secondSubclass = isMulticlass ? scoreSubclassForClass(answers, secondClass) : null;

  return {
    scores,
    ranked,
    topClass,
    secondClass,
    topScore,
    secondScore,
    isMulticlass,
    traitBadges,
    topSubclass,
    secondSubclass,
  };
}

function runSelfTests() {
  const assert = (condition, message) => {
    if (!condition) throw new Error(`Self test failed: ${message}`);
  };

  const objectAnswers = { 0: 2, 1: 0, 4: 0, 16: 2, 26: 2 };
  const objectResult = calculateResult(objectAnswers);
  assert(objectResult.scores.Wizard > 0, "object shaped answers should add Wizard score");

  const arrayAnswers = [];
  arrayAnswers[0] = 2;
  arrayAnswers[1] = 0;
  arrayAnswers[4] = 0;
  arrayAnswers[16] = 2;
  arrayAnswers[26] = 2;
  const arrayResult = calculateResult(arrayAnswers);
  assert(arrayResult.topClass === objectResult.topClass, "array and object answers should produce the same top class");
  assert(arrayResult.topScore === objectResult.topScore, "array and object answers should produce the same top score");

  const invalidResult = calculateResult({ 0: 99, nope: 1, 200: 2 });
  assert(invalidResult.topScore === 0, "invalid answer indexes should be ignored safely");

  const emptyResult = calculateResult({});
  assert(emptyResult.ranked.length === CLASSES.length, "empty answers should still return all classes ranked");

  const artificerResult = calculateResult({ 0: 3, 1: 4, 4: 2, 12: 4, 18: 1, 19: 0, 20: 1 });
  assert(artificerResult.topClass === "Artificer", "Artificer should be reachable as top class");
  assert(Boolean(artificerResult.topSubclass), "Artificer result should include a subclass");

  const wizardResult = calculateResult({ 0: 2, 4: 0, 12: 3, 18: 0, 26: 2 });
  assert(wizardResult.scores.Wizard > wizardResult.scores.Artificer, "Wizard should beat Artificer for theory and research answers");

  const dominantResult = calculateResult({ 0: 3, 1: 4, 4: 2, 5: 1, 12: 4, 13: 4, 14: 3, 15: 4, 16: 3, 17: 4, 18: 1, 19: 0, 20: 3 });
  assert(dominantResult.topClass === "Artificer", "dominant Artificer path should stay Artificer");
  assert(!dominantResult.isMulticlass, "dominant top class should not trigger multiclass");

  CLASSES.forEach((className) => {
    assert(Object.keys(subclassData[className] || {}).length > 0, `${className} should have subclasses`);
  });
}

runSelfTests();

export default function DndClassPersonalityTest() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => calculateResult(answers), [answers]);
  const current = questions[step];
  const answeredCount = Object.values(answers).filter((answer) => answer !== undefined && answer !== null).length;
  const progress = showResult ? 100 : Math.round((answeredCount / questions.length) * 100);

  const choose = (index) => setAnswers((prev) => ({ ...prev, [step]: index }));

  const next = () => {
    if (step === questions.length - 1) {
      setShowResult(true);
      return;
    }
    setStep((currentStep) => currentStep + 1);
  };

  const back = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setStep((currentStep) => Math.max(0, currentStep - 1));
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setShowResult(false);
  };

  const primary = classData[result.topClass] || classData.Fighter;
  const secondary = classData[result.secondClass] || classData.Fighter;
  const resultTitle = result.isMulticlass ? `${result.topClass} / ${result.secondClass}` : result.topClass;
  const subclassTitle = result.isMulticlass ? `${result.topSubclass} / ${result.secondSubclass}` : result.topSubclass;
  const traitList = result.traitBadges.length ? result.traitBadges : primary.traits;

  return (
    <div className="rpg-screen p-3 text-[#f8edcf] sm:p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rpg-badge inline-flex items-center gap-2 border border-[#9f6f2e] bg-[#120d08] px-4 py-2 text-sm font-bold text-[#ffe08a]">
            <Sparkles className="h-4 w-4" /> Real Life D&D Class Test
          </motion.div>
          <h1 className="rpg-display mt-4 text-4xl font-black leading-tight text-[#fff6d8] md:text-6xl">What class did your life build?</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#c9b88d] md:text-base">
            Answer practical questions about how you train, learn, serve, build, lead, improvise, and gain power. You will get one dominant class unless your top two are genuinely close.
          </p>
        </header>

        <Card className="overflow-visible">
          <CardContent className="p-0">
            <div className="pixel-section border-b p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase text-[#c9b88d] md:text-sm">
                <span>{showResult ? "Character Sheet" : `Quest ${step + 1} / ${questions.length}`}</span>
                <span>{progress}% XP</span>
              </div>
              <Progress value={progress} className="mt-3" aria-label={`${progress}% complete`} />
            </div>

            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-5 md:p-8">
                  <Badge variant="outline" className="mb-4">{current.section}</Badge>
                  <h2 className="rpg-display text-3xl font-bold leading-tight text-[#fff6d8] md:text-4xl">{current.text}</h2>
                  <div className="mt-6 grid gap-3">
                    {current.options.map((option, index) => {
                      const selected = answers[step] === index;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => choose(index)}
                          aria-pressed={selected}
                          className={`answer-row min-h-14 px-5 py-4 pl-10 text-left text-sm font-semibold leading-6 transition md:text-base ${selected ? "is-selected" : ""}`}
                        >
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-5 md:p-8">
                  <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-center">
                    <div className={`portrait-slot mx-auto flex h-56 w-56 items-center justify-center ${primary.color}`}>
                      <div className={primary.accent}>
                        <PixelIcon name={result.topClass} size={160} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <Badge className={`${primary.color} border`}>{result.isMulticlass ? "Multiclass Result" : "Dominant Class"}</Badge>
                      <h2 className="rpg-display mt-3 break-words text-5xl font-black leading-none text-[#fff6d8] md:text-6xl">{resultTitle}</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline">Subclass: {subclassTitle}</Badge>
                      </div>
                      <p className={`mt-5 text-base font-bold leading-7 md:text-lg ${primary.accent}`}>{primary.motto}</p>
                      <p className="mt-4 leading-7 text-[#d9c89d]">{primary.summary}</p>
                      <p className="mt-3 leading-7 text-[#d9c89d]"><strong className="text-[#fff6d8]">{result.topSubclass}:</strong> {subclassData[result.topClass]?.[result.topSubclass]}</p>
                      {result.isMulticlass && (
                        <p className="mt-3 leading-7 text-[#d9c89d]">
                          Your second class is not just flavor. <strong className="text-[#fff6d8]">{result.secondClass}</strong> scored close enough to your top class to count as a true secondary path. {secondary.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {traitList.map((trait) => (
                      <div key={trait} className="stat-tile p-4">
                        <div className="text-xs font-bold uppercase text-[#8e7a55]">Unique Trait</div>
                        <div className="mt-2 text-lg font-bold text-[#fff6d8]">{trait}</div>
                      </div>
                    ))}
                  </div>

                  <div className="score-panel mt-8 p-4 md:p-5">
                    <h3 className="rpg-display text-2xl font-bold text-[#fff6d8]">Top class scores</h3>
                    <div className="mt-4 grid gap-4">
                      {result.ranked.slice(0, 5).map(([name, score]) => {
                        const pct = Math.round((score / Math.max(result.topScore, 1)) * 100);
                        return (
                          <div key={name}>
                            <div className="mb-2 flex justify-between gap-4 text-sm font-bold text-[#d9c89d]">
                              <span>{name}</span>
                              <span>{score}</span>
                            </div>
                            <div className="h-4 border-2 border-[#4b351f] bg-[#080604] p-0.5 shadow-[inset_0_0_0_2px_#000]">
                              <div className={`stat-fill ${scoreBarColors[name] || "bg-[#f2c14e]"}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pixel-section flex flex-wrap items-center justify-between gap-3 border-t p-4 md:p-6">
              <Button variant="outline" onClick={back} disabled={step === 0 && !showResult} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="ghost" onClick={reset} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
                {!showResult && (
                  <Button onClick={next} disabled={answers[step] === undefined} className="gap-2 disabled:border-[#4b351f] disabled:bg-[#1a130c] disabled:text-[#8e7a55]">
                    {step === questions.length - 1 ? "Reveal Class" : "Next"} <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-xs leading-5 text-[#8e7a55]">
          Built as an entertainment and self reflection quiz, not a clinical, hiring, or ability assessment.
        </p>
      </div>
    </div>
  );
}
