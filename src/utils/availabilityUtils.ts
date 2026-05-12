import { AppointmentsByProfessional } from "@/types";
/* Converte horário "HH:MM" em minutos desde meia-noite */
export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/* Converte minutos desde meia-noite em horário "HH:MM" */
export function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/* Verifica se um horário está ocupado baseado nos agendamentos existentes */
export function isTimeSlotOccupied(
  slotTime: string,
  date: Date,
  serviceDuration: number,
  appointments: AppointmentsByProfessional[],
) {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + serviceDuration;

  // Extrai no fuso local para bater com os agendamentos do dia certo
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const slotDateStr = `${year}-${month}-${day}`;

  for (const appointment of appointments) {
    // Mantido o padrão original do seu enum do backend
    if (appointment.status === "CANCELLED") continue;

    // Converte a data do agendamento que vem do Banco
    const appointmentDate = new Date(appointment.scheduledAt);

    // Formata a data do agendamento para o padrão local YYYY-MM-DD
    const appYear = appointmentDate.getFullYear();
    const appMonth = String(appointmentDate.getMonth() + 1).padStart(2, "0");
    const appDay = String(appointmentDate.getDate()).padStart(2, "0");
    const appointmentDateStr = `${appYear}-${appMonth}-${appDay}`;

    if (appointmentDateStr !== slotDateStr) continue;

    for (const svc of appointment.services) {
      // Usando getHours() e getMinutes() locais para bater com o fuso do salão
      const appointmentStart =
        appointmentDate.getHours() * 60 + appointmentDate.getMinutes();
      const appointmentEnd = appointmentStart + svc.service.duration;

      if (slotStart < appointmentEnd && slotEnd > appointmentStart) {
        return true;
      }
    }
  }

  return false;
}
