// sitemap.xml autogenerado: solo URLs canónicas de acculab.bio (sin /_styleguide ni la 404).
// lastmod = fecha real del último cambio de los archivos de cada página (ver src/lib/lastmod.mjs); si no se puede
// afirmar con certeza (el contenido cambió y data/lastmod.json no se actualizó), la URL sale sin lastmod.
// Sin priority ni changefreq (Google los ignora).
import type { APIRoute } from 'astro';
import { RUTAS } from '../data/rutas';
import { PAGINAS } from '../data/paginas';
import { SITE } from '../lib/site';
import { lastmodDe, leerManifest } from '../lib/lastmod.mjs';

export const GET: APIRoute = () => {
  const manifest = leerManifest();
  const rutas = [
    ...Object.values(RUTAS).filter((r) => !r.noindex).map((r) => r.path),
    ...PAGINAS.map((p) => `/examenes/${p.slug}`),
  ];
  const urls = rutas.map((path) => ({ loc: path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`, lastmod: lastmodDe(path, manifest) }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
