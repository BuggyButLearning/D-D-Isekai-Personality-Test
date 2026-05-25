// v3 self-tests. Run: node src/selftest_v3.mjs
import { existsSync } from "node:fs";
import { CLASSES, baselineQuestions, tieBreakerPool, subclassFlavorPool, subclassDifferentiatorPool, HOBBIES } from "./questions_v3.mjs";
import {
  calculateResult,
  scoreBaseline,
  pickTieBreakers,
  pickSubclassQuestions,
  pickSubclassDifferentiator,
  getAnchorHobby,
  getPersonaArchetype,
  buildPersonalNarrative,
  buildCharacterNarrative,
  getGrowthTip,
} from "./engine_v3.mjs";
import {
  classIconSrc,
  personalNarratives,
  characterNarratives,
  characterSubclassPhrases,
  growthTips,
} from "./classMetadata_v3.mjs";

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    failures++;
  } else {
    console.log(`ok   ${msg}`);
  }
}

// 1. Each class has at least one option that scores it primary in baseline
for (const cls of CLASSES) {
  let found = false;
  for (const q of baselineQuestions) {
    if (q.type === "rank3") {
      if (q.options.some((h) => (h.scores?.[cls] || 0) >= 2)) {
        found = true;
        break;
      }
    } else {
      if (q.options.some((o) => (o.scores?.[cls] || 0) >= 3)) {
        found = true;
        break;
      }
    }
  }
  assert(found, `${cls} has at least one primary-scoring baseline option`);
}

// 2. Hobby ranking scoring weights ranks correctly
{
  const answers = {
    sunday: { ranked: ["read", "research", "code"] },
  };
  // fill other baseline answers with first option to allow scoreBaseline
  for (const q of baselineQuestions) {
    if (q.id === "sunday") continue;
    answers[q.id] = { choice: 0 };
  }
  const r = scoreBaseline(answers);
  // read x3 + research x2 + code x1 = Wizard 3*3 + 3*2 + 1*1 = 9+6+1 = 16 (plus from other Qs)
  assert(r.scores.Wizard >= 16, `Hobby ranking x3/x2/x1 contributes (Wizard >= 16, got ${r.scores.Wizard})`);
}

// 3. calculateResult returns valid topClass for empty answers
{
  const r = calculateResult({});
  assert(CLASSES.includes(r.topClass), `Empty answers still returns valid topClass (got ${r.topClass})`);
  assert(r.isMulticlass === false, `Empty answers does not trigger multiclass`);
}

// 4. Tie-breaker picker: clear winner = no tie-breakers
{
  const scores = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  scores.Wizard = 40;
  scores.Bard = 10;
  const tb = pickTieBreakers(scores);
  assert(tb.length === 0, `No tie-breakers when top is dominant (Wizard 40 vs Bard 10)`);
}

// 5. Tie-breaker picker: close top-2 fires at least 1
{
  const scores = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  scores.Wizard = 30;
  scores.Artificer = 28;
  const tb = pickTieBreakers(scores);
  assert(tb.length >= 1, `Close top-2 fires tie-breakers (got ${tb.length})`);
  assert(
    tb.some((q) => q.pair.includes("Wizard") && q.pair.includes("Artificer")),
    `Wizard/Artificer tie-breaker fires for that pair`
  );
}

// 6. Subclass picker returns correct class flavor
{
  const subs = pickSubclassQuestions("Druid");
  assert(subs.length === 1 && subs[0].classTarget === "Druid", `Subclass picker returns Druid Q for Druid top`);
}

// 7. Multiclass detection respects threshold
{
  const answers = {};
  for (const q of baselineQuestions) {
    if (q.type === "rank3") answers[q.id] = { ranked: ["read", "code", "make"] };
    else {
      // Pick options that score Wizard heavily
      const idx = q.options.findIndex((o) => (o.scores?.Wizard || 0) >= 3);
      answers[q.id] = { choice: idx >= 0 ? idx : 0 };
    }
  }
  const r = calculateResult(answers);
  assert(r.topClass === "Wizard", `Wizard-biased answers yield Wizard top (got ${r.topClass})`);
}

