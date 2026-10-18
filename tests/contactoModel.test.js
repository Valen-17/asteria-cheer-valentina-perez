// Pruebas unitarias del modelo del formulario (se ejecutan con: npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarCampo, validarFormulario, categoriaDesdeUrl, mensajeExito } from '../js/model/contactoModel.js';

const valido = {
  nombre: 'Valentina Pérez',
  email: 'valentina@correo.com',
  categoria: 'senior',
  mensaje: 'Quiero inscribirme a la clase de prueba del sábado.',
  autorizacion: true,
};

test('formulario completo y correcto es válido', () => {
  assert.deepEqual(validarFormulario(valido), { valido: true, errores: {} });
});

test('nombre: mínimo 3 caracteres sin contar espacios', () => {
  assert.notEqual(validarCampo('nombre', ''), '');
  assert.notEqual(validarCampo('nombre', '  Al  '), '');
  assert.equal(validarCampo('nombre', 'Ana'), '');
});

test('email: exige formato válido', () => {
  for (const malo of ['', 'valentina', 'valentina@', 'valentina@correo', 'a b@correo.com']) {
    assert.notEqual(validarCampo('email', malo), '', `debería rechazar "${malo}"`);
  }
  assert.equal(validarCampo('email', 'v.perez@correo.edu.co'), '');
});

test('categoria: solo acepta categorías del club', () => {
  assert.notEqual(validarCampo('categoria', ''), '');
  assert.notEqual(validarCampo('categoria', 'master'), '');
  assert.equal(validarCampo('categoria', 'open'), '');
});

test('mensaje: mínimo 20 caracteres e informa cuántos lleva', () => {
  assert.match(validarCampo('mensaje', 'Hola, quiero entrar'), /llevas 19/);
  assert.equal(validarCampo('mensaje', 'Hola, quiero entrar!'), '');
});

test('autorizacion: el checkbox es obligatorio', () => {
  assert.notEqual(validarCampo('autorizacion', false), '');
  assert.notEqual(validarCampo('autorizacion', 'true'), '');
  assert.equal(validarCampo('autorizacion', true), '');
});

test('formulario vacío reporta los 5 campos', () => {
  const { valido: ok, errores } = validarFormulario({});
  assert.equal(ok, false);
  assert.deepEqual(Object.keys(errores).sort(), ['autorizacion', 'categoria', 'email', 'mensaje', 'nombre']);
});

test('categoria: acepta la opción de evaluación', () => {
  assert.equal(validarCampo('categoria', 'evaluacion'), '');
});

test('categoriaDesdeUrl: preselecciona solo categorías válidas', () => {
  assert.equal(categoriaDesdeUrl('?categoria=junior'), 'junior');
  assert.equal(categoriaDesdeUrl('?categoria=master'), '');
  assert.equal(categoriaDesdeUrl(''), '');
});

test('mensajeExito: usa el primer nombre, la categoría y el correo', () => {
  assert.equal(
    mensajeExito({ nombre: '  Valentina Pérez ', categoria: 'junior', email: 'v@correo.com ' }),
    '¡Gracias, Valentina! Recibimos tu solicitud para tu clase de prueba en la categoría Junior. Te escribiremos a v@correo.com en las próximas 48 horas.',
  );
  assert.match(mensajeExito({ nombre: 'Ana', categoria: 'evaluacion', email: 'a@b.co' }), /tu evaluación de nivel/);
});
