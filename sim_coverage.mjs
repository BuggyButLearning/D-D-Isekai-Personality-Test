import fs from "fs";
import path from "path";

const src = fs.readFileSync(path.resolve("archive/dnd_class_personality_test_v_2.jsx"), "utf8");
const lines = src.split("\n");
const part1 = lines.slice(8, 593).join("\n");
const part2 = lines.slice(617, 703).join("\n");
const core = part1 + "\n" + part2 + "\n";

const mod = { exports: {} };
const fn = new Function("module", core + "\nmodule.exports = { CLASSES, questions };");
fn(mod);
const { CLASSES, questions } = mod.exports;

console.log("=== SCORING COVERAGE PER CLASS ===");
console.log("How many questions can each class score on? Sum of max points per class?\n");

const coverage = Object.fromEntries(CLASSES.map((c) => [c, { questions: 0, maxPoints: 0, avgPerOption: 0 }]));
for (const q of questions) {
  for (const c of CLASSES) {
    const optionScores = q.options.map((o) => o.scores?.[c] || 0);
    const max = Math.max(...optionScores);
    const sum = optionScores.reduce((a, b) => a + b, 0);
    if (max > 0) {
      coverage[c].questions++;
      coverage[c].maxPoints += max;
      coverage[c].avgPerOption += sum / q.options.length;
    }
  }
}
const sorted = Object.entries(coverage).sort((a, b) => b[1].maxPoints - a[1].maxPoints);
console.log("Class       | Qs scored | Max possible | Avg if random");
console.log("------------|-----------|--------------|---------------");
for (const [c, d] of sorted) {
  console.log(
    `${c.padEnd(11)} | ${String(d.questions).padStart(9)} | ${String(d.maxPoints).padStart(12)} | ${d.avgPerOption.toFixed(1).padStart(13)}`
  );
}

console.log("\n=== TOP 10 ARTIFICER-HEAVY QUESTIONS ===");
const artHeavy = questions
  .map((q, i) => ({
    i,
    section: q.section,
    text: q.text.slice(0, 60),
    artMax: Math.max(...q.options.map((o) => o.scores?.Artificer || 0)),
    artSum: q.options.reduce((s, o) => s + (o.scores?.Artificer || 0), 0),
  }))
  .filter((x) => x.artSum > 0)
  .sort((a, b) => b.artSum - a.artSum)
  .slice(0, 12);
for (const q of artHeavy) {
  console.log(`  Q${q.i + 1} [${q.section}] sum=${q.artSum} max=${q.artMax} — ${q.text}`);
}

console.log("\n=== QUESTIONS WITHOUT DRUID OR RANGER POINTS ===");
const noDruid = questions
  .map((q, i) => ({ i, section: q.section, druidSum: q.options.reduce((s, o) => s + (o.scores?.Druid || 0), 0) }))
  .filter((x) => x.druidSum === 0);
const noRanger = questions
  .map((q, i) => ({ i, section: q.section, rangerSum: q.options.reduce((s, o) => s + (o.scores?.Ranger || 0), 0) }))
  .filter((x) => x.rangerSum === 0);
console.log(`Druid has ZERO chance to score in ${noDruid.length}/${questions.length} questions.`);
console.log(`Ranger has ZERO chance to score in ${noRanger.length}/${questions.length} questions.`);
