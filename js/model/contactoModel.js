// MODELO del formulario de inscripción.
// Contiene solo datos y reglas de validación: no toca el DOM, por eso se puede probar con node --test.

// Opciones del campo "categoría" (valor del <select> -> texto visible)
export const NOMBRES_CATEGORIA = {
  mini: 'Mini (6 a 10 años)',
  junior: 'Junior (11 a 14 años)',
  senior: 'Senior (15 a 18 años)',
  open: 'Open 4.2 (18+ años)',
  evaluacion: 'Aún no sé: quiero una evaluación',
};

export const CATEGORIAS = Object.keys(NOMBRES_CATEGORIA);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Cada regla recibe el valor del campo y devuelve un mensaje de error, o '' si es válido
export const REGLAS = {
  nombre(valor) {
    const limpio = String(valor ?? '').trim();
    if (!limpio) return 'Escribe tu nombre completo.';
    if (limpio.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    return '';
  },
  email(valor) {
    const limpio = String(valor ?? '').trim();
    if (!limpio) return 'Escribe tu correo electrónico.';
    if (!EMAIL_REGEX.test(limpio)) return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    return '';
  },
  categoria(valor) {
    if (!CATEGORIAS.includes(valor)) return 'Selecciona la categoría que te interesa.';
    return '';
  },
  mensaje(valor) {
    const limpio = String(valor ?? '').trim();
    if (!limpio) return 'Cuéntanos tu experiencia o tu pregunta.';
    if (limpio.length < 20) return `El mensaje debe tener al menos 20 caracteres (llevas ${limpio.length}).`;
    return '';
  },
  autorizacion(valor) {
    if (valor !== true) return 'Debes aceptar el tratamiento de datos para continuar.';
    return '';
  },
};

// Valida un solo campo
export function validarCampo(campo, valor) {
  const regla = REGLAS[campo];
  return regla ? regla(valor) : '';
}

// Valida todos los campos con un conjunto de reglas; devuelve { valido, errores } donde errores es { campo: mensaje }.
// Se reutiliza en otros formularios del sitio (por ejemplo, "Comparte tus fotos").
export function validarConReglas(reglas, datos) {
  const errores = {};
  for (const [campo, regla] of Object.entries(reglas)) {
    const error = regla(datos[campo]);
    if (error) errores[campo] = error;
  }
  return { valido: Object.keys(errores).length === 0, errores };
}

export function validarFormulario(datos) {
  return validarConReglas(REGLAS, datos);
}

// Lee ?categoria=junior del enlace para dejar el campo preseleccionado ('' si no es válida)
export function categoriaDesdeUrl(busqueda) {
  const categoria = new URLSearchParams(busqueda).get('categoria');
  return CATEGORIAS.includes(categoria) ? categoria : '';
}

// Texto de confirmación cuando el formulario es válido
export function mensajeExito({ nombre, categoria, email }) {
  const primerNombre = String(nombre).trim().split(/\s+/)[0];
  const destino = categoria === 'evaluacion'
    ? 'tu evaluación de nivel'
    : `tu clase de prueba en la categoría ${NOMBRES_CATEGORIA[categoria].split(' (')[0]}`;
  return `¡Gracias, ${primerNombre}! Recibimos tu solicitud para ${destino}. Te escribiremos a ${String(email).trim()} en las próximas 48 horas.`;
}
