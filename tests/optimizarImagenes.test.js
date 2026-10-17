// Pruebas del nombre de archivo seguro para GitHub Pages
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nombreSeguro } from '../scripts/optimizar-imagenes.js';

test('quita tildes, espacios y mayúsculas', () => {
  assert.equal(nombreSeguro('originales/Foto Pirámide 1.JPG'), 'foto-piramide-1');
  assert.equal(nombreSeguro('Emblema Cósmico Asteria Cheer.png'), 'emblema-cosmico-asteria-cheer');
});

test('no deja guiones repetidos ni en los extremos', () => {
  assert.equal(nombreSeguro('  __Ñandú -- final__.jpeg'), 'nandu-final');
});
