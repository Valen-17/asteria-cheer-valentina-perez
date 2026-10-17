// Pruebas del visor de fotos
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { direccionDeslizamiento, indiceAnterior, indiceSiguiente, textoContador } from '../js/model/visorModel.js';

test('siguiente avanza y vuelve al inicio después de la última', () => {
  assert.equal(indiceSiguiente(0, 8), 1);
  assert.equal(indiceSiguiente(7, 8), 0);
});

test('anterior retrocede y va a la última antes de la primera', () => {
  assert.equal(indiceAnterior(3, 8), 2);
  assert.equal(indiceAnterior(0, 8), 7);
});

test('con una sola foto se queda en la misma', () => {
  assert.equal(indiceSiguiente(0, 1), 0);
  assert.equal(indiceAnterior(0, 1), 0);
});

test('sin fotos lanza un error claro', () => {
  assert.throws(() => indiceSiguiente(0, 0), /al menos una foto/);
});

test('contador legible para personas', () => {
  assert.equal(textoContador(2, 8), '3 de 8');
});

test('deslizamiento: izquierda = siguiente, derecha = anterior, poco movimiento = nada', () => {
  assert.equal(direccionDeslizamiento(300, 120), 1);
  assert.equal(direccionDeslizamiento(120, 300), -1);
  assert.equal(direccionDeslizamiento(200, 230), 0);
});
