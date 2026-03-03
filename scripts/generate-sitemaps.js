#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const langs = ['en','ja','zh-cn','zh-tw','es','fr','de','pt-br','hi','ar','ru','id','tr','it','vi','th','nl'];
const tools = ['roulette','luckydraw','ladder','coinflip','dice'];
const legalPages = ['privacy','terms','contact'];
const today = new Date().toISOString().slice(0, 10);

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content, 'utf8');
}

const main = [];
main.push('<?xml version="1.0" encoding="UTF-8"?>');
main.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');
for (const tool of tools) {
  main.push('  <url>');
  main.push(`    <loc>https://randomly-pick.com/${tool}/</loc>`);
  main.push(`    <lastmod>${today}</lastmod>`);
  main.push('    <changefreq>daily</changefreq>');
  main.push('    <priority>0.9</priority>');
  main.push(`    <xhtml:link rel="alternate" hreflang="ko" href="https://randomly-pick.com/${tool}/"/>`);
  for (const lang of langs) {
    main.push(`    <xhtml:link rel="alternate" hreflang="${lang}" href="https://randomly-pick.com/${lang}/${tool}/"/>`);
  }
  main.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="https://randomly-pick.com/en/${tool}/"/>`);
  main.push('  </url>');
}
for (const page of legalPages) {
  main.push('  <url>');
  main.push(`    <loc>https://randomly-pick.com/${page}/</loc>`);
  main.push(`    <lastmod>${today}</lastmod>`);
  main.push('    <changefreq>monthly</changefreq>');
  main.push('    <priority>0.5</priority>');
  main.push('  </url>');
}
main.push('</urlset>');

const locales = [];
locales.push('<?xml version="1.0" encoding="UTF-8"?>');
locales.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
for (const lang of langs) {
  locales.push('  <url>');
  locales.push(`    <loc>https://randomly-pick.com/${lang}/</loc>`);
  locales.push(`    <lastmod>${today}</lastmod>`);
  locales.push('    <changefreq>weekly</changefreq>');
  locales.push('    <priority>0.6</priority>');
  locales.push('  </url>');
  for (const tool of tools) {
    locales.push('  <url>');
    locales.push(`    <loc>https://randomly-pick.com/${lang}/${tool}/</loc>`);
    locales.push(`    <lastmod>${today}</lastmod>`);
    locales.push('    <changefreq>weekly</changefreq>');
    locales.push('    <priority>0.6</priority>');
    locales.push('  </url>');
  }
}
locales.push('</urlset>');

const index = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <sitemap>',
  '    <loc>https://randomly-pick.com/sitemap-main.xml</loc>',
  `    <lastmod>${today}</lastmod>`,
  '  </sitemap>',
  '  <sitemap>',
  '    <loc>https://randomly-pick.com/sitemap-locales.xml</loc>',
  `    <lastmod>${today}</lastmod>`,
  '  </sitemap>',
  '</sitemapindex>'
];

write('sitemap-main.xml', main.join('\n') + '\n');
write('sitemap-locales.xml', locales.join('\n') + '\n');
write('sitemap-index.xml', index.join('\n') + '\n');
write('sitemap.xml', index.join('\n') + '\n');

console.log('sitemaps generated:', today);
