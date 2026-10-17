// VISTA del formulario de inscripción: solo lee y pinta el DOM.
// No decide si un dato es válido (eso es del modelo) ni cuándo validar (eso es del controlador).

const CAMPOS = ['nombre', 'email', 'categoria', 'mensaje', 'autorizacion'];

const ETIQUETAS = {
  nombre: 'Nombre completo',
  email: 'Correo electrónico',
  categoria: 'Categoría',
  mensaje: 'Mensaje',
  autorizacion: 'Autorización de datos',
};

export function crearVistaContacto(formulario) {
  const control = (campo) => formulario.elements[campo];
  const error = (campo) => formulario.querySelector(`#error-${campo}`);
  const resumen = formulario.querySelector('[data-resumen-errores]');
  const listaResumen = resumen.querySelector('ul');
  const exito = document.querySelector('[data-mensaje-exito]');
  const contador = formulario.querySelector('[data-contador]');

  function pintar(campo, mensaje) {
    const elemento = control(campo);
    elemento.classList.toggle('is-invalid', Boolean(mensaje));
    elemento.classList.toggle('is-valid', !mensaje);
    elemento.setAttribute('aria-invalid', String(Boolean(mensaje)));
    error(campo).textContent = mensaje;
    error(campo).classList.toggle('d-block', Boolean(mensaje));
  }

  return {
    leerDatos() {
      return {
        nombre: control('nombre').value,
        email: control('email').value,
        categoria: control('categoria').value,
        mensaje: control('mensaje').value,
        autorizacion: control('autorizacion').checked,
      };
    },

    mostrarError(campo, mensaje) {
      pintar(campo, mensaje);
    },

    marcarValido(campo) {
      pintar(campo, '');
    },

    // Lista de errores arriba del formulario, con enlaces que llevan a cada campo
    mostrarResumen(errores) {
      listaResumen.replaceChildren(
        ...Object.keys(errores).map((campo) => {
          const item = document.createElement('li');
          const enlace = document.createElement('a');
          enlace.href = `#${control(campo).id}`;
          enlace.textContent = `${ETIQUETAS[campo]}: ${errores[campo]}`;
          enlace.addEventListener('click', (evento) => {
            evento.preventDefault();
            control(campo).focus();
          });
          item.append(enlace);
          return item;
        }),
      );
      resumen.hidden = false;
      resumen.focus();
    },

    ocultarResumen() {
      resumen.hidden = true;
    },

    actualizarContador(cantidad, minimo) {
      contador.textContent = cantidad >= minimo
        ? `${cantidad} caracteres ✓`
        : `${cantidad} de ${minimo} caracteres mínimos`;
      contador.classList.toggle('contador-listo', cantidad >= minimo);
    },

    mostrarExito(texto) {
      exito.querySelector('[data-texto]').textContent = texto;
      exito.hidden = false;
      exito.focus();
    },

    ocultarExito() {
      exito.hidden = true;
    },

    seleccionarCategoria(valor) {
      control('categoria').value = valor;
    },

    // Deja el formulario vacío y sin marcas de validación
    reiniciar() {
      formulario.reset();
      for (const campo of CAMPOS) {
        const elemento = control(campo);
        elemento.classList.remove('is-valid', 'is-invalid');
        elemento.removeAttribute('aria-invalid');
        error(campo).textContent = '';
        error(campo).classList.remove('d-block');
      }
    },

    // Con JavaScript activo, los mensajes los da la página; sin JavaScript queda la validación del navegador
    desactivarValidacionNativa() {
      formulario.noValidate = true;
    },
  };
}
