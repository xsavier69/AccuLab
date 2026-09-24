# AUDIT.md — Fase 0: auditoría de acculab.bio

Fecha: 24/09/2026 · Commit auditado: `698cf1c` (rama `claude/gallant-knuth-s53xoq`).
En esta fase no se modificó ningún archivo del sitio. Solo se agregaron `AUDIT.md`, `DESIGN-DECISIONS.md` y `audit/before/`.

Antes de esta auditoría se leyó `SEO-ANALISIS-acculab.md`. Aquí se confirma o corrige cada punto con el HTML real.

---

## 1. Stack y hosting

| Punto | Hallazgo |
|---|---|
| Stack | HTML estático escrito a mano. Sin build, sin `package.json` y sin framework. 4 páginas: `index.html`, `servicios.html`, `cotizar.html` y `nosotros.html`. |
| Hosting | Vercel (`server: Vercel`, `x-vercel-cache: HIT`, región iad1). |
| `vercel.json` | Solo `{"cleanUrls": true, "trailingSlash": false}`. No tiene `redirects` ni `headers`. |
| Producción = repo | Sí. Las 4 páginas descargadas de acculab.bio son **idénticas byte a byte** a las del repo (`diff` vacío). |
| CSS | 4 hojas sin minificar (styles 924 líneas, stylesServicio 837, stylesNosotros 346, stylesCotizador 278). Mucho CSS duplicado entre páginas. |
| JS | `js/cotizador.js` (solo en /cotizar). `js/script.js` es **código muerto**: ninguna página lo carga y busca un `#btnWhatsApp` que no existe. |
| Fuentes | Google Fonts externas: Manrope (5 pesos) + Poppins (3 pesos). Hoja que bloquea el render y 2 orígenes extra. |
| Header/footer | Copiados a mano en las 4 páginas y ya distintos entre sí (el logo de `index` enlaza a `index.html`; el de las demás, a `/`). |

### Comportamiento HTTP en producción (medido con curl)

| URL | Respuesta | Evaluación |
|---|---|---|
| `https://acculab.bio/` | 200 | OK |
| `https://acculab.bio/index.html` | 308 → `/` | OK (308 = permanente, equivale a 301 para Google) |
| `https://acculab.bio/servicios.html` | 308 → `/servicios` | OK |
| `https://www.acculab.bio/` | **307** → `https://acculab.bio/` | **Mal: 307 es temporal.** Debe ser 301/308. Se configura en el dashboard de Vercel (Domains) → irá a TAREAS-MANUALES.md |
| `https://acculab.vercel.app/cotizar` | **200** (sirve el sitio completo) | **Crítico: contenido duplicado.** Se corrige en Fase 1 con `redirects` + `has: host` |
| `https://acculab.bio/noexiste` | 404 | OK, pero con la página 404 por defecto de Vercel (no hay `404.html`) |
| `robots.txt` / `sitemap.xml` | 200 | Contenido incorrecto (ver §3) |

---

## 2. Línea base de Lighthouse (móvil)

**Método:** PageSpeed Insights devolvió `429 Quota exceeded` (la cuota pública anónima está agotada), así que se ejecutó Lighthouse 12 localmente (preset móvil: Moto G, 4G lento simulado y CPU 4×) contra una copia servida del repo, que es idéntica a producción. Se tomó la mediana de 3 corridas por página. Los JSON están en `audit/before/lighthouse/`.

| Página | Performance | Accesibilidad | Best Practices | SEO | LCP | CLS | TBT | Peso |
|---|---|---|---|---|---|---|---|---|
| `/` | 97* | 91 | 96* | 100 | 2.25 s | 0.000 | 0 ms | 215 KB |
| `/servicios` | 97* | 90 | 96* | 100 | 2.10 s | 0.000 | 0 ms | 206 KB |
| `/cotizar` | 99* | 92 | 96* | 100 | 1.80 s | 0.000 | 0 ms | 139 KB |
| `/nosotros` | 94* | 93 | 96* | 100 | **2.71 s** | 0.000 | 0 ms | 280 KB |

\* **Advertencia:** en este contenedor, Chromium no puede abrir recursos externos (Google Fonts y el iframe de Maps) por el proxy TLS del entorno. Por eso **la Performance real en producción será algo menor** (sumará la hoja de Google Fonts, que bloquea el render, más unos 8 archivos de fuente), y el −4 de Best Practices se debe únicamente a esos errores de consola del entorno. Recomiendo que confirmes la línea base oficial en https://pagespeed.web.dev (lo anoto en TAREAS-MANUALES.md en la Fase 1).

