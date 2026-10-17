// Verifica automáticamente los requisitos de la guía y la rúbrica en cada página HTML.
// Uso:
//   npm run check:rubrica        estructura de cada página (bloquea commits y pull requests)
//   npm run check:rubrica:final  además exige mínimos de contenido (galería, tabla, cards, formulario)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const PAGINAS = ['index.html', 'informacion.html', 'galeria.html', 'tabla.html', 'contacto.html'];
const SEMANTICAS = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
const METAS = [
  /<meta\s+charset=/i,
  /<meta\s+name="viewport"/i,
  /<meta\s+name="description"\s+content="[^"]+"/i,
  /<meta\s+name="keywords"\s+content="[^"]+"/i,
  /<meta\s+name="author"\s+content="[^"]+"/i,
  /<meta\s+property="og:title"\s+content="[^"]+"/i,
  /<meta\s+property="og:description"\s+content="[^"]+"/i,
];

const FINAL = process.argv.includes('--final');
const errores = [];
const pendientes = [];
const fallo = (archivo, mensaje) => errores.push(`${archivo}: ${mensaje}`);
// Mínimos de contenido: avisos durante el desarrollo, errores en modo --final
const pendiente = (archivo, mensaje) => (FINAL ? errores : pendientes).push(`${archivo}: ${mensaje}`);

// Comprueba que un recurso local exista con las mayúsculas exactas (GitHub Pages distingue mayúsculas)
function existeExacto(ruta) {
  if (!existsSync(ruta)) return false;
  return readdirSync(dirname(ruta)).includes(basename(ruta));
}

for (const pagina of PAGINAS) {
  if (!existsSync(pagina)) {
    fallo(pagina, 'la página no existe');
    continue;
  }
  const html = readFileSync(pagina, 'utf8');

  if (!/<html[^>]*\blang="es"/i.test(html)) fallo(pagina, 'falta lang="es" en <html>');

  for (const meta of METAS) {
    if (!meta.test(html)) fallo(pagina, `falta metadato ${meta.source}`);
  }

  for (const etiqueta of SEMANTICAS) {
    if (!new RegExp(`<${etiqueta}[\\s>]`, 'i').test(html)) fallo(pagina, `falta etiqueta <${etiqueta}>`);
  }

  for (const [img] of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt="[^"]{3,}"/i.test(img)) fallo(pagina, `imagen sin alt descriptivo: ${img}`);
  }

  if (!/href="css\/style\.css"/.test(html)) fallo(pagina, 'no enlaza css/style.css');
  if (!/bootstrap(\.bundle)?(\.min)?\.(css|js)/.test(html)) fallo(pagina, 'no integra Bootstrap');
  if (/\balert\s*\(/.test(html)) fallo(pagina, 'usa alert()');

  // Navegación consistente: cada página enlaza a las otras cuatro
  for (const destino of PAGINAS) {
    if (!html.includes(`href="${destino}"`)) fallo(pagina, `la navegación no enlaza a ${destino}`);
  }

  // Recursos locales (src, href, srcset, og:image) existen con el nombre exacto
  const rutas = [...html.matchAll(/(?:src|href)="([^"#?:]+)(?:[#?][^"]*)?"/g)].map((m) => m[1]);
  for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) {
    rutas.push(...srcset.split(',').map((candidato) => candidato.trim().split(/\s+/)[0]));
  }
  const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1];
  if (ogImage && !/^https?:/.test(ogImage)) rutas.push(ogImage);
  for (const ruta of rutas) {
    if (ruta.startsWith('//') || ruta.startsWith('mailto')) continue;
    if (!existeExacto(join('.', ruta))) fallo(pagina, `recurso no encontrado (revisa mayúsculas): ${ruta}`);
  }
}

// Requisitos globales del sitio
const todo = PAGINAS.filter(existsSync).map((p) => readFileSync(p, 'utf8')).join('\n');
// Cuenta solo la clase exacta "card" (no card-body, card-title, etc.)
const cards = (todo.match(/class="(?:[^"]*\s)?card(?:\s[^"]*)?"/g) || []).length;
if (cards < 6) pendiente('sitio', `hay ${cards} cards de Bootstrap, mínimo 6`);

if (existsSync('galeria.html')) {
  const galeria = readFileSync('galeria.html', 'utf8');
  const imagenes = (galeria.match(/<img\b/gi) || []).length;
  if (imagenes < 8) pendiente('galeria.html', `hay ${imagenes} imágenes, mínimo 8`);
  if (!/<figure[\s>]/.test(galeria) || !/<figcaption[\s>]/.test(galeria)) pendiente('galeria.html', 'faltan <figure>/<figcaption>');
  if (!/<video[\s>]|<iframe[\s>]/.test(galeria)) pendiente('galeria.html', 'falta video (<video> o <iframe>)');
}

if (existsSync('tabla.html')) {
  const tabla = readFileSync('tabla.html', 'utf8');
  for (const parte of ['thead', 'tbody', 'tfoot']) {
    if (!new RegExp(`<${parte}[\\s>]`).test(tabla)) pendiente('tabla.html', `falta <${parte}>`);
  }
  const cuerpo = tabla.match(/<tbody[\s\S]*?<\/tbody>/)?.[0] ?? '';
  const filas = cuerpo.match(/<tr[\s>][\s\S]*?<\/tr>/g) || [];
  if (filas.length < 5) pendiente('tabla.html', `tbody tiene ${filas.length} filas, mínimo 5`);
  const columnas = filas[0] ? (filas[0].match(/<t[dh][\s>]/g) || []).length : 0;
  if (columnas < 4) pendiente('tabla.html', `la tabla tiene ${columnas} columnas, mínimo 4`);
}

if (existsSync('contacto.html')) {
  const contacto = readFileSync('contacto.html', 'utf8');
  if (!/<select[\s>]/.test(contacto)) pendiente('contacto.html', 'falta campo <select>');
  if (!/type="checkbox"[^>]*required|required[^>]*type="checkbox"/.test(contacto)) pendiente('contacto.html', 'falta checkbox obligatorio');
  if (!/<textarea[\s>]/.test(contacto)) pendiente('contacto.html', 'falta campo mensaje (<textarea>)');
  if (!/type="email"/.test(contacto)) pendiente('contacto.html', 'falta campo email');
  if (!/src="js\/script\.js"/.test(contacto)) pendiente('contacto.html', 'no enlaza js/script.js');
}

const css = existsSync('css/style.css') ? readFileSync('css/style.css', 'utf8') : '';
if (!/:root\s*{[\s\S]*--[\w-]+:/.test(css)) fallo('css/style.css', 'faltan variables CSS en :root');
if (!/display:\s*(flex|grid)/.test(css)) fallo('css/style.css', 'no usa Flexbox ni CSS Grid');

for (const p of pendientes) console.warn(`  ! pendiente: ${p}`);

if (errores.length) {
  console.error(`Rúbrica: ${errores.length} requisito(s) sin cumplir\n`);
  for (const e of errores) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`Rúbrica: estructura correcta en ${PAGINAS.length} páginas ✓${pendientes.length ? ` (${pendientes.length} mínimos de contenido pendientes)` : ''}`);
