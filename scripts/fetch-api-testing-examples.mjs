// Pulls one illustrative Playwright `test(...)` block AND its matching
// Postman request (+ Tests script) per manifest entry from the public
// API-testing-sample repo and bakes them into apiTesting.generated.ts, so
// the portfolio's "API Testing" section shows real, current snippets
// instead of a hand-copied (and easily stale) paste — trimmed to a single
// case per entry rather than the whole spec/collection, to keep the
// section scannable.
//
// Run manually (npm run fetch:api-testing) whenever that repo changes, and
// opportunistically as part of `npm run build`. Non-fatal on any failure —
// mirrors fetch-fonts.mjs's fallback behavior — so a network hiccup, a
// renamed file/test/request, or a retitled entry never breaks the build; it
// just leaves the previously committed generated file in place.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.resolve(__dirname, '../src/content/apiTestingManifest.json');
const OUTPUT_PATH = path.resolve(__dirname, '../src/content/apiTesting.generated.ts');
const REPO = 'WRTHY/API-testing-sample';
const BRANCH = 'master';
const POSTMAN_COLLECTION_PATH = 'postman/reqres-api-collection.json';

function fail(message) {
  console.warn(`[fetch-api-testing-examples] ${message} — leaving apiTesting.generated.ts as-is.`);
  process.exit(0);
}

async function fetchRepoFile(repoPath) {
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${repoPath}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'portfolio-usher-build' } }).catch(
    (err) => {
      console.warn(`[fetch-api-testing-examples] ${repoPath}: ${err.message}`);
      return null;
    },
  );

  if (!res || !res.ok) {
    fail(`Failed to fetch ${repoPath}${res ? ` (${res.status} ${res.statusText})` : ''}`);
  }

  return res.text();
}

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

// Finds every top-level `const NAME = ...;` declaration in a spec file
// (single-line only — good enough for this repo's own style, e.g.
// `const endpointUnderTest = "unknown";` in resources.spec.ts) and returns
// the ones a given extracted test block actually references by name, so a
// test that reads a shared constant defined outside its own body doesn't
// get pulled out as a broken snippet with an undefined variable in it.
function extractReferencedConsts(source, block) {
  const declRegex = /^const\s+(\w+)\s*=.+;$/gm;
  const consts = [];
  let match;
  while ((match = declRegex.exec(source))) {
    const [decl, name] = [match[0], match[1]];
    if (new RegExp(`\\b${name}\\b`).test(block)) consts.push(decl);
  }
  return consts;
}

// Walks a Postman collection's nested `item` folders following `path`
// (e.g. ["Users", "Get single user - existing id (2)"]) and returns the
// leaf request item, or null if any segment along the way isn't found.
function findPostmanItem(items, path) {
  let level = items;
  let found = null;
  for (const name of path) {
    found = level?.find((entry) => entry.name === name) ?? null;
    if (!found) return null;
    level = found.item;
  }
  return found;
}

// Renders a Postman request + its Tests script as a single readable,
// syntactically-valid-JS snippet: the request line as a comment (Postman's
// own request bar has no "language" of its own to borrow), then a blank
// line, then the pm.test(...) calls verbatim — i.e. exactly what the
// Postman "Tests" tab shows.
function formatPostmanSnippet(item) {
  const { request, event } = item;
  const lines = [`// ${request.method} ${request.url.raw}`];
  for (const header of request.header ?? []) {
    lines.push(`// ${header.key}: ${header.value}`);
  }
  if (request.body?.mode === 'raw') {
    lines.push('//', ...request.body.raw.split('\n').map((line) => `// ${line}`));
  }

  const testScript = (event ?? []).find((entry) => entry.listen === 'test');
  const testCode = testScript ? testScript.script.exec.join('\n') : '';

  return `${lines.join('\n')}\n\n${testCode}\n`;
}

// Same request-line-as-comment + Tests-script shape as formatPostmanSnippet
// above, for a manifest entry that gives the Postman side directly (see
// `postman.inline` in apiTestingManifest.json) instead of a path into the
// collection — used for content that hasn't been pushed to
// postman/reqres-api-collection.json yet. Flip the manifest entry back to
// a `path` once it has, so this goes through the real fetch+lookup like
// every other example instead.
function formatInlinePostmanSnippet(inline) {
  return `// ${inline.method} ${inline.url}\n\n${inline.code}`;
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
const specCache = new Map();
const examples = [];

// Only fetched if at least one manifest entry still uses a `path` lookup —
// entries that are all `inline` right now (see apiTestingManifest.json)
// shouldn't force a network call for a file nothing needs yet.
let postmanCollection = null;

for (const entry of manifest) {
  if (!specCache.has(entry.playwright.repoPath)) {
    specCache.set(entry.playwright.repoPath, await fetchRepoFile(entry.playwright.repoPath));
  }
  const source = specCache.get(entry.playwright.repoPath);
  const importLine = extractImportLine(source);
  const testBlock = extractTestBlocks(source).find((b) => b.title === entry.playwright.testTitle);

  if (!importLine || !testBlock) {
    fail(
      `Couldn't find ${
        importLine ? `test "${entry.playwright.testTitle}"` : 'a @playwright/test import'
      } in ${entry.playwright.repoPath}. Did the test get renamed? Update testTitle in apiTestingManifest.json.`,
    );
  }

  const referencedConsts = extractReferencedConsts(source, testBlock.block);
  const playwrightCode = `${importLine}\n\n${[...referencedConsts, dedent(testBlock.block, testBlock.indent)].join('\n\n')}\n`;

  let postmanFilename;
  let postmanCode;
  let postmanLoggedSource;

  if (entry.postman.inline) {
    postmanFilename = POSTMAN_COLLECTION_PATH;
    postmanCode = formatInlinePostmanSnippet(entry.postman.inline);
    postmanLoggedSource = `inline (${entry.postman.inline.note ?? 'not yet in the repo'})`;
  } else {
    if (!postmanCollection) {
      postmanCollection = JSON.parse(await fetchRepoFile(POSTMAN_COLLECTION_PATH));
    }
    const postmanItem = findPostmanItem(postmanCollection.item, entry.postman.path);
    if (!postmanItem) {
      fail(
        `Couldn't find Postman request "${entry.postman.path.join(' > ')}" in ${POSTMAN_COLLECTION_PATH}. ` +
          'Did it get renamed or moved? Update path in apiTestingManifest.json.',
      );
    }
    postmanFilename = POSTMAN_COLLECTION_PATH;
    postmanCode = formatPostmanSnippet(postmanItem);
    postmanLoggedSource = `"${entry.postman.path.join(' > ')}" from ${POSTMAN_COLLECTION_PATH}`;
  }

  examples.push({
    id: entry.id,
    tag: entry.tag,
    title: entry.title,
    description: entry.description,
    playwright: {
      filename: entry.playwright.repoPath,
      language: 'typescript',
      code: playwrightCode,
    },
    postman: {
      filename: postmanFilename,
      language: 'javascript',
      code: postmanCode,
    },
  });
  console.log(
    `[fetch-api-testing-examples] Extracted "${entry.playwright.testTitle}" from ${entry.playwright.repoPath} ` +
      `and ${postmanLoggedSource}`,
  );
}

const generatedOn = new Date().toISOString().slice(0, 10);
const output = `// AUTO-GENERATED by scripts/fetch-api-testing-examples.mjs — do not hand-edit.
// Each example pairs one Playwright test() with its matching Postman
// request + Tests script, extracted verbatim from
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
