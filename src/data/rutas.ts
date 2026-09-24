// Registro de páginas estáticas: title, description, título de la imagen OG y lastmod real
// (fecha del último cambio de contenido de esa página; actualizar al editarla).
export interface Ruta {
  path: string;
  title: string;
  description: string;
  og: string; // texto grande de la imagen OG
  lastmod: string;
  noindex?: boolean;
}

export const RUTAS: Record<string, Ruta> = {
  home: {
    path: '/',
    title: 'Laboratorio Clínico en Cuenca – Resultados en 24 h | Accu-Lab',
    description: 'Laboratorio clínico en Cuenca desde 2010: 97 exámenes con precio publicado, resultados en 24 h y toma a domicilio. En El Batán. Agenda por WhatsApp.',
    og: 'Laboratorio clínico en Cuenca con resultados en 24 horas',
    lastmod: '2026-09-24',
  },
  examenes: {
    path: '/examenes',
    title: 'Exámenes de Laboratorio en Cuenca: Precios | Accu-Lab',
    description: 'Exámenes de laboratorio en Cuenca por categoría: sangre, orina, heces, hormonas e infecciosas, con precios desde $1.00. Resultados en 24 h en Accu-Lab.',
    og: 'Exámenes de laboratorio en Cuenca',
    lastmod: '2026-09-24',
  },
  paquetes: {
    path: '/paquetes',
    title: 'Paquetes de Exámenes Preventivos en Cuenca | Accu-Lab',
    description: 'Paquetes de exámenes en Cuenca: chequeo preventivo, hormonal, metabólico, deportivo, ETS y más. Mira qué incluye cada uno y cotízalo por WhatsApp.',
    og: 'Paquetes de exámenes preventivos',
    lastmod: '2026-09-24',
  },
  empresas: {
    path: '/empresas',
    title: 'Exámenes Preocupacionales y Ocupacionales en Cuenca | Accu-Lab',
    description: 'Exámenes preocupacionales, ocupacionales periódicos y pruebas de drogas para empresas en Cuenca. Resultados en 24 h. Solicita tu cotización por WhatsApp.',
    og: 'Exámenes preocupacionales y ocupacionales para empresas',
    lastmod: '2026-09-24',
  },
  medicos: {
    path: '/medicos',
    title: 'Convenios con Médicos en Cuenca | Accu-Lab',
    description: 'Convenios de Accu-Lab con médicos en Cuenca: atención prioritaria para tus pacientes, resultados rápidos y comunicación directa. Solicita tu convenio.',
    og: 'Convenios con médicos',
    lastmod: '2026-09-24',
  },
  domicilio: {
    path: '/domicilio',
    title: 'Exámenes de Laboratorio a Domicilio en Cuenca | Accu-Lab',
    description: 'Toma de muestras a domicilio en Cuenca para adultos mayores, pacientes post cirugía y personas ocupadas. Consulta la cobertura en tu sector por WhatsApp.',
    og: 'Exámenes de laboratorio a domicilio en Cuenca',
    lastmod: '2026-09-24',
  },
  preparacion: {
    path: '/preparacion',
    title: 'Preparación para Exámenes: Ayuno y Muestras | Accu-Lab',
    description: 'Cómo prepararte para tus exámenes: ayuno para glucosa y lípidos, primera orina para el EMO y recolección de heces. Confirma tu preparación con Accu-Lab.',
    og: 'Cómo prepararte para tus exámenes',
    lastmod: '2026-09-24',
  },
  faq: {
    path: '/preguntas-frecuentes',
    title: 'Preguntas Frecuentes | Accu-Lab Laboratorio Clínico en Cuenca',
    description: 'Horarios, citas, entrega de resultados, ubicación en El Batán y toma a domicilio: respuestas a las preguntas más frecuentes sobre Accu-Lab en Cuenca.',
    og: 'Preguntas frecuentes',
    lastmod: '2026-09-24',
  },
  servicios: {
    path: '/servicios',
    title: 'Servicios de Laboratorio Clínico en Cuenca | Accu-Lab',
    description: 'Servicios de Accu-Lab en Cuenca: exámenes para empresas, deportistas, toxicología, convenios médicos, toma a domicilio y paquetes. Agenda por WhatsApp.',
    og: 'Servicios de laboratorio clínico en Cuenca',
    lastmod: '2026-09-24',
  },
  cotizar: {
    path: '/cotizar',
    title: 'Precios de Exámenes de Laboratorio en Cuenca | Accu-Lab',
    description: 'Precios de 97 exámenes de laboratorio en Cuenca: sangre, orina, heces y hormonas. Arma tu cotización y envíala por WhatsApp a Accu-Lab, en El Batán.',
    og: 'Precios de exámenes de laboratorio en Cuenca',
    lastmod: '2026-09-24',
  },
  nosotros: {
    path: '/nosotros',
    title: 'Sobre Accu-Lab – Laboratorio Clínico en El Batán desde 2010',
    description: 'Accu-Lab es un laboratorio clínico en El Batán, Cuenca, desde 2010. Conoce nuestra misión, visión y áreas de trabajo. Escríbenos por WhatsApp.',
    og: 'Laboratorio clínico en El Batán desde 2010',
    lastmod: '2026-09-24',
  },
  styleguide: {
    path: '/_styleguide',
    title: 'Guía de estilo | Accu-Lab',
    description: 'Sistema de diseño de Accu-Lab: tokens, tipografía y componentes.',
    og: 'Guía de estilo',
    lastmod: '2026-09-24',
    noindex: true,
  },
};

/** Slug de archivo OG a partir de la ruta. */
export const ogSlug = (path: string) => (path === '/' ? 'inicio' : path.replace(/^\//, '').replace(/\//g, '--'));
