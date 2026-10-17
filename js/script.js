// Punto de entrada de JavaScript del sitio (cargado como módulo en todas las páginas).
// Aquí solo se inicializa; la lógica vive en js/model, js/view y js/controller (patrón MVC).

// Año actual en el pie de página
const anio = document.querySelector('[data-anio]');
if (anio) anio.textContent = String(new Date().getFullYear());

// El formulario de inscripción solo existe en contacto.html: su controlador se carga bajo demanda
const formulario = document.querySelector('#form-inscripcion');
if (formulario) {
  import('./controller/contactoController.js')
    .then(({ iniciarContacto }) => iniciarContacto(formulario))
    .catch((error) => console.error('No se pudo cargar el formulario', error));
}
