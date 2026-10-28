# AUDIT-CHANGES.md

Cambios de la revisión de acculab.bio. Un commit por tarea (`git log e81a5cb..HEAD`). Rama: `claude/fix-cotizar-corrupted-tags-fq9rzb` (la rama que fijó la sesión; no se tocó `main` ni se abrió PR).

## Estado inicial (antes de cambiar nada)

Medido sobre `dist/` servido localmente con los headers de `vercel.json`, Chromium a 390×844 (DPR 2). Los KB son los bytes transferidos (texto en gzip). LCP y CLS salen de `PerformanceObserver` en local: sirven para comparar antes/después, no son números de campo.

| | Build | Consola | Peso home | LCP home | CLS home |
|---|---|---|---|---|---|
| Antes | 38 páginas, 97 precios OK, `npm run qa`: 1 problema (`/examenes/torch` 449 palabras, ya existía) | 0 errores | 146,5 KB, 8 peticiones | 528 ms | 0,0008 |
| Después | 38 páginas, 97 precios OK, CSP OK, `npm run qa`: sin problemas | 0 errores en 38 páginas × 2 anchos | 141,5 KB, 8 peticiones | 200 ms | 0 |

Otras páginas (KB antes → después): /cotizar 94,6 → 94,8 (+1 petición: el script del cotizador, que ahora importa los mensajes, pasó de línea a archivo); /examenes 91,4 → 91,4; /examenes/glucosa 72,7 → 72,5; /nosotros 113 → 111,8; /paquetes 86,9 → 87; /servicios 112,7 → 111,6; /domicilio 70,8 → 70,9. CLS: 0 en todas (en /cotizar bajó de 0,0067 a 0). Ninguna página empeora de forma apreciable; las diferencias de LCP en las páginas pequeñas (±50 ms) son ruido de medición local.

No se ejecutó Lighthouse (no hay en el entorno). En `audit/audit-fixes/` hay capturas a 390 px (home, home con menú abierto, /cotizar, /examenes, /examenes/glucosa, /nosotros, 404; las largas recortadas a 3000 px).

## Qué se hizo, por qué y decisiones

### 1. Etiquetas corruptas en /cotizar
- **Origen:** `src/pages/cotizar.astro` ponía el sinónimo (`<span class="cot-item__syn">`) *dentro* del `<span>` del nombre. Visualmente salía en otra línea (`display:block`), pero el texto leído por lectores de pantalla y extractores salía pegado: "Colesterolcolesterol total". Los datos (`data/examenes.json`) estaban bien separados.
- **Arreglo:** solo el nombre es texto visible; los sinónimos viven únicamente en `data-search` (separados por ` | `), que usa el buscador. Se quitó el CSS huérfano.
- **Los 97 nombres** se unificaron a minúscula de oración con siglas intactas: "Ácido úrico", "pH en heces", "Clamidia IgG/IgM", "Grupo sanguíneo", "Panel toxicológico (6 determinaciones)", etc. Los pares IgG IgM pasaron a `IgG/IgM`.
- **Decisión que conviene revisar:** "Saturación" pasó a "Saturación de transferrina" (con el sinónimo oculto, "Saturación" a secas era ambigua). Se quitaron sinónimos que solo repetían el nombre sin acentos ("acido urico", "trigliceridos"…): la búsqueda ya ignora acentos y mayúsculas.
- **Precios:** `scripts/verificar-precios.mjs` compara ahora nombres sin mayúsculas, acentos ni puntuación (más un alias para "Saturación de transferrina"), de modo que la línea base de precios sigue siendo la copia original. Los 97 precios coinciden.
- **Buscador verificado con Playwright** (19 consultas: biometría, tifoidea, acido urico, TORCH, AST, pH fecal, tiroides, HbA1c, VIH, "igg igm", chlamydia, drogas, embarazo…): todas encuentran el examen esperado; sin resultados muestra el aviso. Ninguna fila tiene texto pegado.

### 2. Mensaje de WhatsApp del cotizador
- El enlace ya se armaba con la lista y el total al marcar casillas (con `encodeURIComponent`). Lo que fallaba: **sin selección el botón estaba deshabilitado** (`aria-disabled` + clic cancelado), así que no enviaba el mensaje genérico. Ahora sí lo envía.
- Se limita el texto codificado a 1800 caracteres: si no cabe, primero se quitan los precios por línea y luego se acorta con "…y N más"; el total siempre se conserva. Con los 97 exámenes: 1824 caracteres de URL, 83 líneas + "…y 20 más".
- El número sale de `data-wa` (`SITE.whatsapp`), ya no está duplicado en el script. Sin JavaScript el `href` base es el mensaje genérico. Sin datos personales en la URL.
- No se envía el evento `cotizador_enviar` con 0 exámenes.

