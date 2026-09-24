# DESIGN-DECISIONS.md

Registro de decisiones: qué se decidió, por qué y qué alternativa se descartó. Cada entrada tiene un estado: **Propuesta** (espera tu OK), **Aprobada** o **Revisada**.

---

## D-001 · Migrar de HTML plano a Astro (salida estática) — *Propuesta, espera tu OK*

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

## D-002 · Paleta: el logo es verde bosque, no teal — *Nota para la Fase 2 (no se aplica todavía)*

**Hallazgo:** al analizar los píxeles de `assets/logo.png`, el color dominante es un **verde bosque oscuro (~#1F5230)** con acentos **verde lima (~#5BB04A / #8CC63F)**. El CSS actual usa teal `#00665C` y lima `#8CC63F`. Los tokens de partida del brief (`--ink #0E2A33` petróleo y `--primary #1F6F78` teal) se alejan del logo hacia el azul.

**Qué propondré en la Fase 2:** conservar la dirección "clínica boutique" del brief (petróleo como tinta y superficies cálidas) y acercar `--primary` al verde del logo, en un verde-teal profundo que armonice con el logo sin chocar. El lima del logo no pasa AA como texto sobre blanco (≈2.1:1: es justo el fallo de contraste que marca Lighthouse), así que quedará reservado para detalles decorativos, nunca para texto. Mostraré ambas opciones en `/_styleguide` antes de aplicarlas.

---

## D-003 · Alt de las fotos existentes — *Propuesta*

**Qué:** describir lo que muestran las fotos (procesamiento de muestras con pipeta y profesionales al microscopio) **sin afirmar que es el personal o el local de Accu-Lab**.
**Por qué:** ambas fotos parecen de banco de imágenes. Atribuirlas al laboratorio contradice la regla de "no inventar" y es un riesgo E-E-A-T en un sitio de salud.
**Descartado:** "Toma de muestra en Accu-Lab, laboratorio clínico en El Batán, Cuenca" (sugerencia del brief), porque la foto no muestra una toma de muestra ni consta que se haya tomado en Accu-Lab.

---

## D-004 · Línea base de Lighthouse medida localmente — *Registro*

**Qué:** Lighthouse 12 móvil, ejecutado localmente sobre una copia idéntica a producción (mediana de 3 corridas).
**Por qué:** la API pública de PageSpeed Insights devolvió 429 (cuota agotada) y el Chromium del entorno no puede abrir recursos externos por el proxy TLS.
**Descartado:** desactivar la verificación TLS del navegador (no es aceptable) y publicar los números sin advertencia. Las cifras de Performance son optimistas porque no incluyen Google Fonts; se pide confirmarlas en pagespeed.web.dev.
