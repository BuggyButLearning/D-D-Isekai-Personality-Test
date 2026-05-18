// v3 Branching engine
// Scores baseline -> picks tie-breakers -> picks subclass flavor -> final result

import { CLASSES, baselineQuestions, tieBreakerPool, subclassFlavorPool, HOBBIES } from "./questions_v3.mjs";

export function emptyScores() {
  return Object.fromEntries(CLASSES.map((c) => [c, 0]));
}

export function emptySubclassScores(className) {
  const subclasses = subclassFlavorPool[className]?.options || [];
  const names = new Set();
  for (const opt of subclasses) {
    for (const sub of Object.keys(opt.subclassTags?.[className] || {})) names.add(sub);
  }
  return Object.fromEntries([...names].map((n) => [n, 0]));
}

// Score a single rank-3 hobby answer. answer = { ranked: [hobbyId, hobbyId, hobbyId] }
function scoreHobbyAnswer(answer, scores, subclassAccum, facets) {
  if (!answer?.ranked) return;
  const weights = [3, 2, 1];
  answer.ranked.slice(0, 3).forEach((hobbyId, idx) => {
    const hobby = HOBBIES.find((h) => h.id === hobbyId);
    if (!hobby) return;
    const w = weights[idx];
    for (const [cls, pts] of Object.entries(hobby.scores || {})) {
      scores[cls] = (scores[cls] || 0) + pts * w;
    }
    for (const [cls, subTags] of Object.entries(hobby.subclassTags || {})) {
      subclassAccum[cls] = subclassAccum[cls] || {};
      for (const [sub, pts] of Object.entries(subTags)) {
        subclassAccum[cls][sub] = (subclassAccum[cls][sub] || 0) + pts * w;
      }
    }
  });
}

// Score a single-select answer. answer = { choice: optionIndex }
function scoreSingleAnswer(question, answer, scores, subclassAccum, facets, weightMult = 1) {
  const opt = question.options[answer?.choice];
  if (!opt) return;
  for (const [cls, pts] of Object.entries(opt.scores || {})) {
    scores[cls] = (scores[cls] || 0) + pts * weightMult;
  }
  for (const [cls, subTags] of Object.entries(opt.subclassTags || {})) {
    subclassAccum[cls] = subclassAccum[cls] || {};
    for (const [sub, pts] of Object.entries(subTags)) {
      subclassAccum[cls][sub] = (subclassAccum[cls][sub] || 0) + pts * weightMult;
    }
  }
  for (const f of opt.facets || []) {
    facets[f] = (facets[f] || 0) + 1;
  }
}

// Compute primary class scores from baseline answers only.
export function scoreBaseline(answers) {
  const scores = emptyScores();
  const subclassAccum = {};
  const facets = {};
  for (let i = 0; i < baselineQuestions.length; i++) {
    const q = baselineQuestions[i];
    const ans = answers[q.id];
    if (!ans) continue;
    if (q.type === "rank3") scoreHobbyAnswer(ans, scores, subclassAccum, facets);
    else scoreSingleAnswer(q, ans, scores, subclassAccum, facets);
  }
  return { scores, subclassAccum, facets };
}

// Pick tie-breaker questions based on baseline result.
// Fires when top-2 gap is narrow OR top-3 cluster present.
export function pickTieBreakers(baselineScores, maxToFire = 3) {
  const ranked = Object.entries(baselineScores).sort((a, b) => b[1] - a[1]);
  const [top, second, third] = ranked;
  if (!second || top[1] === 0) return [];

  const gapPct = (top[1] - second[1]) / Math.max(top[1], 1);
  const triggerPairs = new Set();

  if (gapPct <= 0.20) triggerPairs.add(pairKey(top[0], second[0]));
  if (third && (second[1] - third[1]) / Math.max(second[1], 1) <= 0.15) {
    triggerPairs.add(pairKey(top[0], third[0]));
  }

  if (triggerPairs.size === 0) return [];

  const fired = [];
  for (const q of tieBreakerPool) {
    if (fired.length >= maxToFire) break;
    if (triggerPairs.has(pairKey(q.pair[0], q.pair[1]))) fired.push(q);
  }
  return fired;
}

function pairKey(a, b) {
  return [a, b].sort().join("|");
}

