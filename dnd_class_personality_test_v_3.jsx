import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";

import { CLASSES, baselineQuestions, tieBreakerPool, subclassFlavorPool, HOBBIES } from "./src/questions_v3.mjs";
import {
  calculateResult,
  scoreBaseline,
  pickTieBreakers,
  pickSubclassQuestions,
  getAnchorHobby,
  getPersonaArchetype,
  buildPersonalNarrative,
  buildCharacterNarrative,
  getGrowthTip,
} from "./src/engine_v3.mjs";
import { classData, subclassData, scoreBarColors, classIconSrc } from "./src/classMetadata_v3.mjs";

const PHASES = { BASELINE: "baseline", TIEBREAKER: "tiebreaker", SUBCLASS: "subclass", RESULT: "result" };

function ClassIcon({ name, size = 120, className = "" }) {
  const raw = classIconSrc[name] || classIconSrc.Fighter;
  const fileName = raw.replace(/^\//, "");
  const base = import.meta.env?.BASE_URL ?? "/";
  const src = `${base}${fileName}`;
  return (
    <img
      src={src}
      width={size}
      height={size}
      className={`class-icon ${className}`}
      alt={`${name} 8-bit class icon`}
      draggable="false"
    />
  );
}

function ClassPortrait({ name, classInfo, size = 156, className = "" }) {
  return (
    <div className={`pixel-portrait flex items-center justify-center ${classInfo.color} ${className}`}>
      <ClassIcon name={name} size={size} />
    </div>
  );
}

function HobbyRankQuestion({ question, answer, onChange }) {
  const ranked = answer?.ranked || [];

  const toggle = (hobbyId) => {
    const idx = ranked.indexOf(hobbyId);
    if (idx >= 0) {
      const next = ranked.filter((id) => id !== hobbyId);
      onChange({ ranked: next });
      return;
    }
    if (ranked.length >= 3) return;
    onChange({ ranked: [...ranked, hobbyId] });
  };

  return (
    <div>
      <div className="mb-4 text-xs font-bold leading-6 text-[#171717]">{question.instruction}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((hobby) => {
          const rank = ranked.indexOf(hobby.id);
          const selected = rank >= 0;
          const full = !selected && ranked.length >= 3;
          return (
            <button
              key={hobby.id}
              type="button"
              onClick={() => toggle(hobby.id)}
              disabled={full}
              aria-pressed={selected}
              className={`pixel-menu-row px-3 py-3 text-left text-xs font-bold leading-6 ${
                selected ? "is-selected" : ""
              } ${full ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <span className="pixel-menu-letter" aria-hidden="true">
                {selected ? `#${rank + 1}` : "·"}
              </span>
              <span className="flex-1">{hobby.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#727a78]">
        Picked {ranked.length}/3
      </div>
    </div>
  );
}

function SingleChoiceQuestion({ question, answer, onChange }) {
  return (
    <div className="grid gap-4">
      {question.options.map((option, index) => {
        const selected = answer?.choice === index;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange({ choice: index })}
            aria-pressed={selected}
            className={`pixel-menu-row px-4 py-4 text-left text-xs font-bold leading-6 md:text-sm ${
              selected ? "is-selected" : ""
            }`}
          >
            <span className="pixel-menu-letter" aria-hidden="true">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function isAnswered(question, answer) {
  if (!answer) return false;
  if (question.type === "rank3") return (answer.ranked || []).length === 3;
  return typeof answer.choice === "number";
}

export default function DndClassPersonalityTestV3() {
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState(PHASES.BASELINE);
  const [step, setStep] = useState(0);

  // Compute tie-breaker queue when baseline is complete (memoized on answers)
  const baselineComplete = useMemo(
    () => baselineQuestions.every((q) => isAnswered(q, answers[q.id])),
    [answers]
  );

  const baselineResult = useMemo(() => {
    if (!baselineComplete) return null;
    return scoreBaseline(answers);
  }, [answers, baselineComplete]);

  const firedTieBreakers = useMemo(() => {
    if (!baselineResult) return [];
    return pickTieBreakers(baselineResult.scores);
  }, [baselineResult]);

  // After tie-breakers are answered, decide subclass Qs based on running scores
  const tieBreakersComplete = useMemo(() => {
    if (!baselineComplete) return false;
    return firedTieBreakers.every((q) => isAnswered(q, answers[q.id]));
  }, [baselineComplete, firedTieBreakers, answers]);

  const provisionalResult = useMemo(() => {
    if (!tieBreakersComplete) return null;
    return calculateResult(answers);
  }, [tieBreakersComplete, answers]);

  const firedSubclassQs = useMemo(() => {
    if (!provisionalResult) return [];
    return pickSubclassQuestions(
      provisionalResult.topClass,
      provisionalResult.isMulticlass ? provisionalResult.secondClass : null
    );
  }, [provisionalResult]);

  // Active question list for current phase
  const queue =
    phase === PHASES.BASELINE
      ? baselineQuestions
      : phase === PHASES.TIEBREAKER
      ? firedTieBreakers
      : phase === PHASES.SUBCLASS
      ? firedSubclassQs
      : [];

  const current = queue[step] || null;
  const totalSteps = baselineQuestions.length + firedTieBreakers.length + firedSubclassQs.length;
  const answeredCount =
    Object.keys(answers).filter((id) => {
      const q =
        baselineQuestions.find((x) => x.id === id) ||
        tieBreakerPool.find((x) => x.id === id) ||
        (id.startsWith("subclass_") ? firedSubclassQs.find((x) => x.id === id) : null);
      return q && isAnswered(q, answers[id]);
    }).length;
  const progress = phase === PHASES.RESULT ? 100 : Math.round((answeredCount / Math.max(totalSteps, 1)) * 100);

  const result = useMemo(() => calculateResult(answers), [answers]);

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const advance = () => {
    if (!current) return;
    if (step < queue.length - 1) {
      setStep(step + 1);
      return;
    }
    // End of current queue — transition phase
    if (phase === PHASES.BASELINE) {
      if (firedTieBreakers.length > 0) {
        setPhase(PHASES.TIEBREAKER);
        setStep(0);
        return;
      }
      if (firedSubclassQs.length > 0) {
        setPhase(PHASES.SUBCLASS);
        setStep(0);
        return;
      }
      setPhase(PHASES.RESULT);
      return;
    }
    if (phase === PHASES.TIEBREAKER) {
      if (firedSubclassQs.length > 0) {
        setPhase(PHASES.SUBCLASS);
        setStep(0);
        return;
      }
      setPhase(PHASES.RESULT);
      return;
    }
    if (phase === PHASES.SUBCLASS) {
      setPhase(PHASES.RESULT);
      return;
    }
  };

  const back = () => {
    if (phase === PHASES.RESULT) {
      // back into subclass if it ran, else tie-breakers, else baseline
      if (firedSubclassQs.length > 0) {
        setPhase(PHASES.SUBCLASS);
        setStep(firedSubclassQs.length - 1);
      } else if (firedTieBreakers.length > 0) {
        setPhase(PHASES.TIEBREAKER);
        setStep(firedTieBreakers.length - 1);
      } else {
        setPhase(PHASES.BASELINE);
        setStep(baselineQuestions.length - 1);
      }
      return;
    }
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    if (phase === PHASES.SUBCLASS) {
      if (firedTieBreakers.length > 0) {
        setPhase(PHASES.TIEBREAKER);
        setStep(firedTieBreakers.length - 1);
      } else {
        setPhase(PHASES.BASELINE);
        setStep(baselineQuestions.length - 1);
      }
      return;
    }
    if (phase === PHASES.TIEBREAKER) {
      setPhase(PHASES.BASELINE);
      setStep(baselineQuestions.length - 1);
      return;
    }
  };

  const reset = () => {
    setAnswers({});
    setPhase(PHASES.BASELINE);
    setStep(0);
  };

  const onAnswerChange = (value) => {
    if (!current) return;
    setAnswer(current.id, value);
  };

  const currentAnswer = current ? answers[current.id] : null;
  const canAdvance = current ? isAnswered(current, currentAnswer) : phase === PHASES.RESULT;

  const phaseLabel =
    phase === PHASES.BASELINE
      ? `QUEST ${String(step + 1).padStart(2, "0")} / ${baselineQuestions.length}`
      : phase === PHASES.TIEBREAKER
      ? `BONUS ROUND ${step + 1} / ${firedTieBreakers.length}`
      : phase === PHASES.SUBCLASS
      ? `SUBCLASS FORGE ${step + 1} / ${firedSubclassQs.length}`
      : "CHAR SHEET";

  const primary = classData[result.topClass] || classData.Fighter;
  const secondary = classData[result.secondClass] || classData.Fighter;
  const resultTitle = result.isMulticlass ? `${result.topClass} / ${result.secondClass}` : result.topClass;
  const subclassTitle = result.isMulticlass ? `${result.topSubclass} / ${result.secondSubclass}` : result.topSubclass;
  const traitList = result.traitBadges.length ? result.traitBadges : primary.traits;

  const archetype = useMemo(() => getPersonaArchetype(result), [result]);
  const anchor = useMemo(() => getAnchorHobby(answers), [answers]);
  const personalNarrative = useMemo(() => buildPersonalNarrative(result, answers), [result, answers]);
  const characterNarrative = useMemo(() => buildCharacterNarrative(result), [result]);
  const growthTip = useMemo(() => getGrowthTip(result), [result]);

  const showResult = phase === PHASES.RESULT;
  const showBonusBanner = phase === PHASES.TIEBREAKER && step === 0;
  const showSubclassBanner = phase === PHASES.SUBCLASS && step === 0;

  return (
    <div className="pixel-screen p-3 text-[#fff0bf] sm:p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pixel-badge inline-flex items-center gap-2 bg-[#fff2cf] px-4 py-2 text-[9px] font-bold text-[#171717]"
            >
              <Sparkles className="h-3 w-3" /> Real Life D&D Class Test
            </motion.div>
            <div className="pixel-plaque mt-4 max-w-3xl">
              <h1 className="pixel-title text-2xl font-black leading-relaxed text-[#c7381d] md:text-4xl">
                What class did your life build?
              </h1>
            </div>
          </div>
          <p className="max-w-2xl border-4 border-[#0b0b0b] bg-[#fff2cf] p-4 text-sm leading-6 text-[#171717] shadow-[inset_0_0_0_3px_#d85a24,4px_4px_0_#0b0b0b] md:max-w-sm">
            Concrete scenarios about how you live, train, build, and lead. Bonus rounds may fire to break ties.
          </p>
        </header>

        <Card className="overflow-visible">
          <CardContent className="p-0">
            <div className="pixel-strip border-b-4 p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-wider text-[#fff2cf] md:text-[11px]">
                <span>{phaseLabel}</span>
                <span>XP {progress}/100</span>
              </div>
              <Progress value={progress} className="mt-4" aria-label={`${progress}% complete`} />
            </div>

            <AnimatePresence mode="wait">
              {!showResult && current ? (
                <motion.div
                  key={`${phase}-${step}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-5 md:p-8"
                >
                  {showBonusBanner && (
                    <div className="mb-5 flex items-center gap-3 border-4 border-[#0b0b0b] bg-[#fff2cf] p-3 text-xs font-bold text-[#171717] shadow-[inset_0_0_0_3px_#c7381d,4px_4px_0_#0b0b0b]">
                      <Star className="h-4 w-4 text-[#c7381d]" />
                      <span>
                        Bonus Round unlocked. Your top two paths are close — these will decide it.
                      </span>
                    </div>
                  )}
                  {showSubclassBanner && (
                    <div className="mb-5 flex items-center gap-3 border-4 border-[#0b0b0b] bg-[#fff2cf] p-3 text-xs font-bold text-[#171717] shadow-[inset_0_0_0_3px_#168a32,4px_4px_0_#0b0b0b]">
                      <Sparkles className="h-4 w-4 text-[#168a32]" />
                      <span>
                        Subclass Forge — narrowing your specialization within {provisionalResult?.topClass}.
                      </span>
                    </div>
                  )}
                  <Badge variant="outline" className="mb-5">
                    {current.section}
                  </Badge>
                  <h2 className="text-xl font-extrabold leading-8 text-[#0b0b0b] md:text-2xl">
                    {current.text}
                  </h2>
                  <div className="mt-6">
                    {current.type === "rank3" ? (
                      <HobbyRankQuestion question={current} answer={currentAnswer} onChange={onAnswerChange} />
                    ) : (
                      <SingleChoiceQuestion question={current} answer={currentAnswer} onChange={onAnswerChange} />
                    )}
                  </div>
                </motion.div>
              ) : showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-5 md:p-8"
                >
                  <div className="grid gap-8 md:grid-cols-[224px_1fr] md:items-center">
                    {result.isMulticlass ? (
                      <div
                        className="multiclass-portraits mx-auto"
                        aria-label={`${result.topClass} and ${result.secondClass} class icons`}
                      >
                        <ClassPortrait
                          name={result.topClass}
                          classInfo={primary}
                          size={124}
                          className="class-portrait-dual class-portrait-primary"
                        />
                        <div className="multiclass-divider pixel-font" aria-hidden="true">
                          /
                        </div>
                        <ClassPortrait
                          name={result.secondClass}
                          classInfo={secondary}
                          size={112}
                          className="class-portrait-dual class-portrait-secondary"
                        />
                      </div>
                    ) : (
                      <ClassPortrait
                        name={result.topClass}
                        classInfo={primary}
                        size={156}
                        className="mx-auto h-52 w-52"
                      />
                    )}
                    <div className="min-w-0">
                      <Badge className={`${primary.color}`}>
                        {result.isMulticlass ? "Multiclass Result" : "Dominant Class"}
                      </Badge>
                      <h2 className="pixel-title mt-4 break-words text-3xl font-black leading-relaxed text-[#c7381d] md:text-5xl">
                        {resultTitle}
                      </h2>
                      <div className="mt-3 text-sm font-bold uppercase tracking-wider text-[#8e2c1a]">
                        {archetype}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Badge variant="outline">Subclass: {subclassTitle}</Badge>
                      </div>
                      <p className={`mt-5 text-sm font-bold leading-7 md:text-base ${primary.accent}`}>
                        {primary.motto}
                      </p>
                      <p className="mt-4 leading-7 text-[#171717]">{personalNarrative}</p>
                      {anchor?.hobby && (
                        <div className="pixel-slot mt-5 p-4">
                          <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                            Anchor Hobby
                          </div>
                          <div className="mt-2 text-sm font-bold leading-6 text-[#0b0b0b]">
                            {anchor.hobby.label}
                          </div>
                          {anchor.classSignal && (
                            <div className="mt-1 text-xs leading-5 text-[#171717]">
                              Reads as <strong className="text-[#8e2c1a]">{anchor.classSignal}</strong> DNA.
                            </div>
                          )}
                        </div>
                      )}
                      {result.topSubclass && subclassData[result.topClass]?.[result.topSubclass] && (
                        <p className="mt-4 leading-7 text-[#171717]">
                          <strong className="text-[#8e2c1a]">{result.topSubclass}:</strong>{" "}
                          {subclassData[result.topClass][result.topSubclass]}
                        </p>
                      )}
                      {result.isMulticlass && (
                        <p className="mt-3 leading-7 text-[#171717]">
                          Your second class is not just flavor.{" "}
                          <strong className="text-[#8e2c1a]">{result.secondClass}</strong> scored close enough to
                          count as a true secondary path. {secondary.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pixel-plaque mt-8 p-5 md:p-6">
                    <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                      Your Character
                    </div>
                    <p className="mt-3 leading-7 text-[#171717]">{characterNarrative}</p>
                  </div>

                  <div className="pixel-slot mt-6 p-5 md:p-6">
                    <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#168a32]">
                      Growth Tip
                    </div>
                    <div className="mt-2 text-sm font-bold leading-6 text-[#0b0b0b]">{growthTip.headline}</div>
                    <p className="mt-2 leading-7 text-[#171717]">{growthTip.body}</p>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {traitList.map((trait) => (
                      <div key={trait} className="pixel-slot p-5">
                        <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                          Trait
                        </div>
                        <div className="mt-3 text-sm font-bold leading-6 text-[#0b0b0b]">{trait}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pixel-score-window mt-8 p-5 md:p-6">
                    <h3 className="pixel-font text-sm font-bold text-[#171717]">Top class scores</h3>
                    <div className="mt-5 grid gap-4">
                      {result.ranked.slice(0, 5).map(([name, score]) => {
                        const pct = Math.round((score / Math.max(result.topScore, 1)) * 100);
                        return (
                          <div key={name}>
                            <div className="mb-2 flex justify-between gap-4 text-xs font-bold text-[#171717]">
                              <span className="flex min-w-0 items-center gap-2">
                                <ClassIcon name={name} size={28} className="score-class-icon" />
                                <span className="truncate">{name}</span>
                              </span>
                              <span>{Math.round(score)}</span>
                            </div>
                            <div className="pixel-stat-meter">
                              <div
                                className={`pixel-stat-fill ${scoreBarColors[name] || "bg-[#d79b42]"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="pixel-strip flex flex-wrap items-center justify-between gap-4 border-t-4 p-4 md:p-6">
              <Button
                variant="outline"
                onClick={back}
                disabled={phase === PHASES.BASELINE && step === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="outline" onClick={reset} className="gap-2">
                  Reset
                </Button>
                {!showResult && (
                  <Button
                    onClick={advance}
                    disabled={!canAdvance}
                    className="gap-2 bg-[#168a32] text-[#fff2cf] hover:bg-[#1ea83d] disabled:bg-[#2b2f31] disabled:text-[#727a78]"
                  >
                    {phase === PHASES.SUBCLASS && step === firedSubclassQs.length - 1
                      ? "Reveal Class"
                      : phase === PHASES.TIEBREAKER && step === firedTieBreakers.length - 1 && firedSubclassQs.length === 0
                      ? "Reveal Class"
                      : phase === PHASES.BASELINE && step === baselineQuestions.length - 1 && firedTieBreakers.length === 0 && firedSubclassQs.length === 0
                      ? "Reveal Class"
                      : "Next"}{" "}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 border-4 border-[#0b0b0b] bg-[#fff2cf] p-3 text-center text-[10px] leading-5 text-[#171717] shadow-[inset_0_0_0_3px_#d85a24,4px_4px_0_#0b0b0b]">
          Built as entertainment and self reflection — not a clinical, hiring, or ability assessment.
        </p>
      </div>
    </div>
  );
}
