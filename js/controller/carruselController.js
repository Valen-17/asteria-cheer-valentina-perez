// CONTROLADOR de los carruseles: agrega a cada uno un botón para pausar/reanudar
// el avance automático (requisito de accesibilidad WCAG 2.2.2).
// Usa el componente Carousel de Bootstrap, cargado de forma global por bootstrap.bundle.

export function iniciarCarruseles(Carousel) {
  for (const boton of document.querySelectorAll('[data-pausar-carrusel]')) {
    const carrusel = document.getElementById(boton.dataset.pausarCarrusel);
    if (!carrusel) continue;

    const instancia = Carousel.getOrCreateInstance(carrusel);
    const icono = boton.querySelector('i');
    const texto = boton.querySelector('[data-texto]');
    let pausado = false;

    boton.addEventListener('click', () => {
      pausado = !pausado;
      if (pausado) instancia.pause();
      else instancia.cycle();
      boton.setAttribute('aria-pressed', String(pausado));
      icono.className = pausado ? 'bi bi-play-fill' : 'bi bi-pause-fill';
      texto.textContent = pausado ? 'Reanudar carrusel' : 'Pausar carrusel';
    });
  }
}
