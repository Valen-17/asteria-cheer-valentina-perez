// VISTA del visor de fotos: pinta la foto grande, el título y el contador dentro del modal.

export function crearVistaVisor(modal) {
  const lienzo = modal.querySelector('[data-visor-lienzo]');
  const titulo = modal.querySelector('[data-visor-titulo]');
  const contador = modal.querySelector('[data-visor-contador]');
  const flechas = modal.querySelectorAll('[data-visor-anterior], [data-visor-siguiente]');

  return {
    mostrar({ src, alt, texto, posicion, total }) {
      const imagen = document.createElement('img');
      imagen.className = 'visor-imagen';
      imagen.src = src;
      imagen.alt = alt;
      imagen.decoding = 'async';
      lienzo.replaceChildren(imagen);
      titulo.textContent = texto;
      contador.textContent = posicion;
      // Con una sola foto visible (por un filtro) no tiene sentido mostrar flechas
      for (const flecha of flechas) flecha.hidden = total < 2;
    },

    // Descarga en segundo plano la foto vecina para que el cambio sea instantáneo
    precargar(src) {
      const imagen = new Image();
      imagen.src = src;
    },

    vaciar() {
      lienzo.replaceChildren();
    },
  };
}
