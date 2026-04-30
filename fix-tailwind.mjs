import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'src', 'components');

const fixes = [
  [/py-1\.5/g, 'py-2'],
  [/py-2\.5/g, 'py-2'],
  [/p-1\.5/g, 'p-2'],
  [/w-3\.5/g, 'w-4'],
  [/h-3\.5/g, 'h-4'],
  [/gap-1\.5/g, 'gap-2']
];

function fixFile(fp) {
  let c = fs.readFileSync(fp, 'utf8');
  let m = false;
  fixes.forEach(([f, t]) => {
    if (f.test(c)) { c = c.replace(f, t); m = true; }
  });
  if (m) { fs.writeFileSync(fp, c, 'utf8'); console.log('Fix: ' + fp); }
}

function walk(d) {
  fs.readdirSync(d).forEach(f => {
    const fp = path.join(d, f);
    const s = fs.statSync(fp);
    if (s.isDirectory()) walk(fp);
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) fixFile(fp);
  });
}

walk(baseDir);
console.log('Done');