// Apply tie-breaker answers with 1.5x weight on primary class decision
export function applyTieBreakers(firedQuestions, answers, scores, subclassAccum, facets) {
  for (const q of firedQuestions) {
    const ans = answers[q.id];
    if (!ans) continue;
    scoreSingleAnswer(q, ans, scores, subclassAccum, facets, 1.5);
  }
}

// Pick subclass flavor question for top class.
// If multiclass, optionally pick second one for second class.
export function pickSubclassQuestions(topClass, secondClass = null) {
  const qs = [];
  if (subclassFlavorPool[topClass]) {
    qs.push({ id: `subclass_${topClass}`, classTarget: topClass, ...subclassFlavorPool[topClass] });
  }
  if (secondClass && subclassFlavorPool[secondClass]) {
    qs.push({ id: `subclass_${secondClass}`, classTarget: secondClass, ...subclassFlavorPool[secondClass] });
  }
  return qs;
}

// Apply subclass-flavor answers — they also boost the class score lightly.
export function applySubclassAnswers(firedQuestions, answers, scores, subclassAccum, facets) {
  for (const q of firedQuestions) {
    const ans = answers[q.id];
    if (!ans) continue;
    scoreSingleAnswer(q, ans, scores, subclassAccum, facets, 1);
  }
}

// Multiclass rule (tightened)
const MULTICLASS_THRESHOLD = {
  topMin: 15,
  secondMin: 15,
  secondPctOfTop: 0.82,
  gapPctMax: 0.10,
};

function detectMulticlass(scores, totalAnswered) {
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [top, second] = ranked;
  if (!second) return { isMulticlass: false };
  const maxReasonable = totalAnswered * 5;
  const gapPct = (top[1] - second[1]) / Math.max(maxReasonable, 1);
  const secondPctOfTop = top[1] ? second[1] / top[1] : 0;
  const isMulticlass =
    top[1] >= MULTICLASS_THRESHOLD.topMin &&
    second[1] >= MULTICLASS_THRESHOLD.secondMin &&
    secondPctOfTop >= MULTICLASS_THRESHOLD.secondPctOfTop &&
    gapPct <= MULTICLASS_THRESHOLD.gapPctMax;
  return { isMulticlass, ranked };
}

