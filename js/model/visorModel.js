// MODELO del visor de fotos (lightbox): navegación circular entre fotos, sin tocar el DOM.

// Después de la última vuelve a la primera
export function indiceSiguiente(actual, total) {
  if (total <= 0) throw new Error('El visor necesita al menos una foto');
  return (actual + 1) % total;
}

// Antes de la primera va a la última
export function indiceAnterior(actual, total) {
  if (total <= 0) throw new Error('El visor necesita al menos una foto');
  return (actual - 1 + total) % total;
}

export function textoContador(indice, total) {
  return `${indice + 1} de ${total}`;
}

// Deslizar el dedo: más de `umbral` píxeles hacia la izquierda = siguiente; hacia la derecha = anterior
export function direccionDeslizamiento(inicioX, finX, umbral = 50) {
  const distancia = finX - inicioX;
  if (Math.abs(distancia) < umbral) return 0;
  return distancia < 0 ? 1 : -1;
}
