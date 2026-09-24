// sitemap.xml autogenerado: solo URLs canónicas de acculab.bio, con lastmod real (fecha de contenido).
// Sin priority ni changefreq (Google los ignora).
import type { APIRoute } from 'astro';
import { RUTAS } from '../data/rutas';
import { PAGINAS } from '../data/paginas';
import { SITE } from '../lib/site';

export const GET: APIRoute = () => {
  const urls = [
    ...Object.values(RUTAS).filter((r) => !r.noindex).map((r) => ({ loc: r.path === '/' ? `${SITE.url}/` : `${SITE.url}${r.path}`, lastmod: r.lastmod })),
    ...PAGINAS.map((p) => ({ loc: `${SITE.url}/examenes/${p.slug}`, lastmod: p.actualizado })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
