// Guías informativas por trámite o motivo de consulta. Usan SOLO exámenes y precios del catálogo
// (data/examenes.json): no inventan paquetes, precios ni requisitos oficiales.
// El texto de cada guía deja claro que la lista final la define el médico o la entidad que solicita el trámite.
import { examen, paginaBySlug } from '../lib/catalogo';
import { precio } from '../lib/site';
import type { RUTAS } from './rutas';

export interface GrupoGuia { titulo: string; intro?: string; items: string[] }
export interface ExtraGuia { titulo: string; parrafos: string[]; enlace?: [string, string] }
export interface Guia {
  slug: string;
  ruta: keyof typeof RUTAS;
  h1: string;
  lead: string;
  tema: string; // para el schema (MedicalEntity)
  aviso: string;
  grupos: GrupoGuia[];
  extras: ExtraGuia[];
  preparacion: string[];
  faqs: { p: string; r: string }[];
  waMsg: string;
  /** slugs de otras guías para el bloque "Otras guías". */
  relacionadas: string[];
}

const ent = (slug: string) => paginaBySlug(slug)?.entrega ?? 'Te lo confirmamos al agendar';
const sangre = examen('grupo-sanguineo');

export const GUIAS: Guia[] = [
  {
    slug: 'examenes-prenupciales',
    ruta: 'guiaPrenupciales',
    h1: 'Exámenes prenupciales en Cuenca',
    tema: 'Exámenes de laboratorio antes del matrimonio o de planificar un embarazo',
    lead: 'Muchas parejas se hacen exámenes de laboratorio antes del matrimonio o de planificar un embarazo. Estos son los más habituales, con su precio en Accu-Lab. La lista final la define tu médico o la entidad que te la pida.',
    aviso: 'Guía informativa. No existe una lista única de exámenes prenupciales y aquí no se establecen requisitos oficiales: confirma con tu médico o con la entidad que te lo solicita cuáles necesitas.',
    grupos: [
      { titulo: 'Sangre', intro: 'Una visión general del estado de salud de cada persona.', items: ['hemograma', 'grupo-sanguineo', 'glucosa'] },
      { titulo: 'Infecciones de transmisión sexual y hepatitis', intro: 'Pruebas que muchas parejas se hacen por indicación médica o por tranquilidad. Los resultados de VIH y VDRL se entregan de forma personal.', items: ['hiv', 'vdrl', 'hepatitis-b-ag', 'hepatitis-c'] },
      { titulo: 'Si planifican un embarazo', intro: 'Tu médico puede pedirlos cuando la pareja piensa en tener hijos. Se solicitan según cada caso.', items: ['toxoplasma-igg-igm', 'rubeola-igg-igm', 'citomegalovirus-igg-igm', 'herpes-virus-1-igg-igm', 'herpes-virus-2-igg-igm', 'pruebas-de-embarazo'] },
    ],
    extras: [
      { titulo: 'Cómo organizar tus exámenes', parrafos: [
        'Pide a tu médico, o a la entidad que te solicita los exámenes, la lista exacta. Si ya la tienes, escríbenos por WhatsApp y te ayudamos a cotizarla.',
        'Pueden hacerse los exámenes en pareja el mismo día: atendemos sin cita en nuestro horario, en Consultorios El Batán.',
      ] },
    ],
    preparacion: [
      'La mayoría de estos exámenes no requiere ayuno. Si tu lista incluye glucosa, ve en ayunas de 8 a 12 horas; puedes tomar agua.',
      'Si incluyes exámenes hormonales o una prueba de embarazo, confirma con nosotros la preparación antes de venir.',
      'Lleva tu orden médica o la lista que te pidieron, en papel o en foto.',
    ],
    faqs: [
      { p: '¿Cuáles son los exámenes prenupciales obligatorios?', r: 'No podemos fijar requisitos oficiales: la lista depende de tu médico o de la entidad que te la solicite. En Accu-Lab realizamos los exámenes y te ayudamos a cotizar la lista que te indiquen.' },
      { p: '¿Cuánto cuestan los exámenes prenupciales?', r: 'Cada examen tiene su precio individual, que puedes ver en las tablas de esta página. El total depende de los que te pidan: arma tu lista en el cotizador y envíala por WhatsApp.' },
      { p: '¿Necesito cita para hacérmelos?', r: 'No. Puedes venir directamente a Consultorios El Batán dentro de nuestro horario o escribirnos antes por WhatsApp para confirmar la preparación.' },
      { p: '¿Cuándo están los resultados?', r: `Hemograma, grupo sanguíneo, glucosa y VDRL: ${ent('biometria-hematica').toLowerCase()}. En VIH, hepatitis y perfil TORCH te confirmamos el plazo al agendar.` },
    ],
    waMsg: 'Hola, quiero cotizar exámenes prenupciales.',
    relacionadas: ['examenes-prequirurgicos', 'examen-de-sangre-licencia-de-conducir'],
  },
  {
    slug: 'examen-de-sangre-licencia-de-conducir',
    ruta: 'guiaLicencia',
    h1: 'Examen de sangre para licencia de conducir en Cuenca',
    tema: 'Examen de grupo sanguíneo y factor Rh',
    lead: 'En algunos trámites de licencia de conducir se pide conocer tu tipo de sangre. Esta guía explica qué examen de laboratorio realizamos en Accu-Lab, cuánto cuesta y cómo prepararte.',
    aviso: 'Guía informativa. Los documentos que se piden los define la entidad que realiza el trámite y pueden cambiar: confirma con ellos qué aceptan, incluido si reciben el resultado de un laboratorio privado. Aquí no se establecen requisitos oficiales.',
    grupos: [
      { titulo: 'El examen para este trámite', intro: 'Determina tu grupo sanguíneo (A, B, AB u O) y tu factor Rh (positivo o negativo).', items: ['grupo-sanguineo'] },
      { titulo: 'Otros exámenes de sangre frecuentes', intro: 'Solo si tu médico los incluye en tu orden.', items: ['hemograma', 'glucosa'] },
    ],
    extras: [
      { titulo: 'Qué es el grupo sanguíneo y el factor Rh', parrafos: [
        'El grupo sanguíneo y el factor Rh se determinan con una muestra de sangre. Son datos que se mantienen durante toda la vida y se usan en transfusiones, en el embarazo y en algunos trámites.',
        'Por lo general el examen no requiere ayuno y basta una sola muestra. Si ya conoces tu tipo de sangre pero necesitas un documento, pregunta a la entidad en qué formato lo aceptan.',
      ] },
    ],
    preparacion: [
      'Por lo general no requiere ayuno. Si lo harás junto con otros exámenes de sangre, confirma con nosotros la preparación.',
      'Si la entidad te pidió un formato o datos específicos para el resultado, llévalos o envíalos por WhatsApp antes de venir.',
    ],
    faqs: [
      { p: '¿Cuánto cuesta el examen de grupo sanguíneo?', r: `El grupo sanguíneo y factor Rh cuesta ${precio(sangre.precio)}. Es un precio referencial: confírmalo al agendar.` },
      { p: '¿Necesito cita o ayuno?', r: 'No necesitas cita: atendemos en nuestro horario, en Consultorios El Batán. Por lo general tampoco requiere ayuno.' },
      { p: '¿El resultado sirve para mi trámite?', r: 'Eso lo define la entidad que realiza el trámite. Antes de venir, pregunta qué documento aceptan y si reciben resultados de un laboratorio privado. Nosotros te enviamos el resultado de tu examen por WhatsApp o correo.' },
      { p: '¿Cuándo está listo el resultado?', r: `${ent('grupo-sanguineo')}.` },
    ],
    waMsg: 'Hola, quiero hacerme el examen de grupo sanguíneo.',
    relacionadas: ['examenes-prenupciales', 'examenes-prequirurgicos'],
  },
  {
    slug: 'examenes-prequirurgicos',
    ruta: 'guiaPrequirurgicos',
    h1: 'Exámenes prequirúrgicos en Cuenca',
    tema: 'Exámenes de laboratorio antes de una cirugía',
    lead: 'Antes de una cirugía, el equipo médico suele pedir exámenes de laboratorio para conocer tu estado de salud. La lista exacta la define tu cirujano o tu anestesiólogo; estos son los exámenes más frecuentes y su precio en Accu-Lab.',
    aviso: 'Guía informativa. No reemplaza la indicación de tu médico: cada cirugía y cada centro tienen sus propias listas. Pregunta a tu equipo médico cuáles te corresponden.',
    grupos: [
      { titulo: 'Sangre y coagulación', intro: 'Estudian las células de la sangre y cómo coagula.', items: ['hemograma', 'tp', 'tpt', 'grupo-sanguineo'] },
      { titulo: 'Química sanguínea', intro: 'Azúcar en sangre y función de los riñones.', items: ['glucosa', 'urea', 'creatinina'] },
      { titulo: 'Orina', items: ['emo'] },
      { titulo: 'Que algunos equipos piden además', intro: 'Según la cirugía y el centro donde te operes.', items: ['sodio', 'potasio', 'tgo', 'tgp', 'hiv', 'hepatitis-b-ag', 'hepatitis-c'] },
    ],
    extras: [
      { titulo: 'Qué tener en cuenta', parrafos: [
        'Pregunta a tu cirujano o anestesiólogo cuánto tiempo antes de la cirugía deben hacerse los exámenes y qué vigencia aceptan: lo define cada centro.',
        'Informa siempre los medicamentos que tomas, incluidos anticoagulantes, aspirina y suplementos. No los suspendas por tu cuenta: tu médico te indicará qué hacer antes de la cirugía.',
      ] },
      { titulo: 'Después de la cirugía', parrafos: [
        'Si necesitas controles de laboratorio y no puedes trasladarte, ofrecemos toma de muestras a domicilio sin costo adicional. Confirma la cobertura en tu sector por WhatsApp.',
      ], enlace: ['/domicilio', 'Exámenes a domicilio en Cuenca'] },
    ],
    preparacion: [
      'La glucosa y el perfil renal (urea y creatinina) suelen hacerse en ayunas de 8 a 12 horas; puedes tomar agua.',
      'El EMO se hace con la primera orina de la mañana. Mira cómo recogerla en nuestra guía de preparación.',
      'Lleva tu orden médica con la lista de exámenes que te pidieron.',
    ],
    faqs: [
      { p: '¿Qué exámenes me pedirán antes de mi cirugía?', r: 'Depende de tu edad, tus enfermedades y el tipo de cirugía. La lista la define tu cirujano o tu anestesiólogo; esta página muestra los exámenes más frecuentes con su precio.' },
      { p: '¿Puedo hacerme solo algunos de la lista?', r: 'Sí. Cada examen se cobra por separado y puedes armar tu lista en el cotizador. Hazte únicamente los que te hayan indicado.' },
      { p: '¿Cuándo salen los resultados?', r: `Hemograma, glucosa, perfil renal, tiempos de coagulación, grupo sanguíneo y EMO: ${ent('biometria-hematica').toLowerCase()}. En VIH y hepatitis te confirmamos el plazo al agendar.` },
      { p: '¿Necesito cita?', r: 'No. Puedes venir directamente a Consultorios El Batán dentro de nuestro horario o escribirnos antes por WhatsApp para confirmar la preparación.' },
    ],
    waMsg: 'Hola, quiero cotizar exámenes prequirúrgicos.',
    relacionadas: ['examenes-prenupciales', 'examen-de-sangre-licencia-de-conducir'],
  },
];

export const guiaBySlug = (s: string) => GUIAS.find((g) => g.slug === s);
