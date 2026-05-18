// Share-link encoder / decoder. Snapshots a result into a URL-safe code
// that fully reconstructs the result page without re-running the engine.
//
// Format: <lzstring-compressed-json>.<4-char-checksum>

import LZString from "lz-string";
import { CLASSES } from "./questions_v3.mjs";
import {
  buildPersonalNarrative,
  buildCharacterNarrative,
  getGrowthTip,
  getPersonaArchetype,
} from "./engine_v3.mjs";
import { classData, subclassData } from "./classMetadata_v3.mjs";

export const SHARE_VERSION = 1;

function fnv1a16(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h & 0xffff;
}

function checksumOf(compressed) {
  return fnv1a16(compressed).toString(36).padStart(4, "0");
}

// Build the share payload from a live result + answers object. Freezes
// rendered narrative text so future edits to template strings can never
// rewrite an old shared link.
export function buildSnapshot(result, answers) {
  const primary = classData[result.topClass] || {};
  const archetype = getPersonaArchetype(result);
  const personal = buildPersonalNarrative(result, answers);
  const character = buildCharacterNarrative(result);
  const growth = getGrowthTip(result);
  const subclassDesc =
    !result.isMulticlass && result.topSubclass
      ? subclassData[result.topClass]?.[result.topSubclass] || null
      : null;
  const multiclassSecondary =
    result.isMulticlass && result.secondClass
      ? `Your second class is not just flavor. ${result.secondClass} scored close enough to count as a true secondary path. ${classData[result.secondClass]?.summary || ""}`.trim()
      : null;

  return {
    v: SHARE_VERSION,
    t: result.topClass,
    s: result.secondClass || null,
    m: result.isMulticlass ? 1 : 0,
    sc: result.isMulticlass ? null : result.topSubclass || null,
    tr: (result.traitBadges || []).slice(0, 3),
    h: answers?.sunday?.ranked?.[0] || null,
    ar: archetype,
    mo: primary.motto || null,
    pn: personal,
    cn: character,
    gh: growth?.headline || null,
    gb: growth?.body || null,
    sd: subclassDesc,
    ms: multiclassSecondary,
    r: (result.ranked || []).slice(0, 5).map(([n, score]) => [n, Math.round(score)]),
  };
}

export function encodeSnapshot(snapshot) {
  const json = JSON.stringify(snapshot);
  const compressed = LZString.compressToEncodedURIComponent(json);
  return `${compressed}.${checksumOf(compressed)}`;
}

export function decodeSnapshot(code) {
  if (typeof code !== "string" || !code.includes(".")) {
    throw new Error("malformed share code");
  }
  const dot = code.lastIndexOf(".");
  const compressed = code.slice(0, dot);
  const checksum = code.slice(dot + 1);
  if (!compressed || !checksum) throw new Error("malformed share code");
  if (checksumOf(compressed) !== checksum) {
    throw new Error("share code failed integrity check");
  }
  const json = LZString.decompressFromEncodedURIComponent(compressed);
  if (!json) throw new Error("decompress failed");
  let obj;
  try {
    obj = JSON.parse(json);
  } catch {
    throw new Error("share code is not valid JSON");
  }
  if (obj.v !== SHARE_VERSION) {
    throw new Error(`unsupported share version ${obj.v}`);
  }
  if (!CLASSES.includes(obj.t)) {
    throw new Error(`unknown class ${obj.t}`);
  }
  if (obj.s && !CLASSES.includes(obj.s)) {
    throw new Error(`unknown secondary class ${obj.s}`);
  }
  return obj;
}

// Synthesize a result-shaped object from a snapshot so existing result
// render code can read it without branches on every field.
export function snapshotToResult(snapshot) {
  return {
    topClass: snapshot.t,
    secondClass: snapshot.s,
    isMulticlass: snapshot.m === 1,
    topSubclass: snapshot.sc,
    secondSubclass: null,
    traitBadges: snapshot.tr || [],
    ranked: snapshot.r || [],
    topScore: snapshot.r?.[0]?.[1] ?? 0,
    secondScore: snapshot.r?.[1]?.[1] ?? 0,
    subclassAccum: {},
    facets: {},
  };
}

export function snapshotToAnswers(snapshot) {
  return {
    sunday: { ranked: snapshot.h ? [snapshot.h] : [] },
  };
}
