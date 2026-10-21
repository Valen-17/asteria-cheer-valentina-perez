// Pruebas del script que copia los parciales (menú, pie, recursos) en las páginas
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aplicarParcial, construirPagina, limpiarParcial, marcarPaginaActiva } from '../scripts/parciales.js';

const MENU = `<ul>
  <li><a class="nav-link" href="index.html">Inicio</a></li>
  <li><a class="nav-link nav-cta" href="contacto.html">Inscripción</a></li>
</ul>`;

test('limpiarParcial quita el comentario de instrucciones de la primera línea', () => {
  assert.equal(limpiarParcial('<!-- Parcial: menú -->\n<nav></nav>\n'), '<nav></nav>');
  assert.equal(limpiarParcial('<nav></nav>\n'), '<nav></nav>');
});

test('marcarPaginaActiva marca solo el enlace de la página actual', () => {
  const inicio = marcarPaginaActiva(MENU, 'index.html');
  assert.match(inicio, /href="index\.html" aria-current="page">Inicio/);
  assert.equal((inicio.match(/aria-current/g) || []).length, 1);
  assert.match(marcarPaginaActiva(MENU, 'contacto.html'), /nav-cta" href="contacto\.html" aria-current="page">/);
});

test('marcarPaginaActiva avisa si la página no está en el menú', () => {
  assert.throws(() => marcarPaginaActiva(MENU, 'otra.html'), /no tiene un enlace a otra\.html/);
});

test('aplicarParcial reemplaza entre las marcas y respeta la sangría', () => {
  const html = '<body>\n  <!-- parcial:pie · se edita en parciales/pie.html -->\n  <p>viejo</p>\n  <!-- /parcial:pie -->\n</body>';
  assert.equal(
    aplicarParcial(html, 'pie', '<footer>\n  nuevo\n</footer>'),
    '<body>\n  <!-- parcial:pie · se edita en parciales/pie.html -->\n  <footer>\n    nuevo\n  </footer>\n  <!-- /parcial:pie -->\n</body>',
  );
});

test('aplicarParcial avisa si faltan las marcas', () => {
  assert.throws(() => aplicarParcial('<body></body>', 'pie', 'x'), /No encontré las marcas del parcial "pie"/);
});

test('construirPagina aplica los tres parciales y es estable al repetirse', () => {
  const marcas = (n) => `  <!-- parcial:${n} -->\n  <!-- /parcial:${n} -->`;
  const html = ['<head>', marcas('recursos'), '</head><body>', marcas('menu'), marcas('pie'), '</body>'].join('\n');
  const parciales = { recursos: '<link rel="stylesheet" href="css/style.css">', menu: MENU, pie: '<footer></footer>' };
  const una = construirPagina(html, 'contacto.html', parciales);
  assert.match(una, /css\/style\.css/);
  assert.match(una, /href="contacto\.html" aria-current="page"/);
  assert.match(una, /<footer><\/footer>/);
  assert.equal(construirPagina(una, 'contacto.html', parciales), una);
});
