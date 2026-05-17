import fs from "fs";
import path from "path";

const src = fs.readFileSync(path.resolve("dnd_class_personality_test_v_2.jsx"), "utf8");
const lines = src.split("\n");

// slice CLASSES..end of questions (line 593) + buildInitialScores..end of calculateResult (618..703)
const part1 = lines.slice(8, 593).join("\n"); // line 9 = `const CLASSES` (0-indexed 8)
const part2 = lines.slice(617, 703).join("\n"); // line 618 = buildInitialScores
const core = part1 + "\n" + part2 + "\n";

// eval into module scope
const mod = { exports: {} };
const fn = new Function(
  "module",
  core + "\nmodule.exports = { CLASSES, classData, subclassData, questions, calculateResult, normalizeAnswers, scoreSubclassForClass };"
);
fn(mod);

const { CLASSES, questions, calculateResult } = mod.exports;

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function uniformAnswers() {
  return questions.map((q) => randInt(q.options.length));
}

// Persona-biased: 70% pick option that gives target class >0 points, else random
function personaAnswers(targetClass, biasPct = 0.7) {
  return questions.map((q) => {
    const flagged = q.options
      .map((o, i) => ({ i, score: o.scores?.[targetClass] || 0 }))
      .filter((x) => x.score > 0);
    if (flagged.length && Math.random() < biasPct) {
      // weighted by score
      const total = flagged.reduce((s, x) => s + x.score, 0);
      let r = Math.random() * total;
      for (const x of flagged) {
        r -= x.score;
        if (r <= 0) return x.i;
      }
    }
    return randInt(q.options.length);
  });
}

function tally(simFn, runs = 1000) {
  const wins = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  const multiclassCount = { yes: 0, no: 0 };
  const avgScore = Object.fromEntries(CLASSES.map((c) => [c, 0]));
  for (let i = 0; i < runs; i++) {
    const a = simFn();
    const r = calculateResult(a);
    wins[r.topClass]++;
    multiclassCount[r.isMulticlass ? "yes" : "no"]++;
    for (const c of CLASSES) avgScore[c] += r.scores[c];
  }
  for (const c of CLASSES) avgScore[c] = +(avgScore[c] / runs).toFixed(1);
  return { wins, multiclassCount, avgScore };
}

console.log("=== UNIFORM RANDOM (1000 runs) ===");
console.log("Each user picks each option with equal probability.\n");
const uni = tally(uniformAnswers, 1000);
const sortedWins = Object.entries(uni.wins).sort((a, b) => b[1] - a[1]);
console.log("Class win distribution:");
sortedWins.forEach(([c, n]) => {
  const bar = "#".repeat(Math.round(n / 5));
  console.log(`  ${c.padEnd(11)} ${String(n).padStart(4)}  ${bar}`);
});
console.log(`\nMulticlass rate: ${uni.multiclassCount.yes}/1000 = ${(uni.multiclassCount.yes / 10).toFixed(1)}%`);
console.log("\nAverage score per class (uniform):");
Object.entries(uni.avgScore)
  .sort((a, b) => b[1] - a[1])
  .forEach(([c, s]) => console.log(`  ${c.padEnd(11)} ${s}`));

console.log("\n\n=== PERSONA ACCURACY (each class, 500 runs, 70% bias) ===");
console.log("Person who genuinely IS class X — does test correctly identify them?\n");
const accuracy = {};
for (const target of CLASSES) {
  const t = tally(() => personaAnswers(target, 0.7), 500);
  const correct = t.wins[target];
  accuracy[target] = correct;
  const topMisfires = Object.entries(t.wins)
    .filter(([c]) => c !== target)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  const misfireStr = topMisfires.map(([c, n]) => `${c}:${n}`).join(", ");
  const pct = (correct / 500 * 100).toFixed(0);
  const marker = correct < 250 ? " <-- LOW" : correct < 350 ? " <-- weak" : "";
  console.log(`  ${target.padEnd(11)} hits self ${String(correct).padStart(3)}/500 (${pct}%)  | top misfires: ${misfireStr}${marker}`);
}

console.log("\n\n=== STRONG PERSONA (90% bias, 500 runs) ===");
console.log("Hardcore class fan — clear ceiling for each class.\n");
for (const target of CLASSES) {
  const t = tally(() => personaAnswers(target, 0.9), 500);
  const correct = t.wins[target];
  const pct = (correct / 500 * 100).toFixed(0);
  const marker = correct < 400 ? " <-- BAD" : "";
  console.log(`  ${target.padEnd(11)} hits self ${String(correct).padStart(3)}/500 (${pct}%)${marker}`);
}
