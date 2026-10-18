// VISTA del formulario "Comparte tus fotos": pinta errores, la vista previa de las fotos y la confirmación.
import { formatoTamano } from '../model/fotosModel.js';

const CAMPOS = ['nombre', 'email', 'evento', 'fotos', 'autorizacion'];

export function crearVistaFotos(formulario) {
  const control = (campo) => formulario.elements[campo];
  const error = (campo) => formulario.querySelector(`#error-fotos-${campo}`);
  const vistaPrevia = formulario.querySelector('[data-vista-previa]');
  const exito = formulario.parentElement.querySelector('[data-exito-fotos]');
  let enlacesTemporales = []; // direcciones blob: de las miniaturas; se liberan al cambiar de fotos

  function pintar(campo, mensaje) {
    const elemento = control(campo);
    elemento.classList.toggle('is-invalid', Boolean(mensaje));
    elemento.classList.toggle('is-valid', !mensaje);
    elemento.setAttribute('aria-invalid', String(Boolean(mensaje)));
    error(campo).textContent = mensaje;
    error(campo).classList.toggle('d-block', Boolean(mensaje));
  }

  function limpiarVistaPrevia() {
    enlacesTemporales.forEach((url) => URL.revokeObjectURL(url));
    enlacesTemporales = [];
    vistaPrevia.replaceChildren();
  }

  return {
    leerDatos() {
      return {
        nombre: control('nombre').value,
        email: control('email').value,
        evento: control('evento').value,
        fotos: Array.from(control('fotos').files),
        autorizacion: control('autorizacion').checked,
      };
    },

    mostrarError: pintar,
    marcarValido: (campo) => pintar(campo, ''),

    // Miniatura de cada foto elegida, con su nombre y peso (las imágenes nunca salen del navegador)
    mostrarVistaPrevia(fotos) {
      limpiarVistaPrevia();
      vistaPrevia.append(...fotos.map((foto) => {
        const item = document.createElement('li');
        if (foto.type.startsWith('image/')) {
          const url = URL.createObjectURL(foto);
          enlacesTemporales.push(url);
          const imagen = document.createElement('img');
          imagen.src = url;
          imagen.alt = '';
          item.append(imagen);
        }
        const texto = document.createElement('span');
        texto.textContent = `${foto.name} · ${formatoTamano(foto.size)}`;
        item.append(texto);
        return item;
      }));
    },

    enfocarPrimerError(errores) {
      const primero = CAMPOS.find((campo) => errores[campo]);
      if (primero) control(primero).focus();
    },

    mostrarExito(texto) {
      exito.querySelector('[data-texto]').textContent = texto;
      exito.hidden = false;
      exito.focus();
    },

    ocultarExito() {
      exito.hidden = true;
    },

    reiniciar() {
      formulario.reset();
      limpiarVistaPrevia();
      for (const campo of CAMPOS) {
        const elemento = control(campo);
        elemento.classList.remove('is-valid', 'is-invalid');
        elemento.removeAttribute('aria-invalid');
        error(campo).textContent = '';
        error(campo).classList.remove('d-block');
      }
    },

    desactivarValidacionNativa() {
      formulario.noValidate = true;
    },
  };
}
