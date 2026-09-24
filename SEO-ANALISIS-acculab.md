# Análisis SEO — acculab.bio

Revisión del 24/09/2026 de las 4 páginas públicas, `robots.txt`, `sitemap.xml`, el dominio de Vercel, la indexación en buscadores y la competencia en Cuenca.

**Limitaciones:** sin acceso a Search Console, Analytics ni Google Business Profile (no hay datos de tráfico, clics ni posiciones reales). No se inspeccionó el HTML crudo ni el render: se desconoce si ya existe JSON-LD. Los volúmenes de búsqueda no están medidos; las palabras clave se deducen de la competencia y del vocabulario local, y hay que validarlas en Search Console después del lanzamiento.

---

## 1. Resumen ejecutivo

| Prioridad | Hallazgo | Efecto |
|---|---|---|
| 🔴 Crítico | `robots.txt` y `sitemap.xml` apuntan a **acculab.vercel.app** con URLs `.html`, no a acculab.bio | Google recibe un mapa del sitio con URLs no canónicas de otro dominio |
| 🔴 Crítico | **acculab.vercel.app sirve el sitio completo** (responde 200, sin redirección) | Contenido duplicado; solo lo mitiga el canonical |
| 🔴 Crítico | Google muestra una **versión vieja** del home ("Accu_lab… calidez humana… 100% Confiables") | El sitio actual no está bien reindexado |
| 🟠 Alto | Home H1 = "Tu salud merece atención precisa y oportuna" (sin palabra clave). /servicios y /cotizar igual de genéricos | Se desperdicia la señal on-page más fuerte |
| 🟠 Alto | **No hay una página por examen.** Los precios existen, pero están en una sola lista | Se pierde la mayor oportunidad (ver §4) |
| 🟠 Alto | Marca ambigua: existen "Acculab" en Egipto, EE. UU. y de software; el sitio alterna Accu-Lab / Acculab / Accu_lab | Las búsquedas de marca compiten con empresas globales |
| 🟡 Medio | Jerarquía de encabezados rota: los eyebrows ("Sobre Accu-Lab", "Visítanos") son H3 antes de su H2; footer en H4 | Estructura semántica confusa |
| 🟡 Medio | `og:image` = logo, `twitter:creator` @AccuLabCuenca probablemente inexistente, `article:published_time` en páginas que no son artículos, `og:url` con `.html` ≠ canonical | Mala vista previa en WhatsApp, que es el canal principal |
| 🟡 Medio | Alt de imágenes genéricos ("Equipo Accu-Lab", "Accu-Lab Logo") | Señal de imagen desaprovechada |
| 🟡 Medio | Correo @outlook.com, sin autor ni responsable técnico visible | E-E-A-T débil en un tema de salud (YMYL) |
| 🟢 Bajo | `meta keywords` (Google la ignora) y vocabulario no local ("Hemograma" en lugar de "biometría hemática", "EMO" sin expandir) | Menor coincidencia con las búsquedas reales en Ecuador |

**Lo que ya está bien:** títulos y descripciones con "Cuenca", canonical correctos, `lang`/`og:locale` es_EC, `geo.region` EC-A, URLs limpias (`/servicios.html` → `/servicios`), el mapa embebido vinculado a una ficha real de Google ("Accu-Lab", CID 12753375528872564517) y precios públicos en HTML indexable.

---

## 2. SEO técnico

### 2.1 robots.txt (actual)
```
User-agent: *
Allow: /
Sitemap: https://acculab.vercel.app/sitemap.xml   ← dominio incorrecto
```

### 2.2 sitemap.xml (actual)
Contiene 4 URLs, todas `https://acculab.vercel.app/…` y 3 con `.html`. Deben ser `https://acculab.bio/`, `/servicios`, `/cotizar` y `/nosotros`, más las páginas nuevas.

### 2.3 Dominio duplicado
`acculab.vercel.app` responde con el sitio completo. Se necesita una redirección 301 por host hacia acculab.bio (en `vercel.json` o en la configuración de dominios de Vercel). También hay que verificar que `www.acculab.bio` redirija con 301 a la versión sin www.

### 2.4 Metadatos a corregir en todas las páginas
- `og:url` debe ser idéntico al canonical (sin `.html`).
- `og:image`: una imagen de 1200×630 por página, no el logo.
- Eliminar `twitter:creator` si la cuenta no existe, además de `meta keywords` y `article:*` fuera de artículos.
- `meta-author: Accu_lab` → "Accu-Lab".
- Enlaces internos a `/index.html` → `/`.

### 2.5 Datos estructurados
No se puede confirmar si hay JSON-LD. Hace falta `MedicalBusiness` + `DiagnosticLab` con NAP (nombre, dirección y teléfono), coordenadas (-2.8995369, -79.0270565, tomadas del embed), horarios, teléfono, `hasMap`, `sameAs` (Facebook: facebook.com/ACCULABORATORIO) y `hasOfferCatalog` con los exámenes y sus precios. También `BreadcrumbList` en páginas internas y `MedicalWebPage` en las páginas de examen.
**No** marcar `AggregateRating` con reseñas propias: Google no muestra estrellas de reseñas "self-serving" de un LocalBusiness.

---

## 3. On-page por página

