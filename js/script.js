// Punto de entrada de JavaScript del sitio (cargado como módulo en todas las páginas).
// Aquí solo se inicializa; la lógica vive en js/model, js/view y js/controller (patrón MVC).
// Cada controlador se carga bajo demanda, solo en las páginas que lo necesitan.

const cargar = (ruta, iniciar) =>
  import(ruta)
    .then(iniciar)
    .catch((error) => console.error(`No se pudo cargar ${ruta}`, error));

// Año actual en el pie de página
const anio = document.querySelector('[data-anio]');
if (anio) anio.textContent = String(new Date().getFullYear());

// Cuenta regresiva de la próxima competencia (inicio)
const cuentaRegresiva = document.querySelector('[data-cuenta-regresiva]');
if (cuentaRegresiva) {
  cargar('./controller/inicioController.js', ({ iniciarCuentaRegresiva }) => iniciarCuentaRegresiva(cuentaRegresiva));
}

// Carruseles con botón de pausa (inicio y galería)
if (document.querySelector('[data-pausar-carrusel]') && window.bootstrap) {
  cargar('./controller/carruselController.js', ({ iniciarCarruseles }) => iniciarCarruseles(window.bootstrap.Carousel));
}

// Formulario de inscripción (contacto)
const formulario = document.querySelector('#form-inscripcion');
if (formulario) {
  cargar('./controller/contactoController.js', ({ iniciarContacto }) => iniciarContacto(formulario));
}
