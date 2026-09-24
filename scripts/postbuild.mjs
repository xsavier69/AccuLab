// Después de `astro build`: verifica que los 97 precios publicados sigan idénticos a la línea base.
// Si hay diferencias, el build falla y Vercel mantiene el despliegue anterior.
import { execFileSync } from 'node:child_process';
execFileSync('node', ['scripts/verificar-precios.mjs'], { stdio: 'inherit' });
