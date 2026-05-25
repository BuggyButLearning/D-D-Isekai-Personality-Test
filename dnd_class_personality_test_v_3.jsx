import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Share2, Sparkles, Star } from "lucide-react";

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
import { getFacetBlurb } from "./src/facetBlurbs.mjs";
import {
  buildSnapshot,
  encodeSnapshot,
  decodeSnapshot,
  snapshotToResult,
  snapshotToAnswers,
} from "./src/shareCode.mjs";
import { trackTestComplete } from "./src/analytics.mjs";

const PHASES = { INTRO: "intro", BASELINE: "baseline", TIEBREAKER: "tiebreaker", SUBCLASS: "subclass", RESULT: "result" };

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
        Picked {ranked.length} of 3 max · {ranked.length === 0 ? "pick at least 1" : "ready to continue"}
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
  if (question.type === "rank3") return (answer.ranked || []).length >= 1;
  return typeof answer.choice === "number";
}

export default function DndClassPersonalityTestV3() {
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [step, setStep] = useState(0);
  // Snapshot of the result computed the moment tie-breakers complete.
  // Frozen until reset so subclass-phase answers can't shift the queue mid-flow.
  const [provisionalResult, setProvisionalResult] = useState(null);
  // Result loaded from a #c=... share link, if any.
  const [sharedSnapshot, setSharedSnapshot] = useState(null);
  // Share UI transient state.
  const [copyState, setCopyState] = useState("idle"); // idle | copied | fallback
  const [visibleShareUrl, setVisibleShareUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.location.hash.match(/^#c=(.+)$/);
    if (!m) return;
    try {
      const snap = decodeSnapshot(m[1]);
      setSharedSnapshot(snap);
      setPhase(PHASES.RESULT);
    } catch (err) {
      console.warn("[share] failed to decode share code:", err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (tieBreakersComplete && !provisionalResult) {
      setProvisionalResult(calculateResult(answers));
    }
  }, [tieBreakersComplete, provisionalResult, answers]);

  const firedSubclassQs = useMemo(() => {
    if (!provisionalResult || provisionalResult.isMulticlass) return [];
    return pickSubclassQuestions(provisionalResult.topClass);
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

  const cardRef = useRef(null);
  const isFirstScrollRender = useRef(true);

  useEffect(() => {
    if (isFirstScrollRender.current) {
      isFirstScrollRender.current = false;
      return;
    }
    if (phase === PHASES.INTRO) return;
    if (phase === PHASES.RESULT) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    cardRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [phase, step]);

  const tracked = useRef(false);
  useEffect(() => {
    if (phase !== PHASES.RESULT) return;
    if (sharedSnapshot) return;
    if (tracked.current) return;
    tracked.current = true;
    trackTestComplete({ result, answers });
  }, [phase, sharedSnapshot, result, answers]);

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const advance = () => {
    if (!current) return;
    if (step < queue.length - 1) {
      setStep(step + 1);
      return;
    }
    // End of current queue. Transition phase.
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
    setPhase(PHASES.INTRO);
    setStep(0);
    setProvisionalResult(null);
  };

  const startQuiz = () => {
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
    phase === PHASES.INTRO
      ? "BEFORE YOU BEGIN"
      : phase === PHASES.BASELINE
      ? `QUEST ${String(step + 1).padStart(2, "0")} / ${baselineQuestions.length}`
      : phase === PHASES.TIEBREAKER
      ? `BONUS ROUND ${step + 1} / ${firedTieBreakers.length}`
      : phase === PHASES.SUBCLASS
      ? `SUBCLASS FORGE ${step + 1} / ${firedSubclassQs.length}`
      : "CHAR SHEET";

  // When viewing a shared snapshot, route everything through the synthesized
  // result/answers so the existing render path works unchanged. Frozen
  // narrative text from the snapshot wins over live re-derivation.
  const viewResult = sharedSnapshot ? snapshotToResult(sharedSnapshot) : result;
  const viewAnswers = sharedSnapshot ? snapshotToAnswers(sharedSnapshot) : answers;

  const primary = classData[viewResult.topClass] || classData.Fighter;
  const secondary = classData[viewResult.secondClass] || classData.Fighter;
  const resultTitle = viewResult.isMulticlass ? `${viewResult.topClass} / ${viewResult.secondClass}` : viewResult.topClass;
  const subclassTitle = viewResult.isMulticlass ? null : viewResult.topSubclass;
  const traitList = viewResult.traitBadges.length ? viewResult.traitBadges : primary.traits;

  const archetype = useMemo(
    () => sharedSnapshot?.ar || getPersonaArchetype(viewResult),
    [sharedSnapshot, viewResult]
  );
  const anchor = useMemo(() => getAnchorHobby(viewAnswers), [viewAnswers]);
  const personalNarrative = useMemo(
    () => sharedSnapshot?.pn || buildPersonalNarrative(viewResult, viewAnswers),
    [sharedSnapshot, viewResult, viewAnswers]
  );
  const characterNarrative = useMemo(
    () => sharedSnapshot?.cn || buildCharacterNarrative(viewResult),
    [sharedSnapshot, viewResult]
  );
  const growthTip = useMemo(() => {
    if (sharedSnapshot) {
      return { headline: sharedSnapshot.gh || "", body: sharedSnapshot.gb || "" };
    }
    return getGrowthTip(viewResult);
  }, [sharedSnapshot, viewResult]);
  const motto = sharedSnapshot?.mo || primary.motto;
  const subclassDescriptionText = sharedSnapshot
    ? sharedSnapshot.sd
    : (!viewResult.isMulticlass && viewResult.topSubclass && subclassData[viewResult.topClass]?.[viewResult.topSubclass]) || null;
  const multiclassSecondaryText = sharedSnapshot
    ? sharedSnapshot.ms
    : viewResult.isMulticlass && viewResult.secondClass
      ? `Your second class is not just flavor. ${viewResult.secondClass} scored close enough to count as a true secondary path. ${secondary.summary}`
      : null;

  async function copyShareLink() {
    const snap = buildSnapshot(result, answers);
    const code = encodeSnapshot(snap);
    const base = import.meta.env?.BASE_URL ?? "/";
    const url = `${location.origin}${base}r/${result.topClass}/#c=${code}`;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "My D&D class", url });
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
        return;
      } catch {
        /* user cancelled or unsupported, fall through */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setCopyState("copied");
        setTimeout(() => setCopyState("idle"), 2000);
        return;
      } catch {
        /* permission denied, fall through */
      }
    }
    setVisibleShareUrl(url);
    setCopyState("fallback");
  }

  function exitSharedView() {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setSharedSnapshot(null);
    setCopyState("idle");
    setVisibleShareUrl("");
    reset();
  }

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
            Concrete scenarios about how you live, train, build, and lead. Bonus rounds fire if your top two classes are close.
          </p>
        </header>

        <div ref={cardRef}>
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
              {phase === PHASES.INTRO ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-5 md:p-8"
                >
                  <Badge variant="outline" className="mb-5">Before You Begin</Badge>
                  <h2 className="text-xl font-extrabold leading-8 text-[#0b0b0b] md:text-2xl">
                    What class did your real life build?
                  </h2>
                  <div className="mt-5 space-y-4 leading-7 text-[#171717]">
                    <p>
                      This is not a "pick your favorite vibe" quiz. The questions ask about how you actually
                      live. How you train, learn, lead, build, serve, improvise, and gain power. Your
                      answers map to the 13 D&D classes (plus subclasses) the same way real strengths map
                      to real archetypes.
                    </p>
                    <p>
                      About <strong className="text-[#8e2c1a]">12 core questions</strong> for everyone, plus
                      a few <strong className="text-[#8e2c1a]">Bonus Rounds</strong> only if your top two
                      classes are close. Then a <strong className="text-[#8e2c1a]">Subclass Forge</strong>{" "}
                      to lock in your specialization. Most people finish in 5-7 minutes.
                    </p>
                    <p>
                      At the end you get a class, subclass, persona archetype, a real-world read on who you
                      are, and a fantasy character version of you. Self-reflection and entertainment, not an
                      ability test.
                    </p>
                  </div>
                  <div className="pixel-slot mt-6 p-4 text-xs leading-6 text-[#171717]">
                    <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                      How to answer
                    </div>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Pick what's <em>actually</em> true of you, not what sounds cool.</li>
                      <li>One question is a rank-3 hobby pick. Tap your top 3 in order.</li>
                      <li>No "I don't" escape hatches. Every option says something about someone.</li>
                    </ul>
                  </div>
                </motion.div>
              ) : !showResult && current ? (
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
                        Bonus Round unlocked. Your top two paths are close. These will decide it.
                      </span>
                    </div>
                  )}
                  {showSubclassBanner && (
                    <div className="mb-5 flex items-center gap-3 border-4 border-[#0b0b0b] bg-[#fff2cf] p-3 text-xs font-bold text-[#171717] shadow-[inset_0_0_0_3px_#168a32,4px_4px_0_#0b0b0b]">
                      <Sparkles className="h-4 w-4 text-[#168a32]" />
                      <span>
                        Subclass Forge. Narrowing your specialization within {provisionalResult?.topClass}.
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
                  {sharedSnapshot && (
                    <div className="mb-5 flex items-center gap-3 border-4 border-[#0b0b0b] bg-[#F7EFD2] p-3 text-xs font-bold text-[#1F1A14] shadow-[inset_0_0_0_3px_#8e2c1a,4px_4px_0_#0b0b0b]">
                      <Sparkles className="h-4 w-4 text-[#8e2c1a]" />
                      <span>Shared result from another player. Click below to take the quiz yourself.</span>
                    </div>
                  )}
                  <div className="grid gap-8 md:grid-cols-[224px_1fr] md:items-center">
                    {viewResult.isMulticlass ? (
                      <div
                        className="multiclass-portraits mx-auto"
                        aria-label={`${viewResult.topClass} and ${viewResult.secondClass} class icons`}
                      >
                        <ClassPortrait
                          name={viewResult.topClass}
                          classInfo={primary}
                          size={124}
                          className="class-portrait-dual class-portrait-primary"
                        />
                        <div className="multiclass-divider pixel-font" aria-hidden="true">
                          /
                        </div>
                        <ClassPortrait
                          name={viewResult.secondClass}
                          classInfo={secondary}
                          size={112}
                          className="class-portrait-dual class-portrait-secondary"
                        />
                      </div>
                    ) : (
                      <ClassPortrait
                        name={viewResult.topClass}
                        classInfo={primary}
                        size={156}
                        className="mx-auto h-52 w-52"
                      />
                    )}
                    <div className="min-w-0">
                      <Badge className={`${primary.color}`}>
                        {viewResult.isMulticlass ? "Multiclass Result" : "Dominant Class"}
                      </Badge>
                      <h2 className="pixel-title mt-6 break-words text-3xl font-black leading-relaxed text-[#B8452D] md:text-5xl">
                        {resultTitle}
                      </h2>
                      <div className="mt-4 text-sm font-bold uppercase tracking-wider text-[#8e2c1a]">
                        {archetype}
                      </div>
                      {subclassTitle && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          <Badge variant="outline">Subclass: {subclassTitle}</Badge>
                        </div>
                      )}
                      {!sharedSnapshot && (
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <Button
                            onClick={copyShareLink}
                            variant="outline"
                            className="gap-2"
                          >
                            {copyState === "copied" ? (
                              <>Copied!</>
                            ) : (
                              <>
                                <Share2 className="h-4 w-4" /> Copy share link
                              </>
                            )}
                          </Button>
                          {copyState === "fallback" && visibleShareUrl && (
                            <div className="flex w-full flex-col gap-1">
                              <input
                                readOnly
                                value={visibleShareUrl}
                                onFocus={(e) => e.target.select()}
                                className="w-full border-2 border-[#0b0b0b] bg-[#F7EFD2] px-2 py-1 text-[11px] font-mono text-[#1F1A14]"
                              />
                              <span className="text-[10px] text-[#727a78]">Press Ctrl+C (or ⌘C) to copy.</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className="mt-6 h-1 w-24 bg-[#B8893B] border-x-4 border-solid border-[#8A452F]"
                        aria-hidden="true"
                      />
                      <p className={`mt-6 max-w-[68ch] text-sm font-bold leading-7 md:text-base ${primary.accent}`}>
                        {motto}
                      </p>
                      <p className="mt-4 max-w-[68ch] leading-7 text-[#1F1A14]">{personalNarrative}</p>
                      {anchor?.hobby && (
                        <div className="pixel-slot mt-5 p-4">
                          <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                            Anchor Hobby
                          </div>
                          <div className="mt-2 text-sm font-bold leading-6 text-[#1F1A14]">
                            {anchor.hobby.label}
                          </div>
                          {anchor.classSignal && (
                            <div className="mt-1 text-xs leading-5 text-[#1F1A14]">
                              Reads as <strong className="text-[#8e2c1a]">{anchor.classSignal}</strong> DNA.
                            </div>
                          )}
                        </div>
                      )}
                      {subclassDescriptionText && (
                        <p className="mt-4 max-w-[68ch] leading-7 text-[#1F1A14]">
                          {viewResult.topSubclass && (
                            <strong className="text-[#8e2c1a]">{viewResult.topSubclass}: </strong>
                          )}
                          {subclassDescriptionText}
                        </p>
                      )}
                      {viewResult.isMulticlass && multiclassSecondaryText && (
                        <p className="mt-3 max-w-[68ch] leading-7 text-[#1F1A14]">{multiclassSecondaryText}</p>
                      )}
                    </div>
                  </div>

                  <div className="pixel-plaque mt-8 p-5 md:p-6">
                    <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                      Your Character
                    </div>
                    <p className="mt-3 max-w-[68ch] leading-7 text-[#1F1A14]">{characterNarrative}</p>
                  </div>

                  <div className="pixel-slot mt-6 p-5 md:p-6">
                    <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#168a32]">
                      Growth Tip
                    </div>
                    <div className="mt-2 text-sm font-bold leading-6 text-[#1F1A14]">{growthTip.headline}</div>
                    <p className="mt-2 max-w-[68ch] leading-7 text-[#1F1A14]">{growthTip.body}</p>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {traitList.map((trait) => {
                      const blurb = getFacetBlurb(trait);
                      return (
                        <div key={trait} className="pixel-slot p-5">
                          <div className="pixel-font text-[9px] font-bold uppercase tracking-wider text-[#8e2c1a]">
                            Trait
                          </div>
                          <div className="mt-3 text-sm font-bold leading-6 text-[#1F1A14]">{trait}</div>
                          {blurb && (
                            <div className="mt-2 text-xs leading-snug text-[#3d3328]">{blurb}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pixel-score-window mt-8 p-5 md:p-6">
                    <h3 className="pixel-font text-sm font-bold text-[#1F1A14]">Top class scores</h3>
                    <div className="mt-5 grid gap-4">
                      {viewResult.ranked.slice(0, 5).map(([name, score]) => {
                        const pct = Math.round((score / Math.max(viewResult.topScore, 1)) * 100);
                        return (
                          <div key={name}>
                            <div className="mb-2 flex justify-between gap-4 text-xs font-bold text-[#1F1A14]">
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
              {sharedSnapshot ? (
                <>
                  <div />
                  <Button
                    onClick={exitSharedView}
                    className="gap-2 bg-[#168a32] text-[#fff2cf] hover:bg-[#1ea83d]"
                  >
                    Take the quiz yourself <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : phase === PHASES.INTRO ? (
                <>
                  <div />
                  <Button
                    onClick={startQuiz}
                    className="gap-2 bg-[#168a32] text-[#fff2cf] hover:bg-[#1ea83d]"
                  >
                    Begin Quiz <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={reset} className="gap-2">
                    Reset
                  </Button>
                  <div className="flex flex-wrap justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={back}
                      disabled={phase === PHASES.BASELINE && step === 0}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
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
                </>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        <p className="mt-6 border-4 border-[#0b0b0b] bg-[#fff2cf] p-3 text-center text-[10px] leading-5 text-[#171717] shadow-[inset_0_0_0_3px_#d85a24,4px_4px_0_#0b0b0b]">
          Built as entertainment and self reflection. Not a clinical, hiring, or ability assessment.
        </p>
        <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-wider text-[#727a78]">
          build {__APP_VERSION__} · {__BUILD_DATE__}
        </p>
      </div>
    </div>
  );
}