// Determine top subclass for a class from accumulated subclass scores
function topSubclass(subclassAccum, className) {
  const subs = subclassAccum[className] || {};
  const entries = Object.entries(subs);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

// Full result calculation given full answers object (covers baseline + fired tie-breakers + subclass)
export function calculateResult(answers) {
  const { scores, subclassAccum, facets } = scoreBaseline(answers);
  const baselineRanked = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  // tie-breakers fired based on baseline
  const tbFired = pickTieBreakers(scores);
  applyTieBreakers(tbFired, answers, scores, subclassAccum, facets);

  // subclass pick: top class after tie-breakers
  const postTbRanked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topClass = postTbRanked[0][0];
  const secondClass = postTbRanked[1]?.[0];

  // Provisionally detect multiclass before subclass scoring (so we know whether to fire 1 or 2 subclass Qs)
  const totalAnswered = Object.keys(answers).length;
  const provisional = detectMulticlass(scores, totalAnswered);
  const subQs = pickSubclassQuestions(topClass, provisional.isMulticlass ? secondClass : null);
  applySubclassAnswers(subQs, answers, scores, subclassAccum, facets);

  // Final ranking + multiclass
  const finalRanked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const finalTop = finalRanked[0][0];
  const finalSecond = finalRanked[1]?.[0];
  const finalMc = detectMulticlass(scores, totalAnswered);

  const traitBadges = Object.entries(facets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f);

  return {
    scores,
    ranked: finalRanked,
    topClass: finalTop,
    secondClass: finalSecond,
    topScore: finalRanked[0][1],
    secondScore: finalRanked[1]?.[1] || 0,
    isMulticlass: finalMc.isMulticlass,
    topSubclass: topSubclass(subclassAccum, finalTop),
    secondSubclass: finalMc.isMulticlass ? topSubclass(subclassAccum, finalSecond) : null,
    traitBadges,
    tbFired: tbFired.map((q) => q.id),
    subQsFired: subQs.map((q) => q.id),
    baselineRanked,
    subclassAccum,
    facets,
  };
}

// ---------------------------------------------------------------------------
// Insight helpers — render-time builders that turn data already in `result`
// + `answers` into human-readable narrative pieces for the result page.
// ---------------------------------------------------------------------------

import { classData, personalNarratives, characterNarratives, characterSubclassPhrases, growthTips } from "./classMetadata_v3.mjs";

// Returns { hobby, classSignal } for user's #1 ranked hobby. Null if none picked.
export function getAnchorHobby(answers) {
  const ranked = answers?.sunday?.ranked || [];
  if (!ranked.length) return null;
  const hobby = HOBBIES.find((h) => h.id === ranked[0]);
  if (!hobby) return null;
  const entries = Object.entries(hobby.scores || {});
  if (!entries.length) return { hobby, classSignal: null };
  entries.sort((a, b) => b[1] - a[1]);
  return { hobby, classSignal: entries[0][0] };
}

// Returns archetype string like "The Documented Maker" or just class trait when no facets.
export function getPersonaArchetype(result) {
  const traits = classData[result.topClass]?.traits || [];
  const badges = result.traitBadges || [];
  // De-dupe: if first badge matches first class trait word, drop it.
  const lead = badges[0];
  const second = traits[0];
  if (!lead && !second) return `The ${result.topClass}`;
  if (!lead) return `The ${second}`;
  if (!second || lead.toLowerCase().includes(second.toLowerCase()) || second.toLowerCase().includes(lead.toLowerCase())) {
    return `The ${lead}`;
  }
  return `The ${lead} ${second}`;
}

// Sentence describing the user's facets in natural language.
function facetSentence(traitBadges) {
  if (!traitBadges?.length) return "";
  if (traitBadges.length === 1) return `Your strongest signal is ${traitBadges[0]}.`;
  if (traitBadges.length === 2) return `Your strongest signals are ${traitBadges[0]} and ${traitBadges[1]}.`;
  return `Your strongest signals are ${traitBadges[0]}, ${traitBadges[1]}, and ${traitBadges[2]}.`;
}

// Sentence anchoring the user's #1 hobby. Empty string if no hobby answer.
function anchorHobbyLine(answers) {
  const anchor = getAnchorHobby(answers);
  if (!anchor?.hobby) return "";
  return `Your Sunday goes to ${anchor.hobby.label.toLowerCase()} — that's a real tell.`;
}

// Build "who you are" paragraph.
export function buildPersonalNarrative(result, answers) {
  const tpl = personalNarratives[result.topClass] || "";
  return tpl
    .replace("{facets}", facetSentence(result.traitBadges))
    .replace("{anchorHobbyLine}", anchorHobbyLine(answers))
    .replace(/\s+/g, " ")
    .trim();
}

// Build "your D&D character" paragraph.
export function buildCharacterNarrative(result) {
  const tpl = characterNarratives[result.topClass] || "";
  const subPhrase =
    characterSubclassPhrases[result.topClass]?.[result.topSubclass] || "";
  let body = tpl.replace("{subclassFlavor}", subPhrase);
  if (result.isMulticlass && result.secondClass) {
    body += ` Your second path: ${result.secondClass}. The line between the two is thin enough that you'd actually live in both.`;
  } else if (result.secondClass && result.secondScore >= result.topScore * 0.75) {
    body += ` There's also real ${result.secondClass} energy in the mix — a quieter second voice you'd do well to listen to.`;
  }
  return body.replace(/\s+/g, " ").trim();
}

// Build growth/stretch tip object { headline, body }.
export function getGrowthTip(result) {
  const tip = growthTips[result.topClass];
  if (!tip) return { headline: "Stretch toward what's next.", body: "Keep going." };
  // If subclassAccum has a clear 2nd subclass, mention it.
  const subs = result.subclassAccum?.[result.topClass] || {};
  const ranked = Object.entries(subs).sort((a, b) => b[1] - a[1]);
  const second = ranked[1]?.[0];
  if (second && second !== result.topSubclass && ranked[1][1] > 0) {
    return {
      headline: tip.headline,
      body: `${tip.body} A natural lean from ${result.topSubclass}: explore ${second}.`,
    };
  }
  return tip;
}
