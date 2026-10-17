// CONTROLADOR de la página de inicio: une el modelo de la competencia con su vista.
import { PROXIMA_COMPETENCIA, tiempoRestante } from '../model/competenciaModel.js';
import { crearVistaCuentaRegresiva } from '../view/cuentaRegresivaView.js';

export function iniciarCuentaRegresiva(contenedor) {
  const vista = crearVistaCuentaRegresiva(contenedor);
  const fecha = contenedor.dataset.fecha || PROXIMA_COMPETENCIA.fecha;

  function actualizar() {
    const tiempo = tiempoRestante(fecha);
    vista.mostrar(tiempo);
    if (tiempo.terminado) {
      vista.mostrarTerminado();
      clearInterval(intervalo);
    }
  }

  const intervalo = setInterval(actualizar, 1000);
  actualizar();
}
