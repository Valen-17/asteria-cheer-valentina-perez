// CONTROLADOR del formulario "Comparte tus fotos" (ventana emergente de la galería).
import { mensajeExitoFotos, validarCampoFotos, validarFormularioFotos } from '../model/fotosModel.js';
import { crearVistaFotos } from '../view/fotosView.js';

const CAMPOS_DE_TEXTO = ['nombre', 'email'];
const CAMPOS_DE_SELECCION = ['evento', 'autorizacion'];

export function iniciarFotos(formulario) {
  const vista = crearVistaFotos(formulario);
  const tocados = new Set();
  vista.desactivarValidacionNativa();

  function revisar(campo) {
    const mensaje = validarCampoFotos(campo, vista.leerDatos()[campo]);
    if (mensaje) vista.mostrarError(campo, mensaje);
    else vista.marcarValido(campo);
  }

  // Texto: se valida al salir del campo y, desde ahí, mientras se escribe
  for (const campo of CAMPOS_DE_TEXTO) {
    const elemento = formulario.elements[campo];
    elemento.addEventListener('blur', () => {
      if (elemento.value.trim() === '' && !tocados.has(campo)) return;
      tocados.add(campo);
      revisar(campo);
    });
    elemento.addEventListener('input', () => {
      vista.ocultarExito();
      if (tocados.has(campo)) revisar(campo);
    });
  }

  for (const campo of CAMPOS_DE_SELECCION) {
    formulario.elements[campo].addEventListener('change', () => {
      tocados.add(campo);
      revisar(campo);
    });
  }

  // Al elegir fotos: vista previa inmediata y validación de cantidad, tipo y peso
  formulario.elements.fotos.addEventListener('change', () => {
    tocados.add('fotos');
    vista.ocultarExito();
    vista.mostrarVistaPrevia(vista.leerDatos().fotos);
    revisar('fotos');
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = vista.leerDatos();
    const { valido, errores } = validarFormularioFotos(datos);

    for (const campo of Object.keys(datos)) {
      if (errores[campo]) vista.mostrarError(campo, errores[campo]);
      else vista.marcarValido(campo);
    }

    if (!valido) {
      vista.enfocarPrimerError(errores);
      return;
    }

    // Sitio estático: no hay servidor que reciba los archivos, así que se confirma en pantalla
    vista.reiniciar();
    vista.mostrarExito(mensajeExitoFotos(datos));
    tocados.clear();
  });

  // Al cerrar la ventana, el formulario queda limpio para la próxima vez
  formulario.closest('.modal')?.addEventListener('hidden.bs.modal', () => {
    vista.reiniciar();
    vista.ocultarExito();
    tocados.clear();
  });
}
