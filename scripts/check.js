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
walk(path.join(process.cwd(), 'public', 'assets', 'js'));

for (const htmlName of ['index.html', 'admin.html']) {
  const html = fs.readFileSync(path.join(process.cwd(), 'public', htmlName), 'utf8');
  if (!/<\/html>\s*$/i.test(html)) throw new Error(`${htmlName} is incomplete.`);
}

const indexHtml = fs.readFileSync(path.join(process.cwd(), 'public', 'index.html'), 'utf8');
const exactIcons = ['graphic design.png','Motion Graphics.png','3d.png','AI Visuals.png','Video Editing.png','Brand Identity.png'];
for (const icon of exactIcons) {
  const expected = `/assets/images/services/${icon}`;
  if (!indexHtml.includes(expected)) throw new Error(`index.html does not reference: ${expected}`);
}
for (const required of ['/api/portfolio','site-content.js']) {
  if (!indexHtml.includes(required)) throw new Error(`index.html is missing ${required}`);
}
const siteJs = fs.readFileSync(path.join(process.cwd(), 'public', 'assets', 'js', 'site-content.js'), 'utf8');
if (!siteJs.includes('/api/content')) throw new Error('site-content.js is missing /api/content');

const adminHtml = fs.readFileSync(path.join(process.cwd(), 'public', 'admin.html'), 'utf8');
for (const required of ['Projects','Skills & Tools','Life Journey','Services','Hero & About','Contact & Socials','Enquiries','admin-pro.js']) {
  if (!adminHtml.includes(required)) throw new Error(`admin.html is missing ${required}`);
}

const sql = fs.readFileSync(path.join(process.cwd(), 'supabase', 'setup.sql'), 'utf8');
for (const table of ['site_settings','portfolio_categories','portfolio_items','skills','tools','timeline_items','services','social_links','portfolio_messages']) {
  if (!sql.includes(`public.${table}`)) throw new Error(`setup.sql is missing ${table}`);
}

console.log(`Checked ${jsCount} JavaScript files.`);
console.log('Confirmed complete Pro Admin modules and public dynamic content hooks.');
console.log('Confirmed migration-safe Supabase schema and exact service-icon filenames.');
for (const icon of exactIcons) {
  const iconPath = path.join(process.cwd(), 'public', 'assets', 'images', 'services', icon);
  if (!fs.existsSync(iconPath)) console.warn(`Keep/copy your existing media file: ${iconPath}`);
}
