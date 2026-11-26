#!/usr/bin/env node
/**
 * Guards against shipping placeholder content. Fails (exit 1) while
 * src/content/status.ts has PLACEHOLDER_CONTENT = true or any "// PLACEHOLDER" /
 * "// CONFIRM" marker remains in src/. Run in CI before a production deploy:
 *
 *   pnpm check:content
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const hits = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name)) {
      fs.readFileSync(p, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/\/\/ (PLACEHOLDER|CONFIRM)/.test(line)) hits.push(`${path.relative(root, p)}:${i + 1}  ${line.trim().slice(0, 110)}`);
        });
    }
  }
};
walk(path.join(root, 'src'));
const flag = /PLACEHOLDER_CONTENT = true/.test(fs.readFileSync(path.join(root, 'src/content/status.ts'), 'utf8'));

if (!hits.length && !flag) {
  console.log('✓ No placeholder content. Safe to ship.');
  process.exit(0);
}
console.log(`✗ Placeholder content remains (${hits.length} markers${flag ? ', PLACEHOLDER_CONTENT = true' : ''}):\n`);
hits.forEach((h) => console.log('  ' + h));
console.log('\nReplace them (see docs/TODO-real-content.md), then set PLACEHOLDER_CONTENT = false.');
process.exit(1);
