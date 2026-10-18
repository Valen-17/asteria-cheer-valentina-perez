// Pruebas de la cuenta regresiva de la próxima competencia
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tiempoRestante } from '../js/model/competenciaModel.js';

const FECHA = '2026-11-14T09:00:00-05:00';

test('calcula días, horas, minutos y segundos restantes', () => {
  const ahora = '2026-11-12T07:58:30-05:00';
  assert.deepEqual(tiempoRestante(FECHA, ahora), { dias: 2, horas: 1, minutos: 1, segundos: 30, terminado: false });
});

test('cuando la fecha ya pasó, todo queda en cero y terminado', () => {
  assert.deepEqual(tiempoRestante(FECHA, '2026-11-14T09:00:01-05:00'), {
    dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true,
  });
});

test('fecha no válida lanza un error descriptivo', () => {
  assert.throws(() => tiempoRestante('no-es-fecha'), /Fecha no válida/);
});
