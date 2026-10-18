// MODELO de la próxima competencia: datos y cálculo de la cuenta regresiva (sin DOM).

export const PROXIMA_COMPETENCIA = {
  nombre: 'Festival Estelar de Porrismo',
  ciudad: 'Medellín',
  fecha: '2026-11-14T09:00:00-05:00',
};

const SEGUNDO = 1000;
const MINUTO = 60 * SEGUNDO;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

// Devuelve días, horas, minutos y segundos que faltan; todo en 0 y terminado=true si ya pasó
export function tiempoRestante(fechaObjetivo, ahora = new Date()) {
  const diferencia = new Date(fechaObjetivo).getTime() - new Date(ahora).getTime();
  if (Number.isNaN(diferencia)) throw new Error(`Fecha no válida: ${fechaObjetivo}`);
  if (diferencia <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };

  return {
    dias: Math.floor(diferencia / DIA),
    horas: Math.floor((diferencia % DIA) / HORA),
    minutos: Math.floor((diferencia % HORA) / MINUTO),
    segundos: Math.floor((diferencia % MINUTO) / SEGUNDO),
    terminado: false,
  };
}
