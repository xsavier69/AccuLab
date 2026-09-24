// Los 10 paquetes publicados en /servicios. Nombre, "para quién" y exámenes incluidos: texto original.
// `items`: cada examen del paquete. `examenes` = slugs de data/examenes.json que lo componen
// (vacío => no está en el catálogo: se muestra "precio a consultar").
// La composición de "Perfil lipídico", "Función hepática/renal" y "Electrolitos" usa los mismos
// exámenes que las páginas de perfil (ver PENDIENTES.md: validar con el laboratorio).

export interface ItemPaquete {
  etiqueta: string;
  examenes: string[];
  pagina?: string; // página /examenes/[slug] relacionada
  nota?: string;
}
export interface Paquete {
  slug: string;
  nombre: string;
  paraQuien: string;
  descripcion: string;
  icono: string;
  items: ItemPaquete[];
  preparacion: string;
}

const PERFIL_LIPIDICO = ['colesterol', 'hdl', 'ldl', 'trigliceridos'];
const PERFIL_RENAL = ['urea', 'creatinina', 'acido-urico'];
const PERFIL_HEPATICO = ['tgo', 'tgp', 'bilirrubinas', 'f-alcalina', 'ggt'];
const ELECTROLITOS = ['sodio', 'potasio', 'cloro'];
const AYUNO = 'Incluye exámenes que suelen pedir ayuno de 8 a 12 horas (puedes tomar agua). Te confirmamos la preparación al agendar.';