// 8. Every class has a subclass flavor pool entry
for (const cls of CLASSES) {
  assert(Boolean(subclassFlavorPool[cls]), `${cls} has subclass flavor pool entry`);
  assert(
    subclassFlavorPool[cls].options.length >= 4,
    `${cls} subclass flavor has 4+ options (got ${subclassFlavorPool[cls].options.length})`
  );
}

// 9. Druid can win. Feed Druid-heavy answers.
{
  const answers = {
    sunday: { ranked: ["garden", "birdwatch", "hike"] },
  };
  for (const q of baselineQuestions.slice(1)) {
    const idx = q.options.findIndex((o) => (o.scores?.Druid || 0) >= 2);
    answers[q.id] = { choice: idx >= 0 ? idx : 0 };
  }
  const r = calculateResult(answers);
  assert(r.topClass === "Druid", `Druid-biased answers yield Druid top (got ${r.topClass}, scores: ${JSON.stringify(r.scores)})`);
}

// 10. Total question pool sizes match expectations
assert(baselineQuestions.length === 12, `12 baseline questions (got ${baselineQuestions.length})`);
assert(tieBreakerPool.length >= 10, `>=10 tie-breakers in pool (got ${tieBreakerPool.length})`);
assert(HOBBIES.length >= 25, `>=25 hobbies in pool (got ${HOBBIES.length})`);

// 11. Every class has narrative metadata
for (const cls of CLASSES) {
  assert(Boolean(personalNarratives[cls]), `${cls} has personalNarratives entry`);
  assert(Boolean(characterNarratives[cls]), `${cls} has characterNarratives entry`);
  assert(Boolean(growthTips[cls]?.headline), `${cls} has growthTips.headline`);
  assert(Boolean(growthTips[cls]?.body), `${cls} has growthTips.body`);
  assert(Boolean(characterSubclassPhrases[cls]), `${cls} has characterSubclassPhrases entry`);
}

// 12. Every class icon is deploy-safe and points at a real public asset
for (const cls of CLASSES) {
  const iconPath = classIconSrc[cls];
  assert(Boolean(iconPath), `${cls} has class icon metadata`);
  assert(!iconPath.startsWith("/"), `${cls} class icon path is relative for subpath deploys (${iconPath})`);
  assert(
    existsSync(new URL(`../public/${iconPath}`, import.meta.url)),
    `${cls} class icon file exists at public/${iconPath}`
  );
}

// 13. Insight helpers behave on a known Wizard-biased answer set
{
  const answers = {};
  for (const q of baselineQuestions) {
    if (q.type === "rank3") answers[q.id] = { ranked: ["read", "research", "chess"] };
    else {
      const idx = q.options.findIndex((o) => (o.scores?.Wizard || 0) >= 3);
      answers[q.id] = { choice: idx >= 0 ? idx : 0 };
    }
  }
  const r = calculateResult(answers);

  const anchor = getAnchorHobby(answers);
  assert(anchor?.hobby?.id === "read", `getAnchorHobby returns top-ranked hobby (got ${anchor?.hobby?.id})`);

  const archetype = getPersonaArchetype(r);
  assert(typeof archetype === "string" && archetype.startsWith("The "), `getPersonaArchetype returns 'The ...' string (got ${archetype})`);

  const personal = buildPersonalNarrative(r, answers);
  assert(typeof personal === "string" && personal.length > 50, `buildPersonalNarrative returns non-trivial string`);
  assert(!/\{[a-zA-Z]+\}/.test(personal), `buildPersonalNarrative has no unfilled placeholders (got: ${personal})`);

  const character = buildCharacterNarrative(r);
  assert(typeof character === "string" && character.length > 50, `buildCharacterNarrative returns non-trivial string`);
  assert(!/\{[a-zA-Z]+\}/.test(character), `buildCharacterNarrative has no unfilled placeholders (got: ${character})`);

  const tip = getGrowthTip(r);
  assert(Boolean(tip?.headline) && Boolean(tip?.body), `getGrowthTip returns headline + body`);
}

