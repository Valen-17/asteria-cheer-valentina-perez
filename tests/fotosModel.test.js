// Pruebas del formulario "Comparte tus fotos"
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatoTamano, mensajeExitoFotos, validarCampoFotos, validarFormularioFotos } from '../js/model/fotosModel.js';

const MB = 1024 * 1024;
const foto = (name, size = 2 * MB, type = 'image/jpeg') => ({ name, size, type });

const valido = {
  nombre: 'Daniela Henao',
  email: 'daniela@correo.com',
  evento: 'competencia',
  fotos: [foto('podio.jpg'), foto('piramide.png', MB, 'image/png')],
  autorizacion: true,
};

test('formulario completo y correcto es válido', () => {
  assert.deepEqual(validarFormularioFotos(valido), { valido: true, errores: {} });
});

test('formulario vacío reporta los 5 campos', () => {
  const { valido: ok, errores } = validarFormularioFotos({});
  assert.equal(ok, false);
  assert.deepEqual(Object.keys(errores).sort(), ['autorizacion', 'email', 'evento', 'fotos', 'nombre']);
});

test('evento: solo acepta las opciones de la lista', () => {
  assert.equal(validarCampoFotos('evento', 'entrenamiento'), '');
  assert.notEqual(validarCampoFotos('evento', ''), '');
  assert.notEqual(validarCampoFotos('evento', 'toString'), '');
});

test('fotos: exige al menos una y máximo cinco', () => {
  assert.match(validarCampoFotos('fotos', []), /al menos una/);
  const seis = Array.from({ length: 6 }, (_, i) => foto(`f${i}.jpg`));
  assert.match(validarCampoFotos('fotos', seis), /máximo 5 fotos.*elegiste 6/);
});

test('fotos: rechaza archivos que no son imagen y nombra el archivo', () => {
  assert.match(validarCampoFotos('fotos', [foto('rutina.mp4', MB, 'video/mp4')]), /«rutina\.mp4» no es una foto/);
});

test('fotos: rechaza fotos de más de 5 MB e indica su peso', () => {
  assert.match(validarCampoFotos('fotos', [foto('grande.jpg', 7.5 * MB)]), /«grande\.jpg» pesa 7,5 MB/);
  assert.equal(validarCampoFotos('fotos', [foto('justa.jpg', 5 * MB)]), '');
});

test('formatoTamano: KB por debajo de 1 MB y MB con coma decimal', () => {
  assert.equal(formatoTamano(850 * 1024), '850 KB');
  assert.equal(formatoTamano(1.25 * MB), '1,3 MB');
});

test('mensajeExitoFotos: primer nombre y singular o plural', () => {
  assert.equal(
    mensajeExitoFotos({ nombre: ' Daniela Henao', fotos: [foto('a.jpg')] }),
    '¡Gracias, Daniela! Recibimos tu foto. Las revisaremos y, si las publicamos, aparecerán en la galería con tu nombre.',
  );
  assert.match(mensajeExitoFotos({ nombre: 'Ana', fotos: valido.fotos }), /Recibimos tus 2 fotos/);
});
