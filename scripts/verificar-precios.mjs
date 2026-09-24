// Verifica que los 97 precios coincidan con el sitio original.
// 1) data/examenes.json vs audit/before/precios-baseline.json (copia exacta del cotizador anterior)
// 2) dist/cotizar.html (si existe) vs data/examenes.json
// 3) --live: https://acculab.bio/cotizar (formato antiguo o nuevo) vs línea base
import fs from 'node:fs';

const base = JSON.parse(fs.readFileSync('audit/before/precios-baseline.json', 'utf8')).examenes;
const data = JSON.parse(fs.readFileSync('data/examenes.json', 'utf8')).examenes;
let errores = 0;
const err = (m) => { errores++; console.error('  ✗ ' + m); };

function comparar(nombre, esperado, obtenido) {
  console.log(`\n${nombre}`);
  const mapa = new Map(obtenido.map((e) => [e.nombre, e.precio]));
  if (obtenido.length !== esperado.length) err(`cantidad: ${obtenido.length} (esperado ${esperado.length})`);
  for (const e of esperado) {
    if (!mapa.has(e.nombre)) err(`falta "${e.nombre}"`);
    else if (Math.abs(mapa.get(e.nombre) - e.precio) > 1e-9) err(`"${e.nombre}": ${mapa.get(e.nombre)} ≠ ${e.precio}`);
  }
  const nombres = new Set(esperado.map((e) => e.nombre));
  for (const o of obtenido) if (!nombres.has(o.nombre)) err(`sobra "${o.nombre}"`);
  const suma = obtenido.reduce((a, e) => a + e.precio, 0);
  console.log(`  ${obtenido.length} exámenes · suma $${suma.toFixed(2)}`);
}
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
function parseHtml(html) {
  const out = [];
  // Formato nuevo (Astro): value=slug data-nombre data-precio (en cualquier orden)
  for (const m of html.matchAll(/<input[^>]*name="examen"[^>]*>/g)) {
    const n = m[0].match(/data-nombre="([^"]+)"/), p = m[0].match(/data-precio="([\d.]+)"/);
    if (n && p) out.push({ nombre: unesc(n[1]), precio: Number(p[1]) });
  }
  if (out.length) return out;
  // Formato antiguo: value="precio" data-nombre="..."
  for (const m of html.matchAll(/<input type="checkbox" value="([\d.]+)"\s+data-nombre="([^"]+)"/g)) out.push({ nombre: unesc(m[2]), precio: Number(m[1]) });
  return out;
}

comparar('data/examenes.json vs línea base', base, data);
if (fs.existsSync('dist/cotizar.html')) comparar('dist/cotizar.html vs línea base', base, parseHtml(fs.readFileSync('dist/cotizar.html', 'utf8')));
if (process.argv.includes('--live')) {
  const html = await (await fetch('https://acculab.bio/cotizar')).text();
  comparar('https://acculab.bio/cotizar (en vivo) vs línea base', base, parseHtml(html));
}
console.log(errores ? `\n${errores} diferencia(s).` : '\nOK: los 97 precios coinciden.');
process.exit(errores ? 1 : 0);
