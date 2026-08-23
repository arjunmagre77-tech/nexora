import { createRequire } from 'module';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);
const l = require('./node_modules/lucide-react');
const icons = Object.keys(l);
const dir = './src/components';
const files = readdirSync(dir);

for (const f of files) {
  const content = readFileSync(join(dir, f), 'utf8');

  // Collect all imported names from lucide-react (multi-line safe)
  const importedNames = new Set();
  const importRe = /import\s*\{([\s\S]+?)\}\s*from\s*["']lucide-react["']/g;
  let im;
  while ((im = importRe.exec(content)) !== null) {
    const names = im[1].split(',').map(s => {
      const parts = s.trim().split(/\s+as\s+/);
      // If aliased: "FooIcon as Foo" -> use alias "Foo"
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }).filter(n => /^[A-Za-z][A-Za-z0-9]*$/.test(n));
    names.forEach(n => importedNames.add(n));
  }

  // Also collect const aliases (e.g. "const Github = Terminal;")
  const aliasRe = /^const\s+([A-Z][A-Za-z0-9]*)\s*=/gm;
  let am;
  while ((am = aliasRe.exec(content)) !== null) {
    importedNames.add(am[1]);
  }

  // Find all JSX usages: <IconName className or <IconName />
  const usageRe = /<([A-Z][A-Za-z0-9]+)[\s/>]/g;
  let um;
  while ((um = usageRe.exec(content)) !== null) {
    const name = um[1];
    // Skip known React/framer/Next components (PascalCase but not lucide)
    if (['AnimatePresence', 'React'].includes(name)) continue;
    if (importedNames.has(name)) continue;
    // Only flag if it's a known lucide icon
    if (icons.includes(name)) {
      console.log(`${f}: USED but not imported: ${name}`);
    }
  }
}
console.log('Audit complete.');