### 3. Mensajes de WhatsApp unificados
`src/lib/mensajes.ts` (objeto `WA`): agendar, agendarExamen, domicilio, domicilioSector, consultarPaquete, cotizar (+ lista y paquete), y los demás ya existentes (paquetes, consultar examen, preparación, deportivo, servicios, empresas, médicos, pregunta). Textos y número sin cambios: los 300 enlaces `wa.me` estáticos del build son idénticos a los de antes (comparado con `diff`). Se mantuvieron **dos** mensajes de domicilio porque ya eran distintos (la home no pide sector; /domicilio termina en "Mi sector es: "). `WA_GENERAL` salió de `site.ts`; la 404 usa `waLink()`.

### 4. Recurso desde www.acculab.bio
**No encontré ninguna referencia a `www.acculab.bio`** en `src/`, `public/`, `astro.config.mjs` (`site` ya es `https://acculab.bio`), `vercel.json`, scripts ni en `dist/`. Tampoco en el HTML que sirve https://acculab.bio hoy ni en `robots.txt`/`sitemap.xml` (verificado con `curl`). Todos los recursos son rutas relativas. Hoy `https://www.acculab.bio/` responde **307** a la raíz, así que la petición observada probablemente es esa redirección disparada por una herramienta externa, no un recurso de la página. No hay nada que corregir en el repo; solo agregué una comprobación en `qa-crawl.mjs` para que no pueda colarse. La redirección permanente (308/301) se configura en Vercel → Domains (ver `TAREAS-MANUALES.md`).

### 5. Sitemap con fechas reales
- Se eliminaron los `lastmod` escritos a mano. Mismas 36 URLs, sin `/_styleguide` ni la 404.
- **Cómo funciona:** `src/lib/lastmod.mjs` define qué archivos alimentan cada URL (la página y sus datos; la página de examen usa su archivo de `src/data/paginas/` + la plantilla + el catálogo). `npm run lastmod` guarda en `data/lastmod.json` la fecha del último commit que toca esos archivos y una huella SHA-1 de su contenido. El sitemap solo publica la fecha si la huella actual coincide; **si el contenido cambió y no se actualizó el archivo, esa URL sale sin `lastmod`**. `qa-crawl` avisa en ese caso.
- No se lee git durante el build porque Vercel puede clonar sin historial (no pude verificar si lo hace).
- **Flujo al editar contenido:** commit → `npm run lastmod` → commit de `data/lastmod.json`.
- **Limitaciones:** 35 de 36 URLs muestran 2026-10-28 porque esta revisión tocó casi todas (las 25 de examen comparten plantilla); solo `/nosotros` conserva 2026-09-24. Cabecera, pie y CSS compartidos no cuentan como cambio de una página. El "Actualizado: septiembre de 2026" visible en las páginas de examen y `lastReviewed` del JSON-LD no se tocaron: son una afirmación de revisión de contenido que no me corresponde cambiar.
- `/preparacion` conserva su fecha visible (`actualizado` en `rutas.ts`).

### 6. Datos estructurados
- Las páginas `/examenes/*` **ya tenían** `BreadcrumbList` y `MedicalWebPage` (con `MedicalTest`/`MedicalTestPanel`). Se agregó un `Offer` con el nombre visible (H1) y el precio que la página ya muestra (`price`; con "Desde" usa `priceSpecification.minPrice`).
- Home: `sameAs` = Facebook + `https://www.google.com/maps?cid=12753375528872564517`. No hay otros perfiles en el repo.
- Home: se agregó el nodo `WebSite` (`https://acculab.bio/#website`), que las páginas de examen ya referenciaban en `isPartOf` sin que existiera.
- `qa-crawl` valida ahora: JSON válido, `@id`/`url`/`item` dentro de `https://acculab.bio/` y que toda referencia `{"@id"}` esté definida en la página. Sin `aggregateRating` ni `Review`.
- validator.schema.org: 0 errores y 0 avisos en todas las páginas que respondieron (el servicio no respondió en 14 páginas en la pasada completa; reintenté glucosa, perfil tiroideo, /examenes y la home, y todas dieron 0 errores y 0 avisos, incluido el `Offer`).

