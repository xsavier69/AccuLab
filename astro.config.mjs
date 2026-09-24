// @ts-check
import { defineConfig } from 'astro/config';

// Salida 100 % estática. URLs limpias sin barra final (Vercel: cleanUrls + trailingSlash:false).
export default defineConfig({
  site: 'https://acculab.bio',
  trailingSlash: 'never',
  build: {
    format: 'file',            // /servicios -> servicios.html (Vercel lo sirve como /servicios)
    inlineStylesheets: 'always' // CSS crítico en línea: 0 peticiones que bloqueen el render
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
