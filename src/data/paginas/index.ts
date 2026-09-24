import { SANGRE_GENERAL } from './sangre-general';
import { ORGANOS } from './organos';
import { INFECCIOSAS } from './infecciosas';
import { ESPECIALES } from './especiales';
import { HORMONAS } from './hormonas';

export type { PaginaExamen } from './tipos';

// Orden = orden de "más solicitados" en listados.
export const PAGINAS = [...SANGRE_GENERAL, ...ORGANOS, ...INFECCIOSAS, ...ESPECIALES, ...HORMONAS];
