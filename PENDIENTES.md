# PENDIENTES.md

Datos que el sitio necesita y que **no se inventaron**. Cada punto indica qué se muestra hoy en su lugar y dónde se actualiza. En producción nunca se publica un marcador de "pendiente": las secciones sin datos están ocultas o muestran un texto neutro.

---

## 1. Fotos

| Espacio | Hoy muestra | Proporción | Cómo reemplazar |
|---|---|---|---|
| Hero del home (`id="home-hero"`) | `portada.webp` (pipeta y tubos; parece de banco de imágenes) | 4:5, arco superior | Sustituir `src/assets/fotos/portada.webp` por una foto real del laboratorio o de una toma de muestra, en vertical, de 1200 px de ancho o más. Actualizar el `alt` en `src/pages/index.astro` |
| Historia en /nosotros (`nosotros-historia`) | `equipo.jpeg` (foto de stock muy difundida) | 4:3 | Foto real del equipo o del local. Reemplazar `src/assets/fotos/equipo.jpeg` o pasar otro `src` en `src/pages/nosotros.astro` y corregir el `alt` |
| Deportivo en /servicios (`servicios-deportivo`) | `equipo.jpeg` | 4:3 | Igual que el anterior, en `src/pages/servicios.astro` |
| /domicilio (`domicilio`) | Patrón de marca (placa de Petri) | 4:3 | Foto de una toma a domicilio. Pasar `src={foto}` al `<PhotoSlot>` en `src/pages/domicilio.astro` |
| Imagen principal del JSON-LD (`image`) | `https://acculab.bio/assets/portada.webp` | — | Al tener una foto real de la fachada o del interior, copiarla en `public/assets/` y cambiar `image` en `src/lib/schema.ts` |

**Importante:** los `alt` actuales describen lo que se ve sin afirmar que es el personal ni el local de Accu-Lab (D-003). Con fotos reales se pueden usar alts como "Toma de muestra en Accu-Lab, El Batán, Cuenca".

---

## 2. Datos del cliente

| Dato | Estado en el sitio | Dónde se completa |
|---|---|---|
| **Reseñas reales** (p. ej., de Google) | Sección preparada y oculta (`src/components/Resenas.astro`, arreglo `RESENAS` vacío) | Agregar reseñas verificables con autor y fuente. **No** agregar `AggregateRating` ni `Review` al JSON-LD |
| **Equipo** (nombres, cargos, registro profesional) | Bloque oculto en /nosotros (`EQUIPO = []`) | `src/pages/nosotros.astro` |
| **Calidad** (permisos ACESS, certificaciones, controles de calidad) | Bloque oculto en /nosotros (`CALIDAD = []`) | `src/pages/nosotros.astro` |
| **Responsable técnico / revisor del contenido médico** | Campo `revisadoPor: null` en cada examen; `reviewedBy` no se publica | `src/data/paginas/*.ts` → `revisadoPor: { nombre, cargo }` |
| **Precio de cada paquete** | **Oculto.** Solo se muestra "Precio del paquete: consúltalo por WhatsApp". No se publica ninguna suma, ni en /paquetes, ni en las páginas de examen, ni en el cotizador (`?paquete=` envía la lista sin precios ni total) | `src/data/paquetes.ts` (agregar un campo de precio y mostrarlo en `PackageCard.astro`) |
| **Exámenes de paquetes que no están en el cotizador:** vitamina B12, vitamina D, ureaplasma, mycoplasma, HOMA, VSG | Se muestran solo como nombre (chip sin precio ni enlace) | Si el laboratorio los realiza con precio fijo, agregarlos a `data/examenes.json`, actualizar `audit/before/precios-baseline.json` y enlazarlos en `src/data/paquetes.ts` |
| **Composición exacta de los perfiles de los paquetes** ("Función hepática/renal", "Perfil lipídico", "Electrolitos") | Se usó la composición de las páginas de perfil (hepático: TGO, TGP, bilirrubinas, FA, GGT; renal: urea, creatinina, ácido úrico; lipídico: colesterol, HDL, LDL, TG; electrolitos: Na, K, Cl). "PSA" del paquete masculino = PSA total. "Helicobacter pylori" del panel digestivo = heces (mismo precio que en sangre) | `src/data/paquetes.ts` |
| **Panel toxicológico:** qué 6 sustancias incluye | **Oculto** en la página del examen: solo dice "6 determinaciones; te confirmamos cuáles". En /servicios y /empresas se mantiene la lista original publicada en el sitio anterior | `src/data/paginas/especiales.ts` |
| **Domicilio:** zonas de cobertura, costo, horario | "Consúltanos por WhatsApp la cobertura en tu sector". Se retiró la pregunta sobre el costo | `src/pages/domicilio.astro` |
| **Formas de pago y seguros** | Omitido (sin datos) | Agregar a `src/data/faq.ts` cuando estén confirmados |
| **Correo corporativo** | Se mantiene `lilianauo@outlook.com` | `src/lib/site.ts` → `email` |
| **Dirección en Google Business Profile** | En el sitio y el JSON-LD: "Calle Ecuador y Av. de las Américas, esquina" (confirmado por el cliente el 24/09/2026) | Verificar que la ficha de Google diga exactamente lo mismo (TAREAS-MANUALES.md) |
| **Instagram, TikTok u otras redes** | Solo Facebook en `sameAs` | `src/lib/site.ts` y `src/lib/schema.ts` |

---

## 3. Validaciones médicas y operativas

Texto general y prudente; conviene que lo revise un profesional del laboratorio:

1. **"¿Necesito orden médica?"** → **Oculta.** La respuesta preparada ("Puedes realizarte exámenes con o sin orden; tu médico te indicará cuáles necesitas") está en `src/data/faq.ts` con `validar: true` y no se publica. Para mostrarla, quitar `validar: true`.
2. **Tiempo de entrega por examen:** "Generalmente en 24 h" solo aparece en los exámenes básicos (biometría, glucosa, perfiles lipídico, renal y hepático, EMO, coproparasitario, grupo sanguíneo, tiempos de coagulación, VDRL). En los 15 especializados (HbA1c, tiroides, embarazo, PSA, VIH, hepatitis, H. pylori, dengue, ferritina, toxicológico, TORCH, hormonas femeninas, testosterona, insulina y cortisol) dice **"Te lo confirmamos al agendar"**, porque el sitio anterior indicaba que algunos tardan de 48 a 72 horas. Cuando se confirme cada plazo, cambiar `entrega` en `src/data/paginas/*.ts` (y la meta description si se quiere mencionar).
3. **Ayuno de 8 a 12 horas** para glucosa, perfil lipídico, perfiles renal y hepático, insulina y hierro.
4. **Preparaciones específicas:** PSA (evitar eyaculación y ciclismo 48 h), testosterona (antes de las 10:00), prolactina (en la mañana y en reposo), H. pylori en heces (antiácidos y antibióticos), cortisol (hora de la toma), EMO (chorro medio, entrega dentro de la primera hora).
5. **Prueba de embarazo:** diferencia entre "BHCG Cuantitativa" ($15) y "Pruebas de Embarazo" ($7). El cliente confirmó que ambas están bien; el texto no afirma el tipo de muestra ni la técnica de la de $7.
6. **"Apoyo en interpretación de pruebas"** (beneficio del convenio médico, texto del sitio anterior): confirmar su alcance.
7. **Paquete "Hormonal Masculino" → PSA:** confirmar si es PSA total o total + libre (hoy `?paquete=` preselecciona el PSA total como sugerencia, sin precio).
8. **Signos de alarma del dengue** (página /examenes/dengue): texto de salud pública; validar la redacción.
