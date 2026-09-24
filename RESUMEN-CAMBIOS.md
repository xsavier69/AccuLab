# Resumen de cambios: acculab.bio v2

Fecha: 24/09/2026 · Rama: `claude/gallant-knuth-s53xoq`

## En una línea
Se migró el sitio de 4 páginas HTML sueltas a **Astro estático con 38 páginas**, incluidas 25 páginas de examen con precio, y se aplicaron el SEO técnico completo y un sistema de diseño "clínica boutique". Las URLs, los teléfonos, la dirección, los horarios y **los 97 precios exactos** se mantienen.

---

## Resultados medidos

### Lighthouse móvil (antes → después)

| Página | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS | Peso |
|---|---|---|---|---|---|---|---|
| `/` | 97* → **99** | 91 → **100** | 96* → **100** | 100 → **100** | 2.25 → **1.95 s** | 0 → 0.024 | 215 → **150 KB** |
| `/servicios` | 97* → **100** | 90 → **100** | 96* → **100** | 100 → **100** | 2.10 → **1.35 s** | 0 → 0 | 206 → **88 KB** |
| `/cotizar` | 99* → **100** | 92 → **100** | 96* → **100** | 100 → **100** | 1.80 → **1.28 s** | 0 → 0.007 | 139 → **97 KB** |
| `/nosotros` | 94* → **100** | 93 → **100** | 96* → **100** | 100 → **100** | 2.71 → **1.43 s** | 0 → 0 | 280 → **116 KB** |

\* Las cifras "antes" eran optimistas porque, en el entorno de medición, las Google Fonts no cargaban (ver AUDIT.md). Las de "después" son realistas: todas las fuentes son locales y no hay recursos de terceros en la carga inicial. En las demás páginas (examen, hub, paquetes, preparación, empresas, médicos, domicilio, FAQ) también se obtuvo Accesibilidad, Best Practices y SEO en 100 y Performance entre 99 y 100. Reportes en `audit/after/lighthouse/`.

### Validaciones (todas en verde)
| Verificación | Resultado | Cómo repetirla |
|---|---|---|
| 97 precios = sitio original | ✔ 97/97 (suma $791.50), en datos, en el HTML generado y contra producción | `npm run verify:precios` (`-- --live` para comparar con producción). Además corre en cada build |
| JSON-LD en validator.schema.org | ✔ 38 páginas: 0 errores, 0 avisos | `npm run validar:schema` |
| Crawl interno | ✔ 0 enlaces rotos, 0 anclas rotas, 1 H1 por página, sin saltos de encabezado, titles de 30–65 y descriptions de 140–155 caracteres, todos únicos, alt y width/height en todas las imágenes, canonical = og:url, `lang="es-EC"` | `npm run qa` |
| Contenido de las páginas de examen | ✔ 451–546 palabras cada una; similitud máxima entre páginas: 7.8 % | `npm run qa -- -v` |
| Búsqueda de cadenas prohibidas | ✔ Sin "100 %", "garantizada", "Accu_lab", "Acculab", "Accu-Lab Clínico", "16 años", `index.html`, `vercel.app`, "[[PENDIENTE" ni emojis | incluido en `npm run qa` |
| Desborde horizontal a 390 px | ✔ 0 de 38 páginas | — |
| URLs antiguas | ✔ `/`, `/servicios`, `/cotizar` y `/nosotros` existen; `*.html` → 301 | `curl` en TAREAS-MANUALES.md |

---

## Qué cambió, por fase

**Fase 1 · SEO técnico:** 301 de `acculab.vercel.app` → `acculab.bio`; `.html` e `index` → URL limpia; robots.txt con el sitemap correcto y `/_styleguide` bloqueado; sitemap autogenerado (36 URLs, `lastmod` real, sin `priority`/`changefreq`); og:url = canonical; se eliminaron `keywords`, `twitter:creator` y `article:*` (salvo en la guía de preparación); `author` = Accu-Lab; `lang="es-EC"`; enlaces internos absolutos y limpios; 38 imágenes OG de 1200×630; JSON-LD `MedicalBusiness` + `DiagnosticLab` en todas las páginas con `hasOfferCatalog` (97 ofertas), `BreadcrumbList` en las páginas internas, `MedicalWebPage` en las páginas de examen y preparación, y `FAQPage` en preguntas frecuentes.

