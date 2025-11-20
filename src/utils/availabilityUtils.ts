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
  appointments: AppointmentsByProfessional[]
) {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + serviceDuration;

  const slotDateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

  for (const appointment of appointments) {
    if (appointment.status === "CANCELLED") continue;

    const appointmentDate = new Date(appointment.scheduledAt);
    const appointmentDateStr = appointmentDate.toISOString().split("T")[0];

    if (appointmentDateStr !== slotDateStr) continue;

    for (const svc of appointment.services) {
      const appointmentStart =
        appointmentDate.getUTCHours() * 60 + appointmentDate.getUTCMinutes();
      const appointmentEnd = appointmentStart + svc.service.duration;

      if (slotStart < appointmentEnd && slotEnd > appointmentStart) {
        return true;
      }
    }
  }

  return false;
}