// 14. Insight helpers don't break on empty answers
{
  const r = calculateResult({});
  const anchor = getAnchorHobby({});
  assert(anchor === null, `getAnchorHobby returns null on empty answers (got ${JSON.stringify(anchor)})`);
  const personal = buildPersonalNarrative(r, {});
  assert(typeof personal === "string", `buildPersonalNarrative tolerates empty answers`);
  const character = buildCharacterNarrative(r);
  assert(typeof character === "string", `buildCharacterNarrative tolerates empty result`);
}

// 15. shareCode: round-trip + tamper + version + unknown-class
{
  const { buildSnapshot, encodeSnapshot, decodeSnapshot, snapshotToResult, snapshotToAnswers, SHARE_VERSION } = await import("./shareCode.mjs");

  const wizardAnswers = {};
  for (const q of baselineQuestions) {
    if (q.type === "rank3") {
      wizardAnswers[q.id] = { ranked: ["read", "research", "chess"] };
    } else {
      let bestIdx = 0, bestScore = -Infinity;
      q.options.forEach((opt, i) => {
        const s = opt.scores?.Wizard || 0;
        if (s > bestScore) { bestScore = s; bestIdx = i; }
      });
      wizardAnswers[q.id] = { choice: bestIdx };
    }
  }
  const wResult = calculateResult(wizardAnswers);
  const snap = buildSnapshot(wResult, wizardAnswers);
  const code = encodeSnapshot(snap);

  assert(typeof code === "string" && code.length > 0, `encodeSnapshot returns non-empty string`);
  assert(code.length < 1500, `encoded code under length budget (got ${code.length})`);
  assert(code.includes("."), `encoded code carries a checksum (got ${code})`);

  const decoded = decodeSnapshot(code);
  assert(decoded.v === SHARE_VERSION, `decoded share version matches`);
  assert(decoded.t === wResult.topClass, `topClass round-trips (got ${decoded.t})`);
  assert(decoded.pn === snap.pn, `personal narrative round-trips`);
  assert(decoded.cn === snap.cn, `character narrative round-trips`);
  assert(Array.isArray(decoded.tr) && decoded.tr.length <= 3, `traits round-trip as array`);
  assert(Array.isArray(decoded.r) && decoded.r.length > 0, `ranked round-trips`);

  // Synthetic result/answers from snapshot should let the engine helpers run cleanly
  const synthResult = snapshotToResult(decoded);
  const synthAnswers = snapshotToAnswers(decoded);
  assert(synthResult.topClass === wResult.topClass, `snapshotToResult preserves topClass`);
  assert(synthResult.isMulticlass === wResult.isMulticlass, `snapshotToResult preserves multiclass flag`);
  const synthAnchor = getAnchorHobby(synthAnswers);
  assert(synthAnchor?.hobby?.id === wizardAnswers.sunday.ranked[0], `anchor hobby resolves from synthetic answers`);

  // Tamper: flip one char in the compressed body (before the dot)
  const dot = code.lastIndexOf(".");
  const tampered = (code[0] === "A" ? "B" : "A") + code.slice(1, dot) + code.slice(dot);
  let threw = false;
  try { decodeSnapshot(tampered); } catch { threw = true; }
  assert(threw, `decodeSnapshot rejects tampered payload`);

  // Tamper checksum
  let threw2 = false;
  try { decodeSnapshot(code.slice(0, dot) + ".zzzz"); } catch { threw2 = true; }
  assert(threw2, `decodeSnapshot rejects wrong checksum`);

  // Garbage input
  let threw3 = false;
  try { decodeSnapshot("not a real code"); } catch { threw3 = true; }
  assert(threw3, `decodeSnapshot rejects garbage input`);

  // Unknown class via direct JSON injection (manual construction)
  // Confirm validator catches it by hand-building a payload with bogus class
  const LZString = (await import("lz-string")).default;
  const fnv1a16 = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24)) >>> 0; } return h & 0xffff; };
  const bogusJson = JSON.stringify({ v: SHARE_VERSION, t: "Necromancer", s: null, m: 0, sc: null, tr: [], h: null, ar: "", mo: "", pn: "", cn: "", gh: "", gb: "", sd: null, ms: null, r: [] });
  const bogusCompressed = LZString.compressToEncodedURIComponent(bogusJson);
  const bogusChecksum = fnv1a16(bogusCompressed).toString(36).padStart(4, "0");
  let threw4 = false;
  try { decodeSnapshot(`${bogusCompressed}.${bogusChecksum}`); } catch { threw4 = true; }
  assert(threw4, `decodeSnapshot rejects unknown class`);
}

