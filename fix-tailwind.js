var fs = require('fs');

var fixes = [
  [/py-1\.5/g, 'py-2'],
  [/py-2\.5/g, 'py-2'],
  [/p-1\.5/g, 'p-2'],
  [/w-3\.5/g, 'w-4'],
  [/h-3\.5/g, 'h-4'],
  [/gap-1\.5/g, 'gap-2']
];

function fixFile(fp) {
  var c = fs.readFileSync(fp, 'utf8');
  var m = false;
  fixes.forEach(function(fix) {
    if (fix[0].test(c)) { c = c.replace(fix[0], fix[1]); m = true; }
  });
  if (m) { fs.writeFileSync(fp, c, 'utf8'); console.log('Fix: ' + fp); }
}

function walk(d) {
  fs.readdirSync(d).forEach(function(f) {
    var fp = d + '/' + f;
    var s = fs.statSync(fp);
    if (s.isDirectory()) walk(fp);
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) fixFile(fp);
  });
}

walk('src/components');
console.log('Done');
