// Textos prellenados de WhatsApp: único lugar donde se definen (el número está en SITE.whatsapp).
// Se usan con waLink(mensaje) de lib/site.ts. Sin datos personales: el paciente completa lo demás en el chat.
export const WA = {
  /** Agendar un examen (botón general: cabecera, pie, home, flotante, ubicación). */
  agendar: 'Hola, quiero agendar un examen en Accu-Lab.',
  /** Agendar un examen concreto (páginas /examenes/*). */
  agendarExamen: (nombre: string) => `Hola, quiero agendar: ${nombre}`,
  /** Toma de muestras a domicilio, desde la home (sin pedir sector). */
  domicilio: 'Hola, necesito agendar una toma de muestras a domicilio.',
  /** Toma a domicilio desde /domicilio: termina en ": " para que el paciente escriba su sector. */
  domicilioSector: 'Hola, necesito agendar una toma de muestras a domicilio. Mi sector es: ',
  /** Consultar el precio de un paquete (tarjetas de /paquetes). */
  consultarPaquete: (nombre: string) => `Hola, quiero consultar el precio del paquete: ${nombre}`,
  /** Cotizar: mensaje genérico (cotizador sin selección y sin JavaScript). */
  cotizar: 'Hola, quiero cotizar exámenes en Accu-Lab.',
  /** Cotizar con exámenes elegidos: encabezado + una línea "- examen" por cada uno + pie. */
  cotizarLista: {
    encabezado: 'Hola, quiero cotizar estos exámenes en Accu-Lab:\n',
    pie: (total: string) => `\n\nTotal: ${total}\n(Precios referenciales, sujetos a confirmación.)\n¿Me confirman el valor y la disponibilidad?`,
  },
  /** Cotizar un paquete desde el cotizador (?paquete=): lista sin precios ni total. */
  cotizarPaquete: {
    encabezado: (nombre: string) => `Hola, quiero cotizar el paquete ${nombre} en Accu-Lab.\nExámenes:\n`,
    pie: '\n\n¿Me confirman el precio del paquete y la disponibilidad?',
  },
  /** Otros contextos */
  paquetesInfo: 'Hola, quiero información sobre sus paquetes de exámenes.',
  consultarExamen: 'Hola, quiero consultar si realizan un examen.',
  preparacion: 'Hola, quiero confirmar la preparación para mi examen.',
  deportivo: 'Hola, quiero información sobre exámenes deportivos.',
  servicios: 'Hola, deseo solicitar información y cotización sobre sus servicios.',
  empresas: 'Hola, represento a una empresa y quiero cotizar exámenes preocupacionales/ocupacionales. Número de trabajadores: ',
  medicos: 'Hola, soy médico/a y deseo solicitar información sobre el convenio con Accu-Lab.',
  pregunta: 'Hola, tengo una pregunta.',
} as const;
