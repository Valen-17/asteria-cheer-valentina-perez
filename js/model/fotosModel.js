// MODELO del formulario "Comparte tus fotos": reglas de validación de los datos y de los archivos (sin DOM).
import { REGLAS as REGLAS_CONTACTO, validarConReglas } from './contactoModel.js';

export const EVENTOS = {
  entrenamiento: 'Entrenamiento',
  competencia: 'Competencia',
  evento: 'Evento o presentación',
  otro: 'Otro',
};

export const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FOTOS = 5;
export const MAX_MB = 5;
const BYTES_POR_MB = 1024 * 1024;

// "850 KB" o "1,2 MB" para mostrar el peso de cada foto
export function formatoTamano(bytes) {
  if (bytes < BYTES_POR_MB) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / BYTES_POR_MB).toFixed(1).replace('.', ',')} MB`;
}

// Cada regla recibe el valor del campo y devuelve un mensaje de error, o '' si es válido
export const REGLAS = {
  nombre: REGLAS_CONTACTO.nombre,
  email: REGLAS_CONTACTO.email,
  evento(valor) {
    return Object.hasOwn(EVENTOS, valor ?? '') ? '' : 'Selecciona dónde se tomaron las fotos.';
  },
  // Recibe la lista de archivos del <input type="file"> (o un arreglo de { name, type, size })
  fotos(lista) {
    const fotos = Array.from(lista ?? []);
    if (fotos.length === 0) return 'Elige al menos una foto.';
    if (fotos.length > MAX_FOTOS) return `Puedes enviar máximo ${MAX_FOTOS} fotos a la vez (elegiste ${fotos.length}).`;
    const noEsFoto = fotos.find((foto) => !TIPOS_PERMITIDOS.includes(foto.type));
    if (noEsFoto) return `«${noEsFoto.name}» no es una foto JPG, PNG o WebP.`;
    const pesada = fotos.find((foto) => foto.size > MAX_MB * BYTES_POR_MB);
    if (pesada) return `«${pesada.name}» pesa ${formatoTamano(pesada.size)}; el máximo es ${MAX_MB} MB por foto.`;
    return '';
  },
  autorizacion(valor) {
    return valor === true ? '' : 'Confirma la autorización para poder publicar las fotos.';
  },
};

export function validarCampoFotos(campo, valor) {
  const regla = REGLAS[campo];
  return regla ? regla(valor) : '';
}

export function validarFormularioFotos(datos) {
  return validarConReglas(REGLAS, datos);
}

export function mensajeExitoFotos({ nombre, fotos }) {
  const primerNombre = String(nombre).trim().split(/\s+/)[0];
  const cantidad = Array.from(fotos).length;
  const texto = cantidad === 1 ? 'tu foto' : `tus ${cantidad} fotos`;
  return `¡Gracias, ${primerNombre}! Recibimos ${texto}. Las revisaremos y, si las publicamos, aparecerán en la galería con tu nombre.`;
}
