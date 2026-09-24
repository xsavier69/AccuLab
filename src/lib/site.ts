// Datos confirmados del laboratorio (fuente: sitio publicado). Único lugar donde se definen.
export const SITE = {
  url: 'https://acculab.bio',
  marca: 'Accu-Lab',
  nombreLegal: 'Accu-Lab Laboratorio Clínico',
  fundacion: 2010,
  telefonos: [
    { visible: '099-640-5647', tel: '+593996405647' },
    { visible: '099-596-9554', tel: '+593995969554' },
  ],
  whatsapp: '593996405647',
  email: 'lilianauo@outlook.com',
  direccion: {
    linea1: 'Calle Ecuador y Av. de las Américas, esquina',
    linea2: 'Consultorios El Batán, 2.º piso',
    referencia: 'Altos de farmacia Cruz Azul',
    ciudad: 'Cuenca, Azuay',
  },
  geo: { lat: -2.8995369, lng: -79.0270565 },
  mapsUrl: 'https://www.google.com/maps?cid=12753375528872564517',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d727.2271893411493!2d-79.0270565!3d-2.8995369!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd22a396ade1d9%3A0xb0fd1779259bd725!2sAccu-Lab!5e1!3m2!1ses-419!2sec!4v1772419075209!5m2!1ses-419!2sec',
  facebook: 'https://www.facebook.com/ACCULABORATORIO/',
  horarios: [
    { dias: 'Lunes a viernes', horas: '07:00 – 18:00' },
    { dias: 'Sábados', horas: '08:00 – 13:00' },
  ],
  horarioCorto: 'L–V 07:00–18:00 · S 08:00–13:00',
} as const;

/** Enlace de WhatsApp con mensaje prellenado. */
export function waLink(mensaje?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export const WA_GENERAL = 'Hola, quiero agendar un examen en Accu-Lab.';

/** Formato de precio igual al del cotizador original: $2.50 */
export const precio = (n: number) => `$${n.toFixed(2)}`;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const mesAnio = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  return `${MESES[d.getMonth()]} de ${d.getFullYear()}`;
};

