// Post-build step. For each D&D class, copy dist/index.html to
// dist/r/<ClassName>/index.html with that class's Open Graph image and
// title swapped in. Lets social-card crawlers see a per-class preview
// even though the SPA itself is one bundle.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CLASSES } from "../src/questions_v3.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "..", "dist");
const base = "/D-D-Isekai-Personality-Test/";
const origin = "https://buggybutlearning.github.io";

const indexPath = path.join(dist, "index.html");
if (!fs.existsSync(indexPath)) {
  console.error(`build_og_routes: ${indexPath} not found — did vite build run first?`);
  process.exit(1);
}
const tmpl = fs.readFileSync(indexPath, "utf8");

function swap(html, prop, attr, value) {
  // Match either <meta property="X" content="..."> or <meta name="X" content="...">
  const re = new RegExp(`<meta\\s+${attr}="${prop}"[^>]*>`, "i");
  const replacement = `<meta ${attr}="${prop}" content="${value}">`;
  if (!re.test(html)) return html;
  return html.replace(re, replacement);
}

let written = 0;
for (const cls of CLASSES) {
  const lower = cls.toLowerCase();
  const ogImg = `${origin}${base}class-icons/${lower}.png`;
  const title = `I'm a ${cls} — D&D Class Personality Test`;
  const desc  = `${cls} — see the full result, then take the quiz yourself.`;
  const url   = `${origin}${base}r/${cls}/`;

  let html = tmpl;
  html = swap(html, "og:title",      "property", title);
  html = swap(html, "og:description","property", desc);
  html = swap(html, "og:image",      "property", ogImg);
  html = swap(html, "og:url",        "property", url);
  html = swap(html, "twitter:title",      "name", title);
  html = swap(html, "twitter:description","name", desc);
  html = swap(html, "twitter:image",      "name", ogImg);

  const dir = path.join(dist, "r", cls);
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, "index.html");
  fs.writeFileSync(outPath, html);
  written++;

  // Sanity: confirm replacement actually happened
  if (!html.includes(ogImg)) {
    console.error(`build_og_routes: failed to inject og:image for ${cls}`);
    process.exit(1);
  }
}

console.log(`build_og_routes: wrote ${written} per-class HTML stubs under dist/r/`);
