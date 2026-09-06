/**
 * Generates the Marketplace's product imagery as SVG files in public/products.
 *
 * The catalog references these by URL exactly as it would reference a CDN, so
 * swapping in real photography is a data change and nothing more. Regenerate
 * with: node scripts/generate-product-images.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/products",
);

const shapes = {
  phone: (body, screen) => `
    <rect x="135" y="60" width="130" height="280" rx="24" fill="${body}"/>
    <rect x="144" y="69" width="112" height="262" rx="17" fill="url(#screen)"/>
    <rect x="181" y="76" width="38" height="7" rx="3.5" fill="${body}"/>
    <path d="M156 312c10-64 24-102 42-114 16-11 32-8 46 8" stroke="${screen}" stroke-opacity=".45" stroke-width="7" stroke-linecap="round" fill="none"/>`,

  laptop: (body, screen) => `
    <rect x="86" y="96" width="228" height="152" rx="11" fill="${body}"/>
    <rect x="96" y="106" width="208" height="132" rx="6" fill="url(#screen)"/>
    <path d="M116 232c14-40 30-63 48-70 16-6 32 0 47 17" stroke="${screen}" stroke-opacity=".45" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M70 252h260l22 40a8 8 0 0 1-7 12H55a8 8 0 0 1-7-12z" fill="${body}"/>
    <rect x="168" y="286" width="64" height="7" rx="3.5" fill="#000" fill-opacity=".22"/>`,

  headphone: (body) => `
    <path d="M112 218v-24a88 88 0 0 1 176 0v24" stroke="${body}" stroke-width="22" stroke-linecap="round" fill="none"/>
    <rect x="80" y="206" width="66" height="110" rx="28" fill="${body}"/>
    <rect x="254" y="206" width="66" height="110" rx="28" fill="${body}"/>
    <rect x="94" y="222" width="38" height="78" rx="19" fill="#000" fill-opacity=".2"/>
    <rect x="268" y="222" width="38" height="78" rx="19" fill="#000" fill-opacity=".2"/>`,

  earbuds: (body) => `
    <rect x="118" y="150" width="164" height="126" rx="34" fill="${body}"/>
    <rect x="118" y="204" width="164" height="6" fill="#000" fill-opacity=".12"/>
    <circle cx="200" cy="252" r="13" fill="#000" fill-opacity=".14"/>
    <path d="M150 120c0-18 14-30 30-30s28 13 27 31l-3 34c-1 14-12 22-25 20s-22-12-23-26z" fill="${body}"/>
    <path d="M250 120c0-18-14-30-30-30s-28 13-27 31l3 34c1 14 12 22 25 20s22-12 23-26z" fill="${body}" fill-opacity=".85"/>`,

  watch: (body, screen) => `
    <path d="M162 96h76l-7-40a12 12 0 0 0-12-10h-38a12 12 0 0 0-12 10z" fill="${body}" fill-opacity=".7"/>
    <path d="M162 304h76l-7 40a12 12 0 0 1-12 10h-38a12 12 0 0 1-12-10z" fill="${body}" fill-opacity=".7"/>
    <rect x="138" y="92" width="124" height="216" rx="42" fill="${body}"/>
    <rect x="150" y="104" width="100" height="192" rx="33" fill="url(#screen)"/>
    <path d="M166 274c8-44 18-70 31-79 12-8 24-5 34 8" stroke="${screen}" stroke-opacity=".4" stroke-width="6" stroke-linecap="round" fill="none"/>`,

  tv: (body, screen) => `
    <rect x="46" y="92" width="308" height="188" rx="10" fill="${body}"/>
    <rect x="54" y="100" width="292" height="172" rx="5" fill="url(#screen)"/>
    <path d="M84 264c26-58 52-90 78-98 24-7 48 5 72 34" stroke="${screen}" stroke-opacity=".4" stroke-width="8" stroke-linecap="round" fill="none"/>
    <rect x="184" y="280" width="32" height="42" fill="${body}"/>
    <rect x="130" y="322" width="140" height="14" rx="7" fill="${body}"/>`,
};

function svg({ shape, body, screen, tint }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img">
  <defs>
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${screen}" stop-opacity=".95"/>
      <stop offset="1" stop-color="${screen}" stop-opacity=".55"/>
    </linearGradient>
    <radialGradient id="bg" cx=".5" cy=".42" r=".62">
      <stop offset="0" stop-color="${tint}"/>
      <stop offset="1" stop-color="#ffffff"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <ellipse cx="200" cy="352" rx="122" ry="17" fill="#101014" fill-opacity=".07"/>
${shapes[shape](body, screen).trim()}
</svg>
`;
}

/** name -> visual recipe. One entry per product colourway. */
const IMAGES = {
  "iphone-17-pro-blue": { shape: "phone", body: "#2f4a72", screen: "#7c9fd6", tint: "#eaf0fa" },
  "iphone-17-pro-silver": { shape: "phone", body: "#c9ccd2", screen: "#8ea3c4", tint: "#f2f3f6" },
  "iphone-17-pro-black": { shape: "phone", body: "#24252a", screen: "#6d5fd0", tint: "#eeedf4" },
  "galaxy-s25-ultra-grey": { shape: "phone", body: "#6c7076", screen: "#5f7fd8", tint: "#eff1f4" },
  "galaxy-s25-ultra-black": { shape: "phone", body: "#1d1e22", screen: "#4f6ad2", tint: "#ecedf2" },
  "oneplus-13-ocean": { shape: "phone", body: "#123a5c", screen: "#57a7d8", tint: "#e8f2f9" },
  "oneplus-13-dawn": { shape: "phone", body: "#e6ddd0", screen: "#c9a97e", tint: "#faf6f0" },
  "macbook-air-m4-midnight": { shape: "laptop", body: "#2b3242", screen: "#6f7dd4", tint: "#eef0f7" },
  "macbook-air-m4-starlight": { shape: "laptop", body: "#dfd7c8", screen: "#b9a98d", tint: "#faf7f1" },
  "dell-xps-14-platinum": { shape: "laptop", body: "#c2c6cc", screen: "#7a8dc6", tint: "#f1f3f6" },
  "dell-xps-14-graphite": { shape: "laptop", body: "#33363c", screen: "#5f6fbb", tint: "#eceef3" },
  "sony-xm6-black": { shape: "headphone", body: "#26272c", screen: "#26272c", tint: "#eeeef3" },
  "sony-xm6-silver": { shape: "headphone", body: "#cfd2d8", screen: "#cfd2d8", tint: "#f4f5f8" },
  "airpods-pro-3-white": { shape: "earbuds", body: "#f0f1f4", screen: "#f0f1f4", tint: "#f3f4f8" },
  "apple-watch-11-black": { shape: "watch", body: "#212227", screen: "#6d5fd0", tint: "#eeedf4" },
  "apple-watch-11-silver": { shape: "watch", body: "#ccd0d6", screen: "#5f8ad0", tint: "#f1f3f7" },
  "galaxy-watch-8-graphite": { shape: "watch", body: "#33353b", screen: "#4f9ad2", tint: "#edf1f5" },
  "galaxy-watch-8-cream": { shape: "watch", body: "#e4dccf", screen: "#7fb2d8", tint: "#f9f6f0" },
  "samsung-oled-tv-55": { shape: "tv", body: "#2a2c31", screen: "#6a53c9", tint: "#efedf6" },
};

await mkdir(OUT_DIR, { recursive: true });

await Promise.all(
  Object.entries(IMAGES).map(([name, recipe]) =>
    writeFile(resolve(OUT_DIR, `${name}.svg`), svg(recipe), "utf8"),
  ),
);

console.log(`Wrote ${Object.keys(IMAGES).length} product images to public/products`);