| Página | Title actual (largo) | Propuesta de title | H1 propuesto |
|---|---|---|---|
| `/` | "Laboratorio Clínico en Cuenca \| Exámenes de Sangre, Orina y Heces - Accu-Lab" (76, se corta) | Laboratorio Clínico en Cuenca – Resultados en 24 h \| Accu-Lab | Laboratorio clínico en Cuenca con resultados en 24 horas |
| `/servicios` | OK, 64 | Servicios de Laboratorio Clínico en Cuenca \| Accu-Lab | Servicios de laboratorio clínico en Cuenca |
| `/cotizar` | "Cotizar Exámenes…" | **Precios de Exámenes de Laboratorio en Cuenca \| Accu-Lab** | Precios de exámenes de laboratorio en Cuenca |
| `/nosotros` | OK | Sobre Accu-Lab – Laboratorio Clínico en El Batán desde 2010 | Accu-Lab: laboratorio clínico en Cuenca desde 2010 |

La gente busca "**precio** examen de sangre", no "cotizar". La URL `/cotizar` se conserva y cambian el title y el H1.

El tono elegante no se pierde: el H1 lleva la palabra clave y el titular emocional ("Tu salud merece atención precisa") pasa a subtítulo o eyebrow.

---

## 4. Oportunidad principal: páginas por examen con precio

- Buscar "examen hemograma precio Cuenca" devuelve laboratorios de **Perú y Argentina**. Ningún laboratorio de Cuenca tiene páginas de examen con precio.
- Competidores locales: **Veris** (ISO 9001, FAQ, sin cita), **CLINSA** (testimonios, 3 sedes), **Platinum** (página dedicada a domicilio y servicios por área). **BioquiLab** y **Microlab** solo tienen Facebook.
- Accu-Lab ya publica 97 precios. Convertir los ~25 exámenes más buscados en páginas propias (qué mide, preparación, tiempo de entrega, precio, CTA de WhatsApp) es el mayor salto de SEO disponible **sin pedirle nada al cliente**.

### Grupos de palabras clave (vocabulario de Ecuador)
| Intención | Consultas objetivo |
|---|---|
| Marca/local | laboratorio clínico cuenca, laboratorio el batán, laboratorio cerca de mí, accu-lab cuenca |
| Precio | precio exámenes de laboratorio cuenca, cuánto cuesta un examen de sangre, precio biometría hemática |
| Examen | biometría hemática / hemograma, glucosa, perfil lipídico, hemoglobina glicosilada, perfil tiroideo TSH, prueba de embarazo en sangre (beta HCG), **EMO** (elemental y microscópico de orina), **coproparasitario**, PSA, VIH, helicobacter pylori, dengue |
| Empresas | exámenes **preocupacionales** / ocupacionales cuenca, prueba de drogas / toxicológico cuenca |
| Servicio | exámenes a domicilio cuenca, toma de muestras a domicilio |
| Información | ayuno para examen de sangre, cómo recoger muestra de orina/heces |

---

## 5. SEO local (fuera del sitio)

Para "laboratorio clínico cuenca" y "cerca de mí", lo que más pesa es **Google Business Profile** (categoría, reseñas, fotos, NAP), no el sitio.
- La ficha existe (el embed la referencia), pero no se sabe quién la administra.
- **NAP a unificar:** el sitio dice "Av. América" y el nombre oficial es "Av. de las Américas". Debe coincidir exactamente con la ficha de Google.
- La página de Facebook (772 seguidores) debería enlazar a acculab.bio.

---

## 6. E-E-A-T (salud = YMYL)

Google exige más confianza en contenido de salud. Hoy falta: responsable técnico con nombre y registro, revisor del contenido médico, permisos y certificaciones, fotos reales, reseñas y correo corporativo. Todo eso depende del cliente y va en el **Prompt 2**. El Prompt 1 deja la estructura lista (campos `reviewedBy`, espacios para fotos, página de calidad) sin inventar nada.

---

## 7. Qué va en cada prompt

| Prompt 1 — ahora, sin cliente | Prompt 2 — cuando haya info/fotos |
|---|---|
| robots, sitemap, redirecciones, metadatos, JSON-LD con datos públicos | Google Business Profile, reseñas, NAP definitivo |
| Titles/H1, jerarquía, enlazado interno | Responsable técnico, revisor médico, `reviewedBy` |
| ~25 páginas de examen + hub + paquetes con suma de precios | Precios reales de paquetes, validación de preparación y tiempos |
| /empresas, /medicos, /domicilio (sin datos inventados), /preparacion, /preguntas-frecuentes | Zonas y costo de domicilio, seguros, formas de pago |
| Rediseño premium completo con las 2 fotos existentes + tipografía/iconos | Fotos profesionales, galería, OG con fotos |
| Imágenes OG generadas, medición GA4 de clics a WhatsApp | Correo de dominio, redes, backlinks con médicos y empresas |

Fuentes consultadas: [acculab.bio](https://acculab.bio), [robots.txt](https://acculab.bio/robots.txt), [sitemap.xml](https://acculab.bio/sitemap.xml), [acculab.vercel.app](https://acculab.vercel.app/), [Veris Laboratorio](https://www.veris.com.ec/laboratorio/), [CLINSA](https://www.clinsalab.com/), [Laboratorio Platinum](https://laboratorioplatinum.com/servicios/), [Platinum domicilio](https://laboratorioplatinum.com/servicio-a-domicilio/), [Facebook Accu-Lab](https://www.facebook.com/ACCULABORATORIO/).
