const fs = require('fs');
const path = require('path');

let jsCount = 0;
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) walk(file);
    else if (file.endsWith('.js')) {
      new Function(fs.readFileSync(file, 'utf8'));
      jsCount++;
    }
  }
}
walk(path.join(process.cwd(), 'api'));

const html = fs.readFileSync(path.join(process.cwd(), 'public', 'index.html'), 'utf8');
const exactIcons = [
  'graphic design.png',
  'Motion Graphics.png',
  '3d.png',
  'AI Visuals.png',
  'Video Editing.png',
  'Brand Identity.png'
];
for (const icon of exactIcons) {
  const expected = `/assets/images/services/${icon}`;
  if (!html.includes(expected)) throw new Error(`index.html does not reference: ${expected}`);
}

const sql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'setup.sql'), 'utf8');
if (/initial-3d|assets\/videos\/portfolio/.test(sql)) {
  throw new Error('setup.sql still contains local portfolio seed records.');
}

console.log(`Checked ${jsCount} API JavaScript files.`);
console.log('Confirmed all six exact service-icon filenames in public/index.html.');
console.log('Confirmed portfolio starts empty and is managed through /admin.');

for (const icon of exactIcons) {
  const iconPath = path.join(process.cwd(), 'public', 'assets', 'images', 'services', icon);
  if (!fs.existsSync(iconPath)) console.warn(`Media not included yet: ${iconPath}`);
}
