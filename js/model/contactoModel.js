// MODELO del formulario de inscripción.
// Contiene solo datos y reglas de validación: no toca el DOM, por eso se puede probar con node --test.

export const CATEGORIAS = ['mini', 'junior', 'senior', 'open'];

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

// Valida todos los campos; devuelve { valido, errores } donde errores es { campo: mensaje }
export function validarFormulario(datos) {
  const errores = {};
  for (const campo of Object.keys(REGLAS)) {
    const error = validarCampo(campo, datos[campo]);
    if (error) errores[campo] = error;
  }
  return { valido: Object.keys(errores).length === 0, errores };
}
