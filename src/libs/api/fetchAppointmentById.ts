export async function fetchAppointmentById(
  appointmentId: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar agendamento.");
  }

  return res.json();
}
