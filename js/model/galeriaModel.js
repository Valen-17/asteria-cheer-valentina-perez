// MODELO de la galería: categorías disponibles y filtrado (sin DOM).

export const CATEGORIAS_GALERIA = {
  todos: 'Todas',
  entrenamientos: 'Entrenamientos',
  competencias: 'Competencias',
  eventos: 'Eventos',
};

// Recibe [{ id, categoria }] y devuelve los ids que se deben mostrar
export function filtrarPorCategoria(fotos, categoria) {
  if (!(categoria in CATEGORIAS_GALERIA)) throw new Error(`Categoría desconocida: ${categoria}`);
  const visibles = categoria === 'todos' ? fotos : fotos.filter((foto) => foto.categoria === categoria);
  return visibles.map((foto) => foto.id);
}

export function textoResultado(cantidad, categoria) {
  const nombre = CATEGORIAS_GALERIA[categoria].toLowerCase();
  const fotos = cantidad === 1 ? 'foto' : 'fotos';
  return categoria === 'todos' ? `Mostrando ${cantidad} ${fotos}` : `Mostrando ${cantidad} ${fotos} de ${nombre}`;
}
