// Post-build: rewrite root-absolute URLs in the static export so the pages
// work when opened directly from disk (file://), e.g. by double-clicking
// out/index.html. Next.js emits absolute paths like /_next/... and /images/...
// which only resolve from a web-server root; under file:// they point at the
// drive root and break. We rewrite them to be relative to each HTML file.
//
// Because this export is a single top-level page (out/index.html), every HTML
// file sits at the root of out/, so "relative to the file" == "./".
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath decodes %20 (spaces) and strips the leading slash on Windows,
// so this works even when the project path contains spaces.
const OUT_DIR = fileURLToPath(new URL("../out/", import.meta.url));

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (name.endsWith(".html")) files.push(full);
  }
  return files;
}

// Depth of an html file relative to out/ determines the "../" prefix needed.
function prefixFor(fileAbs) {
  const rel = fileAbs.slice(OUT_DIR.length);
  const depth = rel.split(/[\\/]/).length - 1; // number of dir segments
  return depth === 0 ? "./" : "../".repeat(depth);
}

let changed = 0;
for (const file of walk(OUT_DIR)) {
  const prefix = prefixFor(file);
  let html = readFileSync(file, "utf8");
  const before = html;

  // Rewrite href="/..." and src="/..." (but not "//" protocol-relative URLs)
  // to be relative to this file's location in the export.
  html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${prefix}`);
  // Same for url(/...) inside inline styles, if any.
  html = html.replace(/url\(\/(?!\/)/g, `url(${prefix}`);

  if (html !== before) {
    writeFileSync(file, html, "utf8");
    changed++;
  }
}

console.log(`relativize: rewrote ${changed} HTML file(s) in out/ for file:// use`);
