import { Appointment } from "@/types";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";

export async function fetchAppointmentsByUserId(
  userId: string
): Promise<Appointment[]> {
  const token = await verifyAdminAuth();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/admin/salon?page=1&limit=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar agendamentos do salão.");
  }

  const data = await res.json();

  return data.appointments.filter((a: Appointment) => a.userId === userId);
}
