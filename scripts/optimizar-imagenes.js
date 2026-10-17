// Genera versiones AVIF y WebP en varios anchos de cada imagen para usar con <picture> y srcset.
// También elimina los metadatos EXIF (ubicación GPS, cámara, fecha) de las fotos.
//
// Uso:
//   npm run imagenes -- originales/galeria/*.jpg
//   npm run imagenes -- originales/logo-asteria.png --anchos 320,480,640
//
// Resultado: img/<nombre>-<ancho>.avif y img/<nombre>-<ancho>.webp, más el HTML <picture> listo para copiar.
import { mkdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ANCHOS_POR_DEFECTO = [480, 800, 1200];
const CARPETA_SALIDA = 'img';
const CALIDAD = { avif: 55, webp: 80 };

// Convierte "Foto Pirámide 1.JPG" en "foto-piramide-1" (sin tildes, espacios ni mayúsculas)
export function nombreSeguro(archivo) {
  return basename(archivo, extname(archivo))
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function leerArgumentos(argv) {
  const archivos = [];
  let anchos = ANCHOS_POR_DEFECTO;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--anchos') {
      anchos = argv[++i].split(',').map(Number).filter(Boolean).sort((a, b) => a - b);
    } else {
      archivos.push(argv[i]);
    }
  }
  return { archivos, anchos };
}

async function optimizar(archivo, anchos) {
  const nombre = nombreSeguro(archivo);
  const { width: anchoOriginal, height: altoOriginal } = await sharp(archivo).metadata();

  // Nunca se agranda una imagen: solo anchos menores o iguales al original
  const anchosValidos = anchos.filter((a) => a <= anchoOriginal);
  if (anchosValidos.length === 0) anchosValidos.push(anchoOriginal);

  const generados = [];
  for (const ancho of anchosValidos) {
    const base = sharp(archivo).rotate().resize({ width: ancho });
    for (const formato of ['avif', 'webp']) {
      const salida = join(CARPETA_SALIDA, `${nombre}-${ancho}.${formato}`);
      const { size } = await base.clone()[formato]({ quality: CALIDAD[formato] }).toFile(salida);
      generados.push({ salida, size });
    }
  }

  const mayor = anchosValidos.at(-1);
  const alto = Math.round((altoOriginal * mayor) / anchoOriginal);
  const srcset = (formato) =>
    anchosValidos.map((a) => `${CARPETA_SALIDA}/${nombre}-${a}.${formato} ${a}w`).join(', ');

  console.log(`\n${archivo}`);
  for (const { salida, size } of generados) console.log(`  ${salida}  ${(size / 1024).toFixed(0)} KB`);
  console.log(`
<picture>
  <source type="image/avif" srcset="${srcset('avif')}" sizes="100vw">
  <source type="image/webp" srcset="${srcset('webp')}" sizes="100vw">
  <img src="${CARPETA_SALIDA}/${nombre}-${mayor}.webp" alt="DESCRIBE LA IMAGEN" width="${mayor}" height="${alto}" loading="lazy">
</picture>
(ajusta "sizes" al ancho real en pantalla y escribe un alt descriptivo)`);
}

// Solo se ejecuta al llamarlo por consola (no al importarlo desde las pruebas)
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { archivos, anchos } = leerArgumentos(process.argv.slice(2));
  if (archivos.length === 0) {
    console.error('Indica al menos una imagen. Ejemplo: npm run imagenes -- originales/galeria/*.jpg');
    process.exit(1);
  }
  mkdirSync(CARPETA_SALIDA, { recursive: true });
  for (const archivo of archivos) await optimizar(archivo, anchos);
}
