import {
  AppointmentHistoryType,
  AppointmentService,
  AppointmentResponse,
} from "@/types";

// Faturamento realizado (com base em históricos concluídos)
export function calculateCompletedRevenue(
  appointments: AppointmentHistoryType[]
): number {
  return appointments.reduce(
    (acc, appt) => acc + appt.services.reduce((sum, s) => sum + s.price, 0),
    0
  );
}

// Faturamento previsto (com base em agendamentos ativos confirmados)
export function calculateExpectedRevenue(
  appointments: AppointmentResponse["appointments"]
): number {
  return appointments
    .filter((a) => a.status === "CONFIRMED")
    .reduce((acc, a) => {
      if (a.payment?.amount) return acc + a.payment.amount;

      const totalAppt = a.services.reduce(
        (sum: number, s: AppointmentService) => sum + (s.service?.price || 0),
        0
      );

      return acc + totalAppt;
    }, 0);
}
