// Imágenes Open Graph 1200×630 generadas en el build: logo + título de la página
// en la tipografía del sitio (Fraunces/Manrope) sobre el color de marca.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { RUTAS, ogSlug } from '../../../data/rutas';
import { PAGINAS } from '../../../data/paginas';

const nm = (p: string) => fs.readFileSync(path.join(process.cwd(), 'node_modules', p));
const FRAUNCES = nm('@fontsource/fraunces/files/fraunces-latin-400-normal.woff');
const MANROPE = nm('@fontsource/manrope/files/manrope-latin-600-normal.woff');
let LOGO: string | undefined;
async function logo() {
  if (!LOGO) {
    const buf = await sharp(path.join(process.cwd(), 'src/assets/fotos/logo.png')).resize({ width: 420 }).png().toBuffer();
    LOGO = `data:image/png;base64,${buf.toString('base64')}`;
  }
  return LOGO;
}

export function getStaticPaths() {
  const estaticas = Object.values(RUTAS).map((r) => ({ params: { slug: ogSlug(r.path) }, props: { titulo: r.og } }));
  const examenes = PAGINAS.map((p) => ({ params: { slug: ogSlug(`/examenes/${p.slug}`) }, props: { titulo: `${p.h1} en Cuenca` } }));
  return [...estaticas, ...examenes, { params: { slug: '404' }, props: { titulo: 'Página no encontrada' } }];
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export const GET: APIRoute = async ({ props }) => {
  const { titulo } = props as { titulo: string };
  const size = titulo.length > 48 ? 64 : titulo.length > 30 ? 76 : 88;
  const circles = [[980, 120, 260], [980, 120, 200], [980, 120, 120], [1080, 560, 180]].map(([x, y, r], i) =>
    h('div', { position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, border: `${i === 1 ? 1 : 2}px solid rgba(140,198,63,${i === 3 ? 0.18 : 0.28})` }));
  const svg = await satori(
    h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: '#1f5f4f', position: 'relative', fontFamily: 'Manrope' }, [
      ...circles,
      h('div', { display: 'flex' }, [
        h('div', { display: 'flex', background: '#ffffff', borderRadius: 18, padding: '16px 24px' }, [
          { type: 'img', props: { src: await logo(), width: 240, height: 106 } },
        ]),
      ]),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h('div', { fontFamily: 'Fraunces', fontSize: size, lineHeight: 1.08, color: '#ffffff', maxWidth: 900, letterSpacing: -1 }, titulo),
      ]),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#cfe0d8' }, [
        h('div', {}, 'acculab.bio'),
        h('div', {}, 'El Batán · Cuenca · WhatsApp 099-640-5647'),
      ]),
    ]) as any,
    { width: 1200, height: 630, fonts: [{ name: 'Fraunces', data: FRAUNCES, weight: 400 }, { name: 'Manrope', data: MANROPE, weight: 600 }] },
  );
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
