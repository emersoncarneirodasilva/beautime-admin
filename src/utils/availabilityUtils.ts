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

    // scheduledAt representa o horário local do salão, como também é exibido
    // na agenda. Não converter com Date/getHours, que aplica o fuso do navegador.
    const appointmentDateStr = appointment.scheduledAt.slice(0, 10);

    if (appointmentDateStr !== slotDateStr) continue;

    for (const svc of appointment.services) {
      const appointmentStart = timeToMinutes(
        appointment.scheduledAt.slice(11, 16),
      );
      const appointmentEnd = appointmentStart + svc.service.duration;

      if (slotStart < appointmentEnd && slotEnd > appointmentStart) {
        return true;
      }
    }
  }

  return false;
}
