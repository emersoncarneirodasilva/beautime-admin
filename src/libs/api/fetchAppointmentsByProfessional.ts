import { AppointmentsByProfessional } from "@/types";

export async function fetchAppointmentsByProfessional(
  professionalId: string,
  token: string
): Promise<AppointmentsByProfessional[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/professional/${professionalId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Erro ao buscar agendamentos:", res.status, res.statusText);
    throw new Error("Erro ao buscar agendamentos do profissional.");
  }

  const data = await res.json();
  return data as AppointmentsByProfessional[];
}
