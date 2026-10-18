// CONTROLADOR de la galería: escucha los filtros y coordina modelo y vista.
import { filtrarPorCategoria, textoResultado } from '../model/galeriaModel.js';
import { crearVistaGaleria } from '../view/galeriaView.js';

export function iniciarGaleria(contenedor) {
  const figuras = [...contenedor.querySelectorAll('[data-categoria]')];
  const botones = [...contenedor.querySelectorAll('[data-filtro]')];
  const estado = contenedor.querySelector('[data-estado-galeria]');
  const fotos = figuras.map((figura) => ({ id: figura.id, categoria: figura.dataset.categoria }));
  const vista = crearVistaGaleria({ figuras, botones, estado });

  for (const boton of botones) {
    boton.addEventListener('click', () => {
      const categoria = boton.dataset.filtro;
      const visibles = filtrarPorCategoria(fotos, categoria);
      vista.mostrarSolo(visibles);
      vista.marcarFiltro(categoria);
      vista.anunciar(textoResultado(visibles.length, categoria));
    });
  }
}
