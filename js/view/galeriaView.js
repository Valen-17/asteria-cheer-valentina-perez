// VISTA de la galería: muestra u oculta fotos, marca el filtro activo y anuncia el resultado.

export function crearVistaGaleria({ figuras, botones, estado }) {
  return {
    mostrarSolo(idsVisibles) {
      for (const figura of figuras) figura.hidden = !idsVisibles.includes(figura.id);
    },
    marcarFiltro(categoria) {
      for (const boton of botones) boton.setAttribute('aria-pressed', String(boton.dataset.filtro === categoria));
    },
    anunciar(texto) {
      estado.textContent = texto; // región aria-live: el lector de pantalla lo lee
    },
  };
}
