// CONTROLADOR del formulario de inscripción: escucha los eventos y coordina modelo y vista.
import { categoriaDesdeUrl, mensajeExito, validarCampo, validarFormulario } from '../model/contactoModel.js';
import { crearVistaContacto } from '../view/contactoView.js';

const MINIMO_MENSAJE = 20;
const CAMPOS_DE_TEXTO = ['nombre', 'email', 'mensaje'];
const CAMPOS_DE_SELECCION = ['categoria', 'autorizacion'];

export function iniciarContacto(formulario) {
  const vista = crearVistaContacto(formulario);
  const tocados = new Set(); // campos que la persona ya visitó: solo esos se validan en tiempo real

  vista.desactivarValidacionNativa();
  vista.actualizarContador(0, MINIMO_MENSAJE);

  // contacto.html?categoria=junior deja la categoría preseleccionada
  const categoria = categoriaDesdeUrl(window.location.search);
  if (categoria) vista.seleccionarCategoria(categoria);

  function revisar(campo) {
    const mensaje = validarCampo(campo, vista.leerDatos()[campo]);
    if (mensaje) vista.mostrarError(campo, mensaje);
    else vista.marcarValido(campo);
  }

  // Texto: se valida al salir del campo y, desde ahí, mientras se escribe (no regaña en la primera tecla)
  for (const campo of CAMPOS_DE_TEXTO) {
    const elemento = formulario.elements[campo];
    elemento.addEventListener('blur', () => {
      if (elemento.value.trim() === '' && !tocados.has(campo)) return;
      tocados.add(campo);
      revisar(campo);
    });
    elemento.addEventListener('input', () => {
      vista.ocultarExito();
      if (campo === 'mensaje') vista.actualizarContador(elemento.value.trim().length, MINIMO_MENSAJE);
      if (tocados.has(campo)) revisar(campo);
    });
  }

  // Lista desplegable y casilla: se validan apenas cambian
  for (const campo of CAMPOS_DE_SELECCION) {
    formulario.elements[campo].addEventListener('change', () => {
      tocados.add(campo);
      revisar(campo);
    });
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // la página no se recarga
    const datos = vista.leerDatos();
    const { valido, errores } = validarFormulario(datos);

    for (const campo of Object.keys(datos)) {
      tocados.add(campo);
      if (errores[campo]) vista.mostrarError(campo, errores[campo]);
      else vista.marcarValido(campo);
    }

    if (!valido) {
      vista.mostrarResumen(errores);
      return;
    }

    // Sitio estático: no hay servidor que reciba los datos, así que se confirma en pantalla
    vista.ocultarResumen();
    vista.mostrarExito(mensajeExito(datos));
    vista.reiniciar();
    vista.actualizarContador(0, MINIMO_MENSAJE);
    tocados.clear();
  });
}
