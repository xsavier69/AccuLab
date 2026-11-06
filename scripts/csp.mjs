// Content-Security-Policy de vercel.json calculada a partir de dist/.
//   npm run csp            recalcula los hashes de los <script> y <style> en línea y actualiza vercel.json
//   node scripts/csp.mjs --check   (lo ejecuta postbuild.mjs) falla si dist/ tiene un script o <style> en línea
//                                  cuyo hash no está en la política: así un despliegue nunca sale con estilos o
//                                  scripts bloqueados; Vercel mantiene el despliegue anterior.
// Cada edición del CSS de una página, de los scripts del layout o de los scripts de página cambia estos hashes.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const VERCEL = 'vercel.json';
const hash = (s) => `'sha256-${crypto.createHash('sha256').update(s, 'utf8').digest('base64')}'`;

function htmlDe(dir) {
  const out = [];
  (function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && out.push(p); } })(dir);
  return out;
}

/** Hashes de los scripts y <style> en línea de todas las páginas (los JSON-LD y data blocks no se ejecutan). */
export function hashesDeDist(dir = 'dist') {
  const scripts = new Set(), estilos = new Set();
  for (const f of htmlDe(dir)) {
    const html = fs.readFileSync(f, 'utf8');
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      const attrs = m[1];
      if (/\bsrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs)) continue;
      scripts.add(hash(m[2]));
    }
    for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) estilos.add(hash(m[1]));
  }
  return { scripts: [...scripts].sort(), estilos: [...estilos].sort() };
}

export function construirCsp({ scripts, estilos }) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scripts.join(' ')}`,
    // Navegadores antiguos sin style-src-elem/-attr usan esta línea (permisiva); los modernos usan las dos siguientes.
    "style-src 'self' 'unsafe-inline'",
    `style-src-elem 'self' ${estilos.join(' ')}`,
    // Atributos style="..." en el HTML (swatches y márgenes sueltos): no pueden ejecutar código y no tienen alternativa con hashes sencilla.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'self'",
    // Solo el mapa que se carga al pulsar "Ver mapa" (MapFacade). wa.me y google.com/maps son enlaces, no se incrustan.
    'frame-src https://www.google.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function cspActual(cfg) {
  const regla = cfg.headers.find((h) => h.source === '/(.*)');
  return regla?.headers.find((h) => h.key === 'Content-Security-Policy')?.value;
}

const cfg = JSON.parse(fs.readFileSync(VERCEL, 'utf8'));
const hashes = hashesDeDist();
if (process.argv.includes('--check')) {
  const actual = cspActual(cfg) || '';
  const faltan = [...hashes.scripts, ...hashes.estilos].filter((h) => !actual.includes(h));
  if (faltan.length) {
    console.error(`\nCSP desactualizada: ${faltan.length} script(s) o <style> en línea de dist/ no están permitidos en vercel.json.\nEjecuta \`npm run csp\` y confirma vercel.json.`);
    process.exit(1);
  }
  const usados = new Set([...hashes.scripts, ...hashes.estilos]);
  const sobran = [...actual.matchAll(/'sha256-[^']+'/g)].map((m) => m[0]).filter((h) => !usados.has(h));
  console.log(`CSP OK: ${hashes.scripts.length} scripts y ${hashes.estilos.length} <style> en línea cubiertos` + (sobran.length ? ` (${sobran.length} hash(es) sin uso; \`npm run csp\` los limpia)` : '.'));
} else {
  const regla = cfg.headers.find((h) => h.source === '/(.*)');
  const h = regla.headers.find((x) => x.key === 'Content-Security-Policy');
  const valor = construirCsp(hashes);
  if (h) h.value = valor; else regla.headers.push({ key: 'Content-Security-Policy', value: valor });
  fs.writeFileSync(VERCEL, JSON.stringify(cfg, null, 2) + '\n');
  console.log(`vercel.json actualizado: ${hashes.scripts.length} hashes de script, ${hashes.estilos.length} de <style>.`);
}
