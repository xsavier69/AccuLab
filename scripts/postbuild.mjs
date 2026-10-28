// Después de `astro build`:
// 1) verifica que los 97 precios publicados sigan idénticos a la línea base;
// 2) verifica que la CSP de vercel.json cubra todos los scripts y <style> en línea de dist/.
// Si algo falla, el build falla y Vercel mantiene el despliegue anterior.
import { execFileSync } from 'node:child_process';
execFileSync('node', ['scripts/verificar-precios.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/csp.mjs', '--check'], { stdio: 'inherit' });
