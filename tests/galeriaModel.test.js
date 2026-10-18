// Pruebas del filtro de la galería
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filtrarPorCategoria, textoResultado } from '../js/model/galeriaModel.js';

const FOTOS = [
  { id: 'f1', categoria: 'entrenamientos' },
  { id: 'f2', categoria: 'competencias' },
  { id: 'f3', categoria: 'competencias' },
  { id: 'f4', categoria: 'eventos' },
];

test('"todos" devuelve todas las fotos', () => {
  assert.deepEqual(filtrarPorCategoria(FOTOS, 'todos'), ['f1', 'f2', 'f3', 'f4']);
});

test('filtra por una categoría', () => {
  assert.deepEqual(filtrarPorCategoria(FOTOS, 'competencias'), ['f2', 'f3']);
});

test('categoría desconocida lanza error', () => {
  assert.throws(() => filtrarPorCategoria(FOTOS, 'fiestas'), /Categoría desconocida/);
});

test('texto del resultado en singular y plural', () => {
  assert.equal(textoResultado(8, 'todos'), 'Mostrando 8 fotos');
  assert.equal(textoResultado(1, 'eventos'), 'Mostrando 1 foto de eventos');
});
