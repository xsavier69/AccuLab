import { SITE } from './site';
import { EXAMENES, CATEGORIAS } from './catalogo';

const U = SITE.url;
export const LAB_ID = `${U}/#lab`;

/** Entidad global del laboratorio (todas las páginas). `conCatalogo` agrega hasOfferCatalog con los 97 precios. */
export function labSchema(conCatalogo = false) {
  const lab: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'DiagnosticLab'],
    '@id': LAB_ID,
    name: 'Accu-Lab Laboratorio Clínico',
    alternateName: 'Accu-Lab',
    url: `${U}/`,
    logo: `${U}/assets/logo.png`,
    image: `${U}/assets/portada.webp`,
    telephone: '+593996405647',
    email: SITE.email,
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Ecuador y Av. de las Américas, esquina. Consultorios El Batán, 2.º piso',
      addressLocality: 'Cuenca',
      addressRegion: 'Azuay',
      addressCountry: 'EC',
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '13:00' },
    ],
    areaServed: { '@type': 'City', name: 'Cuenca' },
    sameAs: [SITE.facebook],
  };
  if (conCatalogo) {
    lab.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Exámenes de laboratorio clínico',
      itemListElement: CATEGORIAS.map((c) => ({
        '@type': 'OfferCatalog',
        name: c.nombre,
        itemListElement: EXAMENES.filter((e) => e.categoria === c.slug).map((e) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: e.nombre,
            ...(e.pagina ? { url: `${U}/examenes/${e.pagina}` } : {}),
          },
          price: e.precio.toFixed(2),
          priceCurrency: 'USD',
        })),
      })),
    };
  }
  return lab;
}

export interface Crumb { name: string; path: string }
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.path === '/' ? `${U}/` : `${U}${c.path}`,
    })),
  };
}

export function faqSchema(faqs: { p: string; r: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
  };
}

export function medicalWebPageSchema(o: {
  path: string; name: string; description: string; lastReviewed: string;
  about?: Record<string, unknown>; reviewedBy?: { nombre: string; cargo: string } | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${U}${o.path}#webpage`,
    url: `${U}${o.path}`,
    name: o.name,
    description: o.description,
    inLanguage: 'es-EC',
    lastReviewed: o.lastReviewed,
    ...(o.about ? { about: o.about } : {}),
    // reviewedBy: se agrega solo cuando exista un revisor profesional real (ver PENDIENTES.md).
    ...(o.reviewedBy ? { reviewedBy: { '@type': 'Person', name: o.reviewedBy.nombre, jobTitle: o.reviewedBy.cargo } } : {}),
    publisher: { '@id': LAB_ID },
    isPartOf: { '@type': 'WebSite', '@id': `${U}/#website`, url: `${U}/`, name: 'Accu-Lab' },
  };
}
