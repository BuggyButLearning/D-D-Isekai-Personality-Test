import {
  CLASSES,
  baselineQuestions,
  tieBreakerPool,
  subclassFlavorPool,
  HOBBIES,
} from "./src/questions_v3.mjs";
import { calculateResult, scoreBaseline } from "./src/engine_v3.mjs";

function randInt(n) { return Math.floor(Math.random() * n); }

function pickRandomHobbyRank3() {
  const ids = HOBBIES.map((h) => h.id);
  const picked = [];
  while (picked.length < 3) {
    const idx = randInt(ids.length);
    const id = ids[idx];
    if (!picked.includes(id)) picked.push(id);
  }
  return { ranked: picked };
}

function uniformAnswers() {
  const answers = {};
  for (const q of baselineQuestions) {
    if (q.type === "rank3") answers[q.id] = pickRandomHobbyRank3();
    else answers[q.id] = { choice: randInt(q.options.length) };
  }
  // also randomize all tie-breakers + subclass Qs (engine picks which apply)
  for (const q of tieBreakerPool) {
    answers[q.id] = { choice: randInt(q.options.length) };
  }
  for (const cls of CLASSES) {
    const pool = subclassFlavorPool[cls];
    if (pool) answers[`subclass_${cls}`] = { choice: randInt(pool.options.length) };
  }
  return answers;
}

function personaAnswers(targetClass, biasPct = 0.7) {
  const answers = {};
  for (const q of baselineQuestions) {
    if (q.type === "rank3") {
      // weighted pick: prefer hobbies that score target
      const candidates = HOBBIES.filter((h) => (h.scores?.[targetClass] || 0) > 0);
      let ranked;
      if (candidates.length >= 3 && Math.random() < biasPct) {
        const shuffled = [...candidates].sort((a, b) =>
          (b.scores[targetClass] || 0) - (a.scores[targetClass] || 0) + (Math.random() - 0.5) * 0.5
        );
        ranked = shuffled.slice(0, 3).map((h) => h.id);
      } else {
        ranked = pickRandomHobbyRank3().ranked;
      }
      answers[q.id] = { ranked };
      continue;
    }
    const flagged = q.options
      .map((o, i) => ({ i, score: o.scores?.[targetClass] || 0 }))
      .filter((x) => x.score > 0);
    if (flagged.length && Math.random() < biasPct) {
      const total = flagged.reduce((s, x) => s + x.score, 0);
      let r = Math.random() * total;
      let pickedIdx = flagged[0].i;
      for (const x of flagged) {
        r -= x.score;
        if (r <= 0) { pickedIdx = x.i; break; }
      }
      answers[q.id] = { choice: pickedIdx };
    } else {
      answers[q.id] = { choice: randInt(q.options.length) };
    }
  }
  for (const q of tieBreakerPool) {
    const flagged = q.options
      .map((o, i) => ({ i, score: o.scores?.[targetClass] || 0 }))
      .filter((x) => x.score > 0);
    if (flagged.length && Math.random() < biasPct) {
      answers[q.id] = { choice: flagged[0].i };
    } else {
      answers[q.id] = { choice: randInt(q.options.length) };
    }
  }
  for (const cls of CLASSES) {
    const pool = subclassFlavorPool[cls];
    if (pool) answers[`subclass_${cls}`] = { choice: randInt(pool.options.length) };
  }
  return answers;
}

function tally(simFn, runs = 1000) {
  const wins = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  const mcCount = { yes: 0, no: 0 };
  const avgScore = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  const tbFireCount = { 0: 0, 1: 0, 2: 0, 3: 0, "4+": 0 };
  for (let i = 0; i < runs; i++) {
    const a = simFn();
    const r = calculateResult(a);
    wins[r.topClass]++;
    mcCount[r.isMulticlass ? "yes" : "no"]++;
    for (const c of CLASSES) avgScore[c] += r.scores[c];
    const fired = r.tbFired.length;
    const key = fired >= 4 ? "4+" : String(fired);
    tbFireCount[key]++;
  }
  for (const c of CLASSES) avgScore[c] = +(avgScore[c] / runs).toFixed(1);
  return { wins, mcCount, avgScore, tbFireCount };
}

console.log("=== V3 UNIFORM RANDOM (1000 runs) ===");
const uni = tally(uniformAnswers, 1000);
const sorted = Object.entries(uni.wins).sort((a, b) => b[1] - a[1]);
console.log("Class win distribution (target ~77 each):");
const ideal = 1000 / CLASSES.length;
for (const [c, n] of sorted) {
  const bar = "#".repeat(Math.round(n / 5));
  const dev = ((n - ideal) / ideal * 100).toFixed(0);
  const sign = dev > 0 ? "+" : "";
  console.log(`  ${c.padEnd(11)} ${String(n).padStart(4)} (${sign}${dev}%)  ${bar}`);
}
console.log(`\nMulticlass rate: ${uni.mcCount.yes}/1000 = ${(uni.mcCount.yes / 10).toFixed(1)}%`);
console.log("\nTie-breakers fired distribution:");
for (const [k, v] of Object.entries(uni.tbFireCount)) console.log(`  ${k}: ${v}`);

console.log("\nAvg score by class (uniform):");
for (const [c, s] of Object.entries(uni.avgScore).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c.padEnd(11)} ${s}`);
}

console.log("\n\n=== PERSONA ACCURACY (70% bias, 500 runs each) ===");
for (const target of CLASSES) {
  const t = tally(() => personaAnswers(target, 0.7), 500);
  const correct = t.wins[target];
  const pct = (correct / 500 * 100).toFixed(0);
  const misfires = Object.entries(t.wins)
    .filter(([c]) => c !== target)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([c, n]) => `${c}:${n}`)
    .join(", ");
  const marker = correct < 300 ? " <-- LOW" : correct < 400 ? " <-- weak" : "";
  console.log(`  ${target.padEnd(11)} ${String(correct).padStart(3)}/500 (${pct}%) | misfires: ${misfires}${marker}`);
}

console.log("\n\n=== STRONG PERSONA (90% bias, 500 runs) ===");
for (const target of CLASSES) {
  const t = tally(() => personaAnswers(target, 0.9), 500);
  const correct = t.wins[target];
  const pct = (correct / 500 * 100).toFixed(0);
  const marker = correct < 400 ? " <-- BAD" : "";
  console.log(`  ${target.padEnd(11)} ${String(correct).padStart(3)}/500 (${pct}%)${marker}`);
}
