// VISTA de la cuenta regresiva: solo escribe en el DOM lo que le entrega el controlador.

const dosDigitos = (numero) => String(numero).padStart(2, '0');

export function crearVistaCuentaRegresiva(contenedor) {
  const campos = {
    dias: contenedor.querySelector('[data-unidad="dias"]'),
    horas: contenedor.querySelector('[data-unidad="horas"]'),
    minutos: contenedor.querySelector('[data-unidad="minutos"]'),
    segundos: contenedor.querySelector('[data-unidad="segundos"]'),
  };
  const mensajeFinal = contenedor.querySelector('[data-mensaje-final]');

  return {
    mostrar(tiempo) {
      campos.dias.textContent = String(tiempo.dias);
      campos.horas.textContent = dosDigitos(tiempo.horas);
      campos.minutos.textContent = dosDigitos(tiempo.minutos);
      campos.segundos.textContent = dosDigitos(tiempo.segundos);
    },
    mostrarTerminado() {
      if (mensajeFinal) mensajeFinal.hidden = false;
    },
  };
}