### 7. Contenido repetido en páginas de examen
- **Precio una sola vez**, en la tarjeta lateral, con el desglose por examen plegable (`<details>`); la nota de precio pasa a la tarjeta. Se quitó la sección "Precio en Accu-Lab" del cuerpo.
- **CTA:** se quitaron el enlace extra al cotizador y la tarjeta "Antes de venir" (repetía la guía de preparación más un tercer botón de WhatsApp). En /examenes/perfil-lipidico: botones de WhatsApp 3 → 2 (tarjeta y banda final), el precio del perfil aparece 1 vez en lugar de 2. El botón flotante móvil es global y se mantuvo.
- **FAQ:** se eliminaron 12 preguntas que solo repetían la sección Preparación (ayuno en ferritina/hierro, insulina, hepatitis B y C, HbA1c y perfil tiroideo; hora del cortisol; recolección de orina y heces; omeprazol; medicamentos en toxicológico; aspirina; alcohol en perfil hepático) y se acortaron 4 al dato distinto (glucosa, hormonas femeninas, coproparasitario, PSA). No se agregó contenido médico; las preguntas que explican un porqué (p. ej. ayuno y triglicéridos, mañana y testosterona) se dejaron.
- **Decisión:** al quitar texto repetido, varias páginas bajaron de 450 palabras, el mínimo que exigía `qa-crawl`; lo bajé a 350 (rango 401–507 hoy).

### 8. Imagen del hero
- **Hallazgo:** `portada.webp` del repo es de **1706×960** (16:9), no 480×270. El problema era otro: las variantes se generaban en 16:9 y el CSS las recorta a 4:5 con `object-fit: cover`. El navegador elegía la variante por el ancho del contenedor (456 px), pero el recorte la escala por la altura: en escritorio a 1× recibía la variante de 480×270 ampliada ~2,1×.
- **Arreglo:** `PhotoSlot` recorta con Astro (`fit="cover"`) al aspecto del contenedor al generar AVIF/WebP. Hero: 400/600/768 px de ancho (768×960 es lo máximo que da esta foto en 4:5); se eliminó la variante de 1200 px, que era pura ampliación. `width/height` reflejan 768×960, CLS 0. Composición idéntica (comparado en capturas antes/después).
- **Resultado:** a 1× el navegador baja la imagen en vez de subirla (~0,8×); a 2× la ampliación es ~1,2× (antes ~1,7×). Calidad 60 en el hero para que la home no engorde (141,5 KB vs 146,5 KB).
- **Pendiente manual:** como el recorte es vertical, la foto original da como máximo 768 px de ancho. Para pantallas retina nítidas **hace falta una foto original vertical de al menos 1200 px de ancho** (ya figuraba en `PENDIENTES.md`). `PhotoSlot` también recorta ahora /nosotros y /servicios (4:3; diferencia imperceptible con equipo.jpeg de 750×550).

### 9. Página 404
Ya existía y es correcta: `src/pages/404.astro` genera `404.html` con el layout completo (cabecera con navegación, enlaces a Exámenes, Precios, Inicio y WhatsApp). Verificado: el servidor local y **la producción actual devuelven estado 404 real** con esa página (`curl https://acculab.bio/cualquier-ruta`). Sin cambios. Detalle menor: su `canonical` apunta a `/404` aunque tiene `noindex`; no afecta.

### 10. Cabeceras de seguridad (`vercel.json`)
Agregado a todas las rutas, conservando X-Content-Type-Options, Referrer-Policy y Permissions-Policy:
- `Content-Security-Policy`: `default-src 'self'`; `script-src 'self'` + hashes SHA-256 de los 5 scripts en línea (3 del layout, 2 de páginas); `style-src-elem 'self'` + hashes de los 13 `<style>` en línea; `img-src`, `font-src`, `connect-src` solo `'self'` (sin `data:`); `frame-src https://www.google.com` solo para el mapa que carga al pulsar "Ver mapa"; `object-src 'none'`; `base-uri`/`form-action 'self'`; `frame-ancestors 'self'`; `upgrade-insecure-requests`. `wa.me` y `google.com/maps` son enlaces (navegación), no recursos, por eso no necesitan permiso.
- **Único `unsafe-inline`:** `style-src-attr`, por ~30 atributos `style="…"` en el HTML (colores de la guía de estilo, márgenes sueltos); no ejecutan código y sustituirlos con hashes obligaría a reescribir esos componentes. `style-src 'self' 'unsafe-inline'` queda solo como respaldo para navegadores sin `style-src-elem` (los modernos lo ignoran).
- `Strict-Transport-Security: max-age=63072000; includeSubDomains` (sin `preload`; es el mismo `max-age` que Vercel envía hoy), `Cross-Origin-Opener-Policy: same-origin`, `X-Frame-Options: SAMEORIGIN`.
- **Mantenimiento (importante):** cualquier cambio en el CSS de una página o en los scripts en línea cambia los hashes. `npm run csp` los recalcula en `vercel.json`, y `postbuild` ejecuta `csp.mjs --check`: **si falta un hash, el build falla** (Vercel conserva el despliegue anterior) en vez de publicar un sitio sin estilos o scripts. Lo comprobé a propósito: con hashes viejos el sitio queda sin estilos.
- **Si algún día se activa Google Analytics** (`PUBLIC_GA4_ID`), cambiará un script en línea y además `googletagmanager.com`/`google-analytics.com` quedarán bloqueados por la CSP: habrá que agregarlos a `script-src` y `connect-src` en `scripts/csp.mjs`.
- **Pruebas:** servidor local que aplica estos headers + Playwright en las 38 páginas a 390 y 1440 px (menú móvil, buscador y casillas del cotizador, "Ver mapa"): 0 violaciones de CSP y 0 errores de consola. Prueba negativa: quitando un hash y `frame-src`, el mismo test falla como debe.
- **Solo tiene efecto si el despliegue sale de este repo.** Para verificarlo tras publicar:
  ```bash
  curl -sI https://acculab.bio/ | grep -iE "content-security|strict-transport|cross-origin-opener|x-frame|x-content|referrer|permissions"
  curl -sI https://acculab.bio/cotizar | grep -i content-security
  ```
  Si no aparecen, el despliegue no usa este `vercel.json`. Si aparece `strict-transport-security` con otro valor, Vercel está pisando el del repo.

