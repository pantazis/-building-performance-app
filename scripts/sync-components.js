#!/usr/bin/env node
/**
 * Sync changed components from building-performance-app/prorotype.html to /view HTML files.
 *
 * Usage:
 *   node scripts/sync-components.js --dry-run
 *   node scripts/sync-components.js --apply
 *   node scripts/sync-components.js --apply --component breadcrumbs --component login-form
 *   node scripts/sync-components.js --apply --all-components
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const PROTOTYPE_PATH = path.join(ROOT, "building-performance-app", "prorotype.html");
const VIEW_DIR = path.join(ROOT, "view");

function parseArgs(argv) {
  const args = {
    apply: false,
    dryRun: false,
    components: [],
    allComponents: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--apply") args.apply = true;
    else if (token === "--dry-run") args.dryRun = true;
    else if (token === "--all-components") args.allComponents = true;
    else if (token === "--component") {
      const value = argv[i + 1];
      if (!value) throw new Error("Missing value after --component");
      args.components.push(value.trim());
      i++;
    }
  }

  if (!args.apply && !args.dryRun) {
    args.dryRun = true;
  }

  return args;
}

function title(text) {
  console.log(`\n=== ${text} ===`);
}

function getPrototypeContent() {
  if (!fs.existsSync(PROTOTYPE_PATH)) {
    throw new Error(`Prototype not found at ${PROTOTYPE_PATH}`);
  }
  return fs.readFileSync(PROTOTYPE_PATH, "utf8");
}

function getChangedComponentsViaGitDiff() {
  let diff = "";
  try {
    diff = execSync(`git diff -- "${PROTOTYPE_PATH}"`, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
  } catch (err) {
    diff = `${err.stdout || ""}\n${err.stderr || ""}`;
  }

  const regex = /(?:^|\n)[+-].*<!--\s*COMPONENT:\s*([a-z0-9-]+)\s*-->/gi;
  const set = new Set();
  let m;
  while ((m = regex.exec(diff)) !== null) {
    set.add(m[1]);
  }
  return [...set];
}

function extractComponentBlocks(html) {
  const lines = html.split(/\r?\n/);
  const blocks = new Map();

  const markerRegex = /^\s*<!--\s*COMPONENT:\s*([a-z0-9-]+)\s*-->\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const markerMatch = lines[i].match(markerRegex);
    if (!markerMatch) continue;

    const name = markerMatch[1];
    let end = i + 1;

    while (end < lines.length && !markerRegex.test(lines[end])) {
      end++;
    }

    const block = lines.slice(i, end).join("\n");
    blocks.set(name, block);
  }

  return blocks;
}

function extractCssComponentBlocks(html) {
  const cssBlocks = new Map();
  const cssRegex = /\/\*\s*COMPONENT:\s*([a-z0-9-]+)\s*\*\/([\s\S]*?)(?=\/\*\s*COMPONENT:|$)/gi;
  let m;

  while ((m = cssRegex.exec(html)) !== null) {
    const name = m[1];
    const full = `/* COMPONENT: ${name} */${m[2]}`.trimEnd();
    cssBlocks.set(name, full);
  }

  return cssBlocks;
}

function getHtmlFilesRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const out = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...getHtmlFilesRecursive(full));
    } else if (entry.isFile() && full.toLowerCase().endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function replaceComponentBlockInFile(content, componentName, replacementBlock) {
  const escaped = componentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `(^|\\n)\\s*<!--\\s*COMPONENT:\\s*${escaped}\\s*-->[\\s\\S]*?(?=(?:\\n\\s*<!--\\s*COMPONENT:)|$)`,
    "i"
  );

  if (!regex.test(content)) {
    return { changed: false, content };
  }

  const nextContent = content.replace(regex, (match, leading) => `${leading}${replacementBlock}`);
  return { changed: nextContent !== content, content: nextContent };
}

function ensureCssBlock(content, componentName, cssBlock) {
  if (!cssBlock) return { changed: false, content };

  const markerRegex = new RegExp(`/\\*\\s*COMPONENT:\\s*${componentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\*/`, "i");
  if (markerRegex.test(content)) return { changed: false, content };

  const styleCloseIndex = content.lastIndexOf("</style>");
  if (styleCloseIndex === -1) {
    return { changed: false, content };
  }

  const insertion = `\n\n${cssBlock}\n`;
  const next = content.slice(0, styleCloseIndex) + insertion + content.slice(styleCloseIndex);
  return { changed: true, content: next };
}

function main() {
  const args = parseArgs(process.argv);
  const prototype = getPrototypeContent();
  const componentBlocks = extractComponentBlocks(prototype);
  const cssBlocks = extractCssComponentBlocks(prototype);
  const viewFiles = getHtmlFilesRecursive(VIEW_DIR);

  if (viewFiles.length === 0) {
    console.log("No /view HTML files found. Nothing to sync yet.");
    return;
  }

  let targets = [];
  if (args.allComponents) {
    targets = [...componentBlocks.keys()];
  } else if (args.components.length > 0) {
    targets = args.components;
  } else {
    targets = getChangedComponentsViaGitDiff();
  }

  targets = [...new Set(targets)];

  if (targets.length === 0) {
    console.log("No changed components detected (git diff) and none passed with --component.");
    return;
  }

  title(args.apply ? "APPLY MODE" : "DRY-RUN MODE");
  console.log(`Target components: ${targets.join(", ")}`);

  let changedFiles = 0;

  for (const filePath of viewFiles) {
    let content = fs.readFileSync(filePath, "utf8");
    let fileChanged = false;
    const updates = [];

    for (const comp of targets) {
      const protoBlock = componentBlocks.get(comp);
      if (!protoBlock) continue;

      const replaced = replaceComponentBlockInFile(content, comp, protoBlock);
      if (replaced.changed) {
        content = replaced.content;
        fileChanged = true;
        updates.push(`HTML:${comp}`);
      }

      const cssEnsured = ensureCssBlock(content, comp, cssBlocks.get(comp));
      if (cssEnsured.changed) {
        content = cssEnsured.content;
        fileChanged = true;
        updates.push(`CSS:${comp}`);
      }
    }

    if (fileChanged) {
      changedFiles++;
      const rel = path.relative(ROOT, filePath);
      console.log(`- ${rel} -> ${updates.join(", ")}`);
      if (args.apply) {
        fs.writeFileSync(filePath, content, "utf8");
      }
    }
  }

  if (changedFiles === 0) {
    console.log("No view files required updates for selected components.");
  } else {
    console.log(`\nUpdated files: ${changedFiles}`);
    if (!args.apply) {
      console.log("Run again with --apply to write changes.");
    }
  }
}

main();
