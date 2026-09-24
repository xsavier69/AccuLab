# DESIGN-DECISIONS.md

Registro de decisiones: qué se decidió, por qué y qué alternativa se descartó. Cada entrada tiene un estado: **Propuesta** (espera tu OK), **Aprobada** o **Revisada**.

---

## D-001 · Migrar de HTML plano a Astro (salida estática) — *Aprobada (24/09/2026)*

**Qué:** reconstruir el sitio con [Astro](https://astro.build) en modo `output: 'static'`, desplegado en el mismo proyecto de Vercel. Astro genera HTML puro en `dist/`: no hay servidor ni funciones, y el costo y el comportamiento de hosting no cambian.

**Por qué:**
1. **Escala 4 → 40+ páginas.** Hoy el header y el footer están copiados a mano en 4 archivos y ya divergen (el logo del home enlaza a `index.html` y el de las demás a `/`). Con más de 40 páginas, eso se vuelve imposible de mantener sin errores. Astro tiene layouts y componentes (`<Header/>`, `<Footer/>`, `<ExamCard/>`) que se escriben una sola vez.
2. **Páginas generadas desde datos.** `/examenes/[slug]` se genera con `getStaticPaths()` desde `data/examenes.json`. El mismo archivo alimenta el cotizador, el `hasOfferCatalog`, el hub `/examenes`, los paquetes y el footer. Así los 97 precios tienen una única fuente de verdad, y el script de verificación compara contra ella.
3. **Cero JS por defecto.** Astro no envía JavaScript salvo donde se pide explícitamente (islas). Solo el buscador del cotizador, el buscador de `/examenes` y el mapa diferido llevan un script pequeño. El resto es HTML y CSS, como hoy, y así se protegen los Core Web Vitals.
4. **URLs idénticas.** Con `build.format: 'file'` y `trailingSlash: 'never'` más el `cleanUrls: true` actual de Vercel, `/`, `/servicios`, `/cotizar` y `/nosotros` se sirven exactamente igual. Las nuevas rutas (`/examenes/glucosa`) salen igual de limpias.
5. **Herramientas integradas que el brief necesita:** `@astrojs/sitemap` (sitemap con `lastmod`, filtrando `/_styleguide`), `astro:assets` (AVIF/WebP con `srcset` y `width`/`height` automáticos), fuentes self-hosted vía `@fontsource` e imágenes OG generadas en build con `satori` + `sharp`.
6. **Bajo riesgo.** Es un generador estático maduro; si algún día se abandona, `dist/` sigue siendo HTML plano que se puede alojar en cualquier lugar.

**Alternativas descartadas:**

| Alternativa | Por qué no |
|---|---|
| Seguir con HTML plano + includes a mano | No resuelve las páginas generadas desde datos; más de 40 copias del header y el footer garantizan inconsistencias y enlaces rotos |
| HTML plano + script propio de plantillas (Node + template strings) | Reinventa Astro sin su ecosistema (imágenes, sitemap, dev server); más código propio que mantener |
| Eleventy (11ty) | Buena opción, muy cercana. Astro gana por los componentes con CSS con scope, `astro:assets` integrado y porque el cotizador interactivo encaja mejor como isla |
| Next.js / Nuxt | Framework de aplicación con runtime JS en el cliente; exceso de complejidad y de JS para un sitio de contenido. Peor para los CWV |
| WordPress / CMS | Requiere hosting con servidor, más superficie de mantenimiento y seguridad, y cambia el hosting; el cliente no pidió un CMS |

**Qué implica:**
- Se agrega `package.json` y Vercel detecta Astro automáticamente (build `astro build`, salida `dist/`). Hay que verificar en el dashboard que el *Framework Preset* quede en Astro (lo anoto en TAREAS-MANUALES.md si no se detecta solo).
- `vercel.json` se mantiene y se amplía (redirects por host y `.html` → URL limpia).
- Los archivos `*.html` de la raíz se eliminan: su contenido se migra a `src/pages/`. Las URLs antiguas `*.html` redirigen con 301/308, como hoy.
- **Condición de rollback:** si Vercel falla en el build, el despliegue anterior sigue activo (Vercel no reemplaza producción con un build fallido).

**Razones fuertes en contra que busqué y no encontré:** no hay backend, formularios con servidor, CMS ni dependencias que impidan un build estático, y el hosting ya es Vercel.

---

## D-002 · Paleta: el logo es verde bosque, no teal — *Aplicada (ver D-010)*

**Hallazgo:** al analizar los píxeles de `assets/logo.png`, el color dominante es un **verde bosque oscuro (~#1F5230)** con acentos **verde lima (~#5BB04A / #8CC63F)**. El CSS actual usa teal `#00665C` y lima `#8CC63F`. Los tokens de partida del brief (`--ink #0E2A33` petróleo y `--primary #1F6F78` teal) se alejan del logo hacia el azul.

**Qué propondré en la Fase 2:** conservar la dirección "clínica boutique" del brief (petróleo como tinta y superficies cálidas) y acercar `--primary` al verde del logo, en un verde-teal profundo que armonice con el logo sin chocar. El lima del logo no pasa AA como texto sobre blanco (≈2.1:1: es justo el fallo de contraste que marca Lighthouse), así que quedará reservado para detalles decorativos, nunca para texto. Mostraré ambas opciones en `/_styleguide` antes de aplicarlas.

---

## D-003 · Alt de las fotos existentes — *Aplicada*

**Qué:** describir lo que muestran las fotos (procesamiento de muestras con pipeta y profesionales al microscopio) **sin afirmar que es el personal o el local de Accu-Lab**.
**Por qué:** ambas fotos parecen de banco de imágenes. Atribuirlas al laboratorio contradice la regla de "no inventar" y es un riesgo E-E-A-T en un sitio de salud.
**Descartado:** "Toma de muestra en Accu-Lab, laboratorio clínico en El Batán, Cuenca" (sugerencia del brief), porque la foto no muestra una toma de muestra ni consta que se haya tomado en Accu-Lab.

---

## D-004 · Línea base de Lighthouse medida localmente — *Registro*

**Qué:** Lighthouse 12 móvil, ejecutado localmente sobre una copia idéntica a producción (mediana de 3 corridas).
**Por qué:** la API pública de PageSpeed Insights devolvió 429 (cuota agotada) y el Chromium del entorno no puede abrir recursos externos por el proxy TLS.
**Descartado:** desactivar la verificación TLS del navegador (no es aceptable) y publicar los números sin advertencia. Las cifras de Performance son optimistas porque no incluyen Google Fonts; se pide confirmarlas en pagespeed.web.dev.

---

# Fase 1 — SEO técnico

## D-005 · Redirecciones en `vercel.json` con código 301
**Qué:** `acculab.vercel.app/*` → `https://acculab.bio/*` (regla `redirects` con `has: host`); `/index.html`, `/index` y `/*.html` → URL limpia con `statusCode: 301`; además `cleanUrls: true` y `trailingSlash: false`.
**Por qué:** hoy `acculab.vercel.app` responde 200 (contenido duplicado). El brief pide 301 explícito.
**Descartado:** confiar solo en `cleanUrls`, que ya responde 308 para `.html` y que Google trata igual que un 301. Se mantiene como respaldo, pero se agrega la regla explícita para cumplir el requisito.

## D-006 · `hasOfferCatalog` solo en `/`, `/cotizar` y `/examenes`
**Qué:** la entidad `MedicalBusiness` + `DiagnosticLab` (con el mismo `@id`) va en las 38 páginas; el catálogo de 97 ofertas, agrupado en 7 sub-`OfferCatalog` por categoría, solo en las 3 páginas donde se muestran los precios.
**Por qué:** repetir unos 15 KB de ofertas en 38 páginas no aporta: Google consolida la entidad por `@id`. Las ofertas se marcan donde el precio es visible.
**Descartado:** el catálogo en todas las páginas (peso inútil) o `itemOffered: MedicalTest` (el validador lo rechaza: `Offer.itemOffered` espera `Service`/`Product`). Se usa `Service` con `url` a la página del examen.

## D-007 · `email` en el JSON-LD y sin `postalCode`
Se agrega `email` (dato visible en el sitio). Se quita `postalCode 010104`, que estaba en el JSON-LD anterior pero no aparece publicado en ninguna parte del sitio (regla: no inventar).

## D-008 · Imágenes OG generadas en el build (satori + sharp)
**Qué:** un endpoint estático `src/pages/assets/og/[slug].png.ts` genera un PNG de 1200×630 por página (38 en total): logo real, título de la página en Fraunces, dato local en Manrope, sobre `--primary` con círculos de placa de Petri.
**Por qué:** mejora la vista previa en WhatsApp, el canal principal. Se regeneran solas cuando cambia un título.
**Descartado:** crearlas a mano (no escala a más de 40 páginas) o usar un servicio externo en tiempo real (dependencia y latencia).

## D-009 · Sitemap propio en vez de `@astrojs/sitemap`
**Qué:** `src/pages/sitemap.xml.ts` lista las 11 páginas indexables y las 25 de examen, con `lastmod` tomado del registro de contenido (`src/data/rutas.ts` y el campo `actualizado` de cada examen). No incluye `priority` ni `changefreq`.
**Por qué:** el `lastmod` refleja cuándo cambió el contenido, no la fecha de cada build (Google ignora los `lastmod` que cambian siempre). `/_styleguide` y `/404` quedan fuera.

# Fase 2 — Sistema de diseño

## D-010 · Paleta final
| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--ink` | #0E2A33 | texto | 14.2:1 sobre `--surface` |
| `--ink-2` | #3B525A | texto secundario | 7.8:1 |
| `--ink-3` | #5A6D73 | metadatos | 5.1:1 |
| `--primary` | **#1F5F4F** | marca, botones, enlaces | 7.0:1; blanco sobre primary 7.5:1 |
| `--leaf` | #8CC63F | lima del logo, **solo decorativo** | 2.05:1 (no apto para texto) |
| `--accent` / `--accent-ink` | #B08448 / #85602B | filetes / eyebrows | 5.35:1 |
| `--surface` / `--surface-2` | #FAF8F5 / #F2EDE5 | blanco cálido / arena | — |
| `--whatsapp` | #25D366 | solo botones de WhatsApp, con texto `--ink` | 7.6:1 |

**Por qué #1F5F4F:** es un verde-teal profundo a medio camino entre el verde bosque del logo (#1F5230) y el teal del brief (#1F6F78). Armoniza con el logo sin volverse "verde farmacia" y conserva la sobriedad clínica.
**Descartado:** el teal #1F6F78 del brief, que sobre el logo se veía azulado y desconectado (se muestra comparado en `/_styleguide`), y el lima como color de eyebrows (era el fallo de contraste de Lighthouse en el sitio anterior).
**Descartado:** texto blanco sobre el botón de WhatsApp (1.98:1, no cumple AA); se usa texto `--ink`.

## D-011 · Tipografía: Fraunces 400 + Manrope 400/600/700, self-hosted
**Qué:** los archivos woff2 del subset latin (incluye á, é, ñ, ¿, ¡) se importan desde `@fontsource` y Vite los versiona. Se precargan Manrope 400 y Fraunces 400 con `font-display: swap`, y se definen fallbacks métricos (Georgia y Arial con `size-adjust`) para evitar CLS. Fraunces itálica solo para el acento del H1. Escala 1.25 y `text-wrap: balance` en los títulos. Peso total: unos 83 KB.
**Descartado:** Instrument Serif (un solo peso, sin itálica equilibrada para acentos), Geist (menos cálida para el tono "boutique") y Google Fonts CDN (bloquea el render, 2 orígenes extra y cookies de terceros).

## D-012 · CSS en línea (`inlineStylesheets: 'always'`)
Todo el CSS (unos 30 KB, 6 KB con gzip) va dentro del HTML: no hay ninguna petición que bloquee el render. Casi todas las visitas llegan desde Google a una sola página, así que la caché entre páginas pesa menos que el primer render. **Descartado:** un archivo CSS externo cacheable, que suma un viaje de red en móvil.

## D-013 · Iconos Lucide inline con trazo 1.6
Un solo set lineal (Lucide, ISC), con los SVG copiados en `src/components/Icon.astro`, sin dependencia en runtime. Las únicas excepciones son los glifos de marca de WhatsApp y Facebook (relleno), porque su reconocimiento depende de la forma oficial. **Descartado:** Phosphor (más pesado, estilo menos neutro) y los emojis.

## D-014 · Movimiento
Fade + 12 px en 500 ms (`cubic-bezier(.22,1,.36,1)`) mediante IntersectionObserver. Solo se aplica con `html.js` y `prefers-reduced-motion: no-preference`: sin JS o con movimiento reducido, todo se ve de inmediato. El hero no se anima, para no retrasar el LCP.

## D-015 · Fotos: `<Picture>` AVIF + WebP de respaldo, arco en el hero
`portada.webp` se sirve en 4 tamaños (400–1200 px), en AVIF y WebP, con `fetchpriority="high"` y `loading="eager"` en el hero; el resto va en `lazy`. El hero usa un marco en arco (radio 200 px arriba) que da un aire "boutique" sin necesitar más fotos. `equipo.jpeg` aparece en /servicios y /nosotros. Los espacios para fotos futuras (`PhotoSlot` con `aspect-ratio` fijo) muestran un patrón de placa de Petri mientras no haya foto.
**Descartado:** el respaldo en PNG (Astro lo genera por defecto; llegaba a 498 KB) y usar la portada como fondo CSS (no admite `srcset` ni `fetchpriority`, y era la causa del LCP lento del sitio anterior).

## D-016 · Mapa como fachada
Se muestra una tarjeta con un patrón de cuadrícula, la dirección y dos botones: "Ver mapa" (inyecta el iframe de Google Maps al hacer clic) y "Cómo llegar" (enlace a la ficha CID). **Descartado:** una imagen de Static Maps, que exige una API key de Google con facturación.

# Fase 3 — Arquitectura

## D-017 · Categorías del catálogo
Las 7 categorías originales del cotizador se reordenaron en 7 categorías clínicas: Hematología y coagulación, Química sanguínea, Hormonas, Infecciosas y serología, Inmunología y marcadores, Orina y heces, Toxicología y cultivos. **Por qué:** el grupo original "Retrovirales Infecciosos" incluía PSA, y "Seroinmunológicos" incluía la prueba de embarazo. Nombres y precios **no cambian**: solo cambia el agrupamiento.

## D-018 · Páginas de perfil: precio = suma; opciones = "desde"
Los perfiles (lipídico, renal, hepático, tiroideo, TORCH, hormonas femeninas, coagulación, hepatitis B y C, ferritina y hierro) muestran la suma de sus componentes con el desglose. Las páginas con alternativas (prueba de embarazo: $15 o $7; PSA total o libre; H. pylori en sangre o en heces) muestran "desde" y explican que no se suman. En `?add=` de una página de opciones se agrega solo la primera opción.

## D-019 · Título de las páginas de examen
Patrón "[Examen] en Cuenca: Precio y Preparación | Accu-Lab". Si supera 65 caracteres, se omite "| Accu-Lab" (Google suele añadir el nombre del sitio). Hoy ninguna página lo supera.

## D-020 · `/_styleguide` mediante una ruta dinámica
Astro ignora los archivos de `src/pages` que empiezan con "_", así que la guía se genera con `[guia].astro` + `getStaticPaths`. Lleva `noindex` y está bloqueada en robots.txt.

# Fases 4–8 — Contenido y cotizador

## D-021 · Sin "16 años" y sin conteo dinámico de años
Como el sitio es estático, un "X años" calculado en el build quedaría congelado hasta el siguiente despliegue. Se usa "desde 2010" y "más de una década". **Descartado:** calcularlo con JS en el cliente (texto distinto para Google y para el usuario).

## D-022 · Afirmaciones eliminadas
Se eliminaron: "100% precisión garantizada", "100% confidencial", "precisión garantizada", "tecnología de vanguardia / última generación", "equipos que garantizan total precisión", "profesionales certificados" y "© Accu-Lab Clínico". Se conserva lo que el sitio ya afirmaba de forma verificable: la confidencialidad (en tono no absoluto), las 24 h en la mayoría de exámenes, la atención sin cita y la toma a domicilio. La misión y la visión se mantienen textuales porque son declaraciones institucionales del cliente.

## D-023 · Contenido médico
Cada página de examen tiene entre 451 y 546 palabras en `<main>` (medido por `scripts/qa-crawl.mjs`), con una similitud máxima entre páginas del 7.8 % (shingles de 6 palabras). El texto es general y prudente, remite siempre al médico y usa la frase de aviso educativo exigida. En dengue se incluyen los signos de alarma con la indicación de acudir a emergencias: omitirlos sería imprudente.

## D-024 · Cotizador
- Lista completa en HTML (indexable y visible sin JS). Con JS se activan: búsqueda sin tildes con sinónimos, chips de categoría, resumen lateral fijo (escritorio) o barra inferior expandible (móvil), `?add=` (examen o página) y `?paquete=`.
- El mensaje de WhatsApp incluye la lista con precios, el total y "Precios referenciales, sujetos a confirmación". Se cambió el emoji ✅ del mensaje anterior por guiones.
- **Descartado:** ocultar el total (versión "simplificada" de un commit anterior). El brief pide incluirlo.

# Fase 9 — Medición

## D-025 · GA4 diferido y opcional
Si existe `PUBLIC_GA4_ID` (variable de entorno de Vercel), gtag se carga tras la primera interacción o 4 s después de `load`; los eventos previos quedan en `dataLayer`. Sin ID no se carga nada. Eventos: `whatsapp_click` (con `page_path`, `examen` y `paquete` cuando aplica), `phone_click`, `maps_click` y `cotizador_enviar` (`num_examenes`, `total`, `paquete`). **Descartado:** Google Tag Manager (más JS) y Partytown (complejidad innecesaria para un solo tag).

## D-026 · El build verifica los precios
`npm run build` ejecuta `scripts/verificar-precios.mjs` después de `astro build`. Si alguno de los 97 precios difiere de `audit/before/precios-baseline.json`, el build falla y Vercel mantiene el despliegue anterior. Si el laboratorio cambia un precio a propósito, hay que actualizar la línea base en el mismo commit.

# Ajuste previo al PR (pedido del cliente: "lo que no esté confirmado, sin precio u oculto")

## D-027 · Nada publicado que dependa de datos sin confirmar
**Qué:**
- **Paquetes sin precio:** se eliminó el "valor de los exámenes por separado" de las tarjetas, de /paquetes, de las páginas de examen y del cotizador. Con `?paquete=` el cotizador preselecciona los exámenes como sugerencia, oculta el total y los precios individuales, y envía por WhatsApp solo la lista de nombres para pedir el precio del paquete. Los 6 exámenes que no están en el catálogo aparecen solo por su nombre, sin la etiqueta "precio a consultar".
- **Tiempo de entrega:** "Generalmente en 24 h" se mantiene solo en los 10 exámenes básicos. En los 15 especializados dice "Te lo confirmamos al agendar", y sus meta descriptions ya no mencionan 24 h.
- **Ocultos:** la pregunta "¿Necesito orden médica?" (filtrada por `validar: true`), la pregunta sobre el costo del domicilio y la lista de sustancias en la página del panel toxicológico (el panel tiene 6 determinaciones y el sitio anterior listaba 7 sustancias).

**Por qué:** una suma visible junto a un paquete se lee como su precio. Un plazo de 24 h en un examen que puede tardar 72 h genera reclamos. En los tres casos, un visitante podía confundirse.
**Descartado:** mostrar la suma con una advertencia (sigue pareciendo un precio) y quitar los paquetes del sitio (son contenido publicado y sirven para el SEO).

## D-028 · Sin etiquetas pequeñas sobre los títulos
**Qué:** se eliminaron todas las etiquetas en versalitas que iban sobre los títulos ("97 exámenes con precio", "Precios publicados", "Proceso simple", la categoría en las tarjetas de examen y la línea dorada de las imágenes OG). También se retiraron sus estilos (`.eyebrow`, `.exam-card__cat`).
**Por qué:** pedido del cliente: ese recurso se percibe como un sello de sitios generados con IA. La jerarquía la sostienen el título en serif y el espaciado.
**Descartado:** conservarlas solo en algunas secciones (se pidió quitarlas de todas las páginas).
