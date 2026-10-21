// Copia los bloques comunes (parciales/*.html) dentro de las 5 páginas.
// Cada página marca dónde va cada parcial con dos comentarios:
//   <!-- parcial:menu · se edita en parciales/menu.html -->
//   ...contenido generado...
//   <!-- /parcial:menu -->
//
// Uso:
//   npm run parciales           actualiza las páginas con lo que haya en parciales/
//   npm run check:parciales     solo verifica que estén sincronizadas (lo usa el pipeline)
//
// Las páginas siguen teniendo su HTML completo: la rúbrica y los validadores ven cada página entera.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PAGINAS = ['index.html', 'informacion.html', 'galeria.html', 'tabla.html', 'contacto.html'];
export const PARCIALES = ['recursos', 'menu', 'pie'];

// Quita la primera línea si es el comentario de instrucciones del parcial
export function limpiarParcial(texto) {
  return texto.replace(/^<!-- Parcial:.*-->\r?\n/, '').trimEnd();
}

// Marca con aria-current="page" el enlace del menú que apunta a la página actual
export function marcarPaginaActiva(menu, pagina) {
  const enlace = new RegExp(`(<a class="nav-link[^"]*" href="${pagina.replace('.', '\\.')}")>`);
  if (!enlace.test(menu)) throw new Error(`El menú no tiene un enlace a ${pagina}`);
  return menu.replace(enlace, '$1 aria-current="page">');
}

// Reemplaza el contenido entre <!-- parcial:nombre ... --> y <!-- /parcial:nombre -->,
// respetando la sangría del comentario de apertura
export function aplicarParcial(html, nombre, contenido) {
  const marca = new RegExp(`^([ \\t]*)(<!-- parcial:${nombre}\\b[^>]*-->)\\r?\\n[\\s\\S]*?^[ \\t]*<!-- /parcial:${nombre} -->`, 'm');
  const encontrado = html.match(marca);
  if (!encontrado) throw new Error(`No encontré las marcas del parcial "${nombre}"`);
  const sangria = encontrado[1];
  const cuerpo = contenido.split('\n').map((linea) => (linea ? sangria + linea : linea)).join('\n');
  return html.replace(marca, () => `${sangria}${encontrado[2]}\n${cuerpo}\n${sangria}<!-- /parcial:${nombre} -->`);
}

export function construirPagina(html, pagina, parciales) {
  let resultado = html;
  for (const nombre of PARCIALES) {
    const contenido = nombre === 'menu' ? marcarPaginaActiva(parciales[nombre], pagina) : parciales[nombre];
    resultado = aplicarParcial(resultado, nombre, contenido);
  }
  return resultado;
}

// Solo se ejecuta al llamarlo por consola (no al importarlo desde las pruebas)
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const verificar = process.argv.includes('--verificar');
  const parciales = Object.fromEntries(
    PARCIALES.map((nombre) => [nombre, limpiarParcial(readFileSync(`parciales/${nombre}.html`, 'utf8'))]),
  );
  const desactualizadas = [];
  for (const pagina of PAGINAS) {
    const actual = readFileSync(pagina, 'utf8');
    const nueva = construirPagina(actual, pagina, parciales);
    if (nueva === actual) continue;
    desactualizadas.push(pagina);
    if (!verificar) writeFileSync(pagina, nueva);
  }

  if (verificar && desactualizadas.length) {
    console.error(`Parciales: ${desactualizadas.join(', ')} no coincide(n) con parciales/. Ejecuta: npm run parciales`);
    process.exit(1);
  }
  console.log(verificar
    ? `Parciales: las ${PAGINAS.length} páginas están sincronizadas ✓`
    : `Parciales: ${desactualizadas.length ? `actualizadas ${desactualizadas.join(', ')}` : 'nada que actualizar'} ✓`);
}
