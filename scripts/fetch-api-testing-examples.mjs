// Pulls one illustrative `test(...)` block per manifest entry from the
// public API-testing-sample repo and bakes it into apiTesting.generated.ts,
// so the portfolio's "API Testing" section shows a real, current snippet
// instead of a hand-copied (and easily stale) paste — trimmed to a single
// case per file rather than the whole spec, to keep the section scannable.
//
// Run manually (npm run fetch:api-testing) whenever that repo changes, and
// opportunistically as part of `npm run build`. Non-fatal on any failure —
// mirrors fetch-fonts.mjs's fallback behavior — so a network hiccup, a
// renamed file, or a retitled test never breaks the build; it just leaves
// the previously committed generated file in place.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.resolve(__dirname, '../src/content/apiTestingManifest.json');
const OUTPUT_PATH = path.resolve(__dirname, '../src/content/apiTesting.generated.ts');
const REPO = 'WRTHY/API-testing-sample';
const BRANCH = 'master';

// Finds every top-level `test('title', ...)` call in a Playwright spec file
// and returns each one's title plus its exact source slice (the full call,
// including the trailing `;`). Works by locating each `test(` invocation
// (the `\btest\(` boundary excludes `test.describe(`), reading its title as
// a plain quoted string literal, then walking forward counting paren depth
// to find that call's own matching close — good enough for the
// consistently-formatted, single-quoted spec files this repo writes, not a
// general JS/TS parser.
function extractTestBlocks(source) {
  const blocks = [];
  const callRegex = /\btest\(\s*(['"`])/g;
  let match;

  while ((match = callRegex.exec(source))) {
    const callStart = match.index;
    const openParen = source.indexOf('(', callStart);
    const quote = match[1];
    let i = openParen + 1;
    while (/\s/.test(source[i])) i++;
    if (source[i] !== quote) {
      callRegex.lastIndex = openParen + 1;
      continue;
    }

    let titleEnd = i + 1;
    while (source[titleEnd] !== quote || source[titleEnd - 1] === '\\') titleEnd++;
    const title = source.slice(i + 1, titleEnd);

    let depth = 0;
    let j = openParen;
    for (; j < source.length; j++) {
      if (source[j] === '(') depth++;
      else if (source[j] === ')') {
        depth--;
        if (depth === 0) break;
      }
    }
    let end = j + 1;
    if (source[end] === ';') end++;

    // How far this call is indented in the original file (it's nested
    // inside a test.describe block) — stripped back out below so the
    // extracted snippet reads as a natural, top-level statement rather
    // than starting flush-left while its body stays indented one level in.
    const lineStart = source.lastIndexOf('\n', callStart) + 1;
    const indent = callStart - lineStart;

    blocks.push({ title, block: source.slice(callStart, end), indent });
    callRegex.lastIndex = end;
  }

  return blocks;
}

function dedent(block, indent) {
  if (indent === 0) return block;
  const prefix = ' '.repeat(indent);
  return block
    .split('\n')
    .map((line, index) => (index === 0 || !line.startsWith(prefix) ? line : line.slice(indent)))
    .join('\n');
}

function extractImportLine(source) {
  const match = source.match(/^import .+from ['"]@playwright\/test['"];?$/m);
  return match ? match[0] : null;
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
const examples = [];

for (const entry of manifest) {
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${entry.repoPath}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'portfolio-usher-build' } }).catch(
    (err) => {
      console.warn(`[fetch-api-testing-examples] ${entry.repoPath}: ${err.message}`);
      return null;
    },
  );

  if (!res || !res.ok) {
    console.warn(
      `[fetch-api-testing-examples] Failed to fetch ${entry.repoPath}` +
        `${res ? ` (${res.status} ${res.statusText})` : ''} — leaving apiTesting.generated.ts as-is.`,
    );
    process.exit(0);
  }

  const source = await res.text();
  const importLine = extractImportLine(source);
  const testBlock = extractTestBlocks(source).find((b) => b.title === entry.testTitle);

  if (!importLine || !testBlock) {
    console.warn(
      `[fetch-api-testing-examples] Couldn't find ${
        importLine ? `test "${entry.testTitle}"` : 'a @playwright/test import'
      } in ${entry.repoPath} — leaving apiTesting.generated.ts as-is. ` +
        'Did the test get renamed? Update testTitle in apiTestingManifest.json.',
    );
    process.exit(0);
  }

  const code = `${importLine}\n\n${dedent(testBlock.block, testBlock.indent)}\n`;
  examples.push({
    id: entry.id,
    tag: entry.tag,
    title: entry.title,
    description: entry.description,
    filename: entry.repoPath,
    language: 'typescript',
    code,
  });
  console.log(`[fetch-api-testing-examples] Extracted "${entry.testTitle}" from ${entry.repoPath}`);
}

const generatedOn = new Date().toISOString().slice(0, 10);
const output = `// AUTO-GENERATED by scripts/fetch-api-testing-examples.mjs — do not hand-edit.
// Each example is one test(), extracted verbatim from
// https://github.com/${REPO}/tree/${BRANCH}, refreshed ${generatedOn}.
// To add/remove/retitle an example, edit src/content/apiTestingManifest.json
// and run \`npm run fetch:api-testing\`.

import type { ApiTestingExample } from './apiTesting'

export const apiTestingExamples: readonly ApiTestingExample[] = ${JSON.stringify(examples, null, 2)} as const
`;

writeFileSync(OUTPUT_PATH, output);
console.log(
  `[fetch-api-testing-examples] Wrote ${examples.length} example(s) to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
);
