// Pulls the licensed TBJ-Orcherum webfont into public/fonts/ before build.
// The font can't be committed to this public repo (license restriction — see
// .gitignore), so it lives in the private WRTHY/personal-assets repo instead
// and is fetched here using a read-only token.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST_DIR = path.resolve(__dirname, '../public/fonts');
const FILES = ['TBJ-Orcherum.woff2', 'TBJ-Orcherum.woff'];
const REPO = process.env.FONT_ASSETS_REPO || 'WRTHY/personal-assets';
const TOKEN = process.env.FONT_ASSETS_TOKEN;

const missing = FILES.filter((f) => !existsSync(path.join(DEST_DIR, f)));

if (missing.length === 0) {
  console.log('[fetch-fonts] TBJ-Orcherum already present, skipping fetch.');
  process.exit(0);
}

if (!TOKEN) {
  console.warn(
    `[fetch-fonts] Missing ${missing.join(', ')} and no FONT_ASSETS_TOKEN set — ` +
      'building without the custom heading font (falls back to system-ui).'
  );
  process.exit(0);
}

mkdirSync(DEST_DIR, { recursive: true });

for (const file of missing) {
  const url = `https://api.github.com/repos/${REPO}/contents/TBJ-Orcherum/${file}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github.raw',
      'User-Agent': 'portfolio-usher-build',
    },
  });

  if (!res.ok) {
    console.warn(`[fetch-fonts] Failed to fetch ${file}: ${res.status} ${res.statusText}`);
    continue;
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  writeFileSync(path.join(DEST_DIR, file), bytes);
  console.log(`[fetch-fonts] Fetched ${file} (${bytes.length} bytes)`);
}