**Fallos reales detectados por Lighthouse:**
- **Contraste de color (AA) en las 4 páginas:** los eyebrows `.subtitulo` y `.subtitulo-verde` (verde lima `#8cc63f` sobre blanco ≈ 2.1:1) y párrafos grises.
- **`heading-order`** en `/`, `/servicios` y `/cotizar`: hay saltos de nivel (H2 → H4 y H1 → H3).
- **LCP en /nosotros y speed index de 3.8 s en `/`:** la imagen del hero es un `background-image` de CSS (`portada.webp`, 1706×960, 78 KB). El navegador la descubre tarde y no admite `fetchpriority` ni `srcset`.

---

## 3. SEO técnico

### robots.txt
```
Sitemap: https://acculab.vercel.app/sitemap.xml   ← dominio equivocado
```
No bloquea nada (correcto por ahora; `/_styleguide` todavía no existe).

### sitemap.xml
4 URLs, **todas en `acculab.vercel.app`**, 3 de ellas con `.html` (URLs que redirigen). `lastmod` fijo en 2026-09-07. Incluye `priority` y `changefreq`, que Google ignora.

### Canonical y og:url

| Página | canonical | og:url | ¿Coinciden? |
|---|---|---|---|
| `/` | `https://acculab.bio/` | `https://acculab.bio` (sin barra) | ✗ (diferencia menor) |
| `/servicios` | `https://acculab.bio/servicios` | `…/servicios.html` | ✗ |
| `/cotizar` | `https://acculab.bio/cotizar` | `…/cotizar.html` | ✗ |
| `/nosotros` | `https://acculab.bio/nosotros` | `…/nosotros.html` | ✗ |

### Otros metadatos
- `<html lang="es">` en las 4 páginas (debe ser `es-EC`).
- `meta keywords` en las 4 páginas; incluye "accu_lab".
- `meta author = "Accu_lab"` en el home.
- `twitter:creator = @AccuLabCuenca` en las 4 páginas (no hay evidencia de que exista la cuenta).
- `article:published_time 2010-01-01` / `article:modified_time` en páginas que no son artículos (además, puestos como `name` en vez de `property`).
- `og:image` = `logo.png` (465×206) en todas: mala vista previa en WhatsApp, que es el canal principal. `/cotizar` no tiene `twitter:image`.
- `/cotizar` y `/nosotros` no tienen `geo.*` (irrelevante: Google no usa esas etiquetas).

### Titles, descriptions y H1 actuales

| Página | Title (caracteres) | Description (caracteres) | H1 |
|---|---|---|---|
| `/` | Laboratorio Clínico en Cuenca \| Exámenes de Sangre, Orina y Heces - Accu-Lab (**76**, se corta) | 194 (se corta) | "Tu salud merece atención precisa y oportuna" — **sin palabra clave** |
| `/servicios` | Exámenes de Sangre, Orina y Heces en Cuenca \| Servicios Accu-Lab (64) | 195 | "Análisis clínicos precisos para tu bienestar" — sin "Cuenca" ni "laboratorio" |
| `/cotizar` | Cotizar Exámenes de Laboratorio en Cuenca \| Accu-Lab (53) | 163 | "Calcula el costo de tus exámenes de laboratorio" — sin "precios" ni "Cuenca" |
| `/nosotros` | Quiénes Somos \| Laboratorio Clínico Accu-Lab en Cuenca (55) | **247** | "¿Quiénes Somos?" |

Todas las descriptions superan los 155 caracteres.

### Jerarquía de encabezados (problemas)
- **Home:** H1 → H2 → **H4** (puntos y pasos, sin H3). El eyebrow "Sobre Accu-Lab" es un `<span>` (bien), pero el footer usa **H3** ("UBICACIÓN", "CONTACTO").
- **Servicios:** H1 → H2 → H3 → **H4 "Incluye"/"Pruebas disponibles"** (encabezados sin contenido semántico); los 10 paquetes son H4 directamente bajo H2 (**salto H2 → H4**). Footer en H3.
- **Cotizar:** H1 → **H3** por categoría (**falta H2**). "Exámenes Seleccionados" en H3. Footer en H3.
- **Nosotros:** H1 → H2 (visión, misión, áreas) → footer en H3. Es la más limpia.

