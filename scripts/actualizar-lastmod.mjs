// Recalcula data/lastmod.json (fechas del sitemap). Ejecutar con el historial completo de git, después de
// confirmar (commit) los cambios de contenido:  npm run lastmod
// - Si los archivos fuente de una URL no cambiaron desde la última ejecución, se conserva su fecha.
// - Si cambiaron: fecha del último commit que los toca; si tienen cambios sin confirmar, la fecha de hoy.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fuentes, huella, leerManifest, rutasConocidas, MANIFEST } from '../src/lib/lastmod.mjs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
if (git('rev-parse', '--is-shallow-repository') === 'true') {
  console.error('El repositorio es superficial (shallow): no hay historial para calcular fechas. Usa `git fetch --unshallow`.');
  process.exit(1);
}
const hoy = new Date().toISOString().slice(0, 10);
const previo = leerManifest();
const nuevo = {};
let cambios = 0;
for (const ruta of rutasConocidas()) {
  const src = fuentes(ruta);
  const h = huella(src);
  let fecha = previo[ruta]?.huella === h ? previo[ruta].fecha : null;
  if (!fecha) {
    const sucio = git('status', '--porcelain', '--', ...src) !== '';
    const commit = git('log', '-1', '--format=%cs', '--', ...src);
    fecha = sucio || !commit ? hoy : commit;
    cambios++;
  }
  nuevo[ruta] = { fecha, huella: h };
}
fs.writeFileSync(MANIFEST, JSON.stringify(nuevo, null, 2) + '\n');
console.log(`${Object.keys(nuevo).length} URLs · ${cambios} fecha(s) recalculada(s) → ${MANIFEST}`);
