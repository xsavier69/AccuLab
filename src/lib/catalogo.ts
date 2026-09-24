import data from '../../data/examenes.json';
import { PAQUETES, type Paquete } from '../data/paquetes';
import { PAGINAS, type PaginaExamen } from '../data/paginas';

export interface Examen {
  slug: string;
  nombre: string;
  sinonimos: string[];
  categoria: string;
  precio: number;
  tienePagina: boolean;
  pagina: string | null;
  preparacion: string;
  relacionados: string[];
}

export const CATEGORIAS: { slug: string; nombre: string }[] = data.categorias;
export const EXAMENES: Examen[] = data.examenes as Examen[];

const porSlug = new Map(EXAMENES.map((e) => [e.slug, e]));
export function examen(slug: string): Examen {
  const e = porSlug.get(slug);
  if (!e) throw new Error(`Examen inexistente en data/examenes.json: ${slug}`);
  return e;
}
export const nombreCategoria = (slug: string) => CATEGORIAS.find((c) => c.slug === slug)?.nombre ?? slug;

// ---- Páginas de examen ----
export const paginaBySlug = (s: string) => PAGINAS.find((p) => p.slug === s);

export function componentes(p: PaginaExamen): Examen[] {
  return p.componentes.map(examen);
}
/** Precio mostrado en la cabecera de una página: suma (perfil), mínimo (opciones) o único. */
export function precioPagina(p: PaginaExamen): { valor: number; desde: boolean } {
  const cs = componentes(p);
  if (p.modoPrecio === 'opciones') return { valor: Math.min(...cs.map((c) => c.precio)), desde: cs.length > 1 };
  return { valor: cs.reduce((a, c) => a + c.precio, 0), desde: false };
}
/** Precio individual más bajo entre los componentes (para "desde" en el hub). */
export const precioMinimo = (p: PaginaExamen) => Math.min(...componentes(p).map((c) => c.precio));

export function paquetesDePagina(p: PaginaExamen): Paquete[] {
  return PAQUETES.filter((pq) => pq.items.some((it) => it.pagina === p.slug || it.examenes.some((s) => p.componentes.includes(s))));
}

// ---- Paquetes ----
export function valorPaquete(pq: Paquete) {
  const slugs = new Set<string>();
  pq.items.forEach((it) => it.examenes.forEach((s) => slugs.add(s)));
  const total = [...slugs].reduce((a, s) => a + examen(s).precio, 0);
  const aConsultar = pq.items.filter((it) => it.examenes.length === 0).map((it) => it.etiqueta);
  return { total, aConsultar, slugs: [...slugs] };
}
export const precioItem = (it: { examenes: string[] }) => it.examenes.reduce((a, s) => a + examen(s).precio, 0);

export { PAQUETES, PAGINAS };
