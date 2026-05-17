// v3 self-tests. Run: node src/selftest_v3.mjs
import { CLASSES, baselineQuestions, tieBreakerPool, subclassFlavorPool, HOBBIES } from "./questions_v3.mjs";
import {
  calculateResult,
  scoreBaseline,
  pickTieBreakers,
  pickSubclassQuestions,
} from "./engine_v3.mjs";

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
  for (const q of baselineQuestions.slice(1)) {
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

// 9. Druid can win — feed Druid-heavy answers
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

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}
console.log("\nAll self-tests passed.");
