import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "class-icons", "archive", "svg-originals");

const colors = {
  ink: "#0b0b0b",
  cream: "#fff2cf",
  paper: "#f7d7bb",
  skin: "#f1c4a8",
  skinDark: "#d79b72",
  gold: "#f1b72f",
  orange: "#d85a24",
  orangeDark: "#8e2c1a",
  red: "#c7381d",
  redDark: "#7b1d14",
  teal: "#8ddfd6",
  tealDark: "#2e7f82",
  green: "#168a32",
  greenDark: "#0d5521",
  slate: "#727a78",
  slateDark: "#4d5554",
  charcoal: "#2b2f31",
  blue: "#3190bd",
  blueDark: "#1b5276",
  violet: "#6a3e9f",
  violetDark: "#3f275f",
  white: "#f4f0e8",
};

function rect(x, y, w, h, fill, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"/>`;
}

function block(x, y, w, h, fill) {
  return [
    rect(x - 1, y - 1, w + 2, h + 2, colors.ink),
    rect(x, y, w, h, fill),
  ];
}

function pixels(points, fill) {
  return points.map(([x, y, w = 1, h = 1]) => rect(x, y, w, h, fill));
}

function baseHero({ robe = colors.slate, trim = colors.cream, skin = colors.skin, hair = colors.charcoal } = {}) {
  return [
    ...block(11, 7, 10, 8, skin),
    rect(12, 8, 8, 2, colors.skinDark),
    rect(13, 11, 2, 2, colors.ink),
    rect(18, 11, 2, 2, colors.ink),
    ...block(9, 15, 14, 10, robe),
    rect(11, 17, 10, 2, trim),
    rect(12, 20, 8, 2, robe),
    ...block(7, 16, 4, 8, robe),
    ...block(21, 16, 4, 8, robe),
    ...block(10, 25, 5, 4, colors.ink),
    ...block(17, 25, 5, 4, colors.ink),
    rect(11, 6, 10, 2, hair),
  ];
}