// ---------------------------------------------------------------------------
// v4 rebalance invariants (Layer 1/2/3/4)
// ---------------------------------------------------------------------------

// Every class baseline-scores in >= 9 questions
for (const cls of CLASSES) {
  let qCount = 0;
  for (const q of baselineQuestions) {
    if (q.type === "rank3") {
      if (HOBBIES.some((h) => (h.scores?.[cls] || 0) > 0)) qCount++;
    } else if (q.options.some((o) => (o.scores?.[cls] || 0) > 0)) qCount++;
  }
  assert(qCount >= 9, `class ${cls} scores in >= 9 baseline Qs (got ${qCount})`);
}

// Every defined subclass has >= 1 baseline tag OR differentiator entry
function baselineTagTotal(cls, sub) {
  let total = 0;
  for (const h of HOBBIES) total += h.subclassTags?.[cls]?.[sub] || 0;
  for (const q of baselineQuestions) {
    if (q.type === "rank3") continue;
    for (const o of q.options) total += o.subclassTags?.[cls]?.[sub] || 0;
  }
  for (const q of tieBreakerPool) {
    for (const o of q.options) total += o.subclassTags?.[cls]?.[sub] || 0;
  }
  return total;
}
for (const cls of CLASSES) {
  const definedSubs = new Set();
  if (subclassFlavorPool[cls]) {
    for (const opt of subclassFlavorPool[cls].options) {
      for (const s of Object.keys(opt.subclassTags?.[cls] || {})) definedSubs.add(s);
    }
  }
  if (subclassDifferentiatorPool?.[cls]) {
    for (const opt of subclassDifferentiatorPool[cls].options) {
      for (const s of Object.keys(opt.subclassTags?.[cls] || {})) definedSubs.add(s);
    }
  }
  for (const sub of definedSubs) {
    const inDiff = subclassDifferentiatorPool?.[cls]?.options.some((o) => (o.subclassTags?.[cls]?.[sub] || 0) > 0);
    assert(baselineTagTotal(cls, sub) > 0 || inDiff, `${cls}/${sub} has baseline tag or differentiator entry`);
  }
}

// Every class has a differentiator pool entry
for (const cls of CLASSES) {
  assert(subclassDifferentiatorPool?.[cls] !== undefined, `subclassDifferentiatorPool has entry for ${cls}`);
}

// Smoke: max Q per run <= 16 for canonical answer sets
for (const cls of CLASSES) {
  const a = {};
  for (const q of baselineQuestions) {
    if (q.type === "rank3") {
      const sorted = [...HOBBIES].sort((x, y) => (y.scores?.[cls] || 0) - (x.scores?.[cls] || 0));
      a[q.id] = { ranked: sorted.slice(0, 3).map((h) => h.id) };
    } else {
      const idx = q.options.findIndex((o) => (o.scores?.[cls] || 0) >= 3);
      a[q.id] = { choice: idx >= 0 ? idx : 0 };
    }
  }
  for (const q of tieBreakerPool) {
    const idx = q.options.findIndex((o) => (o.scores?.[cls] || 0) > 0);
    a[q.id] = { choice: idx >= 0 ? idx : 0 };
  }
  for (const c2 of CLASSES) {
    if (subclassFlavorPool[c2]) a[`subclass_${c2}`] = { choice: 0 };
    if (subclassDifferentiatorPool?.[c2]) a[`subclassdiff_${c2}`] = { choice: 0 };
  }
  const r = calculateResult(a);
  const total = 12 + r.tbFired.length + r.subQsFired.length;
  assert(total <= 16, `${cls} smoke run total Q <= 16 (got ${total})`);
}

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}
console.log("\nAll self-tests passed.");