export const PAQUETES: Paquete[] = [
  {
    slug: 'chequeo-preventivo-anual',
    nombre: 'Chequeo Preventivo Anual',
    paraQuien: 'Detección temprana para 35–60 años.',
    descripcion: 'Una revisión general de sangre y orina para conocer cómo estás y conversarlo con tu médico.',
    icono: 'shield-check',
    items: [
      { etiqueta: 'Hemograma', examenes: ['hemograma'], pagina: 'biometria-hematica' },
      { etiqueta: 'Glucosa', examenes: ['glucosa'], pagina: 'glucosa' },
      { etiqueta: 'Perfil lipídico', examenes: PERFIL_LIPIDICO, pagina: 'perfil-lipidico' },
      { etiqueta: 'Función hepática', examenes: PERFIL_HEPATICO, pagina: 'perfil-hepatico' },
      { etiqueta: 'Función renal', examenes: PERFIL_RENAL, pagina: 'perfil-renal' },
      { etiqueta: 'Examen de orina', examenes: ['emo'], pagina: 'examen-de-orina-emo' },
    ],
    preparacion: AYUNO + ' Trae la primera orina de la mañana en frasco estéril.',
  },
  {
    slug: 'adultos-mayores',
    nombre: 'Para Adultos Mayores',
    paraQuien: 'Ideal para mayores de 60 años.',
    descripcion: 'Exámenes de control frecuentes en la edad adulta mayor. También se puede tomar la muestra a domicilio.',
    icono: 'users',
    items: [
      { etiqueta: 'Hemograma', examenes: ['hemograma'], pagina: 'biometria-hematica' },
      { etiqueta: 'Glucosa', examenes: ['glucosa'], pagina: 'glucosa' },
      { etiqueta: 'Perfil renal', examenes: PERFIL_RENAL, pagina: 'perfil-renal' },
      { etiqueta: 'Electrolitos', examenes: ELECTROLITOS, nota: 'Sodio, potasio y cloro' },
      { etiqueta: 'Vitamina B12', examenes: [] },
      { etiqueta: 'Vitamina D', examenes: [] },
    ],
    preparacion: AYUNO,
  },
  {
    slug: 'hormonal-femenino',
    nombre: 'Hormonal Femenino',
    paraQuien: 'Irregularidad, infertilidad o menopausia.',
    descripcion: 'Hormonas que tu médico puede solicitar para estudiar el ciclo menstrual y la función tiroidea.',
    icono: 'activity',
    items: [
      { etiqueta: 'FSH', examenes: ['foliculoestimulante'], pagina: 'hormonas-femeninas' },
      { etiqueta: 'LH', examenes: ['luteinizante'], pagina: 'hormonas-femeninas' },
      { etiqueta: 'Estradiol', examenes: ['estradiol'], pagina: 'hormonas-femeninas' },
      { etiqueta: 'Progesterona', examenes: ['progesterona'], pagina: 'hormonas-femeninas' },
      { etiqueta: 'Prolactina', examenes: ['prolactina'], pagina: 'hormonas-femeninas' },
      { etiqueta: 'TSH', examenes: ['tsh'], pagina: 'perfil-tiroideo' },
    ],
    preparacion: 'El día del ciclo en que conviene tomar la muestra lo indica tu médico. Tráenos la orden o escríbenos para confirmarlo.',
  },
  {
    slug: 'hormonal-masculino',
    nombre: 'Hormonal Masculino',
    paraQuien: 'Fatiga, libido baja o control prostático.',
    descripcion: 'Testosterona, PSA, prolactina y TSH en una sola toma de muestra.',
    icono: 'activity',
    items: [
      { etiqueta: 'Testosterona', examenes: ['testosterona'], pagina: 'testosterona' },
      { etiqueta: 'PSA', examenes: ['psa-total'], pagina: 'psa', nota: 'PSA total' },
      { etiqueta: 'Prolactina', examenes: ['prolactina'], pagina: 'hormonas-femeninas' },
      { etiqueta: 'TSH', examenes: ['tsh'], pagina: 'perfil-tiroideo' },
    ],
    preparacion: 'La testosterona suele medirse en la mañana. Te confirmamos la hora y las indicaciones previas al agendar.',
  },
  {
    slug: 'panel-ets',
    nombre: 'Panel de ETS',
    paraQuien: 'Descarte de enfermedades de transmisión.',
    descripcion: 'Pruebas de infecciones de transmisión sexual, con manejo confidencial de tus resultados.',
    icono: 'shield-check',
    items: [
      { etiqueta: 'VIH', examenes: ['hiv'], pagina: 'prueba-vih' },
      { etiqueta: 'Sífilis', examenes: ['vdrl'], pagina: 'vdrl-sifilis', nota: 'VDRL' },
      { etiqueta: 'Hepatitis B/C', examenes: ['hepatitis-b-ag', 'hepatitis-c'], pagina: 'hepatitis-b-y-c' },
      { etiqueta: 'Ureaplasma', examenes: [] },
      { etiqueta: 'Chlamydia', examenes: ['clamidia-igg-igm'], nota: 'Clamidia IgG IgM' },
      { etiqueta: 'Mycoplasma', examenes: [] },
    ],
    preparacion: 'Las pruebas de sangre por lo general no requieren ayuno. Para ureaplasma y mycoplasma, consúltanos el tipo de muestra.',
  },
  {
    slug: 'perfil-metabolico',
    nombre: 'Perfil Metabólico',
    paraQuien: 'Riesgo de diabetes o síndrome metabólico.',
    descripcion: 'Glucosa, insulina y lípidos para evaluar el metabolismo junto con tu médico.',
    icono: 'droplet',
    items: [
      { etiqueta: 'Glucosa', examenes: ['glucosa'], pagina: 'glucosa' },
      { etiqueta: 'Insulina', examenes: ['insulina'], pagina: 'insulina' },
      { etiqueta: 'HOMA', examenes: [] },
      { etiqueta: 'Perfil lipídico', examenes: PERFIL_LIPIDICO, pagina: 'perfil-lipidico' },
    ],
    preparacion: AYUNO,
  },
  {
    slug: 'perfil-deportivo',
    nombre: 'Perfil Deportivo',
    paraQuien: 'Ideal para gimnasios y clubes.',
    descripcion: 'Parámetros que suelen revisarse en personas que entrenan con regularidad.',
    icono: 'dumbbell',
    items: [
      { etiqueta: 'Hemograma', examenes: ['hemograma'], pagina: 'biometria-hematica' },
      { etiqueta: 'Ferritina', examenes: ['ferritina'], pagina: 'ferritina-y-hierro' },
      { etiqueta: 'CK', examenes: ['cpk'], nota: 'CPK' },
      { etiqueta: 'Electrolitos', examenes: ELECTROLITOS, nota: 'Sodio, potasio y cloro' },
      { etiqueta: 'Glucosa', examenes: ['glucosa'], pagina: 'glucosa' },
    ],
    preparacion: 'Consulta si debes evitar el entrenamiento intenso los días previos; puede influir en algunos resultados como la CK.',
  },
  {
    slug: 'panel-inflamacion',
    nombre: 'Panel de Inflamación',
    paraQuien: 'Usado frecuentemente en medicina interna.',
    descripcion: 'Marcadores que tu médico puede pedir para orientar un estudio de inflamación.',
    icono: 'flask-conical',
    items: [
      { etiqueta: 'PCR', examenes: ['pcr-semicuantitativo'], nota: 'PCR semicuantitativo' },
      { etiqueta: 'VSG', examenes: [] },
      { etiqueta: 'Ferritina', examenes: ['ferritina'], pagina: 'ferritina-y-hierro' },
    ],
    preparacion: 'Por lo general no requiere ayuno. Confirma con nosotros si lo harás junto con otros exámenes.',
  },
  {
    slug: 'panel-digestivo',
    nombre: 'Panel Digestivo',
    paraQuien: 'Para pacientes con molestias intestinales.',
    descripcion: 'Exámenes de heces para orientar el estudio de molestias digestivas.',
    icono: 'microscope',
    items: [
      { etiqueta: 'Coproparasitario', examenes: ['parasitario-heces'], pagina: 'coproparasitario' },
      { etiqueta: 'Sangre oculta en heces', examenes: ['sangre-oculta'] },
      { etiqueta: 'Helicobacter pylori', examenes: ['helicobacter-pylori-heces'], pagina: 'helicobacter-pylori', nota: 'En heces o en sangre: mismo precio' },
    ],
    preparacion: 'Trae una muestra de heces reciente en un frasco limpio, sin mezclar con orina. Te confirmamos si necesitas alguna indicación adicional.',
  },
  {
    slug: 'perfil-fatiga',
    nombre: 'Perfil de Fatiga',
    paraQuien: 'Para el cansancio constante.',
    descripcion: 'Exámenes que se piden con frecuencia cuando el cansancio no mejora.',
    icono: 'clock',
    items: [
      { etiqueta: 'Hemograma', examenes: ['hemograma'], pagina: 'biometria-hematica' },
      { etiqueta: 'TSH', examenes: ['tsh'], pagina: 'perfil-tiroideo' },
      { etiqueta: 'Ferritina', examenes: ['ferritina'], pagina: 'ferritina-y-hierro' },
      { etiqueta: 'Vitamina B12', examenes: [] },
      { etiqueta: 'Glucosa', examenes: ['glucosa'], pagina: 'glucosa' },
    ],
    preparacion: AYUNO,
  },
];

export const paqueteBySlug = (s: string) => PAQUETES.find((p) => p.slug === s);