**Fase 2 · Diseño:** tokens derivados del logo (`--primary #1F5F4F`, tinta petróleo, blanco cálido y arena, latón como acento, lima solo decorativo); Fraunces + Manrope self-hosted (83 KB); escala 1.25; espaciado de 4 px; iconos Lucide inline; patrones SVG de placa de Petri y pipeta; hero con foto en arco; header fijo con blur; CTA flotante de WhatsApp en móvil; `/_styleguide` con `noindex`.

**Fase 3 · Arquitectura:** navegación Exámenes · Paquetes · Empresas · Médicos · Nosotros · Precios · Agendar por WhatsApp. Páginas nuevas: `/examenes`, 25 × `/examenes/[slug]`, `/paquetes`, `/empresas`, `/medicos`, `/domicilio`, `/preparacion` y `/preguntas-frecuentes`. Breadcrumbs visibles; el footer enlaza los 10 exámenes más buscados; anchors descriptivos.

**Fase 4 · On-page:** titles y H1 con palabra clave (home, cotizar, servicios, nosotros); se eliminaron las etiquetas pequeñas sobre los títulos (D-028); el footer usa `<p>`; descriptions únicas; alts descriptivos y honestos; vocabulario local (biometría hemática, EMO, coproparasitario, beta HCG, preocupacionales); dirección "Av. de las Américas".

**Fase 5 · Catálogo:** `data/examenes.json` (97 exámenes: slug, nombre exacto, sinónimos, categoría, precio, página, preparación y relacionados) es la fuente única del cotizador, del `hasOfferCatalog`, de `/examenes`, de los paquetes y de las páginas. Hay 25 páginas de examen con la plantilla pedida: precio, entrega, preparación, WhatsApp prellenado, 5 H2, desglose de perfiles, 3 FAQ, 3 relacionados, paquete, aviso educativo, MedlinePlus y fecha de actualización.

**Fase 6 · Paquetes y servicios:** 10 tarjetas con chips enlazados, **sin precio** ("Precio del paquete: consúltalo por WhatsApp", ver D-027) y "Cotizar este paquete" (`/cotizar?paquete=`, que envía la lista sin precios); `/empresas` con WhatsApp B2B; `/medicos` con "Solicitar convenio"; `/domicilio` sin datos inventados.

**Fase 7 · Contenido:** guía de preparación en acordeones (5 temas) y FAQ solo con datos confirmados.

**Fase 8 · Cotizador:** búsqueda sin tildes y con sinónimos ("biometria" → Hemograma), chips de categoría, resumen fijo (lateral o barra inferior), `?add=` y `?paquete=`, mensaje con lista, total y aviso de precios referenciales. La lista y los precios quedan en el HTML sin JS.

**Fase 9 · Medición:** GA4 diferido por variable de entorno; eventos `whatsapp_click`, `phone_click`, `maps_click` y `cotizador_enviar`; mapa como fachada.

**Fase 10 · QA:** capturas en `audit/after/`, comparativas en `audit/comparativa/` y scripts de verificación en `scripts/`.

---

## Datos sin confirmar: ocultos o sin precio (D-027)
- Precio de los paquetes: no se muestra ninguna suma.
- Tiempo de entrega de los 15 exámenes especializados: "Te lo confirmamos al agendar".
- La pregunta sobre la orden médica, el costo del domicilio y la lista de sustancias del panel toxicológico: ocultos.
- Reseñas, equipo, calidad y `reviewedBy`: preparados y ocultos.

## Estructura del proyecto
```
data/examenes.json          ← fuente única de los 97 exámenes y precios
src/data/paginas/*.ts       ← contenido de las 25 páginas de examen
src/data/paquetes.ts        ← 10 paquetes
src/data/faq.ts, rutas.ts   ← FAQ; titles/descriptions/lastmod de las páginas fijas
src/lib/site.ts             ← NAP, teléfonos, horarios, WhatsApp (único lugar)
src/lib/schema.ts           ← JSON-LD
src/styles/global.css       ← tokens y componentes
src/components/, src/pages/, src/layouts/
scripts/                    ← verificar-precios, qa-crawl, validar-schema, generar-catalogo
public/assets/              ← logo.png, portada.webp, equipo.jpeg (URLs originales intactas)
```
Comandos: `npm run dev` · `npm run build` · `npm run qa` · `npm run verify:precios` · `npm run validar:schema`.

## Documentos
- **PENDIENTES.md**: fotos, datos del cliente y validaciones médicas.
- **TAREAS-MANUALES.md**: Vercel (despliegue, www 308, Node 22), GA4, Search Console, PageSpeed, Google Business Profile.
- **DESIGN-DECISIONS.md**: 26 decisiones con su porqué y las alternativas descartadas.
- **AUDIT.md**: auditoría inicial.