### Enlaces internos
- `index.html` aparece como `href` **6 veces**: logo e "Inicio" del home, y `index.html#contacto-seccion` en el menú de las 4 páginas. Todas pasan por una redirección 308.
- Los enlaces son relativos (`servicios`, `cotizar`): funcionan en la raíz, pero se romperían en rutas anidadas como `/examenes/glucosa`. Hay que pasarlos a absolutos (`/servicios`).
- No hay ningún enlace hacia exámenes concretos (no existen páginas de examen).

### Imágenes y alt

| Imagen | Uso | Alt actual | Problema |
|---|---|---|---|
| `logo.png` 465×206, 63 KB | header y footer ×4 | "Accu-Lab Logo" | Sin `width`/`height`; PNG pesado para un logo que se muestra a ~40 px de alto (se podría servir en SVG/WebP de unos 5 KB) |
| `portada.webp` 1706×960, 78 KB | `<img>` en el home + **fondo CSS** del hero del home y de /nosotros | "Equipo Accu-Lab" | El alt no describe la foto: muestra **una mano con guantes pipeteando junto a una gradilla de tubos de sangre**; no es una toma de muestra ni un equipo de personas. Sin `srcset`, `width`/`height` ni `loading` |
| `equipo.jpeg` 750×550, 64 KB | `<img>` en /nosotros + **fondo CSS** en servicios | "Equipo de Laboratorio Accu-Lab" | Ver alerta abajo |

**Alerta E-E-A-T (importante):** `equipo.jpeg` es, por su composición y estilo, **una foto de banco de imágenes muy difundida** (dos personas con mascarilla y un microscopio celeste). Presentarla con el alt "Equipo de Laboratorio Accu-Lab" atribuye al laboratorio personas que probablemente no trabajan ahí. `portada.webp` también parece de stock. Según la regla de no inventar, propongo:
- mantener las fotos, pero con **alts que describan lo que se ve sin afirmar que es el personal ni el local de Accu-Lab**, por ejemplo: `portada` → "Procesamiento de muestras de sangre con micropipeta en un laboratorio clínico"; `equipo` → "Profesionales de laboratorio analizando muestras al microscopio";
- **descartar** el alt que sugería el brief ("Toma de muestra en Accu-Lab…"), porque la foto no muestra una toma de muestra ni consta que sea de Accu-Lab;
- registrar en PENDIENTES.md → Fotos: "reemplazar por fotos reales del local y del personal".

### JSON-LD existente

| Página | Bloques | Problemas |
|---|---|---|
| `/` | `MedicalBusiness` + `FAQPage` | `alternateName: "Accu_lab"`; `image` = logo; `url` sin barra final; sin `@id`, `DiagnosticLab`, `hasMap` ni `sameAs`; `serviceArea` duplica `areaServed`; `postalCode 010104` no está publicado en el sitio (se quitará: no inventar); description dice "tecnología de vanguardia". La FAQ del JSON-LD dice "ayunar 8-12 horas", pero la visible de /servicios lo matiza distinto: **debe coincidir con el texto visible** |
| `/servicios` | `BreadcrumbList` + `ItemList` | El breadcrumb apunta a `servicios.html` (URL que redirige); el `ItemList` de servicios sin `url` no aporta |
| `/cotizar` | ninguno | Falta `OfferCatalog` con los 97 precios: es la mayor oportunidad perdida |
| `/nosotros` | ninguno | — |

No hay `AggregateRating` ni `Review` (correcto).

### Afirmaciones a eliminar o neutralizar (reglas del brief)
- **"100% Precisión garantizada"** (badge del home) y **"100% Confidencial"** y **"Precisión Garantizada"** (píldoras de /servicios).
- **"16 años"**, en 7 lugares (metas, stat del home y hero de /nosotros) → "desde 2010".
- "Tecnología de vanguardia / última generación / equipos modernos que garantizan total precisión" y "profesionales certificados" (meta de /nosotros): son afirmaciones no verificables. Se reescribirán en tono prudente.
- "+90 exámenes" → el cotizador tiene **97**.
- "© 2026 Accu-Lab **Clínico**" → "Accu-Lab".
- `cotizador.js` usa el emoji ✅ en el mensaje de WhatsApp → se cambia por un guion o una viñeta de texto.
- Nombre: "Accu_lab" aparece en `alternateName`, `author`, `keywords` y en el `console.log` muerto.

