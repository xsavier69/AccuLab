// Preguntas frecuentes: SOLO con datos confirmados en el sitio publicado.
// Pagos y seguros: omitidos a propósito (sin datos). Ver PENDIENTES.md.
export interface FaqItem { p: string; r: string; grupo: string; validar?: boolean }

export const FAQ: FaqItem[] = [
  { grupo: 'Atención', p: '¿Cuál es el horario de atención?', r: 'Atendemos de lunes a viernes de 07:00 a 18:00 y los sábados de 08:00 a 13:00.' },
  { grupo: 'Atención', p: '¿Necesito cita para hacerme exámenes?', r: 'No. Puedes venir directamente dentro de nuestro horario de atención o, si prefieres, escribirnos antes por WhatsApp para coordinar y confirmar la preparación.' },
  { grupo: 'Atención', p: '¿Dónde están ubicados?', r: 'Estamos en la Calle Ecuador y Av. de las Américas, esquina, en Consultorios El Batán, 2.º piso, en Cuenca. La referencia es: altos de la farmacia Cruz Azul.' },
  { grupo: 'Atención', p: '¿Hacen toma de muestras a domicilio?', r: 'Sí. Es ideal para adultos mayores, pacientes post cirugía o personas con poca disponibilidad de tiempo. Escríbenos por WhatsApp para confirmar la cobertura en tu sector.' },
  { grupo: 'Resultados', p: '¿Cuándo están listos mis resultados?', r: 'La mayoría de nuestros exámenes tiene resultados en 24 horas. Algunos análisis especializados pueden tomar más tiempo; te lo indicamos al agendar.' },
  { grupo: 'Resultados', p: '¿Cómo recibo mis resultados?', r: 'Te enviamos tus resultados por WhatsApp o por correo electrónico, según prefieras.' },
  { grupo: 'Precios y exámenes', p: '¿Los precios publicados son finales?', r: 'Son precios referenciales. Te recomendamos confirmarlos con nosotros por WhatsApp antes de tu visita.' },
  { grupo: 'Precios y exámenes', p: '¿Puedo cotizar mis exámenes en línea?', r: 'Sí. En nuestro cotizador puedes seleccionar los exámenes que necesitas, ver el valor referencial y enviarnos la lista por WhatsApp para confirmar precio y disponibilidad.' },
  { grupo: 'Precios y exámenes', p: '¿Necesito orden médica?', r: 'Puedes realizarte exámenes con o sin orden; tu médico te indicará cuáles necesitas.', validar: true },
  { grupo: 'Preparación', p: '¿Necesito ayunar para un examen de sangre?', r: 'Depende del examen. Para glucosa y perfil lipídico, por ejemplo, generalmente se indica ayuno de 8 a 12 horas. Te confirmamos la preparación exacta al agendar.' },
];

export const FAQ_CORTA = [0, 1, 4, 5].map((i) => FAQ[i]);
