// VISTA de animaciones: hace aparecer suavemente los elementos .revelar al entrar en pantalla.
// Si el usuario pidió menos movimiento o el navegador no soporta IntersectionObserver,
// no se activa y todo el contenido queda visible desde el inicio.

const ESPERA_MAXIMA = 2500; // ms; si el observador no responde, se muestra todo

export function iniciarRevelado(elementos) {
  const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (menosMovimiento || !('IntersectionObserver' in window) || elementos.length === 0) return;

  let respondio = false;
  const observador = new IntersectionObserver(
    (entradas) => {
      respondio = true;
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    },
    { threshold: 0.15 },
  );

  document.documentElement.classList.add('animaciones');
  elementos.forEach((elemento) => observador.observe(elemento));

  // Respaldo: el contenido nunca debe quedar oculto (pestaña sin renderizar, impresión, buscadores)
  setTimeout(() => {
    if (respondio) return;
    observador.disconnect();
    elementos.forEach((elemento) => elemento.classList.add('visible'));
  }, ESPERA_MAXIMA);
}
