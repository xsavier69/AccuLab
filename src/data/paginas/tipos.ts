export interface PaginaExamen {
  slug: string;
  /** Nombre visible completo, con sinónimo local. */
  nombre: string;
  /** Nombre corto para H1 "[x] en Cuenca" y title. */
  h1: string;
  /** Texto para el title: "[tituloSeo] en Cuenca: Precio y Preparación | Accu-Lab". */
  tituloSeo: string;
  descripcion: string; // meta description 140–155 caracteres
  categoria: string;
  sinonimos: string[];
  /** Slugs de data/examenes.json. */
  componentes: string[];
  /** suma = perfil (se suman precios); opciones = el paciente elige una o varias; unico = un examen. */
  modoPrecio: 'suma' | 'opciones' | 'unico';
  /** Exámenes complementarios del catálogo que suelen pedirse junto (se muestran aparte, no suman). */
  complementos?: string[];
  muestra: string;
  resumenPrep: string;
  entrega: string;
  intro: string;
  queEs: string[];
  cuando: { intro: string; items: string[]; cierre?: string };
  preparacion: string[];
  notaPrecio?: string;
  faqs: { p: string; r: string }[];
  relacionados: string[]; // slugs de otras páginas de examen (3)
  medline: { url: string; titulo: string };
  actualizado: string; // AAAA-MM-DD
  /** Preparado para cuando exista un revisor profesional. No se rellena sin dato real. */
  revisadoPor: null | { nombre: string; cargo: string };
}

export const ENTREGA_24H = 'Generalmente en 24 h';
/** Exámenes especializados: el sitio original indica que algunos tardan 48–72 h. Sin dato por examen, no se afirma un plazo. */
export const ENTREGA_A_CONFIRMAR = 'Te lo confirmamos al agendar';
export const ACTUALIZADO = '2026-09-24';