const icons = {
  artificer: {
    title: "Artificer",
    parts: [
      ...baseHero({ robe: colors.orange, trim: colors.gold, hair: colors.slateDark }),
      ...block(9, 9, 4, 3, colors.teal),
      ...block(19, 9, 4, 3, colors.teal),
      rect(13, 10, 6, 1, colors.ink),
      ...block(3, 18, 5, 3, colors.slate),
      ...block(4, 15, 2, 8, colors.slateDark),
      ...block(23, 6, 5, 5, colors.gold),
      rect(25, 8, 1, 1, colors.ink),
      rect(27, 8, 2, 1, colors.ink),
      rect(24, 5, 1, 2, colors.ink),
      rect(24, 12, 1, 2, colors.ink),
      rect(29, 7, 1, 2, colors.ink),
    ],
  },
  barbarian: {
    title: "Barbarian",
    parts: [
      ...baseHero({ robe: colors.redDark, trim: colors.cream, hair: colors.red }),
      ...pixels([[9, 5, 3, 3], [20, 5, 3, 3], [8, 7, 2, 4], [22, 7, 2, 4], [10, 4, 12, 3]], colors.red),
      rect(12, 16, 8, 6, colors.skin),
      rect(13, 18, 6, 2, colors.red),
      ...block(4, 8, 3, 18, colors.slateDark),
      ...block(2, 6, 7, 5, colors.slate),
      rect(1, 8, 3, 2, colors.cream),
      ...block(23, 16, 5, 7, colors.skin),
    ],
  },
  bard: {
    title: "Bard",
    parts: [
      ...baseHero({ robe: colors.orange, trim: colors.violet, hair: colors.gold }),
      ...block(8, 4, 15, 4, colors.violet),
      rect(18, 2, 7, 3, colors.violet),
      rect(23, 1, 3, 2, colors.gold),
      ...block(22, 14, 6, 10, colors.gold),
      rect(24, 16, 1, 7, colors.ink),
      rect(26, 16, 1, 7, colors.ink),
      rect(23, 21, 5, 1, colors.ink),
      rect(24, 24, 3, 1, colors.ink),
      ...block(5, 17, 4, 3, colors.cream),
    ],
  },
  cleric: {
    title: "Cleric",
    parts: [
      ...baseHero({ robe: colors.white, trim: colors.gold, hair: colors.white }),
      ...block(9, 4, 14, 6, colors.white),
      rect(10, 6, 12, 3, colors.cream),
      rect(15, 15, 2, 10, colors.gold),
      rect(11, 19, 10, 2, colors.gold),
      ...block(24, 6, 2, 19, colors.gold),
      rect(22, 8, 6, 2, colors.gold),
      rect(24, 6, 2, 6, colors.gold),
      rect(23, 7, 4, 4, colors.cream),
    ],
  },
  druid: {
    title: "Druid",
    parts: [
      ...baseHero({ robe: colors.green, trim: colors.cream, hair: colors.greenDark }),
      ...block(9, 5, 14, 8, colors.greenDark),
      rect(11, 7, 10, 4, colors.green),
      rect(7, 3, 2, 5, colors.gold),
      rect(23, 3, 2, 5, colors.gold),
      rect(6, 2, 3, 2, colors.gold),
      rect(23, 2, 3, 2, colors.gold),
      ...block(23, 16, 5, 5, colors.green),
      rect(25, 14, 2, 7, colors.greenDark),
      rect(26, 15, 3, 2, colors.green),
      rect(23, 17, 3, 2, colors.cream),
    ],
  },
  fighter: {
    title: "Fighter",
    parts: [
      ...baseHero({ robe: colors.slate, trim: colors.cream, hair: colors.slateDark }),
      ...block(10, 4, 12, 6, colors.slate),
      rect(11, 6, 10, 2, colors.cream),
      ...block(3, 9, 3, 18, colors.slate),
      rect(2, 7, 5, 3, colors.cream),
      rect(4, 5, 1, 4, colors.cream),
      ...block(23, 16, 6, 8, colors.red),
      rect(24, 17, 4, 5, colors.slate),
      rect(25, 18, 2, 3, colors.cream),
    ],
  },
  monk: {
    title: "Monk",
    parts: [
      ...baseHero({ robe: colors.skin, trim: colors.red, hair: colors.charcoal }),
      rect(10, 9, 12, 2, colors.red),
      rect(22, 9, 4, 1, colors.red),
      rect(10, 15, 12, 10, colors.orange),
      rect(12, 17, 8, 2, colors.cream),
      ...block(3, 14, 7, 7, colors.skin),
      rect(4, 15, 5, 5, colors.skinDark),
      ...block(22, 18, 6, 4, colors.skin),
      rect(23, 19, 4, 2, colors.skinDark),
    ],
  },
  paladin: {
    title: "Paladin",
    parts: [
      ...baseHero({ robe: colors.teal, trim: colors.cream, hair: colors.gold }),
      ...block(10, 4, 12, 6, colors.cream),
      rect(12, 6, 8, 2, colors.teal),
      rect(15, 14, 2, 11, colors.gold),
      rect(11, 18, 10, 2, colors.gold),
      ...block(23, 14, 6, 10, colors.teal),
      rect(24, 15, 4, 7, colors.cream),
      rect(25, 16, 2, 5, colors.gold),
      rect(24, 18, 4, 1, colors.gold),
    ],
  },
  ranger: {
    title: "Ranger",
    parts: [
      ...baseHero({ robe: colors.greenDark, trim: colors.gold, hair: colors.green }),
      ...block(8, 4, 16, 5, colors.green),
      rect(18, 2, 7, 3, colors.green),
      rect(22, 1, 3, 2, colors.gold),
      rect(11, 15, 10, 10, colors.greenDark),
      ...block(4, 9, 2, 18, colors.gold),
      rect(5, 10, 1, 16, colors.ink),
      rect(6, 11, 2, 2, colors.cream),
      rect(6, 23, 2, 2, colors.cream),
      ...block(22, 16, 5, 3, colors.gold),
    ],
  },
  rogue: {
    title: "Rogue",
    parts: [
      ...baseHero({ robe: colors.charcoal, trim: colors.slate, hair: colors.charcoal }),
      ...block(8, 4, 16, 9, colors.charcoal),
      rect(11, 8, 10, 4, colors.slateDark),
      rect(13, 11, 2, 1, colors.teal),
      rect(18, 11, 2, 1, colors.teal),
      rect(10, 16, 12, 2, colors.violetDark),
      ...block(23, 14, 3, 13, colors.slate),
      rect(24, 12, 4, 3, colors.cream),
      rect(25, 10, 1, 4, colors.cream),
      ...block(5, 18, 4, 3, colors.charcoal),
    ],
  },
  sorcerer: {
    title: "Sorcerer",
    parts: [
      ...baseHero({ robe: colors.red, trim: colors.gold, hair: colors.orangeDark }),
      ...block(9, 4, 14, 5, colors.redDark),
      rect(11, 5, 10, 3, colors.red),
      rect(12, 15, 8, 10, colors.redDark),
      rect(14, 16, 4, 8, colors.gold),
      ...block(23, 14, 5, 5, colors.orange),
      rect(24, 13, 3, 7, colors.gold),
      rect(22, 15, 7, 3, colors.red),
      rect(25, 12, 1, 9, colors.cream),
      ...block(4, 17, 4, 3, colors.red),
    ],
  },
  warlock: {
    title: "Warlock",
    parts: [
      ...baseHero({ robe: colors.slateDark, trim: colors.violet, hair: colors.charcoal }),
      ...block(8, 4, 16, 8, colors.charcoal),
      rect(11, 8, 10, 4, colors.slateDark),
      rect(13, 11, 6, 1, colors.violet),
      rect(12, 16, 8, 9, colors.violetDark),
      ...block(23, 8, 5, 5, colors.violet),
      rect(24, 10, 3, 1, colors.cream),
      rect(25, 9, 1, 3, colors.ink),
      ...block(4, 17, 5, 7, colors.charcoal),
      rect(5, 18, 3, 5, colors.gold),
    ],
  },
  wizard: {
    title: "Wizard",
    parts: [
      ...baseHero({ robe: colors.blue, trim: colors.gold, hair: colors.white }),
      ...block(8, 7, 16, 4, colors.blueDark),
      rect(13, 3, 10, 4, colors.gold),
      rect(18, 1, 4, 3, colors.gold),
      rect(21, 0, 2, 2, colors.cream),
      rect(11, 15, 10, 10, colors.blueDark),
      rect(13, 17, 6, 2, colors.gold),
      ...block(24, 7, 2, 20, colors.slateDark),
      rect(23, 6, 4, 3, colors.teal),
      ...block(4, 18, 6, 5, colors.cream),
      rect(5, 19, 4, 3, colors.blue),
    ],
  },
};

function svg({ title, parts }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 32 32" shape-rendering="crispEdges" role="img" aria-labelledby="title desc">
  <title id="title">${title} 8-bit class icon</title>
  <desc id="desc">Pixel art icon for the ${title} class.</desc>
  ${rect(4, 29, 24, 2, colors.ink, 0.18)}
  ${parts.flat().join("\n  ")}
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const [slug, icon] of Object.entries(icons)) {
  writeFileSync(join(OUT_DIR, `${slug}.svg`), svg(icon));
}

console.log(`Generated ${Object.keys(icons).length} class icons in ${OUT_DIR}`);
