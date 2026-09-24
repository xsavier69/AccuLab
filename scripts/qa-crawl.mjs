// Crawl interno de dist/: enlaces rotos, H1 único, jerarquía de encabezados, titles y descriptions
// únicos y con longitud correcta, alt en imágenes, JSON-LD válido (sintaxis), canonical = og:url,
// palabras en páginas de examen, similitud entre páginas y cadenas prohibidas.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = 'dist';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })(DIST);
const urlDe = (f) => { const r = '/' + path.relative(DIST, f).replace(/\.html$/, ''); return r === '/index' ? '/' : r; };
const existe = (u) => {
  const p = u.split('#')[0].split('?')[0];
  if (p === '/' ) return true;
  return fs.existsSync(path.join(DIST, p + '.html')) || (fs.existsSync(path.join(DIST, p)) && fs.statSync(path.join(DIST, p)).isFile());
};
const problemas = [], avisos = [];
const titles = new Map(), descs = new Map();
const textos = {};
const PROHIBIDO = [/100\s?%/, /Accu_lab/i, /\bAcculab\b/, /index\.html/, /vercel\.app/, /\[\[PENDIENTE/, /16 años/i, /garantizad/i, /Accu-Lab Clínico/];
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2705}\u{2714}\u{2728}]/u;

for (const f of files) {
  const url = urlDe(f);
  const html = fs.readFileSync(f, 'utf8');
  const doc = parse(html);
  const noindex = /noindex/.test(doc.querySelector('meta[name=robots]')?.getAttribute('content') || '');
  const P = (m) => problemas.push(`${url}: ${m}`);
  // H1 y jerarquía
  const hs = doc.querySelectorAll('h1,h2,h3,h4,h5,h6').map((h) => Number(h.tagName[1]));
  const h1 = hs.filter((n) => n === 1).length;
  if (h1 !== 1) P(`${h1} H1`);
  hs.forEach((n, i) => { if (i > 0 && n > hs[i - 1] + 1) P(`salto de encabezado h${hs[i - 1]} → h${n}`); });
  if (hs[0] !== 1) P('el primer encabezado no es H1');
  // Title / description
  const title = doc.querySelector('title')?.text.trim() || '';
  const desc = doc.querySelector('meta[name=description]')?.getAttribute('content') || '';
  if (!noindex) {
    if (title.length < 30 || title.length > 65) P(`title ${title.length} caracteres: "${title}"`);
    if (desc.length < 140 || desc.length > 155) P(`description ${desc.length} caracteres`);
    if (titles.has(title)) P(`title duplicado con ${titles.get(title)}`); titles.set(title, url);
    if (descs.has(desc)) P(`description duplicada con ${descs.get(desc)}`); descs.set(desc, url);
  }
  // Canonical y og:url
  const can = doc.querySelector('link[rel=canonical]')?.getAttribute('href');
  const og = doc.querySelector('meta[property="og:url"]')?.getAttribute('content');
  if (can !== og) P(`canonical (${can}) ≠ og:url (${og})`);
  if (!noindex && can !== `https://acculab.bio${url === '/' ? '/' : url}`) P(`canonical inesperado ${can}`);
  if (doc.querySelector('html')?.getAttribute('lang') !== 'es-EC') P('lang ≠ es-EC');
  for (const m of ['keywords']) if (doc.querySelector(`meta[name=${m}]`)) P(`meta ${m} presente`);
  if (doc.querySelector('meta[name="twitter:creator"]')) P('twitter:creator presente');
  // Imágenes
  doc.querySelectorAll('img').forEach((img) => { if (img.getAttribute('alt') == null) P(`img sin alt: ${img.getAttribute('src')}`); if (!img.getAttribute('width') || !img.getAttribute('height')) avisos.push(`${url}: img sin width/height ${img.getAttribute('src')}`); });
  // Enlaces internos
  doc.querySelectorAll('a[href]').forEach((a) => {
    const h = a.getAttribute('href');
    if (/^(https?:|mailto:|tel:)/.test(h)) { if (/acculab\.bio/.test(h) && !/^https:\/\/acculab\.bio/.test(h)) P(`enlace absoluto raro ${h}`); return; }
    if (h.startsWith('#')) { if (h.length > 1 && !doc.querySelector(`[id="${h.slice(1)}"]`)) P(`ancla rota ${h}`); return; }
    if (!h.startsWith('/')) P(`enlace relativo ${h}`);
    else if (!existe(h)) P(`enlace roto ${h}`);
    if (/\.html/.test(h)) P(`enlace con .html ${h}`);
    const txt = a.text.trim().toLowerCase();
    if (/^(clic aqu[ií]|aqu[ií]|click here|ver m[aá]s)$/.test(txt)) P(`anchor poco descriptivo "${txt}"`);
    const hash = h.split('#')[1]; const base = h.split('#')[0].split('?')[0];
    if (hash && existe(base)) { const target = parse(fs.readFileSync(base === '/' ? `${DIST}/index.html` : `${DIST}${base}.html`, 'utf8')); if (!target.querySelector(`[id="${hash}"]`)) P(`ancla rota ${h}`); }
  });
  // JSON-LD
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((s) => { try { JSON.parse(s.text); } catch { P('JSON-LD inválido'); } });
  // Cadenas prohibidas (texto visible + atributos, sin URLs de la marca)
  const visible = doc.querySelector('body').text + ' ' + (doc.querySelector('title')?.text || '') + ' ' + desc;
  for (const re of PROHIBIDO) if (re.test(visible) || (re.source.includes('vercel') && re.test(html)) || (re.source.includes('index') && re.test(html))) P(`contiene ${re}`);
  if (EMOJI.test(visible)) P('contiene emoji');
  // Texto principal para páginas de examen
  if (url.startsWith('/examenes/')) {
    const main = doc.querySelector('main').clone();
    main.querySelectorAll('nav, .cta-band, script').forEach((n) => n.remove());
    const words = main.text.replace(/\s+/g, ' ').trim().split(' ').filter((w) => /[a-záéíóúñ0-9]/i.test(w));
    textos[url] = doc.querySelector('.exam-body').text.replace(/\s+/g, ' ').toLowerCase();
    const n = words.length;
    if (n < 450 || n > 700) P(`${n} palabras en <main> (objetivo 450–700)`);
    else avisos.push(`${url}: ${n} palabras`);
  }
}
// Similitud entre páginas de examen (shingles de 6 palabras sobre el cuerpo)
const sh = (t) => { const w = t.split(' '); const s = new Set(); for (let i = 0; i + 6 <= w.length; i++) s.add(w.slice(i, i + 6).join(' ')); return s; };
const keys = Object.keys(textos); let max = [0, '', ''];
for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
  const a = sh(textos[keys[i]]), b = sh(textos[keys[j]]); let inter = 0; a.forEach((x) => b.has(x) && inter++);
  const jac = inter / (a.size + b.size - inter); if (jac > max[0]) max = [jac, keys[i], keys[j]];
  if (jac > 0.2) problemas.push(`contenido muy similar (${(jac * 100).toFixed(0)} %) entre ${keys[i]} y ${keys[j]}`);
}
console.log(`Páginas: ${files.length}`);
if (process.argv.includes('-v')) avisos.forEach((a) => console.log('  · ' + a));
console.log(`Máxima similitud entre páginas de examen: ${(max[0] * 100).toFixed(1)} % (${max[1]} / ${max[2]})`);
console.log(problemas.length ? `\n${problemas.length} problema(s):\n` + problemas.map((p) => '  ✗ ' + p).join('\n') : '\nOK: sin problemas.');
process.exit(problemas.length ? 1 : 0);
