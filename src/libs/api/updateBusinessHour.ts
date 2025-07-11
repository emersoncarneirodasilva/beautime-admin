export async function updateBusinessHour({
  id,
  token,
  startTime,
  endTime,
}: {
  id: string;
  token: string;
  startTime: string;
  endTime: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/business-hours/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ startTime, endTime }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao atualizar horário:", error);
    throw new Error("Falha ao atualizar horário.");
  }
}
