import { mkdir, writeFile, readFile } from 'node:fs/promises';

const OUT = 'public/images/heroes';
const payload = JSON.parse(await readFile('public/data/heroes.json', 'utf-8'));
await mkdir(OUT, { recursive: true });

let ok = 0;
let failed = 0;

for (const hero of payload.data) {
  if (!hero.thumbnailUrl) continue;
  try {
    const response = await fetch(hero.thumbnailUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(`${OUT}/${hero.slug}.png`, buffer);
    ok += 1;
  } catch (error) {
    failed += 1;
    console.warn(`실패 ${hero.slug}:`, error.message);
  }
}

console.log(`완료 ${ok}개 / 실패 ${failed}개 → ${OUT}`);