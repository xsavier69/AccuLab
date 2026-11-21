# TAREAS-MANUALES.md

Tareas fuera del código, en orden. Cada una indica cómo comprobar que quedó bien.

---

## 1. Vercel: despliegue de la migración a Astro

1. Al hacer merge de la rama a `main`, Vercel detecta `vercel.json` (`framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist`).
2. En **Project → Settings → General → Build & Development Settings**, confirma que no haya un *Override* antiguo (por ejemplo, "Output Directory: ." del sitio HTML anterior). Si lo hay, desactívalo.
3. En **Settings → General → Node.js Version**, elige **22.x** (Astro 7 requiere Node ≥ 22.12).
4. Si el build falla con el mensaje "N diferencia(s)" de `verificar-precios`, significa que un precio cambió respecto al sitio original. Es intencional: revisa `data/examenes.json`.

**Comprobación después del despliegue** (desde cualquier terminal):
```bash
curl -sI https://acculab.vercel.app/cotizar | grep -iE "^(HTTP|location)"   # 301 → https://acculab.bio/cotizar
curl -sI https://acculab.bio/index.html      | grep -iE "^(HTTP|location)"   # 308 → / (permanente, equivale a 301)
curl -sI https://acculab.bio/servicios.html  | grep -iE "^(HTTP|location)"   # 308 → /servicios
curl -sI https://www.acculab.bio/            | grep -iE "^(HTTP|location)"   # debe ser 301/308 (ver paso 2)
curl -s  https://acculab.bio/robots.txt
curl -s  https://acculab.bio/sitemap.xml | grep -c "<loc>"                    # 36
```

## 2. Vercel: redirección de `www` permanente — HECHO (20/11/2026)

`www.acculab.bio` no estaba dado de alta en ninguna parte: el 307 lo generaba
Vercel por defecto al ser un dominio con sus nameservers sin `www` asignado.
Se añadió al proyecto como **308 Permanent Redirect** a `acculab.bio`, con la
casilla "Redirect apex domains to www" **desmarcada** (el canónico es el apex).

Verificado: `https://www.acculab.bio/examenes/glucosa` → 308 → la misma ruta en
el apex, en un solo salto.

## 3. GA4

1. En https://analytics.google.com, crea la propiedad "Accu-Lab" (zona horaria de Ecuador, moneda USD) y luego un **flujo de datos web** para `https://acculab.bio`.
2. Copia el **ID de medición** (`G-XXXXXXXXXX`).
3. En Vercel, ve a **Settings → Environment Variables** → agrega `PUBLIC_GA4_ID` = `G-XXXXXXXXXX` (entorno *Production*) → **Redeploy**.
   HECHO (20/11/2026): propiedad "acculab.bio" (zona horaria Ecuador GMT-05:00, USD),
   flujo "acculab.bio - Web", y `PUBLIC_GA4_ID` cargada en Production como variable
   de tipo *Config* (el ID de medición es público: viaja en el HTML).
4. En GA4, marca como **eventos clave** (conversiones): `whatsapp_click`, `cotizador_enviar` y `phone_click`. `maps_click` queda como evento normal.
5. Comprueba en **Informes → Tiempo real** haciendo clic en un botón de WhatsApp del sitio.

## 4. Google Search Console — HECHO en parte (20/11/2026)

Propiedad de dominio `acculab.bio` verificada automáticamente por el proveedor
de DNS (Vercel), sin necesidad de registro TXT. Sitemap enviado y leído
correctamente (36 URLs). Quedan los pasos 4.6 (revisión a las 2–4 semanas).

Estado de indexación al 20/11/2026: 26 páginas indexadas, 17 sin indexar
(4 redirecciones, 3 canónicas alternativas y 10 "Descubierta: actualmente sin
indexar"). Las 10 eran fichas de examen que Google nunca había rastreado por
falta de enlaces internos; se solicitó su indexación a mano y se corrigió la
causa con el índice de exámenes del footer (commit 1e38e2d).

1. En https://search.google.com/search-console, agrega una **propiedad de dominio** `acculab.bio`.
2. Copia el registro **TXT** que te muestra y agrégalo en el DNS del dominio (en el proveedor donde compraste acculab.bio o en Vercel → Domains → DNS, según dónde estén los nameservers). Espera a que se verifique.
3. Ve a **Sitemaps** → envía `https://acculab.bio/sitemap.xml`.
4. En **Inspección de URLs** → `https://acculab.bio/` → **Solicitar indexación**. Repite con `/cotizar`, `/examenes` y 3 o 4 páginas de examen (biometría hemática, glucosa, perfil lipídico, EMO).
5. Si en algún momento se verificó `acculab.vercel.app` como propiedad, no hace falta nada más: el 301 transfiere la señal.
6. A las 2–4 semanas, revisa **Páginas** (indexación) y **Rendimiento** (consultas reales) y valida las palabras clave de SEO-ANALISIS-acculab.md.

## 5. Línea base oficial de rendimiento

El Lighthouse de AUDIT.md y del resumen final se midió localmente. Confírmalo en producción en https://pagespeed.web.dev con `https://acculab.bio/` y `https://acculab.bio/cotizar` (versión móvil).

## 6. Google Business Profile (lo que más pesa para "laboratorio clínico cuenca" y "cerca de mí")

- Confirma quién administra la ficha `cid=12753375528872564517`. Si nadie la administra, reclámala.
- **NAP idéntico al sitio:** "Accu-Lab" · "Calle Ecuador y Av. de las Américas, esquina, Consultorios El Batán, 2.º piso" · 099-640-5647 · horarios L–V 7:30–13:00 y 15:00–17:00, S 8:00–12:00 (confirmados por el cliente el 21/11/2026; Google ya los tenía así).
- Categoría principal: "Laboratorio médico" (o "Laboratorio clínico"). Sitio web: `https://acculab.bio/`.
- Sube fotos reales (fachada, recepción, toma de muestra) y pide reseñas a los pacientes. Con esas reseñas se puede activar la sección oculta del home (PENDIENTES.md).

## 7. Facebook

En la página https://www.facebook.com/ACCULABORATORIO/, pon `https://acculab.bio` como sitio web.

## 8. Validación médica

Pide a un profesional del laboratorio que revise la sección 3 de PENDIENTES.md y, si acepta figurar, agrega su nombre y cargo en `revisadoPor` (se publicará como `reviewedBy` en el schema).
