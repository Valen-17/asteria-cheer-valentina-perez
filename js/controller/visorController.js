// CONTROLADOR del visor de fotos: abre el modal al tocar una foto del mosaico y maneja la navegación.
// Usa el componente Modal de Bootstrap (foco atrapado dentro, Esc para cerrar, fondo oscuro).
import { direccionDeslizamiento, indiceAnterior, indiceSiguiente, textoContador } from '../model/visorModel.js';
import { crearVistaVisor } from '../view/visorView.js';

export function iniciarVisor(galeria, Modal) {
  const elementoModal = document.getElementById('visor-fotos');
  const modal = Modal.getOrCreateInstance(elementoModal);
  const vista = crearVistaVisor(elementoModal);
  let fotos = [];
  let actual = 0;
  let enlaceOrigen = null;

  // Solo las fotos visibles: si hay un filtro activo, el visor recorre únicamente esas
  const fotosVisibles = () => [...galeria.querySelectorAll('figure:not([hidden]) .abrir-foto')].map((enlace) => ({
    enlace,
    src: enlace.href,
    alt: enlace.querySelector('img').alt,
    texto: enlace.closest('figure').querySelector('figcaption').textContent.trim(),
  }));

  function mostrar(indice) {
    actual = indice;
    const foto = fotos[actual];
    vista.mostrar({ ...foto, posicion: textoContador(actual, fotos.length), total: fotos.length });
    if (fotos.length > 1) vista.precargar(fotos[indiceSiguiente(actual, fotos.length)].src);
  }

  const siguiente = () => fotos.length > 1 && mostrar(indiceSiguiente(actual, fotos.length));
  const anterior = () => fotos.length > 1 && mostrar(indiceAnterior(actual, fotos.length));

  // Abrir: sin JavaScript el enlace igual abre la foto grande en otra página
  galeria.addEventListener('click', (evento) => {
    const enlace = evento.target.closest('.abrir-foto');
    if (!enlace) return;
    evento.preventDefault();
    fotos = fotosVisibles();
    enlaceOrigen = enlace;
    mostrar(fotos.findIndex((foto) => foto.enlace === enlace));
    modal.show();
  });

  elementoModal.querySelector('[data-visor-siguiente]').addEventListener('click', siguiente);
  elementoModal.querySelector('[data-visor-anterior]').addEventListener('click', anterior);

  // Teclado: flechas para navegar (Esc ya lo maneja Bootstrap)
  elementoModal.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowRight') siguiente();
    if (evento.key === 'ArrowLeft') anterior();
  });

  // Celular: deslizar el dedo
  let inicioX = 0;
  elementoModal.addEventListener('touchstart', (evento) => { inicioX = evento.changedTouches[0].clientX; }, { passive: true });
  elementoModal.addEventListener('touchend', (evento) => {
    const direccion = direccionDeslizamiento(inicioX, evento.changedTouches[0].clientX);
    if (direccion === 1) siguiente();
    if (direccion === -1) anterior();
  });

  // Al cerrar, el foco vuelve a la foto que se abrió (importante para quien navega con teclado)
  elementoModal.addEventListener('hidden.bs.modal', () => {
    vista.vaciar();
    enlaceOrigen?.focus();
  });
}
