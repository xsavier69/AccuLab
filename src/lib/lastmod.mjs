// lastmod del sitemap: fecha real del último cambio de los archivos que definen el contenido de cada URL.
//
// El build de Vercel puede hacer un clon superficial (sin historial de git), así que las fechas no se leen de git
// durante el build. Se calculan con `npm run lastmod` (scripts/actualizar-lastmod.mjs, con el historial completo) y se
// guardan en data/lastmod.json junto con una huella (SHA-1) del contenido de esos archivos. El sitemap solo publica
// una fecha si la huella actual coincide con la guardada; si el contenido cambió y no se actualizó el archivo, esa URL
// sale SIN lastmod (mejor ninguno que uno falso).
//
// Se consideran fuentes la página y sus datos. Cabecera, pie, CSS y otros componentes compartidos no cuentan.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const DIR_PAGINAS = 'src/data/paginas';
const CATALOGO = 'data/examenes.json';

const ESTATICAS = {
  '/': ['src/pages/index.astro', 'src/data/faq.ts', 'src/data/paquetes.ts', CATALOGO],
  '/examenes': ['src/pages/examenes.astro', CATALOGO],
  '/paquetes': ['src/pages/paquetes.astro', 'src/data/paquetes.ts', CATALOGO],
  '/empresas': ['src/pages/empresas.astro'],
  '/medicos': ['src/pages/medicos.astro'],
  '/domicilio': ['src/pages/domicilio.astro'],
  '/preparacion': ['src/pages/preparacion.astro'],
  '/preguntas-frecuentes': ['src/pages/preguntas-frecuentes.astro', 'src/data/faq.ts'],
  '/servicios': ['src/pages/servicios.astro', 'src/data/paquetes.ts'],
  '/cotizar': ['src/pages/cotizar.astro', 'src/lib/mensajes.ts', 'src/data/paquetes.ts', CATALOGO],
  '/nosotros': ['src/pages/nosotros.astro'],
};

/** Archivo de src/data/paginas/ que define la página de examen `slug`. */
function archivoDeExamen(slug) {
  for (const f of fs.readdirSync(DIR_PAGINAS)) {
    if (!f.endsWith('.ts')) continue;
    if (new RegExp(`^\\s+slug: '${slug}',`, 'm').test(fs.readFileSync(path.join(DIR_PAGINAS, f), 'utf8'))) return `${DIR_PAGINAS}/${f}`;
  }
  return null;
}

/** Rutas indexables que tienen fuentes conocidas (para el script y la verificación). */
export function rutasConocidas() {
  const slugs = fs.readdirSync(DIR_PAGINAS).filter((f) => f.endsWith('.ts')).flatMap((f) =>
    [...fs.readFileSync(path.join(DIR_PAGINAS, f), 'utf8').matchAll(/^\s+slug: '([^']+)',/gm)].map((m) => `/examenes/${m[1]}`));
  return [...Object.keys(ESTATICAS), ...slugs];
}

/** Archivos que definen el contenido de la URL, o null si no se conocen. */
export function fuentes(ruta) {
  if (ESTATICAS[ruta]) return ESTATICAS[ruta];
  const m = ruta.match(/^\/examenes\/([^/]+)$/);
  const f = m && archivoDeExamen(m[1]);
  return f ? [f, 'src/pages/examenes/[slug].astro', CATALOGO] : null;
}

export function huella(archivos) {
  const h = crypto.createHash('sha1');
  for (const f of [...archivos].sort()) h.update(f + '\0').update(fs.readFileSync(f)).update('\0');
  return h.digest('hex');
}

export const MANIFEST = 'data/lastmod.json';
export function leerManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch { return {}; }
}

/** lastmod (AAAA-MM-DD) de la ruta, o null si no se puede afirmar con certeza. */
export function lastmodDe(ruta, manifest = leerManifest()) {
  const src = fuentes(ruta);
  const reg = manifest[ruta];
  if (!src || !reg || reg.huella !== huella(src)) return null;
  return reg.fecha;
}