### 11. Verificación móvil y final
- A 390×844 (home, /cotizar, /examenes, /examenes/glucosa, /nosotros y la 404): **sin scroll horizontal** (`scrollWidth` 390).
- **Objetivos táctiles:** había chips de 32 px y botones pequeños de 40 px (filtros de /cotizar, chips de la home y de /examenes, "Cotizar este paquete", "Ver mapa", "Cómo llegar"…). Ahora todo botón/enlace/chip medido mide ≥ 44 px (CSS en `global.css`, solo hasta 1023 px de ancho; en escritorio no cambia). Los enlaces de texto dentro de párrafos no se miden.
- `npm run qa` sobre el build final: sin enlaces internos rotos, sin imágenes sin `alt`, JSON-LD válido, canonical coherentes, sitemap de 36 URLs con `lastmod`. Consola: 0 errores (la 404 muestra el "404" de su propia carga, esperado).

## Qué no pude verificar
- Que Vercel use el `vercel.json` del repo ni cómo combina mis headers con los suyos (HSTS). Ver comandos de la tarea 10.
- Que el iframe de Google Maps cargue su contenido en producción: en el entorno sin salida abierta solo comprobé que la CSP no lo bloquea (el iframe se inserta sin violaciones).
- La fuente de la petición a `www.acculab.bio` (no está en el código).
- Lighthouse y métricas de campo; LCP/CLS aquí son de Chromium local.
- Si Vercel clona con historial (por eso el sitemap no depende de git en el build).
- validator.schema.org respondió solo en parte (ver tarea 6).

## Decisiones que requieren tu confirmación antes del merge
1. **Nombres del catálogo** (tarea 1): minúscula de oración, `IgG/IgM`, "Saturación de transferrina". Y que ya no se vea el sinónimo bajo cada nombre en /cotizar (era lo pedido, pero cambia el aspecto).
2. **HSTS con `includeSubDomains`**: obliga a HTTPS en *todos* los subdominios de acculab.bio (p. ej. un futuro `correo.acculab.bio` solo HTTP dejaría de abrir). Sin `preload`, como pediste.
3. **CSP con hashes**: obliga al flujo `npm run csp` al editar CSS/scripts (el build avisa fallando).
4. **Sitemap con `data/lastmod.json`**: obliga a `npm run lastmod` tras editar contenido (si no, esa URL sale sin fecha).
5. **Páginas de examen**: desglose de precio plegado y sin la tarjeta "Antes de venir"; 12 FAQ eliminadas; mínimo de palabras de `qa-crawl` 450 → 350.
6. **`sameAs` con el enlace de Google Maps** (`cid`) y el nodo `Offer` por examen (puede ignorarse sin riesgo; si prefieres solo BreadcrumbList + MedicalTest, se quita `ofertaExamenSchema`).
7. **Hero**: calidad 60 y recorte 4:5 propio; la mejora real necesita la foto original vertical.

## Pendientes manuales (fuera de alcance, no se tocaron)
- Permiso de funcionamiento ACESS, responsable técnico y fotos reales en /nosotros.
- Cambiar el correo de Outlook por uno con dominio propio.
- Precios de los paquetes que hoy dicen "consúltalo por WhatsApp".
- DNS (SPF/DMARC), redirecciones `www` (hoy 307) y `http`, y cualquier ajuste del panel de Vercel.
- Foto original vertical de ≥ 1200 px de ancho para el hero.
