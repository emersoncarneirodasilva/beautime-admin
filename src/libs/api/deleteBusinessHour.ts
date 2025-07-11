export async function deleteBusinessHour(
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/business-hours/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao excluir horário:", error);
    throw new Error(error || "Erro ao excluir horário");
  }
}