### NAP
- El sitio dice "Av. **América**"; el JSON-LD pedido dice "Av. **de las Américas**". El brief define el texto visible como "Av. América", así que en el HTML visible **conservo "Av. América"** y en `streetAddress` uso lo que indica el brief. Lo anoto en PENDIENTES.md para unificarlo con la ficha de Google Business Profile, que es lo que Google cruza.
- Teléfonos, correo y horarios: consistentes en las 4 páginas. ✔
- El mapa es un iframe de Google Maps cargado con `loading="lazy"` en el home (unos 500 KB de terceros cuando entra en viewport).

---

## 4. Inventario de contenido reutilizable (fuente de verdad para las fases siguientes)

- **Cotizador:** 97 exámenes en 7 categorías: Hematológicos 9, Química General 36, Hormonas 13, Retrovirales Infecciosos 15, Seroinmunológicos 10, Orina y Heces 12, Toxicología y Otros 2. Suma de precios: $791.50. Línea base exacta (nombre, etiqueta, categoría y precio) en **`audit/before/precios-baseline.json`**, que usará el script de verificación de las fases 5 y 10.
- **10 paquetes** (en /servicios): Chequeo Preventivo Anual, Adultos Mayores, Hormonal Femenino, Hormonal Masculino, Panel de ETS, Perfil Metabólico, Perfil Deportivo, Panel de Inflamación, Panel Digestivo y Perfil de Fatiga. Exámenes de paquetes **que no están en el catálogo**: Vitamina B12, Vitamina D, Ureaplasma, Mycoplasma, HOMA y VSG. "Electrolitos" existe solo como Sodio + Potasio + Cloro por separado. "Chlamydia" = "Clamidia IgG IgM" ($30).
- **Servicios publicados:** ocupacionales (ingreso, periódicos, perfiles, alcohol y drogas, marcadores según riesgo), deportivos, toxicología (lista de sustancias y aplicaciones), convenios médicos (6 beneficios y 9 especialidades), domicilio (adultos mayores, post cirugía, poca disponibilidad de tiempo) y 6 FAQ.
- **Nosotros:** visión, misión y 6 áreas (Hematología, Química Sanguínea, Hormonas, Microbiología, Uroanálisis y Parasitología).

### Discrepancias de datos para validar (irán a PENDIENTES.md)
1. **Prueba de embarazo:** hay dos ítems, "Pruebas de Embarazo" ($7, en Seroinmunológicos, probablemente cualitativa) y "BHCG Cuantitativa" ($15). La página `/examenes/prueba-de-embarazo-en-sangre` mostrará ambas opciones con sus precios sin asumir el tipo de muestra de la de $7.
2. **FAQ de resultados:** dice "Algunos análisis especializados pueden tomar 48-72 horas". Es un dato publicado, así que se puede usar, pero con prudencia.
3. **Ayuno "8 y 12 horas":** publicado en /servicios. Se mantiene como indicación general y se marca para validación médica.

---

## 5. Resumen de prioridades para la Fase 1

1. 301 de `acculab.vercel.app` → acculab.bio (hoy sirve 200).
2. robots.txt y sitemap.xml con el dominio correcto.
3. www → 308 permanente (dashboard; hoy es 307).
4. og:url = canonical, limpieza de metadatos, `lang="es-EC"` y eliminar enlaces a `index.html`.
5. JSON-LD unificado (`MedicalBusiness` + `DiagnosticLab`) con `hasOfferCatalog` de los 97 precios.
6. H1 con palabra clave y jerarquía corregida (Fase 4, aunque el cambio es pequeño).

---

## 6. Decisión de stack (pendiente de tu OK)

Propuesta: **migrar a Astro con salida estática.** La justificación completa y las alternativas descartadas están en `DESIGN-DECISIONS.md` (D-001).

## Evidencia
- Capturas: `audit/before/{home,servicios,cotizar,nosotros}-{1440,390}.png` (páginas completas; el iframe de Google Maps aparece en blanco porque no carga en el entorno de captura).
- Lighthouse: `audit/before/lighthouse/lh-*.json`.
- Precios: `audit/before/precios-baseline.json`.
